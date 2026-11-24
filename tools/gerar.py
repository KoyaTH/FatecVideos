"""Automatic, varied posts and Reels from a content request.

Usage (from the project folder):
    .venv\\Scripts\\python.exe tools\\gerar.py pedidos\\<nome>.json

A request only has CONTENT (texts, dates, captions, optional topics/photo).
This script picks the look of each piece -- style, palette, background,
alignment, animation and photo -- avoiding what was used recently
(history in kits/historico.json), so the feed does not look repetitive.

It writes:
    src/gen/fila-posts.json or src/gen/fila-reels.json   queue read by the Motion Canvas projects
    src/gen/reels-audio.wav                               narration + original music (Reels)
    kits/<nome>.json                                      posting plan for tools/kit.py

Then: RENDER the project `gerador-posts` (or `gerador-reels`) in the editor and
run tools/kit.py kits/<nome>.json to build the kit.

Request format (pedidos/*.json):
{
  "nome": "dezembro-prova",
  "tipo": "posts",                      # or "reels"
  "selo": "VESTIBULAR FATEC",           # optional, default for every item
  "itens": [
    {
      "data": "2026-12-07", "hora": "12:00",     # posts: when to post (reels: top-level "data"/"hora")
      "temas": ["prova"],                        # optional: helps pick a matching photo
      "foto": "turma",                           # optional: force a photo (key in src/gen/fotos.ts)
      "estilo": "numero",                        # optional: force a style
      "chamada": "Vestibular Fatec", "titulo": "Dia da prova", "destaque": "13/12",
      "texto": "...", "itens": ["...", "..."], "rodape": "...",
      "legenda": "caption for the post",
      "narracao": "what the voice says on this slide",   # reels only
      "duracao": 3.5                                     # reels without narration
    }
  ],
  "legenda": "caption for the reels", "data": "...", "hora": "...",   # reels only
  "voz": "pt-BR-FranciscaNeural", "bpm": 112                          # reels only, optional
}
"""

import json
import os
import random
import re
import shutil
import subprocess
import sys
import datetime as dt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = os.path.join(ROOT, "src", "gen")
HIST = os.path.join(ROOT, "kits", "historico.json")
PY = sys.executable

ESTILOS = ["faixa", "cheia", "dividido", "numero", "lista", "polaroid"]
PALETAS = ["azul", "laranja", "vermelho", "claro"]
FUNDOS = ["grade", "diagonal", "circulos", "liso"]
ALINHAMENTOS = ["esquerda", "centro"]
ANIMACOES = ["subir", "pop", "lado", "fade"]


def fotos_registradas() -> dict:
    """Read photo keys and topics from src/gen/fotos.ts."""
    with open(os.path.join(GEN, "fotos.ts"), encoding="utf-8") as f:
        src = f.read()
    out = {}
    for key, temas in re.findall(r"(\w+): \{\s*src: \w+,.*?temas: \[([^\]]*)\]", src, re.S):
        out[key] = [t.strip().strip("'\"") for t in temas.split(",") if t.strip()]
    return out


def carregar_historico() -> list:
    if os.path.isfile(HIST):
        with open(HIST, encoding="utf-8") as f:
            return json.load(f)
    return []


def escolher(opcoes: list, usados: list, rng: random.Random, evitar=()) -> str:
    """Pick the option used least recently (never-used first), avoiding `evitar`."""
    candidatas = [o for o in opcoes if o not in evitar] or opcoes

    def idade(o):
        # How many picks ago it was last used (bigger = older); never used = infinity.
        for i, u in enumerate(reversed(usados)):
            if u == o:
                return i
        return 10**6

    melhor = max(idade(o) for o in candidatas)
    empatadas = [o for o in candidatas if idade(o) == melhor]
    return rng.choice(empatadas)


def estilos_validos(item: dict) -> list:
    validos = []
    for e in ESTILOS:
        if e == "numero" and not item.get("destaque"):
            continue
        if e == "lista" and len(item.get("itens", [])) < 2:
            continue
        validos.append(e)
    return validos


def montar_specs(pedido: dict, rng: random.Random, hist: list) -> list:
    fotos = fotos_registradas()
    usados = {k: [h[k] for h in hist if k in h] for k in ["estilo", "paleta", "fundo", "alinhamento", "foto"]}
    specs = []
    for i, item in enumerate(pedido["itens"]):
        estilo = item.get("estilo") or escolher(estilos_validos(item), usados["estilo"], rng)
        paleta = item.get("paleta") or escolher(PALETAS, usados["paleta"], rng)
        fundo = item.get("fundo") or escolher(FUNDOS, usados["fundo"], rng)
        alinh = item.get("alinhamento") or escolher(ALINHAMENTOS, usados["alinhamento"], rng)
        if item.get("foto"):
            foto = item["foto"]
        else:
            temas = set(item.get("temas", []))
            combinam = [k for k, t in fotos.items() if temas & set(t)] or list(fotos)
            foto = escolher(combinam, usados["foto"], rng)
        for k, v in [("estilo", estilo), ("paleta", paleta), ("fundo", fundo), ("alinhamento", alinh), ("foto", foto)]:
            usados[k].append(v)

        spec = {
            "id": f"{pedido['nome']}-{i + 1}",
            "estilo": estilo,
            "paleta": paleta,
            "fundo": fundo,
            "alinhamento": alinh,
            "foto": foto,
            "lado": rng.choice([-1, 1]),
        }
        for k in ["selo", "chamada", "titulo", "destaque", "texto", "itens", "rodape", "duracao"]:
            v = item.get(k, pedido.get("selo") if k == "selo" else None)
            if v is not None:
                spec[k] = v
        specs.append(spec)
    return specs


def run(*args):
    subprocess.run([PY, *args], check=True, cwd=ROOT)


def audio_reels(pedido: dict, specs: list, rng: random.Random) -> dict:
    """Narration (optional) + original music, mixed into src/gen/reels-audio.wav. Returns timing info."""
    falas = [item.get("narracao") for item in pedido["itens"]]
    bpm = pedido.get("bpm") or rng.choice([100, 108, 112, 118, 124])
    musica = os.path.join(GEN, "reels-musica.wav")
    saida = os.path.join(GEN, "reels-audio.wav")
    if any(falas):
        roteiro = {
            "voice": pedido.get("voz", "pt-BR-FranciscaNeural"),
            "rate": pedido.get("velocidade", "+6%"),
            "gap": 0.45,
            "segments": [{"id": s["id"], "text": f or s["titulo"]} for s, f in zip(specs, falas)],
        }
        path = os.path.join(GEN, "reels-roteiro.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(roteiro, f, ensure_ascii=False, indent=2)
        run(os.path.join("tools", "narracao.py"), path)
        with open(os.path.join(GEN, "reels-roteiro.tempos.json"), encoding="utf-8") as f:
            tempos = json.load(f)
        total = round(tempos["total"] + 1.5, 2)
        tempos_slides = [{"start": s["start"], "duration": s["duration"]} for s in tempos["segments"]]
        run(os.path.join("tools", "musica.py"), str(total), musica, str(bpm))
        run(os.path.join("tools", "mixar.py"), os.path.join(GEN, "reels-roteiro.wav"), musica, saida)
        return {"tempos": tempos_slides, "total": total, "bpm": bpm}
    total = round(sum(s.get("duracao", 3.5) for s in specs) + 0.8, 2)
    run(os.path.join("tools", "musica.py"), str(total), musica, str(bpm))
    shutil.copyfile(musica, saida)
    return {"tempos": None, "total": total, "bpm": bpm}


def main() -> None:
    pedido_path = sys.argv[1]
    with open(pedido_path, encoding="utf-8") as f:
        pedido = json.load(f)
    nome = pedido["nome"]
    tipo = pedido.get("tipo", "posts")
    rng = random.Random(nome)
    hist = carregar_historico()

    specs = montar_specs(pedido, rng, hist)
    kit_posts = []
    if tipo == "posts":
        with open(os.path.join(GEN, "fila-posts.json"), "w", encoding="utf-8") as f:
            json.dump({"posts": specs}, f, ensure_ascii=False, indent=2)
        for i, (item, spec) in enumerate(zip(pedido["itens"], specs)):
            kit_posts.append({
                "data": item["data"], "hora": item["hora"], "tipo": "Feed",
                "titulo": f"{spec['titulo']} ({spec['estilo']}, {spec['paleta']})",
                "arquivos": [f"output/gerador-posts/{i:06d}.png"],
                "legenda": item.get("legenda", ""),
            })
        projeto = "gerador-posts"
    else:
        animacao = pedido.get("animacao") or escolher(ANIMACOES, [h.get("animacao") for h in hist], rng)
        info = audio_reels(pedido, specs, rng)
        fila = {"animacao": animacao, "slides": specs, "total": info["total"]}
        if info["tempos"]:
            fila["tempos"] = info["tempos"]
        with open(os.path.join(GEN, "fila-reels.json"), "w", encoding="utf-8") as f:
            json.dump(fila, f, ensure_ascii=False, indent=2)
        kit_posts.append({
            "data": pedido["data"], "hora": pedido["hora"], "tipo": "Reels",
            "titulo": f"{pedido.get('titulo', nome)} ({animacao}, {info['total']:.0f} s)",
            "arquivos": ["output/gerador-reels.mp4"],
            "legenda": pedido.get("legenda", ""),
        })
        projeto = "gerador-reels"
        for s in specs:
            s["animacao"] = animacao

    kit = {"nome": pedido.get("titulo_kit", nome), "lembrete_minutos_antes": 15, "posts": kit_posts}
    os.makedirs(os.path.join(ROOT, "kits"), exist_ok=True)
    with open(os.path.join(ROOT, "kits", f"{nome}.json"), "w", encoding="utf-8") as f:
        json.dump(kit, f, ensure_ascii=False, indent=2)

    agora = dt.datetime.now().isoformat(timespec="seconds")
    hist += [{k: s.get(k) for k in ["estilo", "paleta", "fundo", "alinhamento", "foto", "animacao"]} | {"pedido": nome, "quando": agora} for s in specs]
    with open(HIST, "w", encoding="utf-8") as f:
        json.dump(hist[-200:], f, ensure_ascii=False, indent=2)

    print(f"{len(specs)} peça(s) para o projeto '{projeto}':")
    for s in specs:
        print(f"  {s['id']:<28} estilo={s['estilo']:<9} paleta={s['paleta']:<8} fundo={s['fundo']:<9} "
              f"alinh={s['alinhamento']:<8} foto={s['foto']}")
    print(f"\nPróximos passos:\n  1. RENDER em http://localhost:9000/src/{projeto}\n"
          f"  2. .venv\\Scripts\\python.exe tools\\kit.py kits\\{nome}.json")


if __name__ == "__main__":
    main()

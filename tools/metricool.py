"""Prepare a posting kit for scheduling through Metricool.

Usage (from the project folder):
    .venv\\Scripts\\python.exe tools\\metricool.py kits\\<nome>.json

Metricool only accepts media by public URL, so this script:
  1. copies every file of the kit to publicar/<nome>/ (a folder of this public repo),
  2. writes kits/<nome>.metricool.json with, for each post: date/time (America/Sao_Paulo),
     networks, Instagram/Facebook type, caption and the raw.githubusercontent.com URLs,
  3. commits those files (it does NOT push).

Then: push (git push), check that the URLs open, and ask Claude to schedule the
entries of kits/<nome>.metricool.json with the Metricool connector -- always after
reviewing image, caption, networks and time with the user.
Note: the free Metricool plan allows 20 scheduled posts per month.
"""

import json
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REDES_PADRAO = ["instagram"]  # add "facebook" once a Facebook Page is connected in Metricool

TIPOS = {
    # kit "tipo" -> (instagram type, facebook type)
    "feed": ("POST", "POST"),
    "carrossel": ("POST", "POST"),
    "reels": ("REEL", "REEL"),
    "stories": ("STORY", "STORY"),
}


def git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=ROOT, check=True, capture_output=True, text=True).stdout.strip()


def repo_raw_base() -> str:
    url = git("remote", "get-url", "origin")
    m = re.search(r"github\.com[:/](.+?)/(.+?)(?:\.git)?$", url)
    if not m:
        sys.exit(f"origin não é um repositório do GitHub: {url}")
    branch = git("rev-parse", "--abbrev-ref", "HEAD")
    return f"https://raw.githubusercontent.com/{m.group(1)}/{m.group(2)}/{branch}"


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    sem_commit = "--sem-commit" in sys.argv  # test run: copy and write the plan, no git
    kit_path = args[0]
    redes = args[1].split(",") if len(args) > 1 else REDES_PADRAO
    with open(kit_path, encoding="utf-8") as f:
        kit = json.load(f)

    nome = os.path.splitext(os.path.basename(kit_path))[0]
    destino = os.path.join(ROOT, "publicar", nome)
    os.makedirs(destino, exist_ok=True)
    base = repo_raw_base()

    entradas, faltando, pulados = [], [], []
    for i, post in enumerate(kit["posts"], start=1):
        tipo = post.get("tipo", "Feed").lower()
        if tipo not in TIPOS or not post.get("arquivos"):
            pulados.append(f"{i:02d} {post.get('titulo', '')} ({post.get('tipo')}: sem arquivo ou tipo manual)")
            continue
        urls = []
        for j, src in enumerate(post["arquivos"], start=1):
            src_path = os.path.join(ROOT, src)
            if not os.path.isfile(src_path):
                faltando.append(src)
                continue
            ext = os.path.splitext(src)[1]
            nome_arq = f"{i:02d}-{j}{ext}" if len(post["arquivos"]) > 1 else f"{i:02d}{ext}"
            shutil.copy2(src_path, os.path.join(destino, nome_arq))
            urls.append(f"{base}/publicar/{nome}/{nome_arq}")
        ig, fb = TIPOS[tipo]
        entradas.append({
            "n": i,
            "titulo": post.get("titulo", ""),
            "data": f"{post['data']}T{post['hora']}:00",
            "timezone": "America/Sao_Paulo",
            "redes": redes,
            "instagramType": ig,
            "facebookType": fb,
            "texto": post.get("legenda", ""),
            "media": urls,
            "metricoolId": None,
        })

    if faltando:
        print("FALTANDO (renderize e rode tools/kit.py antes):")
        for f_ in faltando:
            print("  ", f_)
        sys.exit(1)

    saida = os.path.join(ROOT, "kits", f"{nome}.metricool.json")
    with open(saida, "w", encoding="utf-8") as f:
        json.dump({"kit": nome, "posts": entradas}, f, ensure_ascii=False, indent=2)

    if sem_commit:
        print(f"{len(entradas)} post(s) em kits/{nome}.metricool.json; mídias em publicar/{nome}/ (teste: sem commit).")
    else:
        git("add", os.path.relpath(destino, ROOT), os.path.relpath(saida, ROOT))
        status = git("status", "--porcelain", "--", os.path.relpath(destino, ROOT), os.path.relpath(saida, ROOT))
        if status:
            git("commit", "-q", "-m", f"Mídias do kit {nome} para agendar no Metricool")
        print(f"{len(entradas)} post(s) prontos em kits/{nome}.metricool.json; mídias em publicar/{nome}/ (commit feito, falta git push).")
    for p in pulados:
        print("  pulado:", p)


if __name__ == "__main__":
    main()

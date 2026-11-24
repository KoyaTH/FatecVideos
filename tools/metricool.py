"""Prepare a posting kit for scheduling through Metricool.

Usage (from the project folder):
    .venv\\Scripts\\python.exe tools\\metricool.py kits\\<nome>.json [redes] [--pasta=DIR] [--github]

Metricool takes media by link. Default mode is Google Drive (no GitHub needed):
  1. copies every file of the kit to your Google Drive folder, in FatecVideos/<nome>/,
     with unique names (<nome>-01.png, <nome>-02-1.png, ...);
  2. writes kits/<nome>.metricool.json with, for each post: date/time (America/Sao_Paulo),
     networks, Instagram/Facebook type, caption and the file names on Drive.
Then Claude finds each file with the Google Drive connector, puts its Drive link in
"media" and schedules with the Metricool connector -- always after reviewing image,
caption, networks and time with the user. Metricool imports Drive files itself once
Google Drive is linked in the Metricool account (the file does not need to be public).

Where the Drive folder is:
  --pasta=DIR, or the METRICOOL_PASTA environment variable, or the Google Drive for
  desktop folder found automatically (X:\\Meu Drive / X:\\My Drive). Without any of them
  the files go to output/publicar/<nome>/drive/ to be uploaded to Drive by hand.

--github  old mode: copies to publicar/<nome>/ in this repository, uses
          raw.githubusercontent.com links and commits (push by hand). The repository
          must be public.
[redes]   comma-separated networks, default "instagram" (e.g. "instagram,facebook").

Note: the free Metricool plan allows 20 scheduled posts per month.
"""

import json
import os
import re
import shutil
import string
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REDES_PADRAO = ["instagram"]  # add "facebook" when a Facebook Page is connected in Metricool

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


def pasta_drive(arg: str | None) -> str | None:
    """Google Drive folder: --pasta, METRICOOL_PASTA, or Drive for desktop auto-detected."""
    if arg:
        return arg
    if os.environ.get("METRICOOL_PASTA"):
        return os.environ["METRICOOL_PASTA"]
    for letra in string.ascii_uppercase:
        for nome in ("Meu Drive", "My Drive"):
            p = f"{letra}:\\{nome}"
            if os.path.isdir(p):
                return p
    return None


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    flags = [a for a in sys.argv[1:] if a.startswith("--")]
    usar_github = "--github" in flags
    pasta_arg = next((f.split("=", 1)[1] for f in flags if f.startswith("--pasta=")), None)
    kit_path = args[0]
    redes = args[1].split(",") if len(args) > 1 else REDES_PADRAO
    with open(kit_path, encoding="utf-8") as f:
        kit = json.load(f)
    nome = os.path.splitext(os.path.basename(kit_path))[0]

    if usar_github:
        destino = os.path.join(ROOT, "publicar", nome)
        base = repo_raw_base()
        modo = "github"
    else:
        drive = pasta_drive(pasta_arg)
        if drive:
            destino = os.path.join(drive, "FatecVideos", nome)
            modo = "drive"
        else:
            destino = os.path.join(ROOT, "output", "publicar", nome, "drive")
            modo = "drive-manual"
    os.makedirs(destino, exist_ok=True)

    entradas, faltando, pulados = [], [], []
    for i, post in enumerate(kit["posts"], start=1):
        tipo = post.get("tipo", "Feed").lower()
        if tipo not in TIPOS or not post.get("arquivos"):
            pulados.append(f"{i:02d} {post.get('titulo', '')} ({post.get('tipo')}: sem arquivo ou tipo manual)")
            continue
        arquivos, media = [], []
        for j, src in enumerate(post["arquivos"], start=1):
            src_path = os.path.join(ROOT, src)
            if not os.path.isfile(src_path):
                faltando.append(src)
                continue
            ext = os.path.splitext(src)[1]
            sufixo = f"{i:02d}-{j}" if len(post["arquivos"]) > 1 else f"{i:02d}"
            nome_arq = f"{nome}-{sufixo}{ext}"
            shutil.copy2(src_path, os.path.join(destino, nome_arq))
            arquivos.append(nome_arq)
            if usar_github:
                media.append(f"{base}/publicar/{nome}/{nome_arq}")
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
            "arquivos": arquivos,
            # Drive mode: Claude fills these with the Drive links of `arquivos` before scheduling.
            "media": media,
            "metricoolId": None,
        })

    if faltando:
        print("FALTANDO (renderize e rode tools/kit.py antes):")
        for f_ in faltando:
            print("  ", f_)
        sys.exit(1)

    saida = os.path.join(ROOT, "kits", f"{nome}.metricool.json")
    with open(saida, "w", encoding="utf-8") as f:
        json.dump({"kit": nome, "modo": modo, "pasta": destino, "posts": entradas}, f, ensure_ascii=False, indent=2)

    print(f"{len(entradas)} post(s) em kits/{nome}.metricool.json")
    if modo == "drive":
        print(f"Mídias copiadas para o Google Drive: {destino}")
        print("Espere o Drive sincronizar e peça ao Claude para agendar (ele busca os links no Drive).")
    elif modo == "drive-manual":
        print(f"Google Drive para computador não encontrado. Mídias em: {destino}")
        print("Envie essa pasta para o seu Google Drive (drive.google.com > Novo > Upload de pasta)")
        print("ou instale o Google Drive para computador e rode de novo.")
    else:
        git("add", os.path.relpath(destino, ROOT), os.path.relpath(saida, ROOT))
        if git("status", "--porcelain", "--", os.path.relpath(destino, ROOT), os.path.relpath(saida, ROOT)):
            git("commit", "-q", "-m", f"Mídias do kit {nome} para agendar no Metricool")
        print(f"Mídias em publicar/{nome}/ (commit feito, falta git push).")
    for p in pulados:
        print("  pulado:", p)


if __name__ == "__main__":
    main()

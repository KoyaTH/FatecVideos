"""Build a ready-to-post kit from a plan in kits/<name>.json.

Usage (from the project folder):
    .venv\\Scripts\\python.exe tools\\kit.py kits\\2026-12-prova.json

Creates output/publicar/<plan name>/ with:
    01_2026-11-25_qua_18h00_feed.png ...   files in posting order (carousels in a subfolder)
    LEGENDAS.txt                           caption of each post, ready to copy
    agenda.ics                             calendar events with a reminder before each post
                                           (import into Google Calendar / phone calendar)
"""

import datetime as dt
import json
import os
import re
import shutil
import sys
import unicodedata
import uuid

DIAS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"]
BRT = dt.timezone(dt.timedelta(hours=-3))
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def slug(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def ics_escape(text: str) -> str:
    return text.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", "\\n")


def main() -> None:
    plan_path = sys.argv[1]
    with open(plan_path, encoding="utf-8") as f:
        plan = json.load(f)

    out_dir = os.path.join(ROOT, "output", "publicar", os.path.splitext(os.path.basename(plan_path))[0])
    if os.path.isdir(out_dir):
        shutil.rmtree(out_dir)
    os.makedirs(out_dir)

    remind = int(plan.get("lembrete_minutos_antes", 15))
    legendas = [plan["nome"], "=" * len(plan["nome"]), ""]
    if plan.get("observacao"):
        legendas += [plan["observacao"], ""]
    events = []
    missing = []

    for i, post in enumerate(plan["posts"], start=1):
        when = dt.datetime.fromisoformat(f"{post['data']}T{post['hora']}")
        day = DIAS[when.weekday()]
        prefix = f"{i:02d}_{when:%Y-%m-%d}_{day}_{when:%Hh%M}_{slug(post['tipo'])}"

        files = post.get("arquivos", [])
        copied = []
        target_dir = out_dir
        if len(files) > 1:
            target_dir = os.path.join(out_dir, prefix)
            os.makedirs(target_dir)
        for j, src in enumerate(files, start=1):
            src_path = os.path.join(ROOT, src)
            if not os.path.isfile(src_path):
                missing.append(src)
                continue
            ext = os.path.splitext(src)[1]
            name = f"slide-{j}{ext}" if len(files) > 1 else f"{prefix}{ext}"
            shutil.copy2(src_path, os.path.join(target_dir, name))
            copied.append(os.path.relpath(os.path.join(target_dir, name), out_dir))

        header = f"{i:02d}. {day.upper()} {when:%d/%m} às {when:%H:%M} | {post['tipo']} | {post['titulo']}"
        legendas += [header, "-" * len(header)]
        legendas += [f"Arquivo: {c}" for c in copied] or ["Arquivo: (nenhum, ver instruções abaixo)"]
        legendas += ["", post["legenda"], "", ""]

        # Brasília time (UTC-3, no daylight saving since 2019) written as UTC so every
        # calendar app reads it the same way.
        when_utc = when.replace(tzinfo=BRT).astimezone(dt.timezone.utc)
        start = when_utc.strftime("%Y%m%dT%H%M%SZ")
        end = (when_utc + dt.timedelta(minutes=15)).strftime("%Y%m%dT%H%M%SZ")
        desc = f"{post['tipo']}: {post['titulo']}\n\nArquivo: {', '.join(copied) or '-'}\n\nLegenda:\n{post['legenda']}"
        events += [
            "BEGIN:VEVENT",
            f"UID:{uuid.uuid5(uuid.NAMESPACE_URL, plan_path + str(i) + post['titulo'])}",
            f"DTSTAMP:{dt.datetime.now(dt.timezone.utc):%Y%m%dT%H%M%SZ}",
            f"DTSTART:{start}",
            f"DTEND:{end}",
            f"SUMMARY:{ics_escape('Postar: ' + post['titulo'])}",
            f"DESCRIPTION:{ics_escape(desc)}",
            "BEGIN:VALARM",
            "ACTION:DISPLAY",
            f"DESCRIPTION:{ics_escape('Hora de postar: ' + post['titulo'])}",
            f"TRIGGER:-PT{remind}M",
            "END:VALARM",
            "END:VEVENT",
        ]

    # utf-8-sig (with BOM) so Windows Notepad and phones show accents and emojis correctly.
    with open(os.path.join(out_dir, "LEGENDAS.txt"), "w", encoding="utf-8-sig") as f:
        f.write("\n".join(legendas))

    ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//FatecVideos//kit//PT-BR",
        "CALSCALE:GREGORIAN",
        f"X-WR-CALNAME:{ics_escape(plan['nome'])}",
        *events,
        "END:VCALENDAR",
    ]
    with open(os.path.join(out_dir, "agenda.ics"), "w", encoding="utf-8", newline="\r\n") as f:
        f.write("\n".join(ics) + "\n")

    print(f"kit -> {out_dir}")
    for name in sorted(os.listdir(out_dir)):
        print("  ", name)
    if missing:
        print("\nFALTANDO (renderize antes):")
        for m in missing:
            print("  ", m)
        sys.exit(1)


if __name__ == "__main__":
    main()

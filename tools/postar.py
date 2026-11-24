"""Publish the due posts of a kit (kits/<name>.json) to a Facebook Page and an Instagram professional account.

Only works with an Instagram PROFESSIONAL account (business or creator) linked to a Facebook PAGE.
Personal accounts and personal Facebook profiles have no publishing API. Step by step: docs/POSTAGEM-AUTOMATICA.md.

Usage (from the project folder):
    .venv\\Scripts\\python.exe tools\\postar.py kits\\2026-12-prova.json --teste   # only shows what it would do
    .venv\\Scripts\\python.exe tools\\postar.py kits\\2026-12-prova.json           # publishes what is due

Each run publishes every post whose date/time (Brasília) has passed and that is not yet in
output/publicar/<name>/publicados.json, so it is safe to run it every 15 minutes (Task Scheduler).
Posts more than ATRASO_MAXIMO late are skipped and reported, never published late by surprise.

Images only (feed post or carousel). Videos/Reels: post through Meta Business Suite.
Needs: .venv\\Scripts\\python.exe -m pip install requests pillow
Credentials in .env (never commit it): META_PAGE_ID, META_IG_ID, META_PAGE_TOKEN.
"""

import datetime as dt
import json
import os
import sys
import time

API = "https://graph.facebook.com/v27.0"
BRT = dt.timezone(dt.timedelta(hours=-3))
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ATRASO_MAXIMO = dt.timedelta(hours=3)
IMAGENS = (".png", ".jpg", ".jpeg")
LEGENDA_MAX = 2200  # Instagram caption limit

LOG_PATH = None


def log(msg: str) -> None:
    line = f"[{dt.datetime.now(BRT):%d/%m %H:%M}] {msg}"
    print(line)
    if LOG_PATH:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(line + "\n")


def load_env() -> dict:
    """Read KEY=VALUE lines from .env (no extra dependency)."""
    path = os.path.join(ROOT, ".env")
    values = {}
    if os.path.isfile(path):
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    values[key.strip()] = value.strip().strip('"')
    values.update({k: v for k, v in os.environ.items() if k.startswith("META_")})
    missing = [k for k in ("META_PAGE_ID", "META_IG_ID", "META_PAGE_TOKEN") if not values.get(k)]
    if missing:
        sys.exit(f"Faltam no .env: {', '.join(missing)} (ver docs/POSTAGEM-AUTOMATICA.md)")
    return values


class Meta:
    def __init__(self, env: dict):
        import requests  # imported here so --teste works without it

        self.http = requests.Session()
        self.token = env["META_PAGE_TOKEN"]
        self.page = env["META_PAGE_ID"]
        self.ig = env["META_IG_ID"]

    def _check(self, resp, what: str) -> dict:
        data = resp.json()
        if "error" in data:
            raise RuntimeError(f"{what}: {data['error'].get('message')}")
        return data

    def post(self, path: str, data: dict, files=None) -> dict:
        r = self.http.post(f"{API}/{path}", data={**data, "access_token": self.token}, files=files, timeout=180)
        return self._check(r, path)

    def get(self, path: str, **params) -> dict:
        r = self.http.get(f"{API}/{path}", params={**params, "access_token": self.token}, timeout=60)
        return self._check(r, path)

    def upload_photo(self, jpg: str) -> tuple[str, str]:
        """Upload to the Page without publishing. Returns (photo id, public image URL for Instagram)."""
        with open(jpg, "rb") as f:
            photo_id = self.post(f"{self.page}/photos", {"published": "false"}, files={"source": f})["id"]
        images = self.get(photo_id, fields="images")["images"]
        return photo_id, max(images, key=lambda i: i["width"])["source"]

    def publish_facebook(self, photo_ids: list[str], caption: str) -> str:
        data = {"message": caption}
        for i, pid in enumerate(photo_ids):
            data[f"attached_media[{i}]"] = json.dumps({"media_fbid": pid})
        return self.post(f"{self.page}/feed", data)["id"]

    def wait(self, container: str) -> None:
        for _ in range(10):
            status = self.get(container, fields="status_code")["status_code"]
            if status == "FINISHED":
                return
            if status in ("ERROR", "EXPIRED"):
                raise RuntimeError(f"container {container}: {status}")
            time.sleep(30)
        raise RuntimeError(f"container {container}: ainda processando depois de 5 min")

    def publish_instagram(self, urls: list[str], caption: str) -> str:
        if len(urls) == 1:
            container = self.post(f"{self.ig}/media", {"image_url": urls[0], "caption": caption})["id"]
        else:
            children = [self.post(f"{self.ig}/media", {"image_url": u, "is_carousel_item": "true"})["id"] for u in urls]
            for c in children:
                self.wait(c)
            container = self.post(
                f"{self.ig}/media", {"media_type": "CAROUSEL", "children": ",".join(children), "caption": caption}
            )["id"]
        self.wait(container)
        return self.post(f"{self.ig}/media_publish", {"creation_id": container})["id"]


def to_jpeg(src: str, out_dir: str) -> str:
    """Instagram accepts only JPEG (sRGB, up to 8 MB, 4:5 to 1.91:1)."""
    if src.lower().endswith((".jpg", ".jpeg")):
        return src
    from PIL import Image

    os.makedirs(out_dir, exist_ok=True)
    dst = os.path.join(out_dir, os.path.splitext(os.path.basename(src))[0] + ".jpg")
    Image.open(src).convert("RGB").save(dst, "JPEG", quality=92)
    return dst


def main() -> None:
    global LOG_PATH
    sys.stdout.reconfigure(encoding="utf-8")
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    test = "--teste" in sys.argv
    if len(args) != 1:
        sys.exit(__doc__)
    plan_path = args[0]
    with open(plan_path, encoding="utf-8") as f:
        plan = json.load(f)

    name = os.path.splitext(os.path.basename(plan_path))[0]
    state_dir = os.path.join(ROOT, "output", "publicar", name)
    os.makedirs(state_dir, exist_ok=True)
    LOG_PATH = None if test else os.path.join(state_dir, "postar.log")
    state_path = os.path.join(state_dir, "publicados.json")
    state = {}
    if os.path.isfile(state_path):
        with open(state_path, encoding="utf-8") as f:
            state = json.load(f)

    meta = None if test else Meta(load_env())
    now = dt.datetime.now(BRT)

    for i, p in enumerate(plan["posts"], start=1):
        key = f"{i:02d}"
        when = dt.datetime.fromisoformat(f"{p['data']}T{p['hora']}").replace(tzinfo=BRT)
        title = f"{key} {when:%d/%m %H:%M} {p['titulo']}"
        networks = p.get("redes", ["facebook", "instagram"])
        done = state.get(key, {})
        pending = [n for n in networks if n not in done]
        if not pending:
            continue
        if when > now:
            if test:
                log(f"agendado   {title} -> {', '.join(pending)}")
            continue
        if now - when > ATRASO_MAXIMO:
            log(f"ATRASADO   {title}: passou da hora há mais de {ATRASO_MAXIMO.seconds // 3600} h, poste à mão se ainda fizer sentido")
            continue

        files = [os.path.join(ROOT, a) for a in p.get("arquivos", [])]
        caption = p["legenda"]
        problem = None
        if not files:
            problem = "sem arquivo"
        elif any(not a.lower().endswith(IMAGENS) for a in files):
            problem = "tem vídeo (Reels): poste pelo Meta Business Suite"
        elif any(not os.path.isfile(a) for a in files):
            problem = "arquivo não encontrado (renderize antes)"
        elif len(files) > 20:
            problem = "carrossel com mais de 20 itens"
        elif len(caption) > LEGENDA_MAX:
            problem = f"legenda com {len(caption)} caracteres (máximo {LEGENDA_MAX})"
        if problem:
            log(f"PULADO     {title}: {problem}")
            continue

        if test:
            log(f"publicaria {title} -> {', '.join(pending)} ({len(files)} imagem(ns))")
            continue

        try:
            jpgs = [to_jpeg(a, os.path.join(state_dir, "_jpeg")) for a in files]
            uploads = [meta.upload_photo(j) for j in jpgs]
            if "facebook" in pending:
                done["facebook"] = meta.publish_facebook([u[0] for u in uploads], caption)
                log(f"facebook   {title}: {done['facebook']}")
            if "instagram" in pending:
                done["instagram"] = meta.publish_instagram([u[1] for u in uploads], caption)
                log(f"instagram  {title}: {done['instagram']}")
        except Exception as e:  # keep going with the next post; this one is retried next run
            log(f"ERRO       {title}: {e}")
        finally:
            if done:
                state[key] = done
                with open(state_path, "w", encoding="utf-8") as f:
                    json.dump(state, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()

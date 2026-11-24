"""Generate a pt-BR narration track from a script JSON.

Usage (from the project folder):
    .venv\\Scripts\\python.exe tools\\narracao.py src\\audio\\roteiro-sistemas-internet.json

For a script `src/audio/<name>.json` it writes:
    src/audio/<name>.wav         the full narration (segments + short gaps)
    src/audio/<name>.tempos.json start/duration of each segment, in seconds,
                                 which the Motion Canvas scene uses for sync.

Voices come from edge-tts (Microsoft neural voices, needs internet).
"""

import asyncio
import glob
import json
import os
import subprocess
import sys
import tempfile
import wave

import edge_tts

SAMPLE_RATE = 24000


def find_ffmpeg() -> str:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    hits = glob.glob(os.path.join(root, "node_modules", "@ffmpeg-installer", "*", "ffmpeg.exe"))
    if not hits:
        sys.exit("ffmpeg not found: run `npm install` first")
    return hits[0]


async def synthesize(text: str, voice: str, rate: str, path: str) -> None:
    await edge_tts.Communicate(text, voice, rate=rate).save(path)


def to_wav(ffmpeg: str, src: str, dst: str) -> None:
    subprocess.run(
        [ffmpeg, "-y", "-loglevel", "error", "-i", src, "-ac", "1", "-ar", str(SAMPLE_RATE), dst],
        check=True,
    )


def main() -> None:
    script_path = sys.argv[1]
    with open(script_path, encoding="utf-8") as f:
        script = json.load(f)

    base = os.path.splitext(script_path)[0]
    ffmpeg = find_ffmpeg()
    gap_frames = int(script.get("gap", 0.35) * SAMPLE_RATE)

    timings = []
    pcm = bytearray()
    with tempfile.TemporaryDirectory() as tmp:
        for i, seg in enumerate(script["segments"]):
            mp3 = os.path.join(tmp, f"{i}.mp3")
            wav_path = os.path.join(tmp, f"{i}.wav")
            asyncio.run(synthesize(seg["text"], script["voice"], script.get("rate", "+0%"), mp3))
            to_wav(ffmpeg, mp3, wav_path)
            with wave.open(wav_path, "rb") as w:
                frames = w.readframes(w.getnframes())
                duration = w.getnframes() / SAMPLE_RATE
            start = len(pcm) / 2 / SAMPLE_RATE  # 16-bit mono
            timings.append({"id": seg["id"], "start": round(start, 3), "duration": round(duration, 3)})
            pcm += frames
            if i < len(script["segments"]) - 1:
                pcm += b"\x00\x00" * gap_frames
            print(f"{seg['id']:<12} {start:6.2f}s  +{duration:5.2f}s")

    with wave.open(base + ".wav", "wb") as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(SAMPLE_RATE)
        out.writeframes(bytes(pcm))

    total = len(pcm) / 2 / SAMPLE_RATE
    with open(base + ".tempos.json", "w", encoding="utf-8") as f:
        json.dump({"total": round(total, 3), "segments": timings}, f, ensure_ascii=False, indent=2)
    print(f"total        {total:.2f}s -> {base}.wav")


if __name__ == "__main__":
    main()

"""Mix background music under a narration, ducking the music while the voice speaks.

Usage:
    .venv\\Scripts\\python.exe tools\\mixar.py <voz.wav> <musica.wav> <saida.wav> [volume_musica]

volume_musica: linear gain for the music bed (default 0.42, about -7.5 dB).
The output lasts as long as the music (the voice is padded with silence).
"""

import glob
import os
import subprocess
import sys
import wave


def find_ffmpeg() -> str:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    hits = glob.glob(os.path.join(root, "node_modules", "@ffmpeg-installer", "*", "ffmpeg.exe"))
    if not hits:
        sys.exit("ffmpeg not found: run `npm install` first")
    return hits[0]


def main() -> None:
    voice, music, out = sys.argv[1:4]
    volume = float(sys.argv[4]) if len(sys.argv) > 4 else 0.42
    with wave.open(music, "rb") as w:
        music_len = w.getnframes() / w.getframerate()
    fmt = "aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo"
    graph = (
        # Pad the voice with silence to the music's length so the music's fade-out survives.
        f"[0:a]aresample=44100,pan=stereo|c0=c0|c1=c0,{fmt},apad,atrim=end={music_len:.3f},asplit=2[voice][key];"
        f"[1:a]aresample=44100,{fmt},volume={volume}[bed];"
        "[bed][key]sidechaincompress=threshold=0.02:ratio=5:attack=30:release=450[ducked];"
        # The bundled ffmpeg is old: amix has no normalize=0 and halves each
        # input, so volume=2 restores the original levels.
        "[voice][ducked]amix=inputs=2:duration=longest,volume=2,alimiter=limit=0.95[out]"
    )
    subprocess.run(
        [find_ffmpeg(), "-y", "-loglevel", "error", "-i", voice, "-i", music,
         "-filter_complex", graph, "-map", "[out]", out],
        check=True,
    )
    print(f"mixed -> {out}")


if __name__ == "__main__":
    main()

"""Compose an original, royalty-free upbeat "tech/corporate" background track.

Usage:
    .venv\\Scripts\\python.exe tools\\musica.py <seconds> <output.wav> [bpm]

Layers: warm additive pad, plucky bass, 16th-note arpeggio, kick/clap/hi-hat.
Chord loop I-V-vi-IV in C major. Two-bar intro without drums, fade-out at the end.
Everything is synthesized here, so there are no licensing or Content ID issues.
"""

import sys
import wave

import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def midi_hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env_adsr(n, a, r):
    """Linear attack, linear release envelope over n samples."""
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def additive(freq, n, harmonics=6, tilt=1.5, detune=0.0):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for h in range(1, harmonics + 1):
        out += np.sin(2 * np.pi * freq * h * (1 + detune) * t) / h**tilt
    return out


def add(buf, start, sig):
    s = int(start * SR)
    e = min(len(buf), s + len(sig))
    if s < e:
        buf[s:e] += sig[: e - s]


def main():
    seconds = float(sys.argv[1])
    out_path = sys.argv[2]
    bpm = float(sys.argv[3]) if len(sys.argv) > 3 else 112

    beat = 60 / bpm
    bar = 4 * beat
    total = int(seconds * SR)
    L = np.zeros(total)
    R = np.zeros(total)

    # C, G, Am, F  (root midi, chord tones)
    chords = [
        (48, [60, 64, 67, 72]),
        (43, [59, 62, 67, 71]),
        (45, [60, 64, 69, 72]),
        (41, [60, 65, 69, 72]),
    ]
    n_bars = int(np.ceil(seconds / bar))
    intro_bars = 2
    outro_start = seconds - 2 * bar  # drums stop for the last two bars

    for b in range(n_bars):
        t0 = b * bar
        root, tones = chords[b % 4]

        # Pad: two slightly detuned additive voices per note, panned apart.
        n = int((bar + 0.4) * SR)
        env = env_adsr(n, 0.35, 0.5)
        for note in tones[:3]:
            f = midi_hz(note)
            add(L, t0, 0.045 * env * additive(f, n, detune=-0.003))
            add(R, t0, 0.045 * env * additive(f, n, detune=0.003))

        # Bass: eighth-note plucks on the root.
        for k in range(8):
            ts = t0 + k * beat / 2
            n = int(0.32 * SR)
            tt = np.arange(n) / SR
            sig = additive(midi_hz(root), n, harmonics=3, tilt=1.2) * np.exp(-tt * 9)
            amp = 0.11 if k % 2 == 0 else 0.07
            add(L, ts, amp * sig)
            add(R, ts, amp * sig)

        # Arpeggio: 16th notes up/down the chord, an octave up, bell-like pluck.
        pattern = [0, 1, 2, 3, 2, 1, 2, 3] * 2
        for k, idx in enumerate(pattern):
            ts = t0 + k * beat / 4
            n = int(0.25 * SR)
            tt = np.arange(n) / SR
            f = midi_hz(tones[idx] + 12)
            sig = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 14)
            amp = 0.035 if k % 4 else 0.05
            pan = 0.35 if k % 2 else -0.35
            add(L, ts, amp * (1 - pan) * sig)
            add(R, ts, amp * (1 + pan) * sig)

        # Drums (after the intro, before the outro).
        if b >= intro_bars and t0 < outro_start:
            for k in range(4):
                ts = t0 + k * beat
                # Kick: pitch sweep 120 -> 45 Hz.
                n = int(0.3 * SR)
                tt = np.arange(n) / SR
                freq = 45 + 75 * np.exp(-tt * 30)
                phase = 2 * np.pi * np.cumsum(freq) / SR
                kick = np.sin(phase) * np.exp(-tt * 11) * 0.32
                add(L, ts, kick)
                add(R, ts, kick)
                # Clap on beats 2 and 4.
                if k in (1, 3):
                    n = int(0.18 * SR)
                    tt = np.arange(n) / SR
                    noise = np.diff(rng.standard_normal(n + 1))
                    clap = noise * np.exp(-tt * 22) * 0.06
                    add(L, ts, clap)
                    add(R, ts, clap)
                # Hi-hat on the off-beats.
                n = int(0.05 * SR)
                tt = np.arange(n) / SR
                hat = np.diff(np.diff(rng.standard_normal(n + 2))) * np.exp(-tt * 80) * 0.025
                add(L, ts + beat / 2, hat)
                add(R, ts + beat / 2, hat)

    # Fade in/out and normalize to -3 dBFS.
    fade_in, fade_out = int(0.6 * SR), int(2.5 * SR)
    for ch in (L, R):
        ch[:fade_in] *= np.linspace(0, 1, fade_in)
        ch[-fade_out:] *= np.linspace(1, 0, fade_out)
    peak = max(np.abs(L).max(), np.abs(R).max())
    gain = 10 ** (-3 / 20) / peak
    stereo = np.stack([L * gain, R * gain], axis=1)
    pcm = (np.clip(stereo, -1, 1) * 32767).astype("<i2")

    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"{seconds:.2f}s @ {bpm:.0f} bpm -> {out_path}")


if __name__ == "__main__":
    main()

# -*- coding: utf-8 -*-
"""صوت كروت «مستوحى من»: كليك معدّل لكل قطع (طرقة 150–1200Hz تنسمع بالجوال + لمعة زجاج) يطلع نصف درجة مع كل تسارع ← ضربة hit_sub على الشبكة
   ≥0.25 ث بين أي صوتين (CLAUDE.md) · طول الكليك = طول الانتقال تقريبًا · ← assets/clips/intro/inspired-cards.wav + inspired-cards.mp4 (مدموج للمعاينة)"""
import json, os, subprocess, numpy as np, wave
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); SR = 48000
J = json.load(open(os.path.join(W, "_an", "inspired_cuts.json"))); cuts, dur = J["cuts"], J["dur"]
assert all(b - a >= 0.249 for a, b in zip(cuts, cuts[1:])), "صوتين أقرب من 0.25 ث"
rng = np.random.default_rng(7)
def band(x, lo, hi):
    F = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); F[(f < lo) | (f > hi)] = 0; return np.fft.irfft(F, len(x))
def click(k):
    n = int(0.11 * SR); t = np.arange(n) / SR; st = 2 ** (k / 24)          # نصف درجة لكل كرت = توتر يتصاعد
    knock = np.sin(2 * np.pi * 170 * st * t) * np.exp(-t / 0.028)            # طرقة (الجوال)
    body = np.sin(2 * np.pi * 820 * st * t + 0.6 * np.sin(2 * np.pi * 1640 * st * t)) * np.exp(-t / 0.018)
    glint = band(rng.standard_normal(n), 4200, 9000) * np.exp(-t / 0.004); glint /= np.abs(glint).max()
    y = 0.55 * knock + 0.45 * body + 0.35 * glint; y[:48] *= np.linspace(0, 1, 48)
    return y / np.abs(y).max()
def load_wav(p):
    with wave.open(p) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; sr = w.getframerate(); ch = w.getnchannels()
    a = a.reshape(-1, ch).mean(1)
    return np.interp(np.arange(int(len(a) * SR / sr)) * sr / SR, np.arange(len(a)), a) if sr != SR else a
mix = np.zeros(int((dur + 0.6) * SR))
def put(x, t, db):
    i = int(t * SR); g = 10 ** (db / 20) / max(1e-9, np.abs(x).max()); e = min(len(mix), i + len(x)); mix[i:e] += g * x[:e - i]
for k, c in enumerate(cuts[:-1]): put(click(k), c - 0.004, -9)
put(click(len(cuts)), cuts[-1] - 0.004, -8)                                   # كليك الشبكة
put(load_wav(os.path.join(W, "..", "..", "kit", "sfx", "wav", "hit_sub.wav")), cuts[-1], -6)  # ضربة الاكتمال
mix = mix[:int(dur * SR)]; pk = np.abs(mix).max(); mix *= min(1, 10 ** (-1.5 / 20) / pk)
out = os.path.join(W, "assets", "clips", "intro")
with wave.open(os.path.join(out, "inspired-cards.wav"), "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(out, "inspired-cards-v.mp4"), "-i", os.path.join(out, "inspired-cards.wav"),
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", os.path.join(out, "inspired-cards.mp4")], check=True)
print(f"صوت ✔ {len(cuts)} كليك + ضربة · ذروة {20*np.log10(np.abs(mix).max()):.1f} dBFS")

# ── معاينة متزامنة مع التعليق (25.18 ← 33.12): الكليك فوق كلمة ← طرقة 170Hz + لمعة 4–9kHz بس (نطاق الكلام 300–4000 مقصوص)
T0 = 25.18; A = json.load(open(os.path.join(W, "a.json"), encoding="utf-8"))
words = [(w["start"], w["end"], w["word"].strip()) for s in A["segments"] for w in s["words"]]
vo = os.path.join(W, "_an", "vo_seg.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(T0), "-t", f"{dur:.3f}", "-i", os.path.join(W, "input", "vo-script.mp3"), "-ac", "1", "-ar", str(SR), vo], check=True)
v = load_wav(vo); v = np.pad(v, (0, max(0, len(mix) - len(v))))[:len(mix)]
def click_soft(k):
    n = int(0.11 * SR); t = np.arange(n) / SR; st = 2 ** (k / 24)
    knock = np.sin(2 * np.pi * 170 * st * t) * np.exp(-t / 0.028); body = np.sin(2 * np.pi * 820 * st * t + 0.6 * np.sin(2 * np.pi * 1640 * st * t)) * np.exp(-t / 0.018)
    glint = band(rng.standard_normal(n), 4200, 9000) * np.exp(-t / 0.004); glint /= np.abs(glint).max()
    y = 0.6 * knock + 0.4 * glint; y[:48] *= np.linspace(0, 1, 48); y[-480:] *= np.linspace(1, 0, 480)
    y = y - band(y, 300, 4000)  # فوق كلمة: بلا جسم + تخفيض موضعي 300–4000Hz (بعد التنعيم حتى ما يرجع تسرّب)
    return y / np.abs(y).max()
fx = np.zeros(len(mix)); over = []
for k, c in enumerate(cuts):
    tw = T0 + c; hit = [w for w in words if w[0] - 0.02 <= tw <= w[1] + 0.02]
    i = int(c * SR); x = click_soft(k) if hit else click(k); g = 10 ** (((-8 if k == len(cuts) - 1 else -9) - (2 if hit else 0)) / 20) / np.abs(x).max()  # فوق كلمة −2 dB إضافي
    e = min(len(fx), i + len(x)); fx[i:e] += g * x[:e - i]
    if hit: over.append(f"{c:.2f}:{hit[0][2]}")
hs = load_wav(os.path.join(W, "..", "..", "kit", "sfx", "wav", "hit_sub.wav")); hs = hs - band(hs, 300, 4000); i = int(cuts[-1] * SR)  # الضربة فوق «تخلّيك» ← بلا نطاق الكلام; e = min(len(fx), i + len(hs)); fx[i:e] += 10 ** (-6 / 20) / np.abs(hs).max() * hs[:e - i]
# تقرير: مستوى الكلمة فوق المؤثر (dB) لكل كلمة داخل المقطع
rep = []
for s0, s1, wd in words:
    a0, a1 = int((s0 - T0) * SR), int((s1 - T0) * SR)
    if a1 <= 0 or a0 >= len(v): continue
    a0, a1 = max(0, a0), min(len(v), a1); vs = np.sqrt(np.mean(band(v[a0:a1], 300, 4000) ** 2)) + 1e-9; fs = np.sqrt(np.mean(band(fx[a0:a1], 300, 4000) ** 2)) + 1e-9
    rep.append((wd, 20 * np.log10(vs / fs)))
m2 = v + fx; m2 *= min(1, 10 ** (-1.5 / 20) / np.abs(m2).max())
with wave.open(os.path.join(W, "_an", "inspired_vo.wav"), "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m2 * 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(out, "inspired-cards-v.mp4"), "-i", os.path.join(W, "_an", "inspired_vo.wav"),
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", os.path.join(out, "inspired-cards-vo-preview.mp4")], check=True)
low = [f"{w}({d:.0f})" for w, d in rep if d < 12]
print("معاينة بالتعليق ✔ · كليك فوق كلمة (بلا نطاق الكلام):", " ".join(over) or "0", "· كلمات <12 dB:", " ".join(low) or "0", "· أقل هامش %.1f dB" % min(d for _, d in rep))

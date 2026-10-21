# -*- coding: utf-8 -*-
"""صوت المراسيل v4 — مكساج آلي بقواعد:
   1) كل مؤثر طوله محدود بمدة رسمته (ذيل قصير + خفوت ناعم) — ما يستمر بعد الحدث.
   2) نطاق الكلام (300–4000 Hz): المؤثر تحت أي كلمة ≤ الكلام −15 dB (اللحظات المقصودة ≤ −6 dB).
   3) الضربات اللي تقع على كلام = ترددات منخفضة بس (تنحس وما تغطي الحروف).
   4) منحنى خفض تدريجي لصوت الفيديو عند الضربات المقصودة (أدنى نقطة عند الذروة، ويرجع بعدها).
   5) بلا طبقة جو تحت الكلام. يطلع: mix_full.wav · mix_clean.wav · تقرير بالأرقام."""
import numpy as np, sys, subprocess, json, wave
from scipy.signal import butter, sosfilt, fftconvolve
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import os as _os; W = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
SR = 48000
TOTAL = json.load(open(W + r"\caps.json", encoding="utf-8"))["total"] + json.load(open(W + r"\sfx.json", encoding="utf-8")).get("outro", 0)   # + نهاية البراند
N = int(TOTAL * SR)
rng = np.random.default_rng(7)

def tt(d): return np.arange(int(d * SR)) / SR
def flt(x, kind, f, o=2): return sosfilt(butter(o, f, kind, fs=SR, output="sos"), x, axis=0)
def nz(d): return rng.standard_normal(int(d * SR))
def norm(x): return x / (np.max(np.abs(x)) + 1e-12)
def st(m): return np.stack([m, m], 1)
def fade(x, fi=0.003, fo=0.04):
    x = x.copy(); a, b = int(fi * SR), int(fo * SR)
    if a: x[:a] *= np.linspace(0, 1, a)[:, None] if x.ndim == 2 else np.linspace(0, 1, a)
    if b: x[-b:] *= (np.linspace(1, 0, b) ** 2)[:, None] if x.ndim == 2 else np.linspace(1, 0, b) ** 2
    return x
def verb(x, tail, wet, lpf=4000):
    n = int(tail * SR); t = np.arange(n) / SR; e = np.exp(-t / (tail / 6))
    m = x if x.ndim == 1 else x.mean(1)
    w = np.stack([fftconvolve(m, flt(rng.standard_normal(n), "lowpass", lpf) * e)[:len(m) + n] for _ in range(2)], 1)
    w = w / (np.max(np.abs(w)) + 1e-12) * np.max(np.abs(m)) * wet
    out = np.zeros_like(w); out[:len(m)] += st(m) if x.ndim == 1 else x; return out + w

# ── المكتبة (ذيول قصيرة) ──
def boom():
    t = tt(1.1); f = 34 + 46 * np.exp(-t / 0.08)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.32) * (1 - np.exp(-t / 0.004))
    body = flt(nz(1.1), "lowpass", 220) * np.exp(-t / 0.08)
    click = flt(flt(nz(1.1), "highpass", 2000), "lowpass", 6000) * np.exp(-t / 0.008) * 0.6
    return verb(norm(np.tanh(1.5 * (sub + 0.5 * body + click))), 0.8, 0.16, 2500)
def boom_sub():   # للضربات فوق الكلام: ساب + طرقة قصيرة (تنسمع على الجوال)
    b = flt(boom(), "lowpass", 140, 4); t = tt(len(b) / SR)
    knock = st(flt(nz(len(b) / SR), "bandpass", [150, 1200]) * np.exp(-t / 0.014))
    return norm(b / (np.max(np.abs(b)) + 1e-9) + 0.5 * norm(knock))
def hit():
    t = tt(0.5); f = 60 + 90 * np.exp(-t / 0.05)
    m = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.13) + flt(nz(0.5), "bandpass", [300, 3500]) * np.exp(-t / 0.04) * 0.8
    return verb(norm(np.tanh(1.3 * m)), 0.4, 0.14)
def hit_sub():
    sub = flt(hit(), "lowpass", 160, 4); t = tt(len(sub) / SR)
    knock = st(flt(nz(len(sub) / SR), "bandpass", [150, 1200]) * np.exp(-t / 0.012) + np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.035))
    return norm(sub / (np.max(np.abs(sub)) + 1e-9) + 0.55 * norm(knock))
def whoosh(d=0.5, up=True, p0=-0.7, p1=0.7):
    t = tt(d); x = nz(d); u = t / d; out = np.zeros_like(x)
    for i, (lo, hi) in enumerate([(250, 500), (450, 900), (800, 1600), (1400, 2800), (2500, 5000), (4000, 9000)]):
        c = i / 5; pos = u if up else 1 - u; out += flt(x, "bandpass", [lo, hi]) * np.exp(-((pos - c) ** 2) / 0.05)
    out *= np.sin(np.pi * u) ** 2; a = (p0 + (p1 - p0) * u + 1) * np.pi / 4
    return np.stack([out * np.cos(a), out * np.sin(a)], 1)
def whip():
    d = 0.3; w = whoosh(d, True, -0.9, 0.9); t = tt(d)
    return w * np.exp(-((t - d * 0.5) ** 2) / (2 * (d * 0.15) ** 2))[:, None]
def riser(d):
    t = tt(d); u = t / d; tone = sum(np.sin(2 * np.pi * np.cumsum(f0 * 2 ** (2 * u)) / SR) for f0 in (110, 165, 220)) / 3
    m = (flt(nz(d), "bandpass", [1200, 9000]) * 0.7 + flt(tone, "lowpass", 2500)) * u ** 2.2
    return fade(st(norm(m)), 0.01, 0.035)
def shimmer():
    t = tt(0.6); m = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6.3)) * np.exp(-t / rng.uniform(0.12, 0.3)) for f in rng.uniform(3000, 8000, 8))
    return verb(norm(m * (1 - np.exp(-t / 0.02))), 0.4, 0.25, 9000)
def clank():
    t = tt(0.6); m = sum(g * np.sin(2 * np.pi * f * t) * np.exp(-t / tau) for f, tau, g in ((183, .3, 1), (447, .22, .8), (893, .16, .6), (1312, .12, .5), (2151, .08, .4)))
    return verb(norm(m + flt(nz(0.6), "lowpass", 900) * np.exp(-t / 0.02) * 1.5), 0.4, 0.2)
def tick():
    t = tt(0.04); return st(norm(flt(nz(0.04), "highpass", 3000) * np.exp(-t / 0.002) + 0.5 * np.sin(2 * np.pi * 3000 * t) * np.exp(-t / 0.006)))
def pop():
    t = tt(0.14); f = 480 + 700 * (1 - np.exp(-t / 0.03))
    return st(norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.04) * (1 - np.exp(-t / 0.002))))
def kick_sub():
    t = tt(0.3); f = 45 + 70 * np.exp(-t / 0.03); return st(flt(norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.1)), "lowpass", 140, 4))
def typing(d):
    out = np.zeros((int(d * SR) + 4800, 2)); x = 0.0
    while x < d:
        s = tick() * 0.6; i = int(x * SR); out[i:i + len(s)] += s * rng.uniform(0.5, 1.0); x += rng.uniform(0.07, 0.12)
    return out
def ting(f0=1046.5):   # جرس خفيف للملصق — نغمة + توافقيات جرسية قصيرة
    t = tt(0.55); m = sum(g * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t / d) for r, g, d in ((1, 1, .28), (2.0, .35, .16), (2.76, .22, .1), (5.4, .08, .05)))
    return verb(norm(m * (1 - np.exp(-t / 0.002))), 0.35, 0.2, 9000)
def tock():            # علامة +: نقرة خشبية ناعمة
    t = tt(0.12); m = np.sin(2 * np.pi * 620 * t) * np.exp(-t / 0.025) + 0.4 * np.sin(2 * np.pi * 1240 * t) * np.exp(-t / 0.012)
    return st(norm(m * (1 - np.exp(-t / 0.001))))
def breeze():          # علامة ←: نسمة هوائية ناعمة تتحرك يمين ← يسار (اتجاه السهم)
    return whoosh(0.32, True, 0.7, -0.7)
def flutter(d=1.2):   # رفرفة قماش العلم: ضوضاء مفلترة بنبض ~9Hz
    t = tt(d); m = flt(nz(d), "bandpass", [250, 2500]) * (0.55 + 0.45 * np.sin(2 * np.pi * 9 * t) ** 2) * np.sin(np.pi * t / d) ** 0.6
    return st(norm(m))
def cascade(d=0.9, n=26):   # تكّات متتالية تتسارع (الشبكة تنفرش)
    out = np.zeros((int(d * SR) + 4800, 2))
    for i in range(n):
        q = i / n; tk = tick() * (0.5 + 0.5 * q); j = int(d * (1 - (1 - q) ** 1.6) * SR); out[j:j + len(tk)] += tk
    return out
def whipL(): return whip()[:, ::-1]                                       # Whip باتجاه معاكس
def zoomfx():                                                             # زوم يخترق اللقطة: سحبة صاعدة + ثقل خفيف
    w = whoosh(0.34, True, -0.2, 0.2); t = tt(0.34); sub = np.sin(2 * np.pi * np.cumsum(70 + 60 * (t / 0.34)) / SR) * np.sin(np.pi * t / 0.34) ** 2
    return norm(w + st(sub) * 0.5)
def sting():
    t = tt(2.6); m = sum(np.sin(2 * np.pi * f * t) * 0.6 + np.sin(2 * np.pi * f * 1.003 * t) * 0.4 for f in (110.0, 164.81, 220.0, 277.18, 329.63))
    return verb(norm(flt(m, "lowpass", 1800) * (1 - np.exp(-t / 0.3)) * np.exp(-t / 1.2)), 1.0, 0.25)

# ── الصوت الأصلي (الكلام) ──
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", W + r"\cutz.mp4", "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
vo = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)[:N] * 10 ** (4 / 20)
if len(vo) < N: vo = np.vstack([vo, np.zeros((N - len(vo), 2))])
HOP = 960
def band_db(x):  # طاقة نطاق الكلام لكل 20ms
    b = flt(x.mean(1) if x.ndim == 2 else x, "bandpass", [300, 4000], 4)
    f = len(b) // HOP; return 10 * np.log10(np.mean(b[:f * HOP].reshape(f, HOP) ** 2, 1) + 1e-12)
vo_b = band_db(vo)
_cw = [w for c in json.load(open(W + r"\caps.json", encoding="utf-8"))["cards"] for w in c["w"]]
speech = np.zeros(len(vo_b), bool)                       # الكلام من توقيت الكلمات نفسه (+40ms من الجهتين)
for w in _cw: speech[max(0, int((w["s"] - 0.04) * SR / HOP)):int((w["e"] + 0.04) * SR / HOP)] = True

# ── الأحداث: [وقت الحدث, صوت, ذروة dBFS, أقصى مدة بعد الحدث, محاذاة قبل الحدث, لحظة مقصودة, خفض الكلام dB] ──
# لغة صوت ثابتة: انتقال Whip −13 · زوم −14 · ظهور Pop −17 · ضربة −10 · جرس −19 · نسمة رسم −21
# قاعدة: صوت واحد بكل ربع ثانية — إذا تزاحموا يفوز: ضربة > جرس > ظهور > انتقال
WHIPR, WHIPL, ZOOM = (whip, -7, 0.15, 0.15, 3, 0), (whipL, -7, 0.15, 0.15, 3, 0), (zoomfx, -8, 0.16, 0.18, 3, 0)
POP, HIT, CHIME = (pop, -11, 0.14, 0, 3, 0), (hit_sub, -5, 0.35, 0, 1, 2.5), (lambda: ting(1318.5), -15, 0.5, 0, 2, 0)
DRAW = (lambda: whoosh(0.4), -15, 0.15, 0.2, 3, 0)
E = [(t,) + k for t, k in [
 (0.06, (boom_sub, -5, 0.6, 0, 1, 2)),         # هوك
 (2.30, POP),                                    # «شفاف» ← «أبيض معتم»
 (2.84, (lambda: ting(1318.5), -18, 0.5, 0, 2, 0)),   # الكأس يتعتّم (جرس)
 (3.50, WHIPR), (3.95, POP),                     # انتقال · ✓
 (4.52, ZOOM), (4.88, HIT),                      # انتقال · البرميل يهبط
 (5.44, (hit_sub, -7, 0.3, 0, 1, 0)),           # «الأنتارا» (+ومضة بلا صوت)
 (6.08, WHIPL), (7.05, (boom_sub, -5, 0.4, 0, 1, 2)),   # انتقال · الختم
 (7.40, ZOOM),
 (8.62, WHIPR), (8.95, DRAW),                    # انتقال · الشبكة تنفرش
 (10.04, (lambda: ting(1568.0), -18, 0.5, 0, 2, 0)),  # الخانة تضيء (جرس) — الومضة والشارة بلا صوت
 (10.98, POP), (11.36, HIT),                     # إطار الطن · 0.1%
 (11.78, WHIPL), (12.72, POP),                   # انتقال · مكتب الشركة
 (13.50, ZOOM), (13.80, HIT), (14.08, POP),      # انتقال · الدبوس · الكرت
 (15.78, WHIPR), (16.05, DRAW),                  # انتقال · المسارات
 (16.55, (tick, -14, 0.04, 0, 3, 0)), (17.39, (tick, -14, 0.04, 0, 3, 0)),
 (17.02, ZOOM), (17.92, HIT),                    # انتقال · «العراق»
 (19.00, (lambda: whoosh(0.45), -9, 0.15, 0.30, 0, 0)), (19.02, (boom, -6, 1.0, 0, 0, 0)), (19.02, (sting, -10, 2.95, 0, 0, 0)),
 (19.80, (hit, -8, 0.4, 0, 0, 0)), (20.30, (tick, -13, 0.04, 0, 0, 0)), (20.42, (tick, -13, 0.04, 0, 0, 0)),
]]
sfx = np.zeros((N, 2)); duck = np.zeros(N); report = []
for (te, fn, pk, maxd, align, accent, dk) in E:
    s = fn(); s = s if s.ndim == 2 else st(s)
    L = min(len(s), int((align + maxd) * SR) + 1) if maxd > 0 else int(align * SR)
    s = fade(norm(s[:L]) * 10 ** (pk / 20), 0.002, 0.03 if maxd < 0.3 else 0.08)
    i0 = int((te - align) * SR); buf = np.zeros((N, 2)); j = min(N, i0 + len(s)); buf[max(0, i0):j] = s[max(0, -i0):j - i0]
    # قاعدة النسب: نطاق الكلام تحت كل كلمة
    sb = band_db(buf); m = min(len(sb), len(vo_b)); margin = 6 if accent == 1 else (8 if accent == 3 else 15)
    need = np.zeros(len(sb)); sp = speech[:m] & (sb[:m] > -90)
    need[:m][sp] = np.minimum(0, (vo_b[:m] - margin) - sb[:m])[sp]          # كم لازم ينخفض بكل 20ms فوق كلمة
    need = np.maximum(need, -30)
    if accent == 2: need[:] = 0                                              # جرس/علامة: مستوى ثابت خفيف بلا تخفيض
    k = 3; need = np.array([need[max(0, i - k):i + k + 1].min() for i in range(len(need))])   # يمسك أعمق نقطة حولها
    need = np.convolve(need, np.ones(5) / 5, "same")                          # تنعيم 100ms — بلا تقطيع
    gcurve = 10 ** (np.interp(np.arange(N), np.arange(len(need)) * HOP + HOP / 2, need) / 20)
    sfx += buf * gcurve[:, None]; report.append((te, round(float(need.min()), 1)))
    if dk:  # منحنى خفض تدريجي: ينزل قبل الضربة بـ0.25 ث ويرجع خلال 0.45 ث
        c = int(te * SR); a, r = int(0.25 * SR), int(0.45 * SR)
        seg = np.concatenate([0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a)), 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, r))])
        lo, hi = max(0, c - a), min(N, c + r); duck[lo:hi] = np.maximum(duck[lo:hi], seg[lo - (c - a):hi - (c - a)] * dk)
vo_d = vo * (10 ** (-duck / 20))[:, None]
# جو خفيف بس بالمقدمة والنهاية (لا كلام)
room = flt(np.cumsum(rng.standard_normal(N)) * 0.02, "lowpass", 300); room = norm(room - flt(room, "lowpass", 20))
tl = np.arange(N) / SR; lev = np.interp(tl, [0, TOTAL - 3.0, TOTAL - 2.9, TOTAL], [-70, -70, -32, -34])
mix = vo_d + sfx + st(room * 10 ** (lev / 20))

# ── تقرير بعد المكساج ──
caps = json.load(open(W + r"\caps.json", encoding="utf-8")); words = [w for c in caps["cards"] for w in c["w"]]
fx_b = band_db(sfx); vd_b = band_db(vo_d); m = min(len(fx_b), len(vd_b)); worst = []
for w in words:
    a, b = int(w["s"] * SR / HOP), min(m, int(w["e"] * SR / HOP))
    if b - a < 3: continue
    snr = 10 * np.log10(np.mean(10 ** (vd_b[a:b] / 10)) / (np.mean(10 ** (fx_b[a:b] / 10)) + 1e-12)); worst.append((round(snr, 1), w["t"], round(w["s"], 2)))
worst.sort(); tail = (fx_b[:m] > -50) & speech[:m]; near = (fx_b[:m] > vd_b[:m] - 25) & speech[:m]
print(f"أسوأ 6 كلمات (الكلام فوق المؤثرات بنطاق الكلام dB): {worst[:6]}")
print(f"كلمات أقل من 12 dB: {sum(1 for x in worst if x[0] < 12)} من {len(worst)} · المؤثرات مسموعة تحت {tail.sum() / max(speech[:m].sum(), 1) * 100:.0f}% من الكلام")
print(f"المؤثرات قريبة من الكلام (أقل من 25 dB تحته) في {near.sum() / max(speech[:m].sum(), 1) * 100:.1f}% من وقت الكلام — هذا المقياس اللي يهم السمع")
_ix = np.where(near)[0]; _r = []
for _k in _ix:
    if _r and _k - _r[-1][1] <= 2: _r[-1][1] = _k
    else: _r.append([_k, _k])
print("   مواضعها (ث):", ", ".join(f"{a*HOP/SR:.2f}-{(b+1)*HOP/SR:.2f}" for a, b in _r))
print("أعمق تخفيض موضعي (dB) فوق الكلمات:", [r for r in report if r[1] < -1])
print(f"أقصى خفض للكلام: {duck.max():.1f} dB")
def save(name, x):
    x = np.clip(x, -0.999, 0.999); w = wave.open(W + "\\v2\\" + name, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype("<i2").tobytes()); w.close()
hr = 10 ** (-3 / 20) / np.max(np.abs(mix)); save("mix_full.wav", mix * hr); save("mix_clean.wav", vo * 10 ** (-3 / 20) / np.max(np.abs(vo)))
print(f"mix peak {20 * np.log10(np.max(np.abs(mix))):.1f} dBFS")

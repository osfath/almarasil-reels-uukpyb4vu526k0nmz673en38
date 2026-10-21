# -*- coding: utf-8 -*-
"""sfxlib — مكتبة مؤثرات المراسيل (مولّدة بـnumpy، بلا ملفات خارجية).
   الدوال الأصلية من kit/template/v2/sfx_v4.py (المعتمدة) + إضافات مشروع الأصباغ: الكشيدة · شاشة الكتابة · موشن الكلمات · انتقالات القطع.
   الاستعمال: from sfxlib import *  أو  python kit/sfx/make_sfx.py ← kit/sfx/wav/*.wav + manifest.json + demo.wav"""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
SR = 48000
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


# ═══ إضافات 07 (الأصباغ) ═══
def kashida(d=0.42, f0=350, f1=2600):
    """مطّ الكشيدة: نطاق ضيّق ينزلق لفوق (350→2600 Hz) مثل شي ينمطّ + نغمة خفيفة تنزلق + لمسة استقرار بالنهاية (بلا ارتداد)"""
    n = int(d * SR); t = np.arange(n) / SR; u = t / d; x = rng.standard_normal(n + 4096); out = np.zeros(n + 4096)
    hop = 512; win = np.hanning(2048)
    for i in range(0, n, hop):                                          # فلترة متحركة (overlap-add)
        fc = f0 * (f1 / f0) ** (min(1, i / n) ** 1.2)
        seg = flt(x[i:i + 2048] * win, "bandpass", [fc * 0.72, min(20000, fc * 1.38)], 2); out[i:i + 2048] += seg
    out = out[:n]
    tone = np.sin(2 * np.pi * np.cumsum(170 + 430 * u ** 1.3) / SR) * 0.18
    env = (u ** 0.6) * np.minimum(1, (1 - u) / 0.1)                       # يتصاعد ثم يقف بنعومة
    snap = np.zeros(n); i = int(n * 0.9); snap[i:] = flt(rng.standard_normal(n - i), "bandpass", [1800, 5200]) * np.exp(-(t[i:] - t[i]) / 0.01) * 0.5
    m = norm(out) * env + tone * env + snap
    return fade(st(norm(m)), 0.004, 0.02)
def kashida_air(d=0.4):
    """نسخة هوائية أنعم للمطّ فوق كلام كثيف"""
    t = tt(d); u = t / d; x = nz(d); out = np.zeros_like(t)
    for i, (lo, hi) in enumerate([(600, 1200), (1100, 2200), (2000, 4000), (3500, 7000)]): out += flt(x, "bandpass", [lo, hi]) * np.exp(-((u - i / 3) ** 2) / 0.06)
    return fade(st(norm(out * np.sin(np.pi * u) ** 1.5)), 0.003, 0.03)
def key(seed=0):
    """نقرة مفتاح كيبورد: طقّة عالية + ثقل خفيف"""
    r = np.random.default_rng(seed); d = 0.06; t = tt(d); f = r.uniform(2400, 4200)
    m = flt(nz(d), "highpass", 2500) * np.exp(-t / 0.0025) * 0.8 + np.sin(2 * np.pi * f * t) * np.exp(-t / 0.004) * 0.35 + np.sin(2 * np.pi * r.uniform(160, 220) * t) * np.exp(-t / 0.012) * 0.5
    return st(norm(m))
def typing2(d, cps=12, seed=3):
    """كتابة بإيقاع طبيعي (cps حرف/ث) — بطول الكتابة بالضبط"""
    r = np.random.default_rng(seed); out = np.zeros((int(d * SR) + 4800, 2)); x = 0.0; k = 0
    while x < d:
        s = key(seed + k) * r.uniform(0.55, 1.0); i = int(x * SR); out[i:i + len(s)] += s; x += r.uniform(0.6, 1.4) / cps; k += 1
    return out[:int(d * SR) + 2400]
def caret():
    t = tt(0.05); return st(norm(np.sin(2 * np.pi * 1900 * t) * np.exp(-t / 0.006) * (1 - np.exp(-t / 0.0008))))
def type_return():
    """نهاية سطر: نقرتين + نَفَس قصير"""
    a = key(91); b = key(92) * 0.7; w = whoosh(0.18, True, 0.3, -0.3) * 0.25; out = np.zeros((int(0.3 * SR), 2))
    out[:len(a)] += a; j = int(0.07 * SR); out[j:j + len(b)] += b; out[:len(w)] += w; return norm(out)
def slam():
    """ضربة كلمة: ثقل منخفض قصير + نقرة (للكلمة اللي تنضرب)"""
    t = tt(0.3); f = 55 + 110 * np.exp(-t / 0.025)
    m = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.07) + flt(nz(0.3), "bandpass", [600, 3000]) * np.exp(-t / 0.012) * 0.6
    return st(norm(np.tanh(1.4 * m)))
def mask_rise(d=0.3):
    """كلمة تطلع من تحت القناع: سحبة هوائية صاعدة قصيرة"""
    return whoosh(d, True, -0.1, 0.1) * np.linspace(0.6, 1, int(d * SR))[:, None]
def swap_flick():
    """تبديل كلمة بكلمة: نفَس نازل-صاعد قصير"""
    a = whoosh(0.14, False, 0.2, -0.2); b = whoosh(0.16, True, -0.2, 0.2); out = np.zeros((len(a) + len(b) - 1200, 2)); out[:len(a)] += a; out[len(a) - 1200:] += b; return norm(out)
def marker(d=0.32):
    """مسحة الماركر خلف الكلمة: احتكاك ناعم بنطاق عالي ينزلق"""
    t = tt(d); u = t / d; x = nz(d); m = flt(x, "bandpass", [2200, 6500]) * (0.6 + 0.4 * np.sin(2 * np.pi * 38 * t)) * np.sin(np.pi * u) ** 0.8
    return fade(st(norm(m)), 0.005, 0.03)
def push_up():   return whoosh(0.5, True, -0.2, 0.2)
def slide(dir_left=True): return whoosh(0.45, True, 0.8, -0.8) if dir_left else whoosh(0.45, True, -0.8, 0.8)
def wipe_soft(): return whoosh(0.5) * 0.9
def natural_wipe():
    """للانتقال الطبيعي بلقطة A3 (غطاء يعبر الكادر): نفَس عريض ناعم بلا حدّة"""
    w = whoosh(0.6, True, 0.6, -0.6); return w * np.sin(np.linspace(0, np.pi, len(w)))[:, None] ** 0.5

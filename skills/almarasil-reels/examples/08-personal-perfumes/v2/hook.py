# -*- coding: utf-8 -*-
"""هوك: مرور الكاميرا من فوق العيّنات بكيرف سرعة احترافي (ramp in → hold → ramp out)
   مفاتيح السرعة على زمن المصدر، والانتقال بينها smootherstep على لوغاريتم السرعة (تسارع/تباطؤ متساوي الإحساس، بلا كسرات)
   المصدر P3 المثبّت 4K 120fps (البطيء 0.25 = كل فريم حقيقي) ← assets/clips/P3-details/00-hook-pass-curve.mp4 + رسم الكيرف
   python v2/hook.py [مدة_الهدف]"""
import os, sys, math, json, subprocess, numpy as np
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(W, "_an", "stab_P3.mp4"); OUT = os.path.join(W, "assets", "clips", "P3-details")
TARGET = float(sys.argv[1]) if len(sys.argv) > 1 else 2.45   # «منافسك ممكن يقلّد فكرة منتجك» على التايم-لاين المقصوص
# (زمن المصدر, السرعة): اندفاع ← تباطؤ على الأحمر/الماجنتا بوسط الكادر (≈1.95) ← هولد ← خروج سريع للقطع
KEYS = [(0.10, 3.0), (1.38, 3.0), (1.80, 0.25), (2.07, 0.25), (2.42, 3.0)]  # 3x ← 0.25x ← 3x (بلا تحجيم آلي: يطلع 17x)
def sm(u): u = min(1, max(0, u)); return u * u * u * (u * (6 * u - 15) + 10)   # smootherstep
def speed(t):
    if t <= KEYS[0][0]: return KEYS[0][1]
    for (a, sa), (b, sb) in zip(KEYS, KEYS[1:]):
        if t <= b: return math.exp(math.log(sa) + (math.log(sb) - math.log(sa)) * sm((t - a) / (b - a)))
    return KEYS[-1][1]
A, B = KEYS[0][0], KEYS[-1][0]
def table(scale=1.0, n=400):
    ts = np.linspace(A, B, n + 1); outs = [0.0]
    for i in range(n):
        dt = ts[i + 1] - ts[i]; outs.append(outs[-1] + sum(dt / 8 / (scale * speed(ts[i] + dt * (j + .5) / 8)) for j in range(8)))
    return ts, np.array(outs)
ts, outs = table()
# setpts بجدول خطي متعدد القطع (60 قطعة)
idx = np.linspace(0, len(ts) - 1, 61).astype(int); e = f"{outs[-1]:.5f}"
for k in range(len(idx) - 2, -1, -1):
    i0, i1 = idx[k], idx[k + 1]; t0, t1 = ts[i0] - A, ts[i1] - A; sl = (outs[i1] - outs[i0]) / (t1 - t0)
    e = f"if(lt(T\\,{t1:.5f})\\,{outs[i0]:.5f}+(T-{t0:.5f})*{sl:.5f}\\,{e})"
hold_out = float(np.interp(KEYS[2][0], ts, outs)); dur = float(outs[-1])
# دفعة 1.00→1.06 تبدأ مع الهولد (تركيز)، باتجاه واحد
z = f"(1+0.06*pow(sin(min(max((t-{hold_out:.3f})/{max(dur-hold_out, .1):.3f}\\,0)\\,1)*PI/2)\\,2))"
vf = (f"trim=start={A}:end={B},setpts=PTS-STARTPTS,setpts={e}/TB,fps=30,scale=1080:1920:flags=lanczos,"
      f"scale=w=2*trunc(540*{z}):h=2*trunc(960*{z}):eval=frame:flags=bicubic,crop=1080:1920:(iw-1080)/2:(ih-1920)/2,setsar=1")
out = os.path.join(OUT, "00-hook-pass-curve.mp4")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-filter_complex", f"[0:v]{vf}[v]", "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "16", "-preset", "medium",
                "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], check=True)
real = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], capture_output=True, text=True).stdout)
# رسم الكيرف (السرعة على زمن الناتج)
from PIL import Image, ImageDraw, ImageFont
Wd, H = 1080, 420; im = Image.new("RGB", (Wd, H), (14, 21, 36)); d = ImageDraw.Draw(im); F = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)
ys = lambda s: H - 50 - (math.log(s) - math.log(0.2)) / (math.log(4) - math.log(0.2)) * (H - 100)
for s in (0.25, 0.5, 1, 2, 3): d.line([(60, ys(s)), (Wd - 20, ys(s))], fill=(40, 52, 80)); d.text((8, ys(s) - 12), f"{s}x", font=F, fill=(150, 160, 190))
pts = [(60 + (Wd - 80) * float(o) / dur, ys(speed(t))) for t, o in zip(ts, outs)]
d.line(pts, fill=(79, 163, 255), width=5); d.text((70, 12), f"hook speed curve  {real:.2f}s  (ramp in > hold 0.25x > ramp out)", font=F, fill=(255, 255, 255))
im.save(os.path.join(OUT, "00-hook-curve.png"))
json.dump({"keys": KEYS, "dur": real, "hold_starts_out": round(hold_out, 2)}, open(os.path.join(OUT, "00-hook-curve.json"), "w"), indent=1)
print(f"هوك ✔ {real:.2f} ث · الهولد يبدأ {hold_out:.2f} · مفاتيح", [(round(t, 2), round(s, 2)) for t, s in KEYS])

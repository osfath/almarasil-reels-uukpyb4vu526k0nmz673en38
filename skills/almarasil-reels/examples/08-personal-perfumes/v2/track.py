# -*- coding: utf-8 -*-
"""تتبّع قنينة بطل داخل فريم 4K المثبّت (template matching على 540×960) ← مسار (t, x, y) نسبي"""
import cv2, numpy as np, os
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_cache = {}
def frames(k):
    if k not in _cache:
        cap = cv2.VideoCapture(os.path.join(W, "_an", f"stab_{k}.mp4")); fs = []
        while True:
            ok, f = cap.read()
            if not ok: break
            fs.append(cv2.cvtColor(cv2.resize(f, (540, 960), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY))
        _cache[k] = fs
    return _cache[k]
def track(k, t0, x0, y0, fps=120, tw=70, th=55, search=60, thr=0.45):
    fs = frames(k); n0 = int(t0 * fps); res = {n0: (x0 * 540, y0 * 960, 1.0)}
    for step in (1, -1):
        x, y = x0 * 540, y0 * 960; vx = vy = 0; tpl = None; n = n0
        def cut(f, x, y): return f[int(y - th):int(y + th), int(x - tw):int(x + tw)]
        tpl = cut(fs[n0], x, y)
        while 0 <= n + step < len(fs):
            n += step; f = fs[n]; px, py = x + vx, y + vy
            x1, y1 = int(max(0, px - tw - search)), int(max(0, py - th - search))
            x2, y2 = int(min(540, px + tw + search)), int(min(960, py + th + search))
            reg = f[y1:y2, x1:x2]
            if reg.shape[0] <= tpl.shape[0] or reg.shape[1] <= tpl.shape[1]: break
            m = cv2.matchTemplate(reg, tpl, cv2.TM_CCOEFF_NORMED); _, sc, _, loc = cv2.minMaxLoc(m)
            if sc < thr: break
            nx, ny = x1 + loc[0] + tw, y1 + loc[1] + th; vx, vy = nx - x, ny - y; x, y = nx, ny
            if not (tw < x < 540 - tw and th < y < 960 - th): break
            res[n] = (x, y, sc)
            if n % 8 == 0 and sc > 0.7: tpl = cut(f, x, y)  # تحديث القالب (الحجم يتغيّر مع حركة الكاميرا)
    ns = sorted(res)
    return np.array([[n / fps, res[n][0] / 540, res[n][1] / 960, res[n][2]] for n in ns])
if __name__ == "__main__":
    import sys
    T = {"red": ("P3", 1.2, .72, .87), "magenta": ("P3", 1.9, .62, .60), "musk": ("P3", 2.6, .74, .80),
         "musk2": ("P3", 3.0, .48, .62), "kgar": ("P3", 0.3, .50, .88), "carher": ("P3", 0.3, .40, .57),
         "p4mag": ("P4", 1.8, .36, .70), "p4orange": ("P4", 1.8, .65, .60), "malak": ("P3", 2.6, .60, .64)}
    for name, (k, t, x, y) in T.items():
        tr = track(k, t, x, y)
        print(f"{name:9s} {k} {tr[0,0]:.2f}–{tr[-1,0]:.2f}s ({len(tr)}f)", " ".join(f"{r[0]:.1f}:{r[1]:.2f},{r[2]:.2f}" for r in tr[::24]))

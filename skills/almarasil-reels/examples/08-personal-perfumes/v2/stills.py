# -*- coding: utf-8 -*-
"""لقطات من صور ثابتة (دفعة بطيئة Ken Burns، باتجاه واحد بلا ارتداد) ← assets/clips/stills/*.mp4 (1080×1920 30fps)
   جركن PARNZO: مكبّر ×1.12 مثبّت من فوق ← شريط بيانات المورّد (≈0.69 من الارتفاع) ينزل تحت y≈1480 = تحت البانر السفلي (قرار صاحب الشغل)"""
import os, subprocess, numpy as np
from PIL import Image
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); FPS = 30
JOBS = [("jerry-push", "stock/parnzo-1658098/parnzo-jerrycan-on-drums-sunlight.jpg", 2.2, 1.12, 1.18, 0.0, 0.5),
        ("kit-push", "assets/img/photo-box-pyramid-3-4k.jpg", 2.6, 1.30, 1.40, 0.55, 0.92)]   # العلبة مفتوحة كاملة + الهرم · مزاح يمين (يشيل الكيبورد/أغراض المكتب يسار)   # العلبة كاملة + الهرم: «تختار منها» (لقطة مختلفة عن الماكرو)  # (اسم, صورة, مدة, زوم من, إلى, مرساة y: 0=فوق)
for name, src, dur, z0, z1, ay, ax in JOBS:
    im = Image.open(os.path.join(W, src)).convert("RGB"); base = im.resize((1080, round(1080 * im.height / im.width)), Image.LANCZOS)
    big = im.resize((round(1080 * z1 * 1.02), round(1080 * z1 * 1.02 * im.height / im.width)), Image.LANCZOS)   # مصدر عالي الدقة للتصغير
    out = os.path.join(W, "assets", "clips", "stills", name + ".mp4")
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "1080x1920", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-crf", "16",
                          "-preset", "medium", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    n = round(dur * FPS)
    for i in range(n):
        u = i / (n - 1); e = 1 - (1 - u) ** 2                                  # تباطؤ ناعم
        z = z0 + (z1 - z0) * e; w, h = 1080 / z, 1920 / z                       # نافذة القصّ بإحداثيات الصورة المصغّرة لعرض 1080
        k = big.width / 1080; x0 = (1080 - w) * ax; y0 = (base.height - h) * ay
        fr = big.crop((round(x0 * k), round(y0 * k), round((x0 + w) * k), round((y0 + h) * k))).resize((1080, 1920), Image.LANCZOS)
        p.stdin.write(np.asarray(fr).tobytes())
    p.stdin.close(); p.wait(); print(name, "✔", dur, "ث")

# -*- coding: utf-8 -*-
"""لقطات التصوير الحقيقي (4K 120fps عمودي) ← assets/clips/C*.mp4 (1080×1920 30fps) + slow حقيقي (120fps ÷4 = كل فريم حقيقي)
   لحظات التلوّن مقاسة بتشبّع منطقة البيكر (أول لون): أزرق 2.62 · أخضر2 6.97 · بنفسجي 7.41 · أحمر 7.09 · أصفر 19.08 (60fps ← 0.5x) · أخضر1 1.33"""
import json, os, subprocess
from concurrent.futures import ThreadPoolExecutor
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = [  # [اسم, ملف, من, إلى, سرعة, وصف]
 ("C1-blue-approach",      "أزرق",      0.80, 2.60, 1.0,  "أزرق: القضيب ينزل بالبودرة نحو الماء"),
 ("C1-blue-bloom-slow",    "أزرق",      2.40, 4.40, 0.25, "أزرق: البودرة تلمس الماء وتنتشر سحب زرقاء — slow ×4 (8 ث) ★"),
 ("C1-blue-full",          "أزرق",      9.00, 13.0, 1.0,  "أزرق: تحريك — البيكر أزرق كامل"),
 ("C2-green-approach",     "فديو أخضر", 2.00, 6.60, 1.0,  "أخضر فلوري: القضيب يدخل من الجنب بهدوء بالبودرة"),
 ("C2-green-bloom-slow",   "فديو أخضر", 6.80, 8.60, 0.25, "أخضر فلوري: انفجار اللون بالماء — slow ×4 (7.2 ث) ★"),
 ("C2-green-full",         "فديو أخضر", 13.0, 17.0, 1.0,  "أخضر فلوري: بيكر يتوهّج طبيعيًا (لون الصبغة نفسها)"),
 ("C3-violet-drop-slow",   "بنفسجي",    6.60, 8.60, 0.25, "بنفسجي (خلفية داكنة): القضيب ينزل واللون ينتشر — slow ×4 ★"),
 ("C3-violet-full",        "بنفسجي",    10.0, 14.0, 1.0,  "بنفسجي: البيكر بنفسجي كامل + تحريك"),
 ("C4-red-drop-slow",      "أحمر",      5.40, 7.60, 0.25, "أحمر: البودرة تنزل ولوالب حمراء — slow ×4 ★"),
 ("C4-red-swirl",          "أحمر",      7.60, 10.0, 1.0,  "أحمر: اللوالب تنتشر"),
 ("C4-red-fill",           "أحمر",      21.0, 29.0, 1.0,  "أحمر: إضافة ماء والبيكر يمتلي (تخفيف/حجم)"),
 ("C5-yellow-clean",       "أصفر",      2.00, 8.00, 1.0,  "بيكر ماء صافي على الميزان (قبل) — هادئة"),
 ("C5-yellow-flash-slow",  "أصفر",      18.8, 20.2, 0.5,  "أصفر فلوري: تلوّن فوري — slow ×2 (60fps)"),
 ("C6-green1-fill",        "أخضر",      1.00, 5.00, 1.0,  "أخضر: القضيب + امتلاء اللون"),
 ("C7-amaranth-stir",      "أمارانث",   0.50, 4.50, 1.0,  "أمارانث: تحريك بيكر أحمر وردي"),
]
def job(c):
    name, src, a, b, sp, desc = c
    vf = f"setpts={1/sp:.4f}*(PTS-STARTPTS),fps=30,scale=1080:1920:flags=lanczos,setsar=1"
    out = os.path.join(W, "assets", "clips", name + ".mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a), "-to", str(b), "-i", os.path.join(W, "input", src + ".mp4"), "-an", "-vf", vf,
                    "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", out], check=True)
    return {"name": name, "src": src + ".mp4", "from": a, "to": b, "speed": sp, "dur": round((b - a) / sp, 2), "desc": desc, "files": [f"assets/clips/{name}.mp4"]}
with ThreadPoolExecutor(3) as ex: res = list(ex.map(job, C))
m = json.load(open(os.path.join(W, "assets", "clips", "clips.json"), encoding="utf-8"))
m = [x for x in m if not x["name"].startswith("C")] + res
json.dump(m, open(os.path.join(W, "assets", "clips", "clips.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
# الصور (2304×4096 = 9:16 بالضبط) ← 1080×1920
from PIL import Image
for f, n in [("أخضر.jpg", "photo-green"), ("أصفر.jpg", "photo-yellow-1"), ("أصفرر.jpg", "photo-yellow-2"), ("أمارانث.jpg", "photo-amaranth")]:
    Image.open(os.path.join(W, "input", f)).convert("RGB").resize((1080, 1920), Image.LANCZOS).save(os.path.join(W, "assets", "img", n + ".jpg"), quality=93)
print(len(res), "لقطة حقيقية ✔ + 4 صور")

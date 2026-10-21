# -*- coding: utf-8 -*-
"""P3-details: ورقة (3 لحظات لكل شوت = بداية/وسط/نهاية للتأكد من التتبّع) + 00-sequence-preview.mp4 (مونتاج قطع للترتيب) + index.html"""
import json, os, subprocess, io
from PIL import Image, ImageDraw, ImageFont
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); D = os.path.join(W, "assets", "clips", "P3-details")
seq = json.load(open(os.path.join(D, "sequence.json"), encoding="utf-8"))
F = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 20)
def grab(path, t):
    b = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", path, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "mjpeg", "-"], capture_output=True).stdout
    return Image.open(io.BytesIO(b)).convert("RGB").resize((150, 267))
cw, chh, cols = 3 * 150 + 4, 267 + 34, 3
sheet = Image.new("RGB", (cols * (cw + 10), -(-len(seq) // cols) * chh), (14, 21, 36)); d = ImageDraw.Draw(sheet)
for i, s in enumerate(seq):
    x, y = (i % cols) * (cw + 10), (i // cols) * chh; p = os.path.join(W, s["file"])
    for j, f in enumerate((.08, .5, .92)): sheet.paste(grab(p, s["dur"] * f), (x + j * 152, y))
    d.text((x + 4, y + 270), f"{s['name']}  {s['dur']}s", font=F, fill=(79, 163, 255))
sheet.save(os.path.join(D, "00-details-sheet.jpg"), quality=88)

# معاينة الترتيب: قطع نظيف بالتسلسل (مقترح مونتاج، مو نهائي)
CUT = [("01", 0.0, 1.6), ("03", 0.6, 2.4), ("04", 0.8, 2.6), ("05", 0.8, 2.6), ("06", 1.0, 2.4), ("08", 1.4, 3.6), ("11", 0.6, 2.2), ("12", 0.8, 2.4), ("09", 0.0, 2.4)]
lst = os.path.join(W, "_an", "seq_parts"); os.makedirs(lst, exist_ok=True); parts = []
for num, a, b in CUT:
    s = next(x for x in seq if x["name"].startswith(num)); o = os.path.join(lst, f"{num}.mp4"); parts.append(o)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a), "-to", str(min(b, s["dur"])), "-i", os.path.join(W, s["file"]), "-an",
                    "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-pix_fmt", "yuv420p", "-r", "30", o], check=True)
open(os.path.join(lst, "list.txt"), "w").write("".join(f"file '{p.replace(os.sep, '/')}'\n" for p in parts))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(lst, "list.txt"), "-c", "copy", "-movflags", "+faststart",
                os.path.join(D, "00-sequence-preview.mp4")], check=True)

esc = lambda t: str(t).replace("&", "&amp;").replace("<", "&lt;")
cards = "".join(f'<figure><video src="{os.path.basename(s["file"])}" muted loop autoplay playsinline></video><figcaption><b>{esc(s["name"])}</b>'
                f'<span>{esc(s.get("kind",""))} · {esc(s.get("speed",""))}x · {s["dur"]} ث</span><p><i>{esc(s["role"])}</i> — {esc(s.get("desc",""))}</p></figcaption></figure>' for s in seq)
html = f"""<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>تفاصيل العطور</title>
<style>@font-face{{font-family:J;src:url(../../../aljazeera-bold.ttf)}}body{{margin:0;padding:24px;background:#0E1524;color:#fff;font-family:J,Arial}}
h1{{margin:0 0 6px;font-size:26px}}.sub{{color:#4FA3FF;margin:0 0 18px}}.pre{{display:flex;gap:20px;align-items:flex-start;margin-bottom:24px}}
.pre video{{width:300px}}main{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}}figure{{margin:0;background:#16203a;padding:10px}}
video{{width:100%;aspect-ratio:9/16;object-fit:cover;display:block;background:#000}}b{{display:block;margin-top:8px;direction:ltr;text-align:right;font-family:Arial;font-size:13px}}
span{{color:#4FA3FF;font-size:13px}}p{{margin:4px 0 0;font-size:14px;line-height:1.5;color:#cfd6e4}}i{{color:#fff;font-style:normal}}</style>
<h1>التفاصيل — المرور من أعلى</h1><p class="sub">{len(seq)} شوت بالترتيب · واسع ← متوسط ← ماكرو · اتجاه حركة واحد · البطل بالثلث العلوي</p>
<div class="pre"><video src="00-sequence-preview.mp4" controls muted loop autoplay playsinline></video><p>معاينة الترتيب (قطع نظيف، بلا انتقالات ولا صوت):<br>
تأسيسي ← ماكرو ملصق ← أحمر ← ماجنتا ← ألوان تعبر ← MUSK ← تغيير زاوية (منخفضة) ← عنبر ← ختام المرور</p></div><main>{cards}</main></html>"""
open(os.path.join(D, "index.html"), "w", encoding="utf-8").write(html)
print("ورقة ✔ معاينة ✔ index ✔")

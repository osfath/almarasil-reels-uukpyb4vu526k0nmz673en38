# -*- coding: utf-8 -*-
"""ورقة الشوتات (assets/clips/00-shots-sheet.jpg) + معرض محلي (assets/clips/index.html) من clips.json"""
import json, os, subprocess, io
from PIL import Image, ImageDraw, ImageFont
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); CL = os.path.join(W, "assets", "clips")
db = json.load(open(os.path.join(CL, "clips.json"), encoding="utf-8"))
FONT = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)
tw, th = 270, 480; items = []
for s in db["shots"]:  # لحظة البطل: بداية البطيء بالـramp، وإلا الوسط
    t = s.get("ramp", {}).get("slow_starts_at_out", s["dur"] / 2) + (0.6 if s["kind"] == "ramp" else 0)
    jpg = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{min(t, s['dur'] - .1):.2f}", "-i", os.path.join(W, s["file"]), "-frames:v", "1",
                          "-f", "image2pipe", "-vcodec", "mjpeg", "-"], capture_output=True).stdout
    items.append((Image.open(io.BytesIO(jpg)), f"{s['name']}", f"{s['kind']} · {s['speed']}x · {s['dur']}s"))
for p in db["photos"]:
    items.append((Image.open(os.path.join(W, p["files"][0])), p["name"], "photo"))
cols = 6; rows = -(-len(items) // cols); sheet = Image.new("RGB", (cols * (tw + 8), rows * (th + 64)), (14, 21, 36))
for i, (im, a, b) in enumerate(items):
    x, y = (i % cols) * (tw + 8), (i // cols) * (th + 64)
    sheet.paste(im.convert("RGB").resize((tw, th)), (x, y)); d = ImageDraw.Draw(sheet)
    d.text((x + 4, y + th + 6), a, font=FONT, fill=(255, 255, 255)); d.text((x + 4, y + th + 34), b, font=FONT, fill=(79, 163, 255))
sheet.save(os.path.join(CL, "00-shots-sheet.jpg"), quality=88)

esc = lambda s: s.replace("&", "&amp;").replace("<", "&lt;")
cards = "".join(f'<figure><video src="{os.path.basename(s["file"])}" muted loop autoplay playsinline></video><figcaption><b>{esc(s["name"])}</b>'
                f'<span>{s["kind"]} · {s["speed"]}x · {s["dur"]} ث · {esc(s["role"])}</span><p>{esc(s["desc"])}</p></figcaption></figure>' for s in db["shots"])
cards += "".join(f'<figure><img src="../img/{os.path.basename(p["files"][0])}"><figcaption><b>{esc(p["name"])}</b><span>صورة 1080×1920 (+4k)</span>'
                 f'<p>{esc(p["desc"])}</p></figcaption></figure>' for p in db["photos"])
html = f"""<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>شوتات العطور الشخصية</title>
<style>@font-face{{font-family:J;src:url(../../aljazeera-bold.ttf)}}body{{margin:0;padding:24px;background:#0E1524;color:#fff;font-family:J,Arial}}
h1{{margin:0 0 16px;font-size:26px}}h1 small{{color:#4FA3FF;font-size:15px;margin-inline-start:12px}}
main{{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px}}figure{{margin:0;background:#16203a;padding:10px}}
video,img{{width:100%;aspect-ratio:9/16;object-fit:cover;display:block;background:#000}}b{{display:block;margin-top:8px;direction:ltr;text-align:right;font-family:Arial;font-size:13px}}
span{{color:#4FA3FF;font-size:13px}}p{{margin:4px 0 0;font-size:14px;line-height:1.5;color:#cfd6e4}}</style>
<h1>شوتات العطور الشخصية<small>{len(db['shots'])} شوت · {len(db['photos'])} صور · 1080×1920 30fps</small></h1><main>{cards}</main></html>"""
open(os.path.join(CL, "index.html"), "w", encoding="utf-8").write(html)
print("ورقة ✔ + index.html ✔", len(items))

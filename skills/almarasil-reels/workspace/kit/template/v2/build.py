# -*- coding: utf-8 -*-
"""تكسابون N70 (Promax) — التايم-لاين: الصوت + الصورة → cutz.mp4 + vfr/ + caps.json (بطاقات + nocap للصفحات)"""
import json, os, sys, subprocess, shutil
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import os as _os; W = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
SK = __import__('os').path.expanduser(r"~/.claude/skills/video-ad-editor/scripts")
SRC = os.path.join(W, "src.mov"); FPS = 30
KEEP = [[0.95, 11.36], [12.40, 30.45]]                         # القص داخل الصمت (منحنى الطاقة)
VO_END = round(sum(b - a for a, b in KEEP), 3); TOTAL = round(VO_END + 0.30, 3)
# الصورة: تحت الصفحات البيضاء تمشي لقطات عادية؛ «اللزوجة» = لقطة السكب الحقيقية (تنقص داخل كرت الصفحة)
EDL = [
 [0.00, 4.05, 0.95, 1.0],    # الهوك: فتح البرميل والسكب (لقطة الـRAW نفسها — جابت 30 ألف مشاهدة)
 [4.05, 6.25, 5.60, 1.0],    # (تحت صفحة «باسف»)
 [6.25, 8.55, 6.00, 1.0],    # «تكسابون N70» — الرافعة اليدوية
 [8.55, 10.39, 10.20, 1.0],  # «وصلنا اليوم لشركة المراسيل»
 [10.39, 14.65, 14.90, 1.0], # (تحت صفحة التعداد)
 [14.65, 15.75, 2.60, 1.0],  # السكب — يظهر داخل كرت «اللزوجة»
 [15.75, 23.51, 19.20, 1.0], # (تحت صفحتي التوافق والكيمياء)
 [23.51, 25.51, 17.62, 1.0], # «عنوانّا بالموصل» — البالِت برا
 [25.51, TOTAL, 27.35, 1.0], # المستودع
]
assert abs(EDL[-1][1] - TOTAL) < 1e-6
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)
fc = []
for i, (ns, ne, ss, sp) in enumerate(EDL):
    n = round(ne * FPS) - round(ns * FPS)
    fc.append(f"[0:v]trim=start={ss:.4f}:end={ss + (ne - ns) * sp + 0.2:.4f},setpts=(PTS-STARTPTS)/{sp},fps={FPS},"
              f"trim=end_frame={n},setpts=PTS-STARTPTS,eq=contrast=1.06:brightness=0.012:saturation=1.07,"
              f"scale=1080:1920:flags=lanczos,unsharp=5:5:0.30:5:5:0,setsar=1[v{i}]")
fc.append("".join(f"[v{i}]" for i in range(len(EDL))) + f"concat=n={len(EDL)}:v=1:a=0,format=yuv420p[vo]")
for i, (a, b) in enumerate(KEEP):
    fc.append(f"[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st={b-a-0.02:.3f}:d=0.02[a{i}]")
fc.append("".join(f"[a{i}]" for i in range(len(KEEP))) + f"concat=n={len(KEEP)}:v=0:a=1,highpass=f=75,"
          f"acompressor=threshold=-21dB:ratio=2.5:attack=6:release=90:makeup=1.5,apad=whole_dur={TOTAL},atrim=0:{TOTAL}[ao]")
run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-filter_complex", ";".join(fc), "-map", "[vo]", "-map", "[ao]",
     "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
     "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", os.path.join(W, "cutz.mp4")])
for d in ("vfr", "out", "prev"):
    if os.path.isdir(os.path.join(W, d)): shutil.rmtree(os.path.join(W, d))
os.makedirs(os.path.join(W, "vfr"))
run(["ffmpeg", "-v", "error", "-i", os.path.join(W, "cutz.mp4"), "-vf", f"fps={FPS}", "-q:v", "2", os.path.join(W, "vfr", "%05d.jpg")])
print("cutz.mp4 ok — VO", VO_END, "· total", TOTAL, "· frames", len(os.listdir(os.path.join(W, "vfr"))))
a = json.load(open(os.path.join(W, "a.orig.json"), encoding="utf-8"))
a["segments"][0]["words"][0]["start"] = 1.12                     # بداية الكلام الفعلية (الطاقة)
a["segments"][1]["words"][0]["start"] = 12.50
json.dump(a, open(os.path.join(W, "a.json"), "w", encoding="utf-8"), ensure_ascii=False)
json.dump({"keep": KEEP, "total": VO_END, "src_dur": 30.639}, open(os.path.join(W, "cut.json"), "w", encoding="utf-8"), indent=1)
run([sys.executable, os.path.join(SK, "02_captions.py"), W])
caps = json.load(open(os.path.join(W, "caps.json"), encoding="utf-8"))
SPLITS = [[4, 3, 3, 2, 2, 2], [3, 3, 1, 1, 1, 1, 2, 1, 3, 3, 3, 1, 3], [2, 2, 4]]
NOCAP = {"أداء ممتاز في", "الرغوة", "والتنظيف", "والذوبانية", "واللزوجة", "التوافق", "جزيئتين", "وأهم شي", "شركة باسف الألمانية", "تكسابون N70", "وصلنا اليوم", "شارع السايلو", "قرب ورش الألمنيوم والبلاستيك", "عنوانّا بالموصل", "مع مكونات التركيبة"}   # الصفحة تعرضها بالموشن
cards = []
for c, sz in zip(caps["cards"], SPLITS):
    m = []
    for w in c["w"]:                                             # «~» = نصف كلمة قسمها وِسبر ← تندمج باللي قبلها
        if w["t"] == "~":
            if m: m[-1] = {**m[-1], "e": w["e"]}
            continue
        m.append(dict(w))
    assert sum(sz) == len(m), (sz, [w["t"] for w in m]); i = 0
    for s in sz:
        ch = m[i:i + s]; i += s; ph = " ".join(w["t"] for w in ch)
        cards.append({"s": ch[0]["s"], "e": ch[-1]["e"], "w": ch, **({"nocap": True} if ph in NOCAP else {})})
for k in range(len(cards) - 1): cards[k]["e"] = round(min(cards[k + 1]["s"], cards[k]["e"] + 0.18), 3)
cards[-1]["e"] = round(min(VO_END, cards[-1]["e"] + 0.2), 3)
json.dump({"total": TOTAL, "cards": cards}, open(os.path.join(W, "caps.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump({"outro": 3.0}, open(os.path.join(W, "sfx.json"), "w", encoding="utf-8"))
for c in cards: print(f"{c['s']:6.2f}-{c['e']:6.2f} {'·' if c.get('nocap') else ' '} " + " ".join(("*" if w.get("hot") else "") + w["t"] for w in c["w"]))

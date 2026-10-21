# -*- coding: utf-8 -*-
"""فورمالين كيمانول (Promax) — التايم-لاين: الصوت + الصورة → cutz.mp4 + vfr/ + caps.json (بطاقات + nocap للصفحات)"""
import json, os, sys, subprocess, shutil
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import os as _os; W = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
SK = __import__('os').path.expanduser(r"~/.claude/skills/video-ad-editor/scripts")
SRC = os.path.join(W, "src.mov"); FPS = 30
TEX = os.path.join(W, "..", "03-texapon", "src.mov")            # فقرة «عنوانّا بالموصل» من فيديو التكسابون (صوتها الحقيقي)
GAP, TEXK, TEXG = 0.73, [26.15, 30.45], 4.7                     # صمت قبل الفقرة · مقطعها بمصدر التكسابون (الكلام يبدأ 26.24) · رفع مستوى صوته ليطابق صوتنا (−21.4 ← −16.7 dB)
KEEP = [[1.00, 1.60], [2.40, 3.72], [3.84, 6.64], [7.90, 14.20]]  # طرقة الجليكان الحقيقية (1.18) ثم الكلام (يبدأ 2.45 بالتصويت) · القص داخل الصمت
VO_END = round(sum(b - a for a, b in KEEP) + GAP + TEXK[1] - TEXK[0], 3); TOTAL = round(VO_END + 0.60, 3)   # نفَس 0.6 ث بعد آخر كلمة قبل نهاية البراند
# لقطات المصدر: يرصّ الجليكانات 0–2.08 · الصف بملصقاته 2.10–5.70 (بعدها شعار محروق) · الملصق قريب 7.88–9.05 · بعدها صفحات بيضاء (ما تُستخدم)
EDL = [
 [0.00, 1.08, 1.00, 1.0],    # الهوك: يحطّ الجليكان على الصف (الطرقة 0.18 متزامنة) · «الفورمالين»
 [1.08, 1.84, 2.15, 1.0],    # «وصل» — صف الجليكانات بالمستودع (Whip)
 [1.84, 4.72, 2.95, 1.0],    # (تحت صفحة «بس هالمرة من مصنع كيمانول السعودي»)
 [4.72, 5.38, 4.95, 1.0],    # «تركيز» — الصف بملصقاته
 [5.38, 6.60, 7.88, 1.0],    # «37%» — الملصق قريب: SOLUTION 37 % (Whip على الرقم)
 [6.60, TOTAL, 2.30, 1.0],   # (تحت صفحة «جودة ممتازة · جليكانات 32 كيلو ونص» + فقرة العنوان/الخريطة — الصفحة تغطي)
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
    fc.append(f"[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.015,afade=t=out:st={b-a-0.02:.3f}:d=0.02[a{i}]")
n = len(KEEP); fc.append(f"aevalsrc=0:c=stereo:s=48000:d={GAP}[a{n}]")
fc.append(f"[1:a]atrim=start={TEXK[0]}:end={TEXK[1]},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume={TEXG}dB,afade=t=in:d=0.015,afade=t=out:st={TEXK[1]-TEXK[0]-0.02:.3f}:d=0.02[a{n+1}]")
fc.append("".join(f"[a{i}]" for i in range(n + 2)) + f"concat=n={n + 2}:v=0:a=1,highpass=f=75,"
          f"acompressor=threshold=-21dB:ratio=2.5:attack=6:release=90:makeup=1.5,apad=whole_dur={TOTAL},atrim=0:{TOTAL}[ao]")
run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-i", TEX, "-filter_complex", ";".join(fc), "-map", "[vo]", "-map", "[ao]",
     "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
     "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", os.path.join(W, "cutz.mp4")])
for d in ("vfr", "out", "prev"):
    if os.path.isdir(os.path.join(W, d)): shutil.rmtree(os.path.join(W, d))
os.makedirs(os.path.join(W, "vfr"))
run(["ffmpeg", "-v", "error", "-i", os.path.join(W, "cutz.mp4"), "-vf", f"fps={FPS}", "-q:v", "2", os.path.join(W, "vfr", "%05d.jpg")])
print("cutz.mp4 ok — VO", VO_END, "· total", TOTAL, "· frames", len(os.listdir(os.path.join(W, "vfr"))))
a = json.load(open(os.path.join(W, "a.orig.json"), encoding="utf-8"))
s0, s1 = a["segments"]; w0 = s0["words"]                          # جملة وِسبر الأولى تمتد على قطعتي صوت ← نقسمها (seg)
w0[0]["start"] = 2.45                                             # بداية الكلام الفعلية (التصويت يبدأ 2.45؛ قبلها جو المستودع والطرقة)
w0[3]["start"] = 3.95                                             # «بس» بعد الصمت
w0[-1]["end"] = 6.50
s1["words"][0]["start"] = 7.95
a["segments"] = [{**s0, "words": w0[:3], "seg": 1}, {**s0, "words": w0[3:], "seg": 2}, {**s1, "seg": 3}]
s3 = json.load(open(os.path.join(W, "..", "03-texapon", "a.orig.json"), encoding="utf-8"))["segments"][2]
s3["words"][0]["start"] = 26.24                                  # «عنوانّا» تبدأ 26.24 (التصويت)
a["segments"].append({**s3, "seg": 5})
json.dump(a, open(os.path.join(W, "a.json"), "w", encoding="utf-8"), ensure_ascii=False)
json.dump({"keep": KEEP + [[900.0, 900.0 + GAP], TEXK], "total": VO_END, "src_dur": 14.209}, open(os.path.join(W, "cut.json"), "w", encoding="utf-8"), indent=1)
run([sys.executable, os.path.join(SK, "02_captions.py"), W])
caps = json.load(open(os.path.join(W, "caps.json"), encoding="utf-8"))
SPLITS = [[2], [2, 3], [2, 2, 2, 2], [2, 2, 4]]
NOCAP = {"الفورمالين وصل", "بس هالمرة", "من مصنع كيمانول السعودي", "تركيز 37%", "جودة ممتازة", "وبتعبئات جليكانات", "32 كيلو ونص", "عنوانّا بالموصل", "شارع السايلو", "قرب ورش الألمنيوم والبلاستيك"}   # الصفحة/الكرت تعرضها بالموشن
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

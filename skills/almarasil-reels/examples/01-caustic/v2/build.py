# -*- coding: utf-8 -*-
"""المراسيل v2 — يبني التايم-لاين: الصوت (الكلام بلا سكتات) + الصورة (مونتاج حر من لقطات الـRAW) → cutz.mp4 + caps.json"""
import json, os, sys, subprocess, shutil
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import os as _os; W = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
SK = __import__('os').path.expanduser(r"~/.claude/skills/video-ad-editor/scripts")
SRC = os.path.join(W, "src.mov")
FPS = 30

# ── الصوت: مقاطع الكلام من الـRAW (ثواني المصدر) ──
KEEP = [[1.32, 4.745], [5.565, 8.25], [8.85, 15.15], [15.90, 24.32], [25.25, 29.30], [29.98, 34.95]]
VO_END = round(sum(b - a for a, b in KEEP), 3)
CTA = 2.43
TOTAL = round(VO_END + CTA, 3)

# ── الصورة: [بداية جديدة, نهاية جديدة, بداية بالمصدر, السرعة] ──
EDL = [
 [0.00, 0.55, 27.95, 1.0],   # M  الشوكات ترفع الكيس — هوك
 [0.55, 1.40, 0.70, 0.5],    # A  (تحتها صورة المنتج)
 [1.40, 2.62, 1.60, 1.0],    # B  الحاوية — «حاوية جديدة»
 [2.62, 3.425, 0.05, 0.5],   # A  رقائق بطيء — «الكوستك صودا»
 [3.425, 4.50, 3.10, 1.0],   # C  رافعة عند الشاحنة — «وصلتنا اليوم»
 [4.50, 6.11, 28.80, 1.0],   # N  المستودع — «لمخازن شركة المراسيل»
 [6.11, 8.22, 8.70, 1.0],    # F  (خلف الباكشوت المقصوص)
 [8.22, 9.26, 0.60, 0.5],    # A  (تحت صورة الرقائق) — «قشور»
 [9.26, 10.48, 13.00, 1.0],  # H  — «99%»
 [10.48, 11.43, 11.75, 1.0], # G
 [11.43, 12.41, 19.85, 1.0], # K
 [12.41, 13.78, 17.60, 1.0], # J
 [13.78, 14.93, 5.10, 1.0],  # D
 [14.93, 16.37, 14.30, 1.0], # H
 [16.37, 17.87, 16.00, 1.0], # I
 [17.87, 18.63, 21.30, 1.0], # L  — قسم سريع
 [18.63, 19.28, 10.90, 1.0], # F
 [19.28, 20.03, 22.90, 1.0], # L
 [20.03, 20.83, 18.97, 1.0], # J
 [20.83, 22.73, 26.00, 1.0], # M  حركة ثقيلة
 [22.73, 24.88, 6.70, 0.5],  # E  أيدي بالقفازات بطيء — «يحرق إيدك»
 [24.88, 26.73, 24.08, 1.0], # L  تنفّس
 [26.73, 29.85, 30.70, 1.0], # N
 [29.85, TOTAL, 33.85, 0.5], # N  بطيء — كرت الطلب
]
assert abs(EDL[-1][1] - TOTAL) < 1e-6

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode:
        print(r.stderr[-1500:]); sys.exit(1)
    return r

# ── 1) cutz.mp4 ──
fc = []
for i, (ns, ne, ss, sp) in enumerate(EDL):
    n = round(ne * FPS) - round(ns * FPS)
    src_end = ss + (ne - ns) * sp + 0.2
    fc.append(f"[0:v]trim=start={ss:.4f}:end={src_end:.4f},setpts=(PTS-STARTPTS)/{sp},fps={FPS},"
              f"trim=end_frame={n},setpts=PTS-STARTPTS,"
              f"eq=contrast=1.06:brightness=0.012:saturation=1.07,"
              f"scale=1080:1920:flags=lanczos,unsharp=5:5:0.30:5:5:0,setsar=1[v{i}]")
fc.append("".join(f"[v{i}]" for i in range(len(EDL))) + f"concat=n={len(EDL)}:v=1:a=0,format=yuv420p[vo]")
for i, (a, b) in enumerate(KEEP):
    fc.append(f"[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st={b-a-0.02:.3f}:d=0.02[a{i}]")
fc.append("".join(f"[a{i}]" for i in range(len(KEEP))) + f"concat=n={len(KEEP)}:v=0:a=1,"
          f"highpass=f=75,acompressor=threshold=-21dB:ratio=2.5:attack=6:release=90:makeup=1.5,"
          f"apad=whole_dur={TOTAL},atrim=0:{TOTAL}[ao]")
run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-filter_complex", ";".join(fc),
     "-map", "[vo]", "-map", "[ao]", "-c:v", "libx264", "-crf", "15", "-preset", "medium",
     "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
     "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
     os.path.join(W, "cutz.mp4")])
print("cutz.mp4 ok — total", TOTAL, "· VO", VO_END, "· shots", len(EDL))

# ── 2) frames ──
for d in ("vfr", "out", "prev"):
    p = os.path.join(W, d)
    if os.path.isdir(p): shutil.rmtree(p)
os.makedirs(os.path.join(W, "vfr"))
run(["ffmpeg", "-v", "error", "-i", os.path.join(W, "cutz.mp4"), "-vf", f"fps={FPS}", "-q:v", "2",
     os.path.join(W, "vfr", "%05d.jpg")])
print("vfr frames:", len(os.listdir(os.path.join(W, "vfr"))))

# ── 3) captions ──
a = json.load(open(os.path.join(W, "a.orig.json"), encoding="utf-8"))
a["segments"][5]["words"][0]["start"] = 30.25          # «اكتبوا لنا» يبدأ فعلياً بعد السكتة (وِسبر مدّد الكلمة للخلف)
w1=a["segments"][1]["words"]                            # «قشور|وبتركيز»: فجوة صمت عند 11.67 (مقاسة بالطاقة)
for w in w1:
    if w["word"].strip()=="القشور": w["end"]=11.67
    if w["word"].strip()=="وبتركيز": w["start"]=11.67
s0=a["segments"][0]; ws=s0["words"]; k=7                 # الجملة الأولى تنقسم على قطعتي الصوت (شلنا «أول دفعة»)
a["segments"]=[dict(s0,words=ws[:k],start=ws[0]["start"],end=ws[k-1]["end"]),dict(s0,words=ws[k:],start=ws[k]["start"],end=ws[-1]["end"])]+a["segments"][1:]
json.dump(a, open(os.path.join(W, "a.json"), "w", encoding="utf-8"), ensure_ascii=False)
json.dump({"keep": KEEP, "total": VO_END, "src_dur": 35.145792},
          open(os.path.join(W, "cut.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
run([sys.executable, os.path.join(SK, "02_captions.py"), W])

caps = json.load(open(os.path.join(W, "caps.json"), encoding="utf-8"))
SPLITS = [[5], [5], [2, 5, 2, 3], [4, 5, 4], [3, 3, 3], [5, 5], [2, 3, 3, 5]]
cards = []
for c, sz in zip(caps["cards"], SPLITS):
    ws = c["w"]
    m = []                                   # «99» + «%» → «99%» · «أول دفعة» محذوفة
    for w in ws:
        if w["t"] in ("أول", "دفعة"): continue
        if w["t"] == "%" and m and m[-1]["t"] == "99":
            m[-1] = {**m[-1], "t": "99%", "e": w["e"], "hot": True}
        else:
            m.append(dict(w))
    assert sum(sz) == len(m), (sz, len(m), [w["t"] for w in m])
    i = 0
    for s in sz:
        ch = m[i:i + s]; i += s
        cards.append({"s": ch[0]["s"], "e": ch[-1]["e"], "w": ch})
for k in range(len(cards) - 1):              # إطالة بسيطة بدل الوميض — بلا تداخل
    cards[k]["e"] = round(min(cards[k + 1]["s"], cards[k]["e"] + 0.18), 3)
cards[-1]["e"] = round(min(VO_END, cards[-1]["e"] + 0.2), 3)
caps = {"total": TOTAL, "cards": cards}
json.dump(caps, open(os.path.join(W, "caps.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump({"outro": 0}, open(os.path.join(W, "sfx.json"), "w", encoding="utf-8"))
print("cards:", len(cards))
for c in cards:
    print(f"{c['s']:6.2f}-{c['e']:6.2f}  " + " ".join(("*" if w.get("hot") else "") + w["t"] for w in c["w"]))

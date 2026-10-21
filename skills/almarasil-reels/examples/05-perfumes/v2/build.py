# -*- coding: utf-8 -*-
"""عطور المراسيل الإسبانية (Promax) — التايم-لاين:
   الصوت = التعليق الجديد بالترتيب 1 ← 2 ← 3 (صوت الفيديو الأصلي مشال) + فقرة «عنوانّا بالموصل» من تكسابون (صوتها الحقيقي).
   الصورة = لقطات الفيديو الحقيقية (بلا مقدمة الجرافيك المحروقة 0–2.23) تحت الصفحات والموشن.
   يطلع: cutz.mp4 + vfr/ + caps.json (بطاقات + nocap) + cut.json + sfx.json"""
import json, os, sys, subprocess, shutil
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SK = __import__('os').path.expanduser(r"~/.claude/skills/video-ad-editor/scripts")
SRC = os.path.join(W, "src.mov"); FPS = 30
VO = [(os.path.join(W, "input", "vo1.mp3"), 0.60, 9.25), (os.path.join(W, "input", "vo2.mp3"), 0.50, 4.58), (os.path.join(W, "input", "vo3.mp3"), 0.66, 4.50)]
VGAP = 0.30                                                       # نفس الفراغ اللي بـa.wav (التفريغ) — لا تغيّره بدون إعادة التفريغ
TEX = os.path.join(W, "..", "03-texapon", "src.mov"); TGAP, TEXK, TEXG = 0.73, [26.15, 30.45], 0.5   # فقرة العنوان · +0.5 dB يطابق مستوى التعليق (مئين 90: −19.0 مقابل −19.4)
VOL = round(sum(b - a for _, a, b in VO) + VGAP * (len(VO) - 1), 3)  # طول a.wav
VO_END = round(VOL + TGAP + TEXK[1] - TEXK[0], 3); TOTAL = round(VO_END + 0.60, 3)
T_ADDR = round(VOL + TGAP, 3)                                     # بداية صوت فقرة العنوان على التايم-لاين
# الصورة: [بداية, نهاية, بداية بالمصدر, السرعة] — ⛔ لقطة المستودع 2.23–5.13 (الأرضية الرثة — ملاحظة صاحب الشغل) · لقطات المصدر: مستودع 2.23–5.13 · عمّال 5.13–7.73 · يرفع جليكان 7.73–10.07 · يشيل جليكان مبتسم 10.07–12.97 · يفتح الغطاء + بيكر 12.97–17.8 · يصبّ العطر 17.8–22.7
EDL = json.load(open(os.path.join(W, "v2", "edl.json"), encoding="utf-8"))["edl"]
EDL[-1][1] = TOTAL
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)
fc = []
for i, (ns, ne, ss, sp) in enumerate(EDL):
    n = round(ne * FPS) - round(ns * FPS)
    fc.append(f"[0:v]trim=start={ss:.4f}:end={ss + (ne - ns) * sp + 0.2:.4f},setpts=(PTS-STARTPTS)/{sp},fps={FPS},"
              f"trim=end_frame={n},setpts=PTS-STARTPTS,eq=contrast=1.05:brightness=0.01:saturation=1.06,"
              f"scale=1080:1920:flags=lanczos,unsharp=5:5:0.30:5:5:0,setsar=1[v{i}]")
fc.append("".join(f"[v{i}]" for i in range(len(EDL))) + f"concat=n={len(EDL)}:v=1:a=0,format=yuv420p[vo]")
ins = ["-i", SRC]; parts = []
for k, (f, a, b) in enumerate(VO):
    ins += ["-i", f]; j = k + 1
    fc.append(f"[{j}:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.01,afade=t=out:st={b-a-0.02:.3f}:d=0.02[p{k}]"); parts.append(f"[p{k}]")
    if k < len(VO) - 1: fc.append(f"aevalsrc=0:c=stereo:s=48000:d={VGAP}[g{k}]"); parts.append(f"[g{k}]")
ins += ["-i", TEX]; j = len(VO) + 1
fc.append(f"aevalsrc=0:c=stereo:s=48000:d={TGAP}[gt]"); parts.append("[gt]")
fc.append(f"[{j}:a]atrim=start={TEXK[0]}:end={TEXK[1]},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume={TEXG}dB,highpass=f=75,"
          f"afade=t=in:d=0.015,afade=t=out:st={TEXK[1]-TEXK[0]-0.02:.3f}:d=0.02[pt]"); parts.append("[pt]")
fc.append("".join(parts) + f"concat=n={len(parts)}:v=0:a=1,acompressor=threshold=-21dB:ratio=2:attack=6:release=90:makeup=1,apad=whole_dur={TOTAL},atrim=0:{TOTAL}[ao]")
run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fc), "-map", "[vo]", "-map", "[ao]",
     "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
     "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", os.path.join(W, "cutz.mp4")])
for d in ("vfr", "out", "prev"):
    if os.path.isdir(os.path.join(W, d)): shutil.rmtree(os.path.join(W, d))
os.makedirs(os.path.join(W, "vfr"))
run(["ffmpeg", "-v", "error", "-i", os.path.join(W, "cutz.mp4"), "-vf", f"fps={FPS}", "-q:v", "2", os.path.join(W, "vfr", "%05d.jpg")])
print("cutz.mp4 ok — VO", VO_END, "· total", TOTAL, "· addr", T_ADDR, "· frames", len(os.listdir(os.path.join(W, "vfr"))))
# الكابشن: تفريغ a.wav (التعليق كامل = قطعة 0) + جملة العنوان من تفريغ التكسابون (قطعة 2)
a = json.load(open(os.path.join(W, "a.orig.json"), encoding="utf-8"))
for s in a["segments"]: s["seg"] = 0
s3 = json.load(open(os.path.join(W, "..", "03-texapon", "a.orig.json"), encoding="utf-8"))["segments"][2]
s3["words"][0]["start"] = 26.24; a["segments"].append({**s3, "seg": 2})
json.dump(a, open(os.path.join(W, "a.json"), "w", encoding="utf-8"), ensure_ascii=False)
json.dump({"keep": [[0.0, VOL], [900.0, 900.0 + TGAP], TEXK], "total": VO_END}, open(os.path.join(W, "cut.json"), "w", encoding="utf-8"), indent=1)
run([sys.executable, os.path.join(SK, "02_captions.py"), W])
caps = json.load(open(os.path.join(W, "caps.json"), encoding="utf-8"))
SP = json.load(open(os.path.join(W, "v2", "edl.json"), encoding="utf-8"))
SPLITS, NOCAP = SP["splits"], set(SP["nocap"])
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

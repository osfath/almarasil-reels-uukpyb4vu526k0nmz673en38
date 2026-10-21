# -*- coding: utf-8 -*-
"""الأصباغ (Promax) — التايم-لاين. التعليق الصوتي = ملفات مرقّمة بـinput/ («1- …»، «2- …» أو vo1.mp3…) بالترتيب.
   python v2/build.py --prep   ← a.wav للتفريغ (نفس القصّ والفراغات) ثم:  python -m whisper a.wav --model medium … ← a.orig.json
   python v2/build.py          ← cutz.mp4 + vfr/ + caps.json + cut.json + sfx.json
   الصورة من مكتبة اللقطات assets/clips (clips.json): v2/edl.json → edl = [بداية, نهاية, اسم اللقطة, بداية داخل اللقطة, السرعة]
   ⚠️ dyes1 أفقي: نسخ «-9x16-soft» ناعمة (تكبير ×4) — للصفحات استعمل «-window» داخل كرت."""
import json, os, sys, glob, re, subprocess, shutil
import numpy as np
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SK = __import__('os').path.expanduser(r"~/.claude/skills/video-ad-editor/scripts"); FPS = 30
VGAP = 0.30                                                        # فراغ ثابت بين ملفات التعليق (نفسه بـa.wav)
ADDR = False                                                       # True = فقرة «عنوانّا بالموصل» من تكسابون بالنهاية (مثل العطور)
TEX = os.path.join(W, "..", "03-texapon", "src.mov"); TGAP, TEXK, TEXG = 0.73, [26.15, 30.45], 0.5
def run(cmd):
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode: print(r.stderr.decode("utf-8", "replace")[-1500:]); sys.exit(1)
    return r
def vo_files():
    fs = [f for f in glob.glob(os.path.join(W, "input", "*")) if re.search(r"\.(mp3|mpeg|wav|m4a|aac|ogg)$", f, re.I)]
    key = lambda f: int((re.match(r"^\D*?(\d+)", os.path.basename(f)) or [0, 999])[1])
    return sorted(fs, key=key)
def trim(f, thr=-40, pad=0.06):                                    # حدود الكلام بالطاقة كل 10ms
    a = np.frombuffer(run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"]).stdout, np.int16).astype(float) / 32768
    db = 20 * np.log10(np.sqrt(np.mean(a[:len(a) // 160 * 160].reshape(-1, 160) ** 2, 1)) + 1e-9); on = np.where(db > thr)[0]
    return round(max(0, on[0] / 100 - pad), 2), round(min(len(a) / 16000, on[-1] / 100 + pad), 2)
VO = [(f, *trim(f)) for f in vo_files()]
assert VO, "ما لقيت ملفات تعليق بـinput/"
VOL = round(sum(b - a for _, a, b in VO) + VGAP * (len(VO) - 1), 3)
VO_END = round(VOL + ((TGAP + TEXK[1] - TEXK[0]) if ADDR else 0), 3); TOTAL = round(VO_END + 1.20, 3)   # نفَس 1.2 ث: «اللون» الأخيرة تُرى قبل نهاية البراند
def vo_graph(first_in):
    fc, parts = [], []
    for k, (f, a, b) in enumerate(VO):
        fc.append(f"[{first_in + k}:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.01,afade=t=out:st={b-a-0.02:.3f}:d=0.02[p{k}]"); parts.append(f"[p{k}]")
        if k < len(VO) - 1: fc.append(f"aevalsrc=0:c=stereo:s=48000:d={VGAP}[g{k}]"); parts.append(f"[g{k}]")
    return fc, parts
VO_IN = sum([["-i", f] for f, _, _ in VO], [])
if "--prep" in sys.argv:                                           # a.wav للتفريغ = نفس التايم-لاين بالضبط
    fc, parts = vo_graph(0); fc.append("".join(parts) + f"concat=n={len(parts)}:v=0:a=1,aresample=16000,aformat=channel_layouts=mono[o]")
    run(["ffmpeg", "-v", "error", "-y", *VO_IN, "-filter_complex", ";".join(fc), "-map", "[o]", os.path.join(W, "a.wav")])
    for f, a, b in VO: print(f"{os.path.basename(f)[:60]:60s} {a:.2f}–{b:.2f}")
    print("a.wav ✔", VOL, "ث"); sys.exit(0)
E = json.load(open(os.path.join(W, "v2", "edl.json"), encoding="utf-8")); EDL = E["edl"]; EDL[-1][1] = TOTAL
CLIPS = sorted({c for _, _, c, _, _ in EDL}); cidx = {c: i for i, c in enumerate(CLIPS)}
ins = sum([["-i", os.path.join(W, "assets", "clips", c + ".mp4")] for c in CLIPS], []) + VO_IN + (["-i", TEX] if ADDR else [])
fc = []
for i, (ns, ne, c, ss, sp) in enumerate(EDL):
    n = round(ne * FPS) - round(ns * FPS)
    fc.append(f"[{cidx[c]}:v]trim=start={ss:.4f}:end={ss + (ne - ns) * sp + 0.2:.4f},setpts=(PTS-STARTPTS)/{sp},fps={FPS},"
              f"tpad=stop_mode=clone:stop={n},trim=end_frame={n},setpts=PTS-STARTPTS,eq=contrast=1.04:saturation=1.05,setsar=1[v{i}]")   # tpad: لو اللقطة أقصر يثبّت آخر فريم
fc.append("".join(f"[v{i}]" for i in range(len(EDL))) + f"concat=n={len(EDL)}:v=1:a=0,format=yuv420p[vo]")
vf, parts = vo_graph(len(CLIPS)); fc += vf
if ADDR:
    j = len(CLIPS) + len(VO)
    fc.append(f"aevalsrc=0:c=stereo:s=48000:d={TGAP}[gt]"); parts.append("[gt]")
    fc.append(f"[{j}:a]atrim=start={TEXK[0]}:end={TEXK[1]},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume={TEXG}dB,highpass=f=75,"
              f"afade=t=in:d=0.015,afade=t=out:st={TEXK[1]-TEXK[0]-0.02:.3f}:d=0.02[pt]"); parts.append("[pt]")
fc.append("".join(parts) + f"concat=n={len(parts)}:v=0:a=1,acompressor=threshold=-21dB:ratio=2:attack=6:release=90:makeup=1,apad=whole_dur={TOTAL},atrim=0:{TOTAL}[ao]")
run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fc), "-map", "[vo]", "-map", "[ao]",
     "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-ar", "48000", os.path.join(W, "cutz.mp4")])
for d in ("vfr", "out", "prev"):
    if os.path.isdir(os.path.join(W, d)): shutil.rmtree(os.path.join(W, d))
os.makedirs(os.path.join(W, "vfr"))
run(["ffmpeg", "-v", "error", "-i", os.path.join(W, "cutz.mp4"), "-vf", f"fps={FPS}", "-q:v", "2", os.path.join(W, "vfr", "%05d.jpg")])
print("cutz.mp4 ok — VO", VO_END, "· total", TOTAL, "· frames", len(os.listdir(os.path.join(W, "vfr"))))
# الكابشن: تفريغ a.wav = قطعة 0 (+ جملة العنوان من تكسابون = قطعة 2)
a = json.load(open(os.path.join(W, "a.orig.json"), encoding="utf-8"))
for s in a["segments"]: s["seg"] = 0
keep = [[0.0, VOL]]
if ADDR:
    s3 = json.load(open(os.path.join(W, "..", "03-texapon", "a.orig.json"), encoding="utf-8"))["segments"][2]; s3["words"][0]["start"] = 26.24
    a["segments"].append({**s3, "seg": 2}); keep += [[900.0, 900.0 + TGAP], TEXK]
json.dump(a, open(os.path.join(W, "a.json"), "w", encoding="utf-8"), ensure_ascii=False)
json.dump({"keep": keep, "total": VO_END}, open(os.path.join(W, "cut.json"), "w", encoding="utf-8"), indent=1)
run([sys.executable, os.path.join(SK, "02_captions.py"), W])
caps = json.load(open(os.path.join(W, "caps.json"), encoding="utf-8")); SPLITS, NOCAP = E["splits"], set(E["nocap"])
cards = []
for c, sz in zip(caps["cards"], SPLITS):
    m = []
    for w in c["w"]:
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

# -*- coding: utf-8 -*-
"""العطور الشخصية (08) — التايم-لاين. تعليق واحد (input/vo-script.mp3) يُقصّ بسكتاته:
   كل سكتة >0.25 ث (RMS −45 dB) ← GAP · بداية LEAD (الهوك يفتح قبل الصوت) · DROPS = وقفة صمت تام قبل الكشف (والحل · عطور مستوحاة · ويا المراسيل)
   المصدر النصّي: a.fixed.json (نص صاحب الشغل + توقيت وِسبر medium + حدود RMS) ← a.json على التايم-لاين الجديد
   python v2/build.py --prep ← a.wav (التايم-لاين المقصوص، للفحص)   ·   python v2/build.py ← cutz.mp4 + vfr/ + caps.json + cut.json + sfx.json
   الصورة: v2/edl.json → [بداية, نهاية, لقطة (مسار نسبي بـassets/clips بلا .mp4), بداية داخل اللقطة, السرعة]"""
import json, os, sys, subprocess, shutil
import numpy as np
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SK = __import__('os').path.expanduser(r"~/.claude/skills/video-ad-editor/scripts"); FPS = 30
VO_SRC = os.path.join(W, "input", "vo-script.mp3")
LEAD, GAP, GAP_SENT, DROP, THR, MINS = 0.65, 0.10, 0.34, 0.55, -45, 0.25   # v2: فصلة بين الجُمل 0.34 (ملاحظة صاحب الشغل) · داخل الجملة 0.10 · وقفة الكشف 0.55
# v3: فصل السكشنات — بالتناوب: «rest» = استراحة صمت تام · «sfx» = جسر صوتي يملأ الفصلة وينتهي على أول كلمة
SECTIONS = [("لون", "sfx", 0.45), ("لكن", "rest", 0.60), ("والحل", "sfx", 0.60), ("زيوت", "rest", 0.55),
            ("تختار", "sfx", 0.45), ("عطور", "rest", 0.60), ("ويا", "sfx", 0.60)]
DROP_BEFORE = [w for w, _, _ in SECTIONS]
BREATH = 1.20                                                        # نفَس بعد آخر كلمة (الأوترو)
def run(cmd):
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode: print(r.stderr.decode("utf-8", "replace")[-1500:]); sys.exit(1)
    return r
# ── السكتات بالـRMS (20ms) ──
a16 = np.frombuffer(run(["ffmpeg", "-v", "error", "-i", VO_SRC, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"]).stdout, np.int16).astype(float) / 32768
DUR = len(a16) / 16000; h = 320
db = 20 * np.log10(np.sqrt(np.mean(a16[:len(a16) // h * h].reshape(-1, h) ** 2, 1)) + 1e-9)
sil, s0 = [], None
for i, v in enumerate(list(db) + [0]):
    t = i * 0.02
    if v < THR and s0 is None: s0 = t
    if v >= THR and s0 is not None:
        if t - s0 > MINS or s0 == 0: sil.append((round(s0, 2), round(min(t, DUR), 2)))
        s0 = None
if db[-1] < THR and s0 is not None: sil.append((round(s0, 2), round(DUR, 2)))
A = json.load(open(os.path.join(W, "a.fixed.json"), encoding="utf-8"))
words = [w for s in A["segments"] for w in s["words"]]
first = {w["word"].strip(): w["start"] for w in reversed(words)}      # أول ظهور لكل كلمة
drop_at = {round(first[w], 2): g for w, _, g in SECTIONS}
sent_at = [s["words"][0]["start"] for s in A["segments"]]                 # بداية كل جملة
# مقاطع الكلام = بين السكتات
edges = [b for a, b in sil[:-1]] if sil and sil[0][0] == 0 else [0.0] + [b for a, b in sil[:-1]]
speech = []; prev_end = sil[0][1] if sil and sil[0][0] == 0 else 0.0
for a, b in (sil[1:] if sil and sil[0][0] == 0 else sil):
    speech.append((prev_end, a)); prev_end = b
if prev_end < DUR - 0.05: speech.append((prev_end, DUR))
KEEP, cur = [], LEAD                                                  # [(من, إلى, بداية جديدة)]
for i, (a, b) in enumerate(speech):
    KEEP.append((a, b, cur)); cur += b - a
    if i + 1 < len(speech):
        nx = speech[i + 1][0]
        dg = [g for d, g in drop_at.items() if abs(nx - d) < 0.12]
        cur += dg[0] if dg else (GAP_SENT if any(abs(nx - d) < 0.12 for d in sent_at) else GAP)
VO_END = round(cur, 3); TOTAL = round(VO_END + BREATH, 3)
def m(t):
    for a, b, n in KEEP:
        if a - 0.03 <= t <= b + 0.03: return n + min(max(t - a, 0), b - a)
    return min((n for a, b, n in KEEP if a >= t), default=VO_END)
def vo_graph(idx):
    fc, parts = [f"aevalsrc=0:c=stereo:s=48000:d={LEAD}[l0]"], ["[l0]"]
    for k, (a, b, n) in enumerate(KEEP):
        fc.append(f"[{idx}:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.012,afade=t=out:st={b-a-0.02:.3f}:d=0.02[p{k}]"); parts.append(f"[p{k}]")
        if k + 1 < len(KEEP):
            g = KEEP[k + 1][2] - (n + b - a); fc.append(f"aevalsrc=0:c=stereo:s=48000:d={g:.3f}[g{k}]"); parts.append(f"[g{k}]")
    return fc, parts
if "--prep" in sys.argv:
    fc, parts = vo_graph(0); fc.append("".join(parts) + f"concat=n={len(parts)}:v=0:a=1,aresample=16000,aformat=channel_layouts=mono[o]")
    run(["ffmpeg", "-v", "error", "-y", "-i", VO_SRC, "-filter_complex", ";".join(fc), "-map", "[o]", os.path.join(W, "a.wav")])
    print("a.wav ✔", VO_END, "ث ·", len(KEEP), "مقطع"); sys.exit(0)
# ── a.json على التايم-لاين الجديد ──
for s in A["segments"]:
    for w in s["words"]: w["start"], w["end"] = round(m(w["start"]), 3), round(m(w["end"]), 3)
    s["start"], s["end"], s["seg"] = s["words"][0]["start"], s["words"][-1]["end"], 0
json.dump(A, open(os.path.join(W, "a.json"), "w", encoding="utf-8"), ensure_ascii=False)
json.dump({"keep": [[0.0, VO_END]], "total": VO_END}, open(os.path.join(W, "cut.json"), "w", encoding="utf-8"), indent=1)
json.dump({"lead": LEAD, "gap": GAP, "drop": DROP, "keep": KEEP, "vo_end": VO_END, "total": TOTAL,
           "drops": [round(m(first[w]) - g, 2) for w, k, g in SECTIONS if k == "rest"],
           "sections": [{"w": w, "kind": k, "gap": g, "a": round(m(first[w]) - g, 3), "b": round(m(first[w]), 3)} for w, k, g in SECTIONS]}, open(os.path.join(W, "v2", "timeline.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
# ── الفيديو من مكتبة اللقطات ──
E = json.load(open(os.path.join(W, "v2", "edl.json"), encoding="utf-8"))
_ws = [(w["word"].strip(), w["start"]) for s in A["segments"] for w in s["words"]]
def anchor(x):   # رقم أو "كلمة#n+off" (n = رقم الظهور، يبدأ 1) على التايم-لاين الجديد
    if isinstance(x, (int, float)): return float(x)
    import re; m_ = re.match(r"^(.+?)(?:#(\d+))?([+-][\d.]+)?$", x); w_, n_, o_ = m_.group(1), int(m_.group(2) or 1), float(m_.group(3) or 0)
    return round([t for ww, t in _ws if ww == w_][n_ - 1] + o_, 3)
starts = [anchor(e[0]) for e in E["edl"]] + [TOTAL]
EDL = [[starts[i], starts[i + 1], e[1], e[2], e[3]] for i, e in enumerate(E["edl"])]
CLIPS = sorted({c for _, _, c, _, _ in EDL}); cidx = {c: i for i, c in enumerate(CLIPS)}
ins = sum([["-i", os.path.join(W, "assets", "clips", c + ".mp4")] for c in CLIPS], []) + ["-i", VO_SRC]
fc = []
for i, (ns, ne, c, ss, sp) in enumerate(EDL):
    n = round(ne * FPS) - round(ns * FPS)
    fc.append(f"[{cidx[c]}:v]trim=start={ss:.4f}:end={ss + (ne - ns) * sp + 0.2:.4f},setpts=(PTS-STARTPTS)/{sp},fps={FPS},"
              f"tpad=stop_mode=clone:stop={n},trim=end_frame={n},setpts=PTS-STARTPTS,eq=contrast=1.04:saturation=1.05,setsar=1[v{i}]")
fc.append("".join(f"[v{i}]" for i in range(len(EDL))) + f"concat=n={len(EDL)}:v=1:a=0,format=yuv420p[vo]")
vf, parts = vo_graph(len(CLIPS)); fc += vf
fc.append("".join(parts) + f"concat=n={len(parts)}:v=0:a=1,acompressor=threshold=-21dB:ratio=2:attack=6:release=90:makeup=1,apad=whole_dur={TOTAL},atrim=0:{TOTAL}[ao]")
run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fc), "-map", "[vo]", "-map", "[ao]",
     "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-ar", "48000", os.path.join(W, "cutz.mp4")])
for d in ("vfr", "out", "prev"):
    if os.path.isdir(os.path.join(W, d)): shutil.rmtree(os.path.join(W, d))
os.makedirs(os.path.join(W, "vfr"))
run(["ffmpeg", "-v", "error", "-i", os.path.join(W, "cutz.mp4"), "-vf", f"fps={FPS}", "-q:v", "2", os.path.join(W, "vfr", "%05d.jpg")])
print("cutz.mp4 ok — VO", VO_END, "· total", TOTAL, "· frames", len(os.listdir(os.path.join(W, "vfr"))))
# ── الكابشن ──
run([sys.executable, os.path.join(SK, "02_captions.py"), W])
caps = json.load(open(os.path.join(W, "caps.json"), encoding="utf-8")); SPLITS, NOCAP = E["splits"], set(E["nocap"])
cards = []
for c, sz in zip(caps["cards"], SPLITS):
    mm = []
    for w in c["w"]:
        if w["t"] == "~":
            if mm: mm[-1] = {**mm[-1], "e": w["e"]}
            continue
        mm.append(dict(w))
    assert sum(sz) == len(mm), (sz, [w["t"] for w in mm]); i = 0
    for s in sz:
        ch = mm[i:i + s]; i += s; ph = " ".join(w["t"] for w in ch)
        cards.append({"s": ch[0]["s"], "e": ch[-1]["e"], "w": ch, **({"nocap": True} if ph in NOCAP else {})})
for k in range(len(cards) - 1): cards[k]["e"] = round(min(cards[k + 1]["s"], cards[k]["e"] + 0.18), 3)
cards[-1]["e"] = round(min(VO_END, cards[-1]["e"] + 0.2), 3)
json.dump({"total": TOTAL, "cards": cards}, open(os.path.join(W, "caps.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump({"outro": 0.0}, open(os.path.join(W, "sfx.json"), "w", encoding="utf-8"))
for c in cards: print(f"{c['s']:6.2f}-{c['e']:6.2f} {'·' if c.get('nocap') else ' '} " + " ".join(("*" if w.get("hot") else "") + w["t"] for w in c["w"]))

# -*- coding: utf-8 -*-
"""مجلد التفاصيل assets/clips/P3-details/ — تسلسل احترافي مرقّم + لقطات بطل مقفولة على القنينة (تتبّع) + معاينة التسلسل
   قواعد: واسع ← متوسط ← ماكرو · اتجاه حركة واحد (المحتوى يطلع فوق-يسار بكل اللقطات) · البطل بثلث الكادر العلوي (y≈0.42، بعيد عن الكابشن 1150 والتذييل)
   القصّ ≥ 964 عرض من 2160 (تكبير ≤1.12) · بطيء 0.25 = كل فريم 120fps حقيقي
   python v2/details.py"""
import json, os, subprocess, shutil, numpy as np, cv2
from track import track
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); D = os.path.join(W, "assets", "clips", "P3-details")
os.makedirs(D, exist_ok=True)
FPS_IN, FPS_OUT = 120, 30
ENC = ["-an", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]

# لقطات بطل بالتتبّع: (اسم, مصدر, مرساة (t,x,y), من, إلى, عرض القصّ, follow, وصف)
HERO = [
 ("macro-label-kgar", "P3", (0.3, .50, .88), 0.20, 1.20, 964,  0.85, "ماكرو الملصق: الاسم والكود يطلعون من الضبابية للحدّة — افتتاح التفاصيل"),
 ("hero-red",         "P3", (1.2, .72, .87), 1.25, 2.05, 964,  0.85, "ماكرو السائل الأحمر بالمقدمة — قريب ومقفول، الصفوف تنساب خلفه"),
 ("hero-magenta",     "P3", (1.9, .62, .60), 2.05, 3.00, 1080, 0.80, "قنينة الماجنتا بطل اللون — الأوضح بين الألوان"),
 ("hero-musk",        "P3", (2.6, .74, .80), 2.85, 3.84, 964,  0.85, "«MUSK» ماكرو — اسم العطر يوصل للحدّة الكاملة بنهاية اللقطة"),
 ("lowangle-magenta", "P4", (1.8, .36, .70), 1.30, 2.15, 1080, 0.75, "زاوية منخفضة: الماجنتا تعبر بالمقدمة"),
 ("lowangle-orange",  "P4", (1.8, .65, .60), 1.75, 2.65, 1080, 0.75, "زاوية منخفضة: قنينة العنبر/البرتقالي تعبر"),
]
# لقطات كادر كامل جديدة: (اسم, مصدر, من, إلى, سرعة, وصف)
FULL = [("pullup-reveal", "P3", 3.10, 3.84, 0.25, "نهاية المرور: حافة العلبة تدخل — لقطة ختام/انتقال")]
# الترتيب النهائي: (رقم, اسم بالمجلد, ملف موجود أو None للجديد, دور)
SEQ = [
 ("01", "overhead-pass",        "P3-rows-glide-stab.mp4", "تأسيسي: مرور من أعلى فوق الصفوف (1x)"),
 ("02", "overhead-pass-ramp",   "P3-rows-glide-ramp.mp4", "مرور سريع ← تباطؤ (افتتاح بديل/انتقال)"),
 ("03", "macro-label-kgar",     None, "ماكرو ملصق"),
 ("04", "hero-red",             None, "بطل لون: أحمر"),
 ("05", "hero-magenta",         None, "بطل لون: ماجنتا"),
 ("06", "colors-slow",          "P3-colors-slow.mp4", "متوسط: ألوان تعبر (كادر كامل)"),
 ("07", "colors-detail",        "P3-colors-detail.mp4", "تفصيل ثابت المركز"),
 ("08", "hero-musk",            None, "ماكرو اسم: MUSK"),
 ("09", "pullup-reveal",        None, "ختام المرور/انتقال"),
 ("10", "lowangle-rows-slow",   "P4-rows-slow.mp4", "زاوية منخفضة: صفوف (تغيير زاوية)"),
 ("11", "lowangle-magenta",     None, "زاوية منخفضة: ماجنتا"),
 ("12", "lowangle-orange",      None, "زاوية منخفضة: عنبر"),
]

def smooth(a, s=9):
    k = np.exp(-0.5 * (np.arange(-3 * s, 3 * s + 1) / s) ** 2); k /= k.sum()
    p = np.pad(a, 3 * s, mode="edge"); return np.convolve(p, k, mode="valid")

def writer(path):
    return subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", "1080x1920", "-r", str(FPS_OUT), "-i", "-"] + ENC + [path],
                            stdin=subprocess.PIPE)

def read_range(k, a, b):
    cap = cv2.VideoCapture(os.path.join(W, "_an", f"stab_{k}.mp4")); cap.set(cv2.CAP_PROP_POS_FRAMES, int(a * FPS_IN))
    for n in range(int(a * FPS_IN), int(b * FPS_IN)):
        ok, f = cap.read()
        if not ok: break
        yield n, f

def hero(name, k, anc, a, b, cw, follow, desc):
    tr = track(k, *anc)
    n_all = (tr[:, 0] * FPS_IN).round().astype(int)
    sel = (n_all >= int(a * FPS_IN)) & (n_all < int(b * FPS_IN))
    assert sel.sum() > 0.9 * (b - a) * FPS_IN, f"{name}: التتبّع ما يغطي النافذة"
    ns, sx, sy = n_all[sel], smooth(tr[sel, 1]), smooth(tr[sel, 2]); mx, my = sx.mean(), sy.mean()
    cx = mx + follow * (sx - mx); cy = my + follow * (sy - my)  # follow<1 = يبقى انسياب خفيف باتجاه المرور (مو قفل صناعي)
    H, Wd = 3840, 2160; ch = round(cw * 16 / 9); cy = cy + (0.5 - 0.42) * ch / H  # البطل على 0.42 من الكادر
    m = dict(zip(ns, zip(cx, cy)))
    pw, bad = writer(os.path.join(D, f"_{name}.mp4")), 0
    for i, (n, f) in enumerate(read_range(k, a, b)):
        if n not in m: continue
        z = 1 + 0.04 * (i / max(1, len(ns) - 1))  # دفعة خفيفة 1.00→1.04 (تركيز)
        w, h = int(cw / z) // 2 * 2, int(ch / z) // 2 * 2
        x0 = int(np.clip(m[n][0] * Wd - w / 2, 0, Wd - w)); y0 = int(np.clip(m[n][1] * H - h / 2, 0, H - h))
        bad += (x0 in (0, Wd - w)) or (y0 in (0, H - h))
        pw.stdin.write(cv2.resize(f[y0:y0 + h, x0:x0 + w], (1080, 1920), interpolation=cv2.INTER_LANCZOS4 if w != 1080 else cv2.INTER_AREA).tobytes())
    pw.stdin.close(); pw.wait()
    return {"track_frames": int(sel.sum()), "edge_clamped_frames": int(bad), "crop_w": cw, "zoom_vs_4k": round(Wd / cw, 2), "follow": follow,
            "speed": 0.25, "from": a, "to": b, "src_key": k, "desc": desc}

def full(name, k, a, b, sp, desc):
    src = os.path.join(W, "_an", f"stab_{k}.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf", f"trim=start={a}:end={b},setpts=PTS-STARTPTS,setpts={1/sp}*PTS,fps=30,scale=1080:1920:flags=lanczos,setsar=1"]
                   + ENC + [os.path.join(D, f"_{name}.mp4")], check=True)
    return {"speed": sp, "from": a, "to": b, "src_key": k, "desc": desc}

if __name__ == "__main__":
    meta = {h[0]: hero(*h) for h in HERO}
    meta.update({f[0]: full(*f) for f in FULL})
    db = json.load(open(os.path.join(W, "assets", "clips", "clips.json"), encoding="utf-8"))
    old = {os.path.basename(s["file"]): s for s in db["shots"]}
    old.update({s["was"] + ".mp4": s for s in db.get("details", {}).get("shots", []) if "was" in s})  # إعادة تشغيل آمنة
    seq = []
    for num, nm, srcfile, role in SEQ:
        dst = f"{num}-{nm}.mp4"
        if srcfile:
            p = os.path.join(D, srcfile)
            if os.path.exists(p): shutil.move(p, os.path.join(D, dst))
            assert os.path.exists(os.path.join(D, dst)), dst
            s = dict(old[srcfile]); s.update(name=f"{num}-{nm}", was=srcfile.replace(".mp4", ""))
        else:
            shutil.move(os.path.join(D, f"_{nm}.mp4"), os.path.join(D, dst))
            k = meta[nm]["src_key"]; s = {"name": f"{num}-{nm}", "src": {"P3": "VID_20261005_105214.mp4", "P4": "VID_20261005_105245.mp4"}[k],
                                          "kind": "hero-track" if "track_frames" in meta[nm] else "slow", **meta[nm]}
        s["dur"] = round(float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(D, dst)],
                                              capture_output=True, text=True).stdout), 2)
        s.update(file=f"assets/clips/P3-details/{dst}", role=role, seq=int(num)); seq.append(s)
    db["shots"] = [s for s in db["shots"] if os.path.basename(s["file"]) not in {x[2] for x in SEQ}]
    db["details"] = {"folder": "assets/clips/P3-details", "rule": "واسع ← متوسط ← ماكرو · اتجاه واحد · البطل y≈0.42", "shots": seq}
    json.dump(db, open(os.path.join(W, "assets", "clips", "clips.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(seq, open(os.path.join(D, "sequence.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for s in seq: print(s["name"], s["dur"], s.get("edge_clamped_frames", ""), s.get("track_frames", ""))

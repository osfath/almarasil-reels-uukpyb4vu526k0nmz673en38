# -*- coding: utf-8 -*-
"""مكتبة شوتات العطور الشخصية ← assets/clips/*.mp4 (1080×1920 30fps) + clips.json + 00-shots-sheet.jpg + index.html
   1) تثبيت vidstab (مرحلتين) على الدقة الأصلية ← _an/stab_*.mp4 (وسيط، يُمسح بـclean)
   2) لكل مقطع: stab (1x كامل) · ramp (سريع ← تباطؤ ناعم ← بطيء + دفعة زوم ≤1.08) · slow (لحظة البطل) · detail (قصّ 4K أصلي بلا تكبير)
   120fps ← بطيء 0.25 = كل فريم حقيقي · 60fps ← 0.5 حدّ أقصى
   python v2/shots.py [--no-stab]"""
import json, os, subprocess, sys, math
from concurrent.futures import ThreadPoolExecutor
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AN, CL, IMG = (os.path.join(W, d) for d in ("_an", "assets/clips", "assets/img"))
for d in (AN, CL, IMG): os.makedirs(d, exist_ok=True)
FF = ["ffmpeg", "-v", "error", "-y"]
ENC = ["-an", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]

# المصادر: [مفتاح, ملف, أفقي؟, fps, أقل سرعة]
SRC = {
 "P1": ("VID_20261005_104012.mp4", False, 60, 0.5),
 "P2": ("VID_20261005_105030.mp4", True, 120, 0.25),
 "P3": ("VID_20261005_105214.mp4", False, 120, 0.25),
 "P4": ("VID_20261005_105245.mp4", False, 120, 0.25),
}
# الشوتات: (اسم, مصدر, نوع, من, إلى, بارامترات, دور, وصف)
#   ramp: (k1, k2, fast, slow) — سريع حتى k1، تباطؤ smoothstep حتى k2، بطيء بعده · slow: سرعة ثابتة · detail: (cx, cy, سرعة) مركز القصّ نسبي
SHOTS = [
 ("P1-pyramid-push-stab",   "P1", "stab",   0.00, 2.80, None,                 "b-roll/افتتاح", "دفعة للأمام من العلبة المفتوحة إلى هرم العيّنات (1x مثبّت)"),
 ("P1-pyramid-push-ramp",   "P1", "ramp",   0.00, 2.80, (1.0, 1.5, 1.6, 0.5), "هوك محتمل ★",   "اندفاع سريع للهرم ← تباطؤ وتركيز على القناني المرصوصة"),
 ("P1-pyramid-hero-slow",   "P1", "slow",   1.50, 2.80, 0.5,                  "باكشوت",        "هرم العيّنات ثابت تقريبًا — slow ×2 (60fps)"),
 ("P2-boxes-arc-stab",      "P2", "stab",   0.00, 4.05, None,                 "b-roll",        "علبتين عيّنات — دفعة نحو العلبة السفلى (أفقي ← قصّ بورتريه بالوسط)"),
 ("P2-boxes-arc-ramp",      "P2", "ramp",   0.00, 3.80, (2.4, 3.0, 2.0, 0.25),"انتقال/كشف",     "مرور سريع فوق العلبتين ← تباطؤ على صفوف العلبة"),
 ("P2-box-rows-slow",       "P2", "slow",   2.80, 3.80, 0.25,                 "تشكيلة",        "صفوف العلبة تملأ الكادر — slow ×4"),
 ("P3-rows-glide-stab",     "P3", "stab",   0.00, 3.85, None,                 "b-roll",        "انزلاق قريب فوق صفوف القناني (عمق ميدان)"),
 ("P3-rows-glide-ramp",     "P3", "ramp",   0.00, 3.30, (1.8, 2.3, 2.0, 0.25),"تنوّع/ألوان ★",  "انزلاق سريع ← تباطؤ على القناني الملوّنة (الوردي/الأحمر)"),
 ("P3-colors-slow",         "P3", "slow",   2.20, 3.20, 0.25,                 "تنوّع/ألوان",    "قناني ملوّنة تعبر الكادر — slow ×4"),
 ("P3-colors-detail",       "P3", "detail", 2.20, 3.20, (0.5, 0.55, 0.25),    "تفصيل/ماكرو",   "قصّ 4K أصلي (×2) على الملصقات والسوائل — slow ×4"),
 ("P4-lowangle-stab",       "P4", "stab",   0.00, 3.20, None,                 "b-roll",        "زاوية منخفضة على العلبة المفتوحة وصفوفها، الغطاء بالخلف"),
 ("P4-lowangle-ramp",       "P4", "ramp",   0.00, 2.90, (1.4, 1.9, 2.0, 0.25),"انتقال/كشف",     "اندفاع منخفض ← تباطؤ على صفوف ملوّنة"),
 ("P4-rows-slow",           "P4", "slow",   1.80, 2.70, 0.25,                 "تشكيلة",        "صفوف العيّنات من زاوية منخفضة — slow ×4"),
 ("P4-rows-detail",         "P4", "detail", 1.80, 2.70, (0.5, 0.62, 0.25),    "تفصيل/ماكرو",   "قصّ 4K أصلي (×2) على صف قريب — slow ×4"),
 ("P2-box-detail",          "P2", "detail", 2.80, 3.80, (0.5, 0.55, 0.25),    "تفصيل/ماكرو",   "قصّ 4K أصلي على صفوف العلبة — slow ×4"),
]
PHOTOS = [  # (ملف, اسم, وصف)
 ("IMG_20261005_104206.jpg",   "photo-box-pyramid",   "العلبة المفتوحة + هرم العيّنات — خلفية نظيفة ★"),
 ("MVIMG_20261005_104114.jpg", "photo-box-pyramid-2", "نفس الكادر — ⚠️ كيبورد/أغراض مكتب بالخلفية (يسار)"),
 ("MVIMG_20261005_104115.jpg", "photo-box-pyramid-3", "نفس الكادر — ⚠️ أغراض مكتب بالخلفية"),
]

def stab(k):
    f, land, fps, _ = SRC[k]; inp = os.path.join(W, "input", f); out = os.path.join(AN, f"stab_{k}.mp4")
    if "--no-stab" in sys.argv or os.path.exists(out): return
    trf = f"stab_{k}.trf"  # نسبي (ويندوز: «:» بالمسار يكسر الفلتر)
    subprocess.run(FF + ["-i", inp, "-vf", f"vidstabdetect=shakiness=6:accuracy=15:result={trf}", "-f", "null", "-"], cwd=AN, check=True)
    sm = 60 if fps == 120 else 30  # ≈0.5 ث نعومة: يشيل رجفة اليد ويبقي حركة الكاميرا المقصودة
    subprocess.run(FF + ["-i", inp, "-vf", f"vidstabtransform=input={trf}:smoothing={sm}:optzoom=1:interpol=bicubic,unsharp=5:5:0.6",
                         "-an", "-c:v", "libx264", "-crf", "12", "-preset", "fast", "-pix_fmt", "yuv420p", out], cwd=AN, check=True)

def frame_vf(k):  # إطار 9:16 → 1080×1920
    land = SRC[k][1]
    return ("crop=ih*9/16:ih," if land else "") + "scale=1080:1920:flags=lanczos,setsar=1"

def ramp_expr(a, b, k1, k2, fast, slow, n=48):
    """خريطة زمن المصدر ← زمن الناتج: ∫ 1/s(t) dt، s ناعم (smoothstep بين k1 وk2) · جدول خطي متعدد القطع ← تعبير setpts"""
    def s(t):
        if t <= k1: return fast
        if t >= k2: return slow
        u = (t - k1) / (k2 - k1); u = u * u * (3 - 2 * u)
        return math.exp(math.log(fast) * (1 - u) + math.log(slow) * u)  # لوغاريتمي = إحساس تباطؤ متساوٍ
    ts = [a + (b - a) * i / n for i in range(n + 1)]; outs = [0.0]
    for i in range(n):  # تكامل بنقطة الوسط مقسّمة
        dt = ts[i + 1] - ts[i]; outs.append(outs[-1] + sum(dt / 8 / s(ts[i] + dt * (j + .5) / 8) for j in range(8)))
    e = f"{outs[-1]:.5f}"
    for i in range(n - 1, -1, -1):  # T هنا = زمن من بداية القطعة
        t0, t1 = ts[i] - a, ts[i + 1] - a; sl = (outs[i + 1] - outs[i]) / (t1 - t0)
        e = f"if(lt(T,{t1:.5f}),{outs[i]:.5f}+(T-{t0:.5f})*{sl:.5f},{e})"
    tslow = outs[ts.index(min(ts, key=lambda t: abs(t - k2)))]
    return e, outs[-1], tslow

def job(sh):
    name, k, kind, a, b, p, role, desc = sh
    f, land, fps, minsp = SRC[k]
    src = os.path.join(AN, f"stab_{k}.mp4")
    if not os.path.exists(src): src = os.path.join(W, "input", f)
    pre = f"trim=start={a}:end={b},setpts=PTS-STARTPTS,"
    info = {"speed": 1.0}
    if kind == "stab":
        vf = pre + frame_vf(k) + ",fps=30"; dur = b - a
    elif kind == "slow":
        sp = max(p, minsp); vf = pre + f"setpts={1/sp:.4f}*PTS,fps=30," + frame_vf(k); dur = (b - a) / sp; info["speed"] = sp
    elif kind == "detail":
        cx, cy, sp = p; sp = max(sp, minsp)
        # قصّ 1080×1920 من الدقة الأصلية (4K) = ×2 بلا تكبير
        vf = pre + f"setpts={1/sp:.4f}*PTS,fps=30,crop=1080:1920:(iw-1080)*{cx}:(ih-1920)*{cy},setsar=1"; dur = (b - a) / sp; info["speed"] = sp
    else:  # ramp
        k1, k2, fast, slow = p; slow = max(slow, minsp)
        e, dur, tsl = ramp_expr(a, b, k1, k2, fast, slow)
        # دفعة زوم 1.00→1.08 ناعمة خلال الجزء البطيء (≤1.12 القاعدة)
        z = f"(1+0.08*if(lt(t,{tsl:.3f}),0,pow(sin(min((t-{tsl:.3f})/{max(dur-tsl,.1):.3f},1)*PI/2),2)))"
        vf = (pre + f"setpts='({e})/TB',fps=30," + frame_vf(k) +
              f",scale=w='2*trunc(540*{z})':h='2*trunc(960*{z})':eval=frame:flags=bicubic,crop=1080:1920:(iw-1080)/2:(ih-1920)/2,setsar=1")
        info.update(speed=f"{fast}→{slow}", ramp={"fast_until": k1, "slow_from": k2, "fast": fast, "slow": slow, "slow_starts_at_out": round(tsl, 2), "push_in": "1.00→1.08"})
    out = os.path.join(CL, name + ".mp4")
    subprocess.run(FF + ["-i", src, "-vf", vf] + ENC + [out], check=True)
    real = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], capture_output=True, text=True).stdout)
    return dict(name=name, src=f, kind=kind, **{"from": a, "to": b}, **info, dur=round(real, 2), role=role, desc=desc,
                stabilized=os.path.exists(os.path.join(AN, f"stab_{k}.mp4")), landscape_crop=land, file=f"assets/clips/{name}.mp4")

def photos():
    from PIL import Image, ImageOps
    res = []
    for f, n, desc in PHOTOS:
        im = ImageOps.exif_transpose(Image.open(os.path.join(W, "input", f))).convert("RGB")
        w, h = im.size; tw = round(h * 9 / 16)
        if tw < w: im = im.crop(((w - tw) // 2, 0, (w - tw) // 2 + tw, h))  # 3:4 ← 9:16 بالوسط
        for sz, suf in (((1080, 1920), ""), ((2160, 3840), "-4k")):  # 4k = هامش لزوم/Ken Burns
            im.resize(sz, Image.LANCZOS).save(os.path.join(IMG, n + suf + ".jpg"), quality=93)
        res.append(dict(name=n, src=f, kind="photo", desc=desc, files=[f"assets/img/{n}.jpg", f"assets/img/{n}-4k.jpg"]))
    return res

if __name__ == "__main__":
    with ThreadPoolExecutor(2) as ex: list(ex.map(stab, SRC))
    print("تثبيت ✔")
    with ThreadPoolExecutor(3) as ex: res = list(ex.map(job, SHOTS))
    ph = photos()
    json.dump({"project": "08-personal-perfumes", "format": "1080x1920 30fps", "shots": res, "photos": ph},
              open(os.path.join(CL, "clips.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(len(res), "شوت ✔ +", len(ph), "صور")

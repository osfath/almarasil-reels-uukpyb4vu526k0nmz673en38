# -*- coding: utf-8 -*-
"""يولّد مكتبة المؤثرات: kit/sfx/wav/*.wav (بالمستوى الموصى) + manifest.json + demo.wav (كلها بالترتيب بفاصل 0.9 ث)
   python kit/sfx/make_sfx.py"""
import os, sys, json, wave, numpy as np
sys.path.insert(0, os.path.dirname(__file__)); from sfxlib import *
D = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(D, "wav"); os.makedirs(OUT, exist_ok=True)
# [اسم, دالة, ذروة dBFS موصى بها بالمكساج, الفئة, متى/مزامنة]
LIB = [
 ("kashida",        lambda: kashida(0.42),     -12, "كلمات", "مطّ الكشيدة — يبدأ عند t0 لـkStretch ويخلص مع اكتمال المطّ (0.42 ث)"),
 ("kashida_short",  lambda: kashida(0.30),     -12, "كلمات", "مطّ قصير (dur 0.30)"),
 ("kashida_long",   lambda: kashida(0.60),     -13, "كلمات", "مطّ طويل لكلمة البطل (dur 0.60)"),
 ("kashida_air",    lambda: kashida_air(0.40), -16, "كلمات", "نسخة هوائية فوق كلام كثيف"),
 ("slam",           slam,                      -9,  "كلمات", "kSlam — عند t0"),
 ("mask_rise",      mask_rise,                 -15, "كلمات", "kMask — يبدأ قبل t0 بـ0.05"),
 ("swap_flick",     swap_flick,                -14, "كلمات", "kSwap — مركزه عند t0+0.17"),
 ("marker",         marker,                    -16, "كلمات", "kMarker — عند t0 (مدة المسح 0.32)"),
 ("pop_soft",       pop,                       -16, "كلمات", "ظهور شارة صغيرة"),
 ("tick_soft",      tick,                      -16, "كلمات", "شريحة/عنصر ثانوي — بدل Pop"),
 ("count_ticks",    lambda: cascade(0.45, 9),  -14, "كلمات", "kCount — بطول العدّ"),
 ("typing_1s",      lambda: typing2(1.0),      -16, "كتابة", "شاشة الكتابة — قصّه بطول السطر (t0→t1)"),
 ("typing_2s",      lambda: typing2(2.0),      -16, "كتابة", "سطر طويل"),
 ("key",            lambda: key(1),            -16, "كتابة", "حرف مفرد"),
 ("caret",          caret,                     -20, "كتابة", "ظهور المؤشر/بداية سطر"),
 ("type_return",    type_return,               -16, "كتابة", "نهاية سطر قبل اللي بعده"),
 ("whip_r",         whip,                      -6,  "انتقال", "Whip يمين — مركزه عند القطع"),
 ("whip_l",         whipL,                     -6,  "انتقال", "Whip يسار"),
 ("zoom_through",   zoomfx,                    -7,  "انتقال", "زوم يخترق (يخلص عند القطع)"),
 ("push_up",        push_up,                   -6,  "انتقال", "الصفحة تدفع الفيديو لفوق"),
 ("slide_left",     lambda: slide(True),       -6,  "انتقال", "الصفحة تنسحب يسار"),
 ("slide_right",    lambda: slide(False),      -6,  "انتقال", "دخول من اليسار"),
 ("wipe",           wipe_soft,                 -6,  "انتقال", "مسح الصفحة المائل"),
 ("natural_wipe",   natural_wipe,              -9,  "انتقال", "الانتقال الطبيعي بلقطة A3 (غطاء الجرّة يعبر)"),
 ("hit_sub",        hit_sub,                   -6,  "ضربة",  "بنش/لحظة مهمة (طرقة تنسمع بالجوال)"),
 ("boom_sub",       boom_sub,                  -5,  "ضربة",  "افتتاح الهوك"),
 ("riser",          lambda: riser(0.6),        -14, "ضربة",  "تمهيد قبل كشف المنتج (يخلص عند الكشف)"),
 ("ting_C",         lambda: ting(1046.5),      -24, "جرس",   "سلّم تعداد — قائمة وحدة بالإعلان بس"),
 ("ting_D",         lambda: ting(1174.7),      -24, "جرس",   ""),
 ("ting_E",         lambda: ting(1318.5),      -24, "جرس",   ""),
 ("ting_G",         lambda: ting(1568.0),      -24, "جرس",   ""),
 ("outro_tick",     tick,                      -8,  "ضربة",  "الأوترو: تكة وحدة بس"),
]
def save(path, x):
    x = np.clip(x, -0.999, 0.999); w = wave.open(path, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype("<i2").tobytes()); w.close()
man, demo = [], []
for name, fn, pk, cat, use in LIB:
    s = fn(); s = s if s.ndim == 2 else st(s); s = norm(s) * 10 ** (pk / 20)
    save(os.path.join(OUT, name + ".wav"), s)
    man.append({"name": name, "file": f"kit/sfx/wav/{name}.wav", "dur": round(len(s) / SR, 3), "peak_dbfs": pk, "cat": cat, "use": use})
    demo += [s, np.zeros((int(0.9 * SR), 2))]
save(os.path.join(D, "demo.wav"), np.vstack(demo))
json.dump({"rules": ["الانتقال ياخذ لحظته: ولا صوت ثاني خلال ±0.5 ث", "ولا صوتين أقرب من 0.5 ث", "الأجراس لقائمة وحدة بالإعلان (−24)", "لا Pop لكل كلمة — tick_soft أو صمت", "الكشيدة صوتها بطول المطّ نفسه", "الأوترو تكة وحدة"],
           "sounds": man}, open(os.path.join(D, "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(man), "مؤثر ✔ · demo.wav", round(sum(len(x) for x in demo) / SR, 1), "ث")

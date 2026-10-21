# -*- coding: utf-8 -*-
"""قصّ قناني الماركات (stock/inspired-by) ← assets/img/inspired/*.png شفافة ومقصوصة على حدود المنتج
   الخلفيات المتوهّجة ⛔ (لا AI aesthetic) ← rembg · الشفافة أصلًا ← قصّ الحدود فقط"""
import os, json
from PIL import Image
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S, O = os.path.join(W, "stock", "inspired-by"), os.path.join(W, "assets", "img", "inspired")
CUT = {"armani-code-parfum", "kenzo-leau-pour-femme", "gucci-rush-2", "carolina-herrera-212-vip-men", "sunnamusk-golden-dust-elixir", "kenzo-flower-le-rouge"}  # kenzo-flower-original شفافة أصلًا — rembg شوّه الزجاج (ملاحظة صاحب الشغل)
from rembg import remove, new_session
sess = new_session("isnet-general-use")
for f in sorted(os.listdir(S)):
    n = f[:-4]; im = Image.open(os.path.join(S, f)).convert("RGBA")
    if n in CUT: im = remove(im, session=sess, post_process_mask=True)
    a = im.getchannel("A").point(lambda v: 0 if v < 12 else v); im.putalpha(a)
    im = im.crop(a.getbbox()); im.save(os.path.join(O, n + ".png")); print(n, im.size, "rembg" if n in CUT else "trim")

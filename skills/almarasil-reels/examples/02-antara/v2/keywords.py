# -*- coding: utf-8 -*-
"""الكلمات المفتاحية تطلع لحالها بالكابشن (بطاقة مستقلة kw) — تُرسم بمطّ الكشيدة في scenes.js"""
import json, sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import os as _os; p = _os.path.join(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))), "caps.json")
d = json.load(open(p, encoding="utf-8")); C = d["cards"]
KW = [["الأبيض", "المعتم"], ["الأنتارا"], ["العراق"]]
out = []
for c in C:
    ws = c["w"]; toks = [w["t"] for w in ws]; done = False
    for kw in KW:
        for i in range(len(toks) - len(kw) + 1):
            if toks[i:i + len(kw)] == kw:
                parts = [ws[:i], ws[i:i + len(kw)], ws[i + len(kw):]]
                for j, pw in enumerate(parts):
                    if pw: out.append({"s": pw[0]["s"], "e": pw[-1]["e"], "w": pw, **({"kw": True} if j == 1 else {})})
                done = True; break
        if done: break
    if not done: out.append(c)
for k in range(len(out) - 1):            # كل بطاقة تبقى لين تبدأ اللي بعدها (بلا فراغ داخل الجملة)
    if out[k + 1]["s"] - out[k]["e"] < 0.35: out[k]["e"] = out[k + 1]["s"]
for k, c in enumerate(out):                # الكلمة المفتاحية تبقى 0.6 ث على الأقل (تنقرأ) — اللي بعدها تتأخر شوي
    if c.get("kw") and c["e"] - c["s"] < 0.6:
        c["e"] = round(c["s"] + 0.6, 3)
        if k + 1 < len(out) and out[k + 1]["s"] < c["e"]: out[k + 1]["s"] = c["e"]
d["cards"] = out; json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for c in out: print(f"{c['s']:6.2f}-{c['e']:6.2f} {'★' if c.get('kw') else ' '} " + " ".join(w["t"] for w in c["w"]))

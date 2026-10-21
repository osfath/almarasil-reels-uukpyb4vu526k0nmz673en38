# -*- coding: utf-8 -*-
"""guide_index.py — يعيد كتابة جدول أقسام docs/GUIDE.md بأرقام الأسطر داخل README.md (بين <!--INDEX--> و<!--/INDEX-->). شغّله بعد أي تعديل للدليل."""
import os, re, sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
OG = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
lines = open(os.path.join(OG, "docs", "GUIDE.md"), encoding="utf-8").read().split("\n")
heads = [(i + 1, l) for i, l in enumerate(lines) if re.match(r"^#{2,3} ", l)]
rows = ["| القسم | الأسطر (offset · limit) |", "|---|---|"]
for k, (ln, h) in enumerate(heads):
    end = (heads[k + 1][0] - 1) if k + 1 < len(heads) else len(lines)
    rows.append(f"| {'　↳ ' if h.startswith('###') else ''}{h.lstrip('#').strip()} | {ln}–{end} ({ln} · {end - ln + 1}) |")
p = os.path.join(OG, "README.md"); r = open(p, encoding="utf-8").read()
a, b = r.index("<!--INDEX-->") + len("<!--INDEX-->"), r.index("<!--/INDEX-->")
open(p, "w", encoding="utf-8").write(r[:a] + "\n" + "\n".join(rows) + "\n" + r[b:])
print(f"README ✔ {len(heads)} قسم · GUIDE {len(lines)} سطر")

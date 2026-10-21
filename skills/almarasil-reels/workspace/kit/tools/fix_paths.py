# -*- coding: utf-8 -*-
"""fix_paths.py <مجلد مشروع أو projects/> — يبدّل أي مسار مطلق بسكربتات v2 بمسار يحدد نفسه (المشروع يشتغل وين ما انتقل)."""
import os, sys, glob
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = "_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))"
MARK_W, MARK_B = "C:\\Users\\", "/c/Users/"
root = sys.argv[1] if len(sys.argv) > 1 else "."
files = [p for pat in ("**/v2/*.py", "**/v2/*.sh", "**/v2/covers/*.sh") for p in glob.glob(os.path.join(root, pat), recursive=True) if os.sep + "history" + os.sep not in p]
n = 0
for p in files:
    lines = open(p, encoding="utf-8").read().split("\n"); out = []
    for l in lines:
        s = l.lstrip()
        if p.endswith(".py") and MARK_W in l and "video-ad-editor" in l:
            if s.startswith("W ") or s.startswith("W="):
                l = "import os as _os; W = " + HERE
            elif s.startswith("p = ") and l.rstrip().endswith('caps.json"'):
                l = 'import os as _os; p = _os.path.join(' + HERE + ', "caps.json")'
        elif p.endswith(".sh") and MARK_B in l and "video-ad-editor" in l:
            q0 = l.index('"', l.index(MARK_B) - 1); q1 = l.index('"', q0 + 1)
            if l[q0 - 3:q0] == "cd ":
                new = '"$(dirname "$0")"' if l[q0:q1].endswith("/covers") else '"$(dirname "$0")/.."'
            else:
                new = '"$(cd "$(dirname "$0")/.." && pwd)"'
            l = l[:q0] + new + l[q1 + 1:]
        out.append(l)
    if out != lines:
        open(p, "w", encoding="utf-8").write("\n".join(out)); n += 1; print("✔", p)
print(n, "ملف")

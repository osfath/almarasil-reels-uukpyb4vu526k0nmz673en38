# -*- coding: utf-8 -*-
"""يبني ملف .ass مُنسّق من caps.json — خط Al-Jazeera-Arabic · RTL · وسط الشاشة فوق البانر · الكلمات المهمة زرقاء."""
import sys, io, json, os
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
W = os.path.abspath(sys.argv[1])
caps = json.load(open(os.path.join(W, "caps.json"), encoding="utf-8"))

WHITE = r"&H00FFFFFF"
BLUE  = r"&H00E6742E"   # #2E74E6 بترتيب BGR

def tc(s):
    cs = int(round(s * 100))
    h = cs // 360000; cs %= 360000
    m = cs // 6000;   cs %= 6000
    sec = cs // 100;  cc = cs % 100
    return f"{h}:{m:02d}:{sec:02d}.{cc:02d}"

head = r"""[Script Info]
Title: Al-Marasil - Caustic Soda
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Main,Al-Jazeera-Arabic,80,&H00FFFFFF,&H000000FF,&H0078233A,&H6068182E,-1,0,0,0,100,100,0,0,1,3,4,2,70,70,770,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

lines = [head]
for c in caps["cards"]:
    parts = []
    for w in c["w"]:
        t = w["t"]
        if w.get("hot"):
            parts.append(r"{\c" + BLUE + r"}" + t + r"{\c" + WHITE + r"}")
        else:
            parts.append(t)
    text = " ".join(parts)
    lines.append(f"Dialogue: 0,{tc(c['s'])},{tc(c['e'])},Main,,0,0,0,,{text}")

out = os.path.join(W, "al-marasil.ass")
open(out, "w", encoding="utf-8").write("\n".join(lines) + "\n")
print("wrote", out, "·", len(caps["cards"]), "lines")

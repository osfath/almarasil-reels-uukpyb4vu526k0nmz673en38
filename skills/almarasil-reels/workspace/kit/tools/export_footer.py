# -*- coding: utf-8 -*-
"""تصدير تذييل المراسيل (بديل البانر المحروق) كـSVG فيكتور حقيقي — نفس هندسة K07.banner بالضبط.
   النص العربي يتشكّل بـharfbuzz ويتحوّل لمسارات (outlines) بـfontTools ← الملف ما يحتاج الخط عند الفتح.
   python kit/tools/export_footer.py <مجلد الإخراج>  ← المراسيل-التذييل.svg (+ نسخة بلا تدرّج)"""
import sys, os, re
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
OG = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
AR = os.path.join(OG, "brand", "aljazeera-bold.ttf") if os.path.exists(os.path.join(OG, "brand", "aljazeera-bold.ttf")) else os.path.join(OG, "projects", "07-dyes", "aljazeera-bold.ttf")
LA = r"C:\Windows\Fonts\ariblk.ttf"
KIT = os.path.join(OG, "projects", "07-dyes", "v2", "kit07.js")
ACC, PURP, YEL, WA = "#2E74E6", "#6B4BC2", "#F7CC2F", "#25D366"

class Font:
    def __init__(s, path):
        s.tt = TTFont(path); s.gs = s.tt.getGlyphSet(); s.upem = s.tt["head"].unitsPerEm
        s.hbf = hb.Font(hb.Face(hb.Blob.from_file_path(path))); hh = s.tt["hhea"]; s.asc, s.desc = hh.ascent, hh.descent
    def shape(s, text):
        b = hb.Buffer(); b.add_str(text); b.guess_segment_properties(); hb.shape(s.hbf, b, {})
        names = [s.tt.getGlyphName(i.codepoint) for i in b.glyph_infos]
        return names, b.glyph_positions
    def width(s, text, size): _, pos = s.shape(text); return sum(p.x_advance for p in pos) * size / s.upem
    def path(s, text, x, cy, size, align="center", ink_center=False):
        """يرجّع d لمسار النص. align: center|right|left · cy = منتصف مربّع الإم (مثل textBaseline=middle)"""
        names, pos = s.shape(text); sc = size / s.upem; total = sum(p.x_advance for p in pos) * sc
        x0 = {"center": x - total / 2, "right": x - total, "left": x}[align]
        base = cy + (s.asc + s.desc) / 2 * sc
        pen = SVGPathPen(s.gs); bp = BoundsPen(s.gs); cx = 0
        for n, p in zip(names, pos):
            m = (sc, 0, 0, -sc, x0 + (cx + p.x_offset) * sc, base - p.y_offset * sc)
            s.gs[n].draw(TransformPen(pen, m)); s.gs[n].draw(TransformPen(bp, m)); cx += p.x_advance
        d = pen.getCommands()
        if ink_center and bp.bounds:                                 # توسيط بحدود الحبر (مثل ltrCenter)
            xmin, ymin, xmax, ymax = bp.bounds; dx = x - (xmin + xmax) / 2; dy = cy - (ymin + ymax) / 2
            return d, (dx, dy)
        return d, (0, 0)

def kit_path(name):
    m = re.search(r"const " + name + r"=new Path2D\('([^']+)'\)", open(KIT, encoding="utf-8").read()); return m.group(1)
def glyph(d, vw, vh, cx, cy, size, fill):
    s = size / max(vw, vh); return f'<path d="{d}" fill="{fill}" transform="translate({cx - vw * s / 2:.2f} {cy - vh * s / 2:.2f}) scale({s:.4f})"/>'
def text(f, s, x, cy, size, fill, align="center", op=1, ink=False):
    d, (dx, dy) = f.path(s, x, cy, size, align, ink); t = f' transform="translate({dx:.2f} {dy:.2f})"' if (dx or dy) else ""
    return f'<path d="{d}" fill="{fill}"{' fill-opacity="%.2f"' % op if op < 1 else ""}{t}/>'
def rrect(x, y, w, h, r, fill): return f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" rx="{r}" fill="{fill}"/>'

def build(gradient=True):
    A, L = Font(AR), Font(LA); P_WA, P_CALL, P_IG, P_FB, P_TT, P_WEB, P_PIN = (kit_path(n) for n in ("K_WA", "K_CALL", "P_IG", "P_FB", "P_TT", "P_WEB", "K_PIN"))
    o = []
    if gradient:
        o.append('<defs><linearGradient id="g" x1="0" y1="1150" x2="0" y2="1920" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3A2378" stop-opacity="0"/><stop offset="0.24" stop-color="#3A2378" stop-opacity="0.8"/>'
                 '<stop offset="0.5" stop-color="#28185C" stop-opacity="0.95"/><stop offset="1" stop-color="#1A103E" stop-opacity="0.99"/></linearGradient></defs><rect x="0" y="1150" width="1080" height="770" fill="url(#g)"/>')
    else:
        o.append('<rect x="0" y="1150" width="1080" height="770" fill="#1A103E"/>')
    # ① الشعار + التعريف بين خطّين
    o.append(text(A, "المراسيل", 540, 1384, 128, "#FFFFFF"))
    tg = "لتجارة المواد الأولية للمنظفات"; tw2 = A.width(tg, 36)
    o.append(text(A, tg, 540, 1466, 36, "#FFFFFF", op=0.94))
    o.append(f'<rect x="{540 - tw2 / 2 - 24 - 56:.2f}" y="1465" width="56" height="3" fill="#FFFFFF" fill-opacity="0.85"/><rect x="{540 + tw2 / 2 + 24:.2f}" y="1465" width="56" height="3" fill="#FFFFFF" fill-opacity="0.85"/>')
    # ② الأرقام: واتساب (الشعار الرسمي) · اتصال · رقمين
    cy, pw, ph, r = 1552, 300, 74, 37; x0 = 540 - (2 * r * 2 + 12 + 20 + pw * 2 + 16) / 2
    o.append(f'<circle cx="{x0 + r:.2f}" cy="{cy}" r="{r}" fill="{WA}"/>' + glyph(P_WA, 24, 24, x0 + r, cy, r * 1.2, "#FFFFFF"))
    o.append(f'<circle cx="{x0 + 3 * r + 12:.2f}" cy="{cy}" r="{r}" fill="{ACC}"/>' + glyph(P_CALL, 24, 24, x0 + 3 * r + 12, cy, r * 1.1, "#FFFFFF"))
    for n, x in (("0771-679-1043", x0 + 4 * r + 12 + 20 + pw / 2), ("0772-112-7339", x0 + 4 * r + 12 + 20 + pw + 16 + pw / 2)):
        o.append(rrect(x - pw / 2, cy - ph / 2, pw, ph, 10, ACC) + text(A, n, x, cy + 1, 36, "#FFFFFF", ink=True))
    # ③ السوشيال + الموقع
    cy, r, g, fs, sep = 1640, 27, 12, 31, 40; hand, web = "@almaraseel", "almaraseel.com"; wh, ww = L.width(hand, fs), L.width(web, fs)
    W = 3 * 2 * r + 2 * g + 16 + wh + sep + 2 * r + 16 + ww; x = 540 + W / 2
    for p, vw, vh in ((P_IG, 24, 24), (P_FB, 24, 24), (P_TT, 448, 512)):
        c = x - r; o.append(f'<circle cx="{c:.2f}" cy="{cy}" r="{r}" fill="#FFFFFF"/>' + glyph(p, vw, vh, c, cy, r * 1.15, PURP)); x -= 2 * r + g
    x += g; x -= 16; o.append(text(L, hand, x, cy + 2, fs, "#FFFFFF", "right")); x -= wh
    o.append(f'<rect x="{x - sep / 2 - 1:.2f}" y="{cy - 18}" width="2" height="36" fill="#FFFFFF" fill-opacity="0.45"/>'); x -= sep
    c = x - r; o.append(f'<circle cx="{c:.2f}" cy="{cy}" r="{r}" fill="{ACC}"/>' + glyph(P_WEB, 24, 24, c, cy, r * 1.15, "#FFFFFF")); x -= 2 * r + 16
    o.append(text(L, web, x, cy + 2, fs, "#FFFFFF", "right"))
    # ④ شريط العنوان بلونين + كتلة الموقع
    y, h, pinX, sk = 1696, 72, 896, 22; a, b = "الموصل – الأيمن – شارع السايلو", "قرب ورش الألمنيوم والبلاستيك"; fs = 29
    while fs > 22 and (pinX - 52) - A.width(a, fs) - 40 - sk - 28 - A.width(b, fs) < 64: fs -= 1
    wa = A.width(a, fs); seam = pinX - 52 - wa - 40
    o.append(f'<rect x="0" y="{y}" width="1080" height="{h}" fill="#FFFFFF"/><polygon points="{seam + sk:.2f},{y} 1080,{y} 1080,{y + h} {seam - sk:.2f},{y + h}" fill="{ACC}"/>')
    o.append(text(A, a, pinX - 52, y + h / 2 + 2, fs, "#FFFFFF", "right") + text(A, b, seam - sk - 28, y + h / 2 + 2, fs, ACC, "right"))
    o.append(f'<rect x="{pinX - h / 2}" y="{y}" width="{h}" height="{h}" fill="{PURP}"/><rect x="{pinX - h / 2}" y="{y + h - 6}" width="{h}" height="6" fill="{YEL}"/>' + glyph(P_PIN, 24, 24, pinX, y + h / 2 - 2, 40, "#FFFFFF"))
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="770" viewBox="0 1150 1080 770">\n'
            '<!-- تذييل المراسيل · 1080×770 (يركب على فيديو 1080×1920 من y=1150) · النص مسارات (بلا خط) -->\n' + "\n".join(o) + "\n</svg>\n")

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(out, exist_ok=True)
    for name, grad in (("المراسيل-التذييل.svg", True), ("المراسيل-التذييل-خلفية-صلبة.svg", False)):
        open(os.path.join(out, name), "w", encoding="utf-8").write(build(grad)); print("✔", name)

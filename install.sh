#!/usr/bin/env bash
# install.sh — يثبّت سكلين بـ~/.claude/skills (almarasil-reels + video-ad-editor) ويجهّز مجلد الشغل ~/AlMarasil-Reels
#   bash install.sh            تثبيت كامل + الأدوات الناقصة (ffmpeg · وِسبر · puppeteer · مكتبات بايثون)
#   bash install.sh --no-deps  السكلات ومجلد الشغل بس
# ويندوز: شغّله من Git Bash (يجي مع Claude Code). ماك: من Terminal.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; SK="$HOME/.claude/skills"; WS="$HOME/AlMarasil-Reels"
mkdir -p "$SK"
for s in video-ad-editor almarasil-reels; do
  if [ -d "$SK/$s" ]; then mv "$SK/$s" "$SK/$s.old-$(date +%Y%m%d%H%M%S)"; echo "نسخة قديمة من $s انحفظت جنبها"; fi
  cp -r "$HERE/skills/$s" "$SK/$s"; echo "✔ سكل $s"
done
if [ -d "$WS" ]; then
  # مجلد شغل موجود: حدّث الأدوات والدليل والهوية بس، ولا تلمس projects/ وOUT/
  for d in kit brand docs; do rm -rf "$WS/$d"; cp -r "$SK/almarasil-reels/workspace/$d" "$WS/$d"; done
  cp "$SK/almarasil-reels/workspace/CLAUDE.md" "$SK/almarasil-reels/workspace/README.md" "$WS/"; echo "✔ مجلد الشغل تحدّث: $WS"
else
  cp -r "$SK/almarasil-reels/workspace" "$WS"; echo "✔ مجلد الشغل: $WS"
fi
[ "$1" = "--no-deps" ] && exit 0
PY=python; command -v python >/dev/null 2>&1 || PY=python3
bash "$SK/video-ad-editor/scripts/00_setup.sh" --install || true
"$PY" -m pip install --quiet scipy pillow fonttools || "$PY" -m pip install --quiet --break-system-packages scipy pillow fonttools || echo "⚠️ scipy/pillow/fonttools ما تثبّتت"
( cd "$SK/video-ad-editor" && npm i --silent ) || echo "⚠️ npm i فشل — ثبّت Node.js وأعد"
node "$WS/kit/tools/chrome.js" >/dev/null 2>&1 && echo "✔ كروم/إيدج موجود" || echo "⚠️ ما لقيت كروم ولا إيدج — ثبّت Google Chrome"
echo "خلص ✔ — افتح Claude Code داخل $WS وقل: «سوّ ريل المراسيل من هالفيديو <مسار الفيديو>»"

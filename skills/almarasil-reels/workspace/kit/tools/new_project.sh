#!/bin/bash
# new_project.sh <NN-اسم> <RAW.mp4> — مشروع جديد من القالب + تفريغ وِسبر medium بالخلفية
# بعده: صحّح fixes.json ← عدّل KEEP/EDL/SPLITS/NOCAP في v2/build.py ← run.sh build ← لقطة تجريبية (style.html) قبل أي مشهد
set -e
command -v python >/dev/null 2>&1 || python(){ python3 "$@"; }    # ماك: python3
OG="$(cd "$(dirname "$0")/../.." && pwd)"; N="$1"; RAW="$2"; P="$OG/projects/$N"
[ -e "$P" ] && { echo "موجود: $P"; exit 1; }
cp -r "$OG/kit/template" "$P"; mkdir -p "$P/input" "$P/ref"
cp "$RAW" "$P/input/"; cp "$RAW" "$P/src.mov"
cd "$P"; ffprobe -v error -show_entries stream=width,height,r_frame_rate:format=duration -of compact=p=0 src.mov
ffmpeg -v error -y -i src.mov -vn -ac 1 -ar 16000 a.wav
echo "مشروع ✔ $P — التفريغ (medium) يشتغل الحين…"
PYTHONUTF8=1 python -m whisper a.wav --language ar --model medium --word_timestamps True --output_format json --output_dir . --fp16 False --verbose False > whisper.log 2>&1 && mv a.json a.orig.json && cp a.orig.json a.json && python - <<'PY' && echo "تفريغ ✔ a.orig.json + fixes.json (نسخة وِسبر كما هي — صحّحها كلمة بكلمة)"
import json, os
a = json.load(open('a.json', encoding='utf-8'))
if not os.path.exists('fixes.json'):
    json.dump({'fix': [[w['word'].strip() for w in s.get('words', [])] for s in a['segments']], 'hot': []},
              open('fixes.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
PY

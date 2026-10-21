#!/bin/bash
# run.sh <مشروع> <أمر> [...] — كل مرحلة بأمر واحد ومخرجات مختصرة (توفير توكنز)
#   build                    التايم-لاين + الكابشن (+ keywords.py إن وجد)
#   check                    فحص صياغة scenes.js (بعد أي باتش، إلزامي)
#   preview t1 t2 …          ≤9 لقطات ← v2/sheet.jpg (اقرأ الورقة وحدها)
#   render                   رسم كل الفريمات + ترميز v2/video.mp4
#   audio                    المؤثرات + المكساج + المعايرة ← ad-master.mp4 / ad-clean.mp4 (بلا إعادة رسم)
#   full                     build + render + audio
#   qc t1 t2 …               ورقة 9 لقطات من الملف المرمّز نفسه ← v2/qc.jpg
#   sync                     تفريغ ad-clean بوِسبر medium ومقارنة بالكابشن (الوسيط والأقصى)
#   deliver <مجلد OUT> <بادئة> <vN>   ترجمة + نسخ للتسليم + نقل النسخة السابقة + معاينة 720p
#   clean                    حذف الوسيطات (vfr out prev cutz wav _an) — كلها تنعاد بـbuild/render
set -e
command -v python >/dev/null 2>&1 || python(){ python3 "$@"; }    # ماك: python3
P="$(cd "$1" && pwd)"; M="$2"; shift 2 || true
SELF="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"; OG="$(cd "$(dirname "$0")/../.." && pwd)"
export PYTHONUTF8=1
export CHROME_PATH="${CHROME_PATH:-$(node "$(dirname "$0")/chrome.js")}"    # كروم/إيدج تلقائياً (ويندوز وماك)
SK=~/.claude/skills/video-ad-editor/scripts
cd "$P"
enc(){ ffmpeg -v error -y -framerate 30 -i out/%05d.jpg -vf "scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p" \
  -c:v libx264 -preset slow -crf 19 -maxrate 8M -bufsize 16M -profile:v high -level 4.0 -pix_fmt yuv420p \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -r 30 -an v2/video.mp4; echo "video.mp4 ✔"; }
chk(){ node --check v2/scenes.js && echo "scenes.js ✔"; }
case "$M" in
  build)   mkdir -p _an; python v2/build.py > _an/build.log 2>&1 || { tail -8 _an/build.log; exit 1; }; head -1 _an/build.log; [ -f v2/keywords.py ] && python v2/keywords.py | tail -1; true ;;
  check)   chk ;;
  preview) chk; node $SK/04_render_frames.js . preview "$@" 2>&1 | grep -E "⚠️|Error|متخطّى" || true; bash v2/sheet.sh v2/sheet.jpg "$@" | tail -1 ;;
  render)  chk; [ -d vfr ] || { echo "vfr/ ناقص ← build أولًا"; exit 1; }
           node $SK/04_render_frames.js . all --force 2>&1 | grep -E "⚠️|Error|متخطّى" || true; enc ;;
  audio)   python v2/sfx_v4.py | grep -E "أسوأ|أقل من 12|peak" ; bash v2/master.sh ;;
  full)    bash "$SELF" "$P" build && bash "$SELF" "$P" render && bash "$SELF" "$P" audio ;;
  qc)      mkdir -p _an/qc; i=0; for t in "$@"; do i=$((i+1)); ffmpeg -v error -y -ss $t -i ad-master.mp4 -frames:v 1 \
             -vf "scale=360:640,drawtext=fontfile=aljazeera-bold.ttf:text='$t':x=8:y=8:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.6" _an/qc/$i.jpg; done
           while [ $i -lt 9 ]; do i=$((i+1)); ffmpeg -v error -y -f lavfi -i color=c=black:s=360x640 -frames:v 1 _an/qc/$i.jpg; done
           ffmpeg -v error -y $(for k in 1 2 3 4 5 6 7 8 9; do echo -n "-i _an/qc/$k.jpg "; done) -filter_complex \
             "xstack=inputs=9:layout=0_0|w0_0|w0+w1_0|0_h0|w0_h0|w0+w1_h0|0_h0+h3|w0_h0+h3|w0+w1_h0+h3" -q:v 3 v2/qc.jpg; echo "v2/qc.jpg ✔" ;;
  sync)    mkdir -p _an; ffmpeg -v error -y -i ad-clean.mp4 -vn -ac 1 -ar 16000 _an/fa.wav
           python -m whisper _an/fa.wav --language ar --model medium --word_timestamps True --output_format json --output_dir _an --fp16 False --verbose False > _an/w.log 2>&1
           python - <<'EOF'
import json, statistics
a=json.load(open("_an/fa.json",encoding="utf-8")); c=json.load(open("caps.json",encoding="utf-8"))
ws=[w for s in a["segments"] for w in s["words"]]; d=[]
for x in [w for k in c["cards"] for w in k["w"]]:
    m=min(ws,key=lambda w:abs(w["start"]-x["s"]))
    if abs(m["start"]-x["s"])<0.6: d.append(m["start"]-x["s"])
print(f"مزامنة: {len(d)} كلمة · الوسيط {statistics.median(d):+.3f} ث · الأقصى {max(map(abs,d)):.3f} ث · كابشن متأخر >0.1: {sum(1 for v in d if v<-0.1)}")
EOF
           ;;
  deliver) D="$OG/OUT/$1"; PRE="$2"; V="$3"; mkdir -p "$D"
           python $SK/09_srt.py . ad-master >/dev/null; python build_ass.py . >/dev/null
           old=$(ls -p "$D" | grep -v / | grep -oE -- "-v[0-9]+[.-]" | tr -d '.-' | sort -u | grep -vx "$V" || true)   # أي ملف بنسخة أقدم (بأي بادئة)
           for o in $old; do mkdir -p "$D/نسخة-سابقة-$o"; for f in "$D"/*-"$o".* "$D"/*-"$o"-*; do [ -f "$f" ] && mv "$f" "$D/نسخة-سابقة-$o/"; done; done
           cp ad-master.mp4 "$D/$PRE-$V.mp4"; cp ad-clean.mp4 "$D/$PRE-$V-بلا-مؤثرات.mp4"
           cp ad-master.srt "$D/$PRE-$V.srt"; cp ad-master.txt "$D/$PRE-$V.txt"; cp al-marasil.ass "$D/$PRE-$V.ass"
           ffmpeg -v error -y -i ad-master.mp4 -vf scale=720:1280 -c:v libx264 -crf 26 -preset fast -c:a aac -b:a 128k "$D/معاينة-720.mp4"
           echo "تسليم ✔ $D" ; ls "$D" ;;
  clean)   for d in vfr out prev _an; do [ -d "$P/$d" ] && rm -rf "$P/$d"; done
           for f in cutz.mp4 a.wav fa.wav; do [ -f "$P/$f" ] && rm -f "$P/$f"; done
           find "$P/v2" -maxdepth 1 -name "mix_*.wav" -delete; echo "نظيف ✔ ($(du -sh "$P" | cut -f1))" ;;
  *) sed -n 2,13p "$0" ;;
esac

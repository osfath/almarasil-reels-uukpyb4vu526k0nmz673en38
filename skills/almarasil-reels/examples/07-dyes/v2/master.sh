#!/bin/bash
# معايرة بلا ضغط ديناميكي: كسب ثابت لـ-14 LUFS + محدِّد شفاف (نظرة مسبقة 5ms) → AAC → قياس
set -e; cd "$(dirname "$0")/.."
I(){ ffmpeg -v info -i "$1" -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p' | grep -E " I:" | grep -oE "[-0-9.]+" | head -1; }
TP(){ ffmpeg -v info -i "$1" -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p' | grep -E "Peak:" | grep -oE "[-0-9.]+" | head -1; }
one(){ in="$1"; out="$2"; g=$(python -c "print(round(-14-($(I $in)),2))")
  ffmpeg -v error -y -i "$in" -af "volume=${g}dB,alimiter=limit=0.70:attack=5:release=90:level=disabled:asc=1" -c:a pcm_s24le "${in%.wav}_m.wav"
  g2=$(python -c "print(round(-14-($(I ${in%.wav}_m.wav)),2))")
  ffmpeg -v error -y -i "${in%.wav}_m.wav" -af "volume=${g2}dB,alimiter=limit=0.70:attack=5:release=90:level=disabled:asc=1" -c:a pcm_s24le "${in%.wav}_m2.wav"
  ffmpeg -v error -y -i v2/video.mp4 -i "${in%.wav}_m2.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$out"
  echo "$(basename $out): I $(I $out) LUFS · TP $(TP $out) dBTP · $(ffprobe -v error -show_entries format=duration,size -of default=nw=1:nk=1 "$out" | paste -sd' ' | awk '{printf "%.2fs %.1fMB",$1,$2/1048576}')"; }
one v2/mix_full.wav ad-master.mp4
one v2/mix_clean.wav ad-clean.mp4

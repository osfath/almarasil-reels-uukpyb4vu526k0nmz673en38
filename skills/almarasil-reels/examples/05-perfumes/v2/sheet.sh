#!/bin/bash
# sheet.sh <out.jpg> t1 t2 ... (3 cols, frames from prev/, 360px wide, time stamped)
W="$(cd "$(dirname "$0")/.." && pwd)"; OUT="$1"; shift
FF="C\:/Windows/Fonts/arial.ttf"
ins=(); fl=""; i=0
for t in "$@"; do f=$(printf "%s/prev/t%.2f.jpg" "$W" "$t"); ins+=(-i "$f")
  fl+="[$i:v]scale=360:-1,drawtext=fontfile='$FF':text='${t}s':x=10:y=10:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=6[s$i];"; i=$((i+1)); done
n=$i; cols=3; rows=$(( (n+cols-1)/cols )); lay=""
for ((k=0;k<n;k++)); do c=$((k%cols)); r=$((k/cols)); [ -n "$lay" ] && lay+="|"; lay+="$((c*360))_$((r*640))"; done
for ((k=0;k<n;k++)); do fl+="[s$k]"; done
ffmpeg -v error -y "${ins[@]}" -filter_complex "${fl}xstack=inputs=$n:layout=$lay:fill=black[v]" -map "[v]" -frames:v 1 -q:v 3 "$OUT" && echo "sheet: $OUT"

#!/bin/bash
# ورقة مرقّمة: كل صف = قالب · sheet_bulk.sh <out.jpg> [crop45]
cd "$(dirname "$0")"; FF="C\:/Windows/Fonts/arialbd.ttf"
files=(bulk/*.png); n=${#files[@]}; ins=(); fl=""; lay=""
rows=(L1 L2 L3 L4 L5 L6); declare -A col; 
for ((i=0;i<n;i++)); do f="${files[$i]}"; num=$(basename "$f" | cut -c1-2); t=$(basename "$f" | cut -d- -f2)
  ins+=(-i "$f"); pre=""; [ "$2" = "crop45" ] && pre="crop=1080:1350:0:285,"
  fl+="[$i:v]${pre}scale=240:-1,pad=iw+8:ih+8:4:4:color=0x0E1524,drawtext=fontfile='$FF':text='$num':x=12:y=10:fontsize=40:fontcolor=white:box=1:boxcolor=0x2E74E6:boxborderw=8[s$i];"
  r=0; for k in 0 1 2 3 4 5; do [ "${rows[$k]}" = "$t" ] && r=$k; done; c=${col[$t]:-0}; col[$t]=$((c+1))
  h=$([ "$2" = "crop45" ] && echo 308 || echo 435)
  [ -n "$lay" ] && lay+="|"; lay+="$((c*248))_$((r*h))"; done
for ((i=0;i<n;i++)); do fl+="[s$i]"; done
ffmpeg -v error -y "${ins[@]}" -filter_complex "${fl}xstack=inputs=$n:layout=$lay:fill=0x0E1524[v]" -map "[v]" -frames:v 1 -q:v 2 "$1" && echo "sheet $1"

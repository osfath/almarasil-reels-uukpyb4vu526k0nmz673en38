#!/bin/bash
# ورقة 5×2 مرقّمة · sheet.sh <out.jpg> [crop45]
cd "$(dirname "$0")"; FF="C\:/Windows/Fonts/arialbd.ttf"; files=(out/*.png); ins=(); fl=""; lay=""
for ((i=0;i<${#files[@]};i++)); do num=$(basename "${files[$i]}" | cut -c1-2); ins+=(-i "${files[$i]}"); pre=""; [ "$2" = "crop45" ] && pre="crop=1080:1350:0:285,"
  fl+="[$i:v]${pre}scale=300:-1,pad=iw+10:ih+10:5:5:color=0x0E1524,drawtext=fontfile='$FF':text='$num':x=14:y=12:fontsize=44:fontcolor=white:box=1:boxcolor=0x2E74E6:boxborderw=8[s$i];"
  h=$([ "$2" = "crop45" ] && echo 385 || echo 543); [ -n "$lay" ] && lay+="|"; lay+="$(( (i%5)*310 ))_$(( (i/5)*h ))"; done
for ((i=0;i<${#files[@]};i++)); do fl+="[s$i]"; done
ffmpeg -v error -y "${ins[@]}" -filter_complex "${fl}xstack=inputs=${#files[@]}:layout=$lay:fill=0x0E1524[v]" -map "[v]" -frames:v 1 -q:v 2 "$1" && echo "sheet $1"

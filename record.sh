#!/bin/bash
slop=$(slop -f "%x %y %w %h %g %i") || exit 1
read -r X Y W H G ID < <(echo $slop)
ffmpeg -y -f x11grab -s "$W"x"$H" -i :0.0+$X,$Y -f alsa -i pulse -pix_fmt yuv444p -colorspace bt709 test.webm
./node_modules/.bin/electron . test.webm

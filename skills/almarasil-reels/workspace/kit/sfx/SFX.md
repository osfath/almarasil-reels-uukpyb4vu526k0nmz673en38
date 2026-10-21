# مكتبة مؤثرات المراسيل (`kit/sfx/`)

مولّدة بالكود (`sfxlib.py`، numpy) — بلا ملفات خارجية أو حقوق. `python kit/sfx/make_sfx.py` ← `wav/*.wav` بالمستوى الموصى + `manifest.json` + `demo.wav` (كلها بالترتيب بفاصل 0.9 ث للسماع).

## القواعد (من ملاحظات صاحب الشغل — العطور v3)
- **الانتقال ياخذ لحظته:** ولا صوت ثاني خلال ±0.5 ث منه.
- **ولا صوتين أقرب من 0.5 ث** · لا Pop لكل كلمة (tick_soft أو صمت) · **الأجراس لقائمة وحدة بالإعلان** (−24).
- **صوت الكشيدة بطول المطّ نفسه** · الأوترو تكة وحدة · بلا جو تحت الكلام.

## الربط بالأدوات (`projects/07-dyes/v2/kit07.js` ↔ `sfx_v4.py`)
| الأداة | الصوت | الحدث بالمكساج |
|---|---|---|
| `kStretch` (الكشيدة) | `kashida` (0.42) · `kashida_long` (0.60) · `kashida_air` | `KASH` عند t0 — نطاق ينزلق 350→2600 Hz ويقف بلمسة استقرار |
| `kSlam` | `slam` | `SLAM` عند t0 |
| `kMask` | `mask_rise` | `MASK` (يبدأ قبل t0 بـ0.05) |
| `kSwap` | `swap_flick` | `SWAP` عند t0+0.17 |
| `kMarker` | `marker` | `MARK` عند t0 |
| `kCount` | `count_ticks` | بطول العدّ |
| `typeScreen` | `typing_1s/2s` (مقصوص بطول السطر) · `caret` · `type_return` | `TYPE(t1−t0)` عند t0 لكل سطر |
| push / slide / wipe / zoom | `push_up` · `slide_left/right` · `wipe` · `zoom_through` | −6…−7 |
| Whip | `whip_r` / `whip_l` | مركزه عند القطع |
| لقطة A3 (غطاء يعبر) | `natural_wipe` | انتقال طبيعي ناعم −9 |
| بنش / هوك / كشف | `hit_sub` · `boom_sub` · `riser` | |
| تعداد | `ting_C/D/E/G` | سلّم صاعد −24 |

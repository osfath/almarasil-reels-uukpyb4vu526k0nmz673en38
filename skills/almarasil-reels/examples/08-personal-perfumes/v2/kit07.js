/* ═══ kit07 — أدوات مشروع الأصباغ (موشن كلمات + شاشة كتابة + باكشوت بخلفية فيكتور + بانر المراسيل) ═══
   يُحمَّل قبل scenes.js (compose.html) وقبل lab.html. يعتمد على globals المحرّك: X (السياق) · FONT · ACC.
   لغة Promax: فلات تحريري · ⛔ لا توهّج ولا ارتداد · الحركة باتجاه واحد · النص العربي RTL واللاتيني {ltr}.
   كل دالة: (t, …, t0) — t0 = لحظة الكلمة بالصوت؛ الحركة تخلص خلال ≤0.45 ث وبعدها ثابتة (استراحة عين). */
(function(){
const K = window.K07 = {};
const PURP='#6B4BC2', NAVY='#0E1524', INKD='#16213A', BLUE_L='#5B93EE', VIO_L='#8E73D6', YEL='#F7CC2F';
Object.assign(K,{PURP,NAVY,INKD,BLUE_L,VIO_L,YEL});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lp=(a,b,k)=>a+(b-a)*k, P=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const eo=k=>1-Math.pow(1-k,3), eo5=k=>1-Math.pow(1-k,5), eio=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
function rgba(h,a){h=String(h).replace('#','');const n=parseInt(h,16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;}
const ISO=s=>String(s).replace(/(\d[\d\-.]*\d%?|\d%?)/g,'⁦$1⁩');
function tw(s,size){ X.save(); X.font='900 '+size+'px '+FONT; X.direction='rtl'; const v=X.measureText(ISO(s)).width; X.restore(); return v; }
function txt(s,x,y,size,o){ o=o||{}; s=ISO(s); X.save(); X.font='900 '+size+'px '+FONT; X.textAlign=o.al||'center'; X.textBaseline='middle'; X.direction=o.ltr?'ltr':'rtl';
  if(o.stroke){ X.lineJoin='round'; X.strokeStyle=o.sc||'#3A2378'; X.lineWidth=Math.max(4,size*0.085); X.shadowColor='rgba(46,24,104,0.62)'; X.shadowBlur=22; X.shadowOffsetY=6; X.strokeText(s,x,y); X.shadowColor='transparent'; }
  X.fillStyle=o.c||'#FFFFFF'; X.fillText(s,x,y); X.restore(); }
function fit(s,size,max){ while(tw(s,size)>max&&size>36) size-=2; return size; }
function reveal(x,y,w,h,k,dir){ X.beginPath(); if(dir==='r') X.rect(x+w*(1-k),y,w*k,h); else if(dir==='l') X.rect(x,y,w*k,h); else if(dir==='u') X.rect(x,y+h*(1-k),w,h*k); else X.rect(x,y,w,h*k); X.clip(); }
function ltrCenter(s,cx,cy,fs,col){ X.save(); X.font='900 '+fs+'px '+FONT; X.direction='ltr'; X.textAlign='left'; X.textBaseline='alphabetic';
  const m=X.measureText(s), w=m.actualBoundingBoxLeft+m.actualBoundingBoxRight, h=m.actualBoundingBoxAscent+m.actualBoundingBoxDescent;
  X.fillStyle=col; X.fillText(s,cx-w/2+m.actualBoundingBoxLeft,cy+h/2-m.actualBoundingBoxDescent); X.restore(); return [w,h]; }
Object.assign(K,{clamp,lp,P,eo,eo5,eio,rgba,ISO,tw,txt,fit,reveal,ltrCenter});

/* ── الكشيدة: مواضع المطّ (بعد حرف يتصل · لا بعد «ال» · لا داخل «لا» · ≤3 مواضع) ── */
const JOINF='بتثجحخسشصضطظعغفقكلمنهيئ', ARL=/[ء-ي]/;
function slots(w){ const pre=w.startsWith('ال')?2:0, s=[]; for(let i=pre;i<w.length-1;i++){ const a=w[i],b=w[i+1]; if(!JOINF.includes(a)||!ARL.test(b)) continue; if(a==='ل'&&'اأإآ'.includes(b)) continue; s.push(i); }
  return s.length>3?[...new Set([s[0],s[Math.floor(s.length/2)],s[s.length-1]])]:s; }
function stretched(ph,n){ return ph.split(' ').map(w=>{ const sl=slots(w); let o=''; for(let i=0;i<w.length;i++){ o+=w[i]; if(sl.includes(i)) o+='ـ'.repeat(n); } return o; }).join(' '); }
K.slots=slots; K.stretched=stretched;
/* ① kStretch — الأهم: الكلمة تنمطّ بالكشيدة 0→NM بنعومة (ترسم بعدد الكشيدات الأعلى وتنضغط أفقيًا للعرض المطلوب — بلا قفزات)
   o: {nm:3 · max:880 · dur:0.42 · settle:true (تصغير 1.18→1 بلا ارتداد) · stroke · shc}  · المدة الكلية ≈ dur  · صوتها: kashida.wav من t0 */
K.kStretch=function(t,ph,t0,cx,cy,fs,c,o){ o=o||{}; if(t<t0) return; const NM=o.nm||3, D=o.dur||0.42; let f=fs; while(tw(stretched(ph,NM),f)>(o.max||880)&&f>60) f-=4;
  const k=NM*eio(P(t,t0+0.04,t0+D)), n0=Math.floor(k), n1=Math.min(NM,n0+1), fr=k-n0, s1=stretched(ph,n1), w0=tw(stretched(ph,n0),f), w1=tw(s1,f), sx=(w0+(w1-w0)*fr)/w1;
  const ka=P(t,t0,t0+0.14), sc=o.settle===false?1:1+0.18*(1-eo(ka));
  X.save(); X.globalAlpha*=Math.min(1,ka*2.5); X.translate(cx,cy); X.scale(sc*sx,sc); X.translate(-cx,-cy); txt(s1,cx,cy,f,{c,stroke:o.stroke}); X.restore(); };
/* ② kSlam — تنضرب من كبير (1.35→1) بلا ارتداد */
K.kSlam=function(t,s,t0,cx,cy,fs,c,o){ o=o||{}; if(t<t0) return; const k=eo5(P(t,t0,t0+0.28)); X.save(); X.globalAlpha*=Math.min(1,k*2); X.translate(cx,cy); const sc=lp(1.35,1,k); X.scale(sc,sc); X.translate(-cx,-cy); txt(s,cx,cy,fs,{c,stroke:o.stroke}); X.restore(); };
/* ③ kMask — تطلع من تحت خط قناع (مثل العناوين التحريرية) */
K.kMask=function(t,s,t0,cx,cy,fs,c,o){ o=o||{}; if(t<t0) return; const k=eo5(P(t,t0,t0+0.36)), h=fs*1.3; X.save(); X.beginPath(); X.rect(0,cy-h/2,1080,h); X.clip(); txt(s,cx,cy+(1-k)*h,fs,{c,stroke:o.stroke}); X.restore();
  if(o.line){ const w=lp(0,tw(s,fs)+24,eo(P(t,t0+0.1,t0+0.45))); X.fillStyle=o.line; X.fillRect(cx-w/2,cy+h/2+6,w,8); } };
/* ④ kSlideRTL — تدخل من اليمين باتجاه القراءة مع أثر حركة خفيف */
K.kSlideRTL=function(t,s,t0,cx,cy,fs,c,o){ o=o||{}; if(t<t0) return; const k=eo5(P(t,t0,t0+0.34)), dx=(1-k)*180;
  if(k<1) for(let g=2;g>=1;g--){ X.save(); X.globalAlpha*=0.18*(1-k); txt(s,cx+dx+g*40*(1-k),cy,fs,{c}); X.restore(); }
  X.save(); X.globalAlpha*=Math.min(1,k*1.8); txt(s,cx+dx,cy,fs,{c,stroke:o.stroke}); X.restore(); };
/* ⑤ kSwap — كلمة تنسحب لفوق وتدخل الثانية من تحت داخل نفس القناع (مقارنة / تبديل) */
K.kSwap=function(t,a,b,t0,cx,cy,fs,ca,cb){ const k=eio(P(t,t0,t0+0.34)), h=fs*1.3; X.save(); X.beginPath(); X.rect(0,cy-h/2,1080,h); X.clip();
  if(k<1) txt(a,cx,cy-k*h,fs,{c:ca}); if(k>0) txt(b,cx,cy+(1-k)*h,fs,{c:cb||ca}); X.restore(); };
/* ⑥ kMarker — كتلة لون صلبة تمسح خلف الكلمة (يمين←يسار) ولون النص ينقلب */
K.kMarker=function(t,s,t0,cx,cy,fs,c,bg,c2){ const w=tw(s,fs)+fs*0.7, h=fs*1.32, x=cx-w/2, k=eio(P(t,t0,t0+0.32));
  txt(s,cx,cy,fs,{c}); if(k<=0) return; X.save(); reveal(x,cy-h/2,w,h,k,'r'); X.fillStyle=bg||YEL; X.fillRect(x,cy-h/2,w,h); txt(s,cx,cy+fs*0.04,fs,{c:c2||NAVY}); X.restore(); };
/* ⑦ kCount — عدّاد رقم (بلا ارتداد) · للأرقام اللاتينية */
K.kCount=function(t,from,to,t0,t1,cx,cy,fs,c,dec,suf){ if(t<t0) return; const v=lp(from,to,eo(P(t,t0,t1))); ltrCenter(v.toFixed(dec||0)+(suf||''),cx,cy,fs,c); };

/* ⑧ kLine — سطر يُبنى كلمة كلمة بتوقيت الصوت: كل كلمة تطلع من تحت قناعها (ارتفاع + تصغير 1.15→1) والسطر ثابت المواضع (بلا قفز)
   words: [[كلمة, t0, لون؟], …] بترتيب القراءة · o: {stroke, gap} */
K.kLine=function(t,words,cx,cy,fs,c,o){ o=o||{}; const sp=tw(' ',fs), ws=words.map(w=>tw(w[0],fs)), tot=ws.reduce((a,b)=>a+b,0)+sp*(words.length-1); let xr=cx+tot/2; const h=fs*1.35;
  words.forEach(([w,t0,cc],i)=>{ const x=xr; xr-=ws[i]+sp; if(t<t0) return; const k=eo5(P(t,t0,t0+0.30)), sc=lp(1.15,1,k), mx=x-ws[i]/2;
    X.save(); X.beginPath(); X.rect(x-ws[i]-fs*0.2,cy-h/2-fs*0.2,ws[i]+fs*0.4,h+fs*0.4); X.clip(); X.translate(mx,cy+(1-k)*h*0.8); X.scale(sc,sc); X.translate(-mx,-cy);
    txt(w,x,cy,fs,{c:cc||c,al:'right',stroke:o.stroke}); X.restore(); }); };
/* ═══ شاشة الكتابة — لوح فلات أبيض بشريط كحلي، والأسطر تنكتب حرف حرف بمؤشر أزرق ═══
   lines: [[نص, t0, t1, {c, hot:[كلمات]}], …] · صوتها: typing.wav بطول الكتابة (t0→t1) + caret.wav عند كل سطر */
K.typeScreen=function(t,box,lines,o){ o=o||{}; const {x,y,w,h}=box, kIn=eio(P(t,o.tIn||0,(o.tIn||0)+0.32)); if(kIn<=0) return;
  X.save(); reveal(x,y,w,h,kIn,'d'); X.fillStyle='#FFFFFF'; X.fillRect(x,y,w,h); X.strokeStyle=rgba(PURP,0.35); X.lineWidth=3; X.strokeRect(x,y,w,h);
  X.fillStyle=NAVY; X.fillRect(x,y,w,64); [0,1,2].forEach(i=>{ X.fillStyle=[YEL,BLUE_L,'#FFFFFF'][i]; X.fillRect(x+w-40-i*30,y+24,16,16); });   // شريط اللوح (مربعات صلبة، بلا دوائر)
  if(o.title) txt(o.title,x+w/2,y+33,30,{c:'#FFFFFF'});
  const fs=o.fs||64, lh=fs*1.55; let ly=y+64+fs*1.05;
  lines.forEach(([s,t0,t1,lo],i)=>{ lo=lo||{}; const n=Math.round(s.length*P(t,t0,t1)); if(n>0){ const part=s.slice(0,n);
      txt(part,x+w-40,ly,fs,{c:lo.c||INKD,al:'right'});
      const active=t<t1+0.5&&(i===lines.length-1||t<lines[i+1][1]); if(active&&Math.floor(t*3.5)%2===0){ const pw=tw(part,fs); X.fillStyle=ACC; X.fillRect(x+w-40-pw-14,ly-fs*0.55,7,fs*1.05); } }
    ly+=lh; });
  X.restore(); };

/* ═══ خلفيات فيكتور للباكشوت (فلات، بلا توهّج) ═══
   backdropPowder: سحابة صبغة بودرة (كتلة عضوية من دوائر متحدة + حبيبات تنطلق للخارج) — لون المنتج: أزرق (BLUE AB 800)
   backdropLiquid: قطرة سائل كبيرة + سطح موج يتحرك + قطرات صغيرة — لون المنتج: بنفسجي (VIOLET SOL 300 LQ)
   k = تقدّم البناء 0→1 (الأول 0.45 ث) · t للحركة المستمرة الهادئة */
function rnd(seed){ let s=seed; return ()=>{ s=(s*9301+49297)%233280; return s/233280; }; }
K.backdropPowder=function(t,k,cx,cy,R,col,col2){ col=col||ACC; col2=col2||BLUE_L; if(k<=0) return; const r=rnd(11), ke=eo5(clamp(k,0,1));
  const C=[[0,0,1],[0.42,-0.30,0.62],[-0.45,-0.22,0.66],[0.30,0.42,0.6],[-0.36,0.40,0.58],[0.02,-0.55,0.5],[0.62,0.10,0.45],[-0.64,0.06,0.47]];
  X.save(); X.translate(cx,cy); X.scale(ke,ke); X.fillStyle=col; X.beginPath(); C.forEach(([x,y,s])=>{ X.moveTo(x*R+s*R*0.62,y*R); X.arc(x*R,y*R,s*R*0.62,0,7); }); X.fill();
  X.fillStyle=col2; X.beginPath(); [[0.18,-0.18,0.55],[-0.22,0.12,0.42],[0.30,0.22,0.3]].forEach(([x,y,s])=>{ X.moveTo(x*R+s*R*0.62,y*R); X.arc(x*R,y*R,s*R*0.62,0,7); }); X.fill(); X.restore();
  for(let i=0;i<46;i++){ const a=r()*Math.PI*2, d0=R*(0.55+r()*0.25), d1=R*(0.95+r()*0.55), sz=3+r()*11, kk=eo5(clamp((k-r()*0.25)/0.75,0,1)); if(kk<=0) continue;
    const d=lp(d0,d1,kk)+Math.sin(t*0.8+i)*3, px=cx+Math.cos(a)*d, py=cy+Math.sin(a)*d*0.92; X.fillStyle=[col,col2,NAVY][i%3];
    if(i%4===0) X.fillRect(px-sz/2,py-sz/2,sz,sz); else { X.beginPath(); X.arc(px,py,sz/2,0,7); X.fill(); } } };
K.backdropLiquid=function(t,k,cx,cy,R,col,col2){ col=col||PURP; col2=col2||VIO_L; if(k<=0) return; const ke=eo5(clamp(k,0,1));
  X.save(); X.translate(cx,cy-R*0.08); X.scale(ke,ke); X.fillStyle=col; X.beginPath(); X.moveTo(0,-R*1.02); X.bezierCurveTo(R*0.55,-R*0.40,R*0.9,-R*0.02,R*0.9,R*0.32); X.arc(0,R*0.32,R*0.9,0,Math.PI); X.bezierCurveTo(-R*0.9,-R*0.02,-R*0.55,-R*0.40,0,-R*1.02); X.fill();
  X.fillStyle=col2; X.beginPath(); X.ellipse(-R*0.34,-R*0.05,R*0.13,R*0.26,-0.35,0,7); X.fill(); X.restore();                  // لمعة صلبة (شكل، مو توهّج)
  const kw=eo(clamp((k-0.25)/0.75,0,1)); if(kw>0){ const yb=cy+R*0.88, w=Math.min(R*2.3,860);                                                 // سطح موج تحت القطرة
    [[col2,0,18],[col,1.4,26]].forEach(([c,ph,amp],j)=>{ X.fillStyle=c; X.beginPath(); X.moveTo(cx-w/2,yb+60); for(let x=0;x<=w;x+=12){ const yy=yb-j*16-amp*Math.sin(x/w*Math.PI*3+t*1.6+ph)*kw; X.lineTo(cx-w/2+x,yy+(1-kw)*80); } X.lineTo(cx+w/2,yb+60); X.closePath(); X.fill(); }); }
  const r=rnd(5); for(let i=0;i<7;i++){ const a=-Math.PI*0.95+r()*Math.PI*0.9, d=R*(1.15+r()*0.35), s=8+r()*12, kk=eo5(clamp((k-0.3-i*0.05)/0.5,0,1)); if(kk<=0) continue;
    const px=cx+Math.cos(a)*d, py=cy+Math.sin(a)*d+Math.sin(t*1.2+i)*4; X.fillStyle=i%2?col:col2; X.beginPath(); X.moveTo(px,py-s*1.6*kk); X.quadraticCurveTo(px+s*kk,py,px,py+s*kk); X.quadraticCurveTo(px-s*kk,py,px,py-s*1.6*kk); X.fill(); } };
/* packshot — الخلفية تنبني (0→0.45 ث) ثم المنتج يطلع بقناع من تحت مع ظل أرضي ودفع بطيء · kind: 'powder' | 'liquid' */
K.packshot=function(t,img,kind,t0,cx,cy,H,o){ o=o||{}; if(t<t0||!img||!img.complete) return; const kb=P(t,t0,t0+0.45), kp=eio(P(t,t0+0.18,t0+0.62)), W=H*img.width/img.height, drift=lp(1,1.035,P(t,t0+0.62,t0+(o.hold||3)));
  const R=o.R||H*0.52; (kind==='liquid'?K.backdropLiquid:K.backdropPowder)(t,kb,cx,cy+(o.bdy||0),R,o.col,o.col2);
  if(kp<=0) return; const top=cy-H/2;
  X.save(); X.fillStyle='rgba(14,21,36,0.16)'; X.beginPath(); X.ellipse(cx,top+H-4,W*0.42*kp,H*0.022,0,0,7); X.fill(); X.restore();
  X.save(); X.beginPath(); X.rect(cx-W,top-40,W*2,H+44); X.clip(); X.translate(cx,top+H); X.scale(drift,drift); X.translate(-cx,-(top+H)); X.drawImage(img,cx-W/2,top+(1-kp)*H*0.35,W,H); X.restore(); };

/* ═══ بانر المراسيل (فيكتور) — بديل البانر المحروق (هالفيديوهات بلا بانر) — شبكة دقيقة حسب الدليل ═══
   هوامش 80 · مسافات بمضاعفات 8 · ⛔ لا عنصر بـx>950 بين y 1100–1750 (أزرار المنصّة) · ⛔ بلا خط تحت الشعار · باليت ثابت (واتساب الأخضر الاستثناء الوحيد)
   الصفوف: الشعار 1392 · التعريف 1472 · الأرقام 1560 · سوشيال + الموقع 1656 · شريط العنوان 1712–1776 · تحته فراغ لواجهة المنصّة */
const P_IG=new Path2D('M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z');
const P_FB=new Path2D('M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z');
const P_TT=new Path2D('M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z');   // viewBox 448×512
const P_WEB=new Path2D('M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z');
const K_CALL=new Path2D('M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z');
const K_WA=new Path2D('M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z');
/* صف الأرقام (نفس ترتيب البانرات الحقيقية): واتساب (شعاره الرسمي، أخضر #25D366 — الاستثناء الوحيد) · اتصال · الرقمين */
function contactRowK(cy){ const pw=300, ph=74, r=37, x0=540-(2*r*2+12+20+pw*2+16)/2;
  X.save(); X.fillStyle='#25D366'; X.beginPath(); X.arc(x0+r,cy,r,0,7); X.fill(); X.restore(); icon(K_WA,x0+r,cy,r*1.2,24,24,'#FFFFFF');
  X.save(); X.fillStyle=ACC; X.beginPath(); X.arc(x0+3*r+12,cy,r,0,7); X.fill(); X.restore(); icon(K_CALL,x0+3*r+12,cy,r*1.1,24,24,'#FFFFFF');
  [['0771-679-1043',x0+4*r+12+20+pw/2],['0772-112-7339',x0+4*r+12+20+pw+16+pw/2]].forEach(([n,x])=>{ const rr=10; X.fillStyle=ACC; X.beginPath(); X.moveTo(x-pw/2+rr,cy-ph/2); X.arcTo(x+pw/2,cy-ph/2,x+pw/2,cy+ph/2,rr); X.arcTo(x+pw/2,cy+ph/2,x-pw/2,cy+ph/2,rr); X.arcTo(x-pw/2,cy+ph/2,x-pw/2,cy-ph/2,rr); X.arcTo(x-pw/2,cy-ph/2,x+pw/2,cy-ph/2,rr); X.closePath(); X.fill();
    K.ltrCenter(n,x,cy+1,36,'#FFFFFF'); }); }
K.contactRow=contactRowK;
function icon(P2,cx,cy,size,vw,vh,col){ X.save(); const s=size/Math.max(vw,vh); X.translate(cx-vw*s/2,cy-vh*s/2); X.scale(s,s); X.fillStyle=col; X.fill(P2); X.restore(); }
function socialRow(cy){ const r=27, g=12, hand='@almaraseel', web='almaraseel.com', fs=31;
  X.save(); X.font='900 '+fs+'px '+FONT; X.direction='ltr'; const wh=X.measureText(hand).width, ww=X.measureText(web).width; X.restore();
  const sep=40, W=3*2*r+2*g+16+wh+sep+2*r+16+ww; let x=540+W/2;                        // RTL: من اليمين ← السوشيال ثم الموقع
  [[P_IG,24,24],[P_FB,24,24],[P_TT,448,512]].forEach(([p,vw,vh])=>{ const cx=x-r; X.fillStyle='#FFFFFF'; X.beginPath(); X.arc(cx,cy,r,0,7); X.fill(); icon(p,cx,cy,r*1.15,vw,vh,PURP); x-=2*r+g; });
  x+=g; x-=16; X.save(); X.font='900 '+fs+'px '+FONT; X.direction='ltr'; X.textAlign='right'; X.textBaseline='middle'; X.fillStyle='#FFFFFF'; X.fillText(hand,x,cy+2); X.restore(); x-=wh;
  X.fillStyle='rgba(255,255,255,0.45)'; X.fillRect(x-sep/2-1,cy-18,2,36); x-=sep;
  const cx=x-r; X.fillStyle=ACC; X.beginPath(); X.arc(cx,cy,r,0,7); X.fill(); icon(P_WEB,cx,cy,r*1.15,24,24,'#FFFFFF'); x-=2*r+16;
  X.save(); X.font='900 '+fs+'px '+FONT; X.direction='ltr'; X.textAlign='right'; X.textBaseline='middle'; X.fillStyle='#FFFFFF'; X.fillText(web,x,cy+2); X.restore(); return W; }
K.socialRow=socialRow;
const K_PIN=new Path2D('M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5 2.5,1.12 2.5,2.5 -1.12,2.5 -2.5,2.5z');
/* شريط العنوان بلونين (مثل البانر الحقيقي): أزرق «الموصل – الأيمن – شارع السايلو» | أبيض «قرب ورش الألمنيوم والبلاستيك» · فاصل مائل · دبوس بمعيّن أبيض */
function addressStrip(y,h){ const a='الموصل – الأيمن – شارع السايلو', b='قرب ورش الألمنيوم والبلاستيك', pinX=896, sk=22; let fs=29;
  while(fs>22 && (pinX-52)-tw(a,fs)-40-sk-28-tw(b,fs) < 64) fs--;            // الحجم ينزل لين النصّين يدخلون بمسافات ثابتة (هامش يسار ≥64)
  const wa=tw(a,fs), wb=tw(b,fs), seam=pinX-52-wa-40;
  X.fillStyle='#FFFFFF'; X.fillRect(0,y,1080,h);
  X.fillStyle=ACC; X.beginPath(); X.moveTo(seam+sk,y); X.lineTo(1080,y); X.lineTo(1080,y+h); X.lineTo(seam-sk,y+h); X.closePath(); X.fill();
  txt(a,pinX-52,y+h/2+2,fs,{c:'#FFFFFF',al:'right'});
  txt(b,seam-sk-28,y+h/2+2,fs,{c:ACC,al:'right'});
  X.fillStyle=PURP; X.fillRect(pinX-h/2,y,h,h); X.fillStyle=K.YEL; X.fillRect(pinX-h/2,y+h-6,h,6);       // كتلة بنفسجية صلبة بارتفاع الشريط + خط أصفر رفيع (فلات تحريري)
  icon(K_PIN,pinX,y+h/2-2,40,24,24,'#FFFFFF'); }
K.addressStrip=addressStrip;
K.banner=function(t,o){ o=o||{}; const k=o.k===undefined?1:o.k; if(k<=0) return; X.save(); X.globalAlpha*=k;
  const g=X.createLinearGradient(0,1150,0,1920); g.addColorStop(0,'rgba(58,35,120,0)'); g.addColorStop(0.24,'rgba(58,35,120,0.80)'); g.addColorStop(0.5,'rgba(40,24,92,0.95)'); g.addColorStop(1,'rgba(26,16,62,0.99)'); X.fillStyle=g; X.fillRect(0,1150,1080,770);
  txt('المراسيل',540,1384,128,{c:'#FFFFFF'});
  const tg='لتجارة المواد الأولية للمنظفات', tw2=tw(tg,36); txt(tg,540,1466,36,{c:'rgba(255,255,255,0.94)'});
  X.fillStyle='rgba(255,255,255,0.85)'; X.fillRect(540-tw2/2-24-56,1465,56,3); X.fillRect(540+tw2/2+24,1465,56,3);   // خطّين جنب التعريف (مثل البانر الحقيقي — مو تحت الشعار)
  contactRowK(1552);
  socialRow(1640);
  addressStrip(1696,72); X.restore(); };
})();

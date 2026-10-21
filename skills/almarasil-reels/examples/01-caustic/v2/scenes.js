/* ═══ المراسيل v3 — مشاهد الريل (فوق محرّك compose.html) ═══
   باليت واحد: كحلي (BG) · أزرق الهوية (ACC) · أبيض — وخط واحد: الجزيرة (لا نص لاتيني).
   الطبقات: video (زوم يحمي البانر · ضبابية الخلفية · صور المنتج · تعتيم · Whip · فينييت) ← الرسوم ← الكابشن (المحرّك).
   كل الأوقات على التايم-لاين النهائي (32.28 ث). كل نص منطوق أو من البانر/الصور المقدّمة. */
(function(){
window.NOBAR = true; window.NO_OUTRO = true;          // شريط التقدّم كان يقطع اسم «المراسيل» المحروق
window.CAP_STROKE = 0.085;    // حدّ بنفسجي رفيع + ظل ناعم (theme.json ← stroke · strokeShadow)

const IMG = {};
function loadImg(k, src){ return new Promise(r=>{ const im=new Image();
  im.onload=()=>{ IMG[k]=im; (im.decode?im.decode():Promise.resolve()).then(r,r); };
  im.onerror=()=>{ console.error('⚠️ صورة ما تحمّلت: '+src); r(); }; im.src=src; }); }
const _init0 = window.init;
window.init = function(o){ const p=_init0(o); const th=(o&&o.theme)||{}; window.CAP_SC=th.stroke||'#3A2378'; window.CAP_SH=th.strokeShadow||'rgba(46,24,104,0.62)';
  for(const c of (o.cards||[])) if(c.kw) SCENES.push({s:c.s,e:c.e,m:R_FULL,nocap:true});   // الكلمة المفتاحية يرسمها kwCap
  return Promise.all([p, loadImg('pour','assets/product.jpeg'), loadImg('bag','assets/packshot_cut.png')]); };

/* ── أدوات ── */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lp=(a,b,k)=>a+(b-a)*k;
const P=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const eo=k=>1-Math.pow(1-k,3), eo5=k=>1-Math.pow(1-k,5);
const eio=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
const ob=k=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2);};
function rgba(h,a){h=String(h).replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;}
function mix(h1,h2,k){ const f=h=>{h=String(h).replace('#','');const n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255];}; const a=f(h1),b=f(h2); return `rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*k)).join(',')})`; }
function win(t,s,e,fi,fo){ if(t<s||t>e) return 0; return Math.min(fi?P(t,s,s+fi):1, fo?1-P(t,e-fo,e):1); }
function rrect(x,y,w,h,r){X.beginPath();X.moveTo(x+r,y);X.arcTo(x+w,y,x+w,y+h,r);X.arcTo(x+w,y+h,x,y+h,r);X.arcTo(x,y+h,x,y,r);X.arcTo(x,y,x+w,y,r);X.closePath();}
function txt(s,x,y,size,o){ o=o||{}; X.save(); X.font=(o.w||800)+' '+size+'px '+FONT; X.textAlign=o.al||'center'; X.textBaseline='middle'; X.direction='rtl';
  if(o.stroke){ X.lineJoin='round'; X.miterLimit=2; X.lineWidth=o.stroke; X.strokeStyle=o.sc||window.CAP_SC||rgba(BG,0.92); X.lineWidth=Math.max(4,o.stroke*0.65);
    X.shadowColor=window.CAP_SH||'rgba(0,0,0,0.55)'; X.shadowBlur=Math.max(o.sh||0,22); X.shadowOffsetY=6; X.strokeText(s,x,y); X.shadowColor='transparent'; X.shadowBlur=0; }
  else if(o.sh){ X.shadowColor='rgba(0,0,0,0.6)'; X.shadowBlur=o.sh; X.shadowOffsetY=4; }
  X.fillStyle=o.c||'#FFFFFF'; X.fillText(s,x,y); X.restore(); }
function tw(s,size,w){ X.save(); X.font=(w||800)+' '+size+'px '+FONT; X.direction='rtl'; const v=X.measureText(s).width; X.restore(); return v; }
function glass(x,y,w,h,r,a,bar){
  X.save(); X.shadowColor='rgba(0,0,0,0.45)'; X.shadowBlur=40; X.shadowOffsetY=14; rrect(x,y,w,h,r); X.fillStyle=rgba(BG,a); X.fill(); X.restore();
  X.save(); rrect(x+1,y+1,w-2,h-2,r); X.strokeStyle='rgba(255,255,255,0.10)'; X.lineWidth=2; X.stroke(); X.restore();
  if(bar){ X.save(); rrect(x,y,w,h,r); X.clip(); X.fillStyle=bar; X.fillRect(x,y,w,7); X.restore(); } }
function pill(s,cx,cy,fs,fill,col){ const w=tw(s,fs,900)+fs*1.4, h=fs*2.05;
  X.save(); X.shadowColor='rgba(0,0,0,0.45)'; X.shadowBlur=28; X.shadowOffsetY=10; rrect(cx-w/2,cy-h/2,w,h,h/2); X.fillStyle=fill; X.fill(); X.restore();
  txt(s,cx,cy+2,fs,{w:900,c:col||'#FFFFFF'}); return w; }
function arrowL(cx,cy,len,c){ X.save(); X.strokeStyle=c; X.fillStyle=c; X.lineWidth=9; X.lineCap='round'; X.beginPath(); X.moveTo(cx+len/2,cy); X.lineTo(cx-len/2+14,cy); X.stroke();
  X.beginPath(); X.moveTo(cx-len/2,cy); X.lineTo(cx-len/2+24,cy-17); X.lineTo(cx-len/2+24,cy+17); X.closePath(); X.fill(); X.restore(); }

/* ═════════ طبقة الفيديو ═════════ */

/* البانر المحروق يُعاد رسمه بمكانه بعد أي تكبير/ضبابية — الاسم والأرقام والعنوان ثابتة دائماً */
const BN_Y=1180, BN_F=140;
const _bn=document.createElement('canvas'); _bn.width=1080; _bn.height=1920-BN_Y; const _bx=_bn.getContext('2d');
const _bg=_bx.createLinearGradient(0,0,0,BN_F); _bg.addColorStop(0,'rgba(0,0,0,0)'); _bg.addColorStop(1,'rgba(0,0,0,1)');
function restoreBanner(){
  _bx.globalCompositeOperation='source-over'; _bx.clearRect(0,0,1080,_bn.height);
  _bx.drawImage(VF,0,BN_Y,1080,_bn.height,0,0,1080,_bn.height);
  _bx.globalCompositeOperation='destination-in'; _bx.fillStyle=_bg; _bx.fillRect(0,0,1080,_bn.height);
  _bx.globalCompositeOperation='source-over'; X.drawImage(_bn,0,BN_Y); }

const PUNCH=[ /* [t0, ذروة, مدة, cx, cy, رجّة] */
  [0.00, 1.12, 0.50, 540, 700, 0],    // الهوك
  [2.62, 1.06, 0.40, 540, 620, 0],    // «الكوستك»
  [10.00,1.07, 0.40, 540, 600, 0],    // «99»
  [20.83,1.09, 0.45, 540, 700, 14],   // الشوكات ترفع — حركة ثقيلة
  [23.26,1.06, 0.35, 540, 640, 8],    // «يحرق»
];
const PUSH=[ /* [s, e, z0, z1, cx, cy] */
  [4.50, 6.11, 1.00, 1.045, 540, 620],
  [12.41,13.78,1.00, 1.035, 540, 600],
  [16.37,17.87,1.00, 1.04, 540, 600],
  [26.73,32.28,1.00, 1.09, 540, 640],   // المستودع ← كرت الطلب بلا قطع
];
function vzoom(t){
  let s=1,cx=540,cy=640,dx=0,dy=0;
  for(const p of PUSH) if(t>=p[0]&&t<p[1]){ s*=lp(p[2],p[3],eio(P(t,p[0],p[1]))); cx=p[4]; cy=p[5]; }
  for(const p of PUNCH) if(t>=p[0]&&t<p[0]+p[2]){ const u=P(t,p[0],p[0]+p[2]); s*=1+(p[1]-1)*(1-eo(u)); cx=p[3]; cy=p[4];
    if(p[5]){ const d=(1-u)*(1-u)*p[5]; dx+=Math.sin(t*95)*d; dy+=Math.cos(t*73)*d*0.6; } }
  if(s===1&&!dx&&!dy) return;
  X.save(); X.translate(cx+dx,cy+dy); X.scale(s,s); X.translate(-cx,-cy); X.drawImage(VF,0,0,W,H); X.restore();
  restoreBanner(); }

/* ضبابية الخلفية خلف المنتج (PIP + كرت الطلب) — العين تروح للمنتج */
const BLUR=[[6.11,8.22,0.22,0.12],[29.85,32.28,0.35,0]];
function bgblur(t){ let k=0; for(const b of BLUR) k=Math.max(k,win(t,b[0],b[1],b[2],b[3])); if(k<=0) return;
  X.save(); X.filter='blur('+(16*k).toFixed(1)+'px)'; X.translate(540,640); X.scale(1.05,1.05); X.translate(-540,-640); X.drawImage(VF,0,0,W,H); X.restore();
  restoreBanner(); }

/* صورة المنتج (دقة عالية) فوق البانر — حافتها تذوب في تدرّج البانر */
const IMR=1320, IMF=170;
const _im=document.createElement('canvas'); _im.width=1080; _im.height=IMR; const _ix=_im.getContext('2d');
const _ig=_ix.createLinearGradient(0,IMR-IMF,0,IMR); _ig.addColorStop(0,'rgba(0,0,0,1)'); _ig.addColorStop(1,'rgba(0,0,0,0)');
function drawPhoto(img,fx,fy,ax,ay,k){
  const dw=img.width*k, dh=img.height*k; const dx=clamp(ax-fx*dw,1080-dw,0), dy=clamp(ay-fy*dh,IMR-dh,0);
  _ix.globalCompositeOperation='source-over'; _ix.clearRect(0,0,1080,IMR); _ix.drawImage(img,dx,dy,dw,dh);
  _ix.globalCompositeOperation='destination-in'; _ix.fillStyle=_ig; _ix.fillRect(0,0,1080,IMR); _ix.globalCompositeOperation='source-over';
  X.drawImage(_im,0,0); }
function photos(t){ const im=IMG.pour; if(!im) return;
  if(t>=0.55&&t<1.40) drawPhoto(im,0.74,0.30,600,620,lp(1.24,1.34,eo(P(t,0.55,1.40))));   // هوك: المغرفة والرقائق تنصب
  if(t>=8.22&&t<9.26) drawPhoto(im,0.62,0.62,540,660,lp(1.62,1.74,P(t,8.22,9.26)));        // «قشور»
}

/* تعتيم كحلي فوق البانر بس — للحظات اللي فيها رسم */
const DIMS=[ [0.00,1.45,0.30,0,0.15], [6.11,8.22,0.45,0.25,0.12], [9.26,12.41,0.40,0.2,0.2], [13.45,17.93,0.30,0.3,0.25],
             [22.33,24.83,0.36,0.2,0.2], [25.08,29.73,0.28,0.3,0.3], [29.80,32.28,0.50,0.45,0] ];
function dim(t){ let a=0; for(const d of DIMS) a=Math.max(a,d[2]*win(t,d[0],d[1],d[3],d[4])); if(a<=0) return;
  const g=X.createLinearGradient(0,0,0,1310); g.addColorStop(0,rgba(BG,a)); g.addColorStop(0.78,rgba(BG,a*0.85)); g.addColorStop(1,rgba(BG,0));
  X.fillStyle=g; X.fillRect(0,0,1080,1310); }

/* Whip-pan: الصورة تنسحب بضبابية حركة على القطع — مرتين بس */
const WHIP=[[1.40,1],[17.87,1]], WH=0.12, WA=300;
const _wc=document.createElement('canvas'); _wc.width=1080; _wc.height=1310; const _wx=_wc.getContext('2d');
const _wo=document.createElement('canvas'); _wo.width=1080; _wo.height=1310; const _wox=_wo.getContext('2d');
const _wg=_wox.createLinearGradient(0,1150,0,1310); _wg.addColorStop(0,'rgba(0,0,0,1)'); _wg.addColorStop(1,'rgba(0,0,0,0)');
function whip(t){ for(const w of WHIP){ const u=(t-w[0])/WH; if(u<-1||u>1) continue;
  const sh=WA*Math.sign(u||1)*Math.pow(1-Math.abs(u),2)*(u<0?-1:1), spread=Math.abs(sh)*0.7, N=9;
  _wx.clearRect(0,0,1080,1310); _wx.drawImage(C,0,0,1080,1310,0,0,1080,1310);
  _wox.globalCompositeOperation='source-over'; _wox.clearRect(0,0,1080,1310);
  for(let i=0;i<N;i++){ _wox.globalAlpha=i?0.22:1; _wox.drawImage(_wc,sh+(i-(N-1)/2)*spread/N*2,0); }
  _wox.globalAlpha=1; _wox.globalCompositeOperation='destination-in'; _wox.fillStyle=_wg; _wox.fillRect(0,0,1080,1310); _wox.globalCompositeOperation='source-over';
  X.drawImage(_wo,0,0);
  const fa=0.22*Math.pow(1-Math.abs(u),3); if(fa>0.01){ X.fillStyle='rgba(255,255,255,'+fa+')'; X.fillRect(0,0,1080,1180); } } }

/* فينييت سينمائي خفيف فوق البانر */
function vignette(t){ const g=X.createRadialGradient(540,620,380,540,620,1050); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,0.38)');
  X.save(); X.fillStyle=g; X.fillRect(0,0,1080,1180); const g2=X.createLinearGradient(0,1180,0,1300); g2.addColorStop(0,'rgba(0,0,0,0.12)'); g2.addColorStop(1,'rgba(0,0,0,0)');
  X.fillStyle=g2; X.fillRect(0,1180,1080,120); X.restore(); }

/* ═════════ عرض المنتج (مقصوص) — دائرة زرقاء · حلقات · وميض ضوء · ظل ═════════ */
const _sc=document.createElement('canvas'); const _sx=_sc.getContext('2d');
function hero(t,t0,cx,cy,R,bagH,a){
  const bag=IMG.bag; if(!bag) return; const k=P(t,t0,t0+0.45), kc=ob(P(t,t0,t0+0.40)), kb=eo5(P(t,t0+0.08,t0+0.62));
  X.save(); X.globalAlpha=a;
  // هالة خارجية
  const hg=X.createRadialGradient(cx,cy,R*0.6,cx,cy,R*1.55); hg.addColorStop(0,rgba(ACC,0.45*k)); hg.addColorStop(1,rgba(ACC,0)); X.fillStyle=hg; X.beginPath(); X.arc(cx,cy,R*1.55,0,7); X.fill();
  // الدائرة الزرقاء
  const r=R*Math.max(0,kc); if(r>1){ const g=X.createRadialGradient(cx-R*0.3,cy-R*0.35,R*0.1,cx,cy,r); g.addColorStop(0,mix(ACC,'#FFFFFF',0.28)); g.addColorStop(0.55,ACC); g.addColorStop(1,mix(ACC,BG,0.45));
    X.save(); X.shadowColor=rgba(ACC,0.6); X.shadowBlur=60; X.fillStyle=g; X.beginPath(); X.arc(cx,cy,r,0,7); X.fill(); X.restore();
    X.save(); X.strokeStyle='rgba(255,255,255,0.35)'; X.lineWidth=3; X.beginPath(); X.arc(cx,cy,r-6,0,7); X.stroke(); X.restore(); }
  // تموّج حلقتين عند الدخول
  for(let i=0;i<2;i++){ const u=P(t,t0+0.10+i*0.16,t0+0.95+i*0.16); if(u<=0||u>=1) continue;
    X.save(); X.globalAlpha=a*(1-u)*0.9; X.strokeStyle=i?rgba(ACC,1):'#FFFFFF'; X.lineWidth=4*(1-u)+1; X.beginPath(); X.arc(cx,cy,R*(1+0.55*eo(u)),0,7); X.stroke(); X.restore(); }
  // حلقة متقطّعة تدور ببطء
  X.save(); X.globalAlpha=a*0.55*k; X.strokeStyle='#FFFFFF'; X.lineWidth=3; X.setLineDash([4,16]); X.lineDashOffset=-t*40;
  X.translate(cx,cy); X.rotate(t*0.25); X.beginPath(); X.arc(0,0,R*1.14,0,7); X.stroke(); X.restore();
  // الكيس: يطلع من تحت مايل ثم يطفو
  const bw=bagH*bag.width/bag.height, bob=Math.sin((t-t0)*2.4)*6*kb, rot=lp(-0.16,-0.05,kb)+Math.sin((t-t0)*1.3)*0.012;
  const by=cy+(1-kb)*170+bob, sc=lp(0.82,1,kb);
  // ظل تحت الكيس
  X.save(); X.globalAlpha=a*0.55*kb; const sg=X.createRadialGradient(cx,cy+bagH*0.47,4,cx,cy+bagH*0.47,bw*0.55); sg.addColorStop(0,'rgba(0,0,0,0.75)'); sg.addColorStop(1,'rgba(0,0,0,0)');
  X.fillStyle=sg; X.save(); X.translate(cx,cy+bagH*0.47); X.scale(1,0.22); X.beginPath(); X.arc(0,0,bw*0.55,0,7); X.fill(); X.restore(); X.restore();
  // رسم الكيس + وميض ضوء مقصوص على شكله
  _sc.width=Math.ceil(bw); _sc.height=Math.ceil(bagH); _sx.clearRect(0,0,_sc.width,_sc.height); _sx.globalCompositeOperation='source-over'; _sx.drawImage(bag,0,0,bw,bagH);
  const sw=P(t,t0+0.75,t0+1.35); if(sw>0&&sw<1){ _sx.globalCompositeOperation='source-atop'; const x0=lp(-bw*0.6,bw*1.4,eio(sw));
    const lg=_sx.createLinearGradient(x0-bw*0.25,0,x0+bw*0.25,bagH*0.35); lg.addColorStop(0,'rgba(255,255,255,0)'); lg.addColorStop(0.5,'rgba(255,255,255,0.75)'); lg.addColorStop(1,'rgba(255,255,255,0)');
    _sx.fillStyle=lg; _sx.fillRect(0,0,_sc.width,_sc.height); _sx.globalCompositeOperation='source-over'; }
  X.save(); X.globalAlpha=a*Math.min(1,kb*1.6); X.translate(cx,by); X.rotate(rot); X.scale(sc,sc);
  X.shadowColor='rgba(0,0,0,0.5)'; X.shadowBlur=40; X.shadowOffsetY=20; X.drawImage(_sc,-bw/2,-bagH/2); X.restore();
  X.restore(); }

/* شارة بخط إشارة للمنتج */
function callout(t,s,t0,t1,px,py,cx,cy){ const a=win(t,t0,t1,0.01,0.15); if(a<=0) return; const kl=eo(P(t,t0,t0+0.28)), kp=P(t,t0+0.15,t0+0.45);
  X.save(); X.globalAlpha=a; X.strokeStyle='rgba(255,255,255,0.9)'; X.lineWidth=3;
  X.beginPath(); X.moveTo(px,py); X.lineTo(lp(px,cx,kl),lp(py,cy,kl)); X.stroke();
  X.fillStyle='#FFFFFF'; X.beginPath(); X.arc(px,py,8,0,7); X.fill(); X.strokeStyle=rgba(ACC,0.9); X.lineWidth=4; X.beginPath(); X.arc(px,py,15+6*Math.sin(t*6),0,7); X.stroke();
  if(kp>0){ const s2=ob(kp); X.translate(cx,cy); X.scale(s2,s2); X.translate(-cx,-cy); X.globalAlpha=a*Math.min(1,kp*2.5); pill(s,cx,cy,40,ACC); }
  X.restore(); }

/* ═════════ الرسوم ═════════ */

/* 1) الهوك */
function hook(t){ if(t>1.55) return; const out=1-P(t,1.30,1.52); if(out<=0) return;
  const kp=P(t,0.20,0.42);
  if(kp>0){ const s='مواد أولية للمنظفات', fs=38, w=tw(s,fs,800)+70, h=72, x=540-w/2, y=560-h/2;
    X.save(); X.globalAlpha=Math.min(1,kp*2)*out; X.translate((1-eo(kp))*50,0);
    rrect(x,y,w,h,36); X.fillStyle=rgba(BG,0.6); X.fill(); X.lineWidth=3; X.strokeStyle=ACC; X.stroke();
    txt(s,540,y+h/2+2,fs,{w:800}); X.restore(); }
  const k=P(t,0.06,0.30);
  if(k>0){ const sc=1+0.55*(1-eo(k)); X.save(); X.globalAlpha=Math.min(1,k*3)*out;
    X.translate(540,690); X.scale(sc,sc); X.translate(-540,-690); txt('كوستك صودا',540,690,150,{w:900,stroke:20,sh:30}); X.restore(); }
  const ku=eo(P(t,0.30,0.58));
  if(ku>0){ const w=560*ku; X.save(); X.globalAlpha=out; X.shadowColor=rgba(ACC,0.8); X.shadowBlur=18; X.fillStyle=ACC; rrect(540-w/2,792,w,10,5); X.fill(); X.restore(); }
}

/* 2) ملصقات قصيرة تطابق اللقطة */
const LABELS=[['وصول الحاوية',1.48,2.58],['مناولة وتحميل',3.48,4.45]];
function labels(t){ for(const L of LABELS){ const a=win(t,L[1],L[2],0.22,0.18); if(a<=0) continue; const k=eo(P(t,L[1],L[1]+0.3));
  const fs=40, w=tw(L[0],fs,800)+80, h=74, xr=1010, x=xr-w, y=228;
  X.save(); X.globalAlpha=a; X.translate((1-k)*60,0); glass(x,y,w,h,20,0.72);
  X.fillStyle=ACC; rrect(xr-16,y+15,6,h-30,3); X.fill(); txt(L[0],xr-32,y+h/2+2,fs,{w:800,al:'right'}); X.restore(); } }

/* 3) المنتج — «هيدروكسيد الصوديوم» */
function pack(t){ if(t<6.11||t>8.22) return; const a=win(t,6.11,8.22,0.01,0.14);
  hero(t,6.11,540,560,290,600,a);
  callout(t,'قشور',6.95,8.12,470,400,215,320);
  callout(t,'25 كغ',7.45,8.12,690,585,860,700); }

/* 4) الرقم المؤكد: عدّاد دائري يمتلئ ويضرب على 99% */
function gauge(t){ if(t<9.26||t>12.41) return; const a=win(t,9.26,12.41,0.22,0.18), k=eo(P(t,9.26,9.6));
  const cx=540, cy=470, R=170;
  X.save(); X.globalAlpha=a; X.translate(cx,cy); X.scale(0.85+0.15*k,0.85+0.15*k); X.translate(-cx,-cy);
  X.save(); X.shadowColor='rgba(0,0,0,0.5)'; X.shadowBlur=50; X.shadowOffsetY=16; X.fillStyle=rgba(BG,0.82); X.beginPath(); X.arc(cx,cy,R+44,0,7); X.fill(); X.restore();
  X.lineCap='round'; X.lineWidth=24; X.strokeStyle='rgba(255,255,255,0.13)'; X.beginPath(); X.arc(cx,cy,R,0,7); X.stroke();
  const f=eo(P(t,9.40,10.00)), n=Math.round(99*f), a0=-Math.PI/2;
  if(f>0){ X.save(); X.shadowColor=rgba(ACC,0.9); X.shadowBlur=26; X.strokeStyle=ACC; X.beginPath(); X.arc(cx,cy,R,a0,a0+Math.PI*2*0.99*f); X.stroke(); X.restore();
    const ea=a0+Math.PI*2*0.99*f; X.fillStyle='#FFFFFF'; X.beginPath(); X.arc(cx+R*Math.cos(ea),cy+R*Math.sin(ea),9,0,7); X.fill(); }
  for(let i=0;i<60;i++){ const an=a0+i/60*Math.PI*2, r1=R+30, r2=R+(i%5?36:42); X.strokeStyle=rgba('#FFFFFF',i/60<=0.99*f?0.55:0.15); X.lineWidth=2;
    X.beginPath(); X.moveTo(cx+r1*Math.cos(an),cy+r1*Math.sin(an)); X.lineTo(cx+r2*Math.cos(an),cy+r2*Math.sin(an)); X.stroke(); }
  txt('التركيز',cx,cy-78,36,{w:800,c:'rgba(255,255,255,0.78)'});
  const bump=t>=10.00?1+0.16*(1-eo(P(t,10.00,10.30))):1;
  X.save(); X.translate(cx,cy+12); X.scale(bump,bump); X.translate(-cx,-(cy+12)); txt(n+'%',cx,cy+12,124,{w:900}); X.restore();
  X.restore();
  const pa=P(t,11.06,11.36); if(pa>0){ X.save(); X.globalAlpha=a*pa; X.translate(540,744+(1-eo(pa))*16); const s=ob(pa); X.scale(s,s); X.translate(-540,-744); pill('نقاوة عالية جداً',540,744,42,ACC); X.restore(); }
}

/* 5) الاستخدام كما قاله: كوستك صودا + زيوت ← صابون صلب */
function usage(t){ if(t<13.48||t>17.93) return; const a=win(t,13.48,17.93,0.01,0.22);
  const items=[{s:'كوستك صودا',t0:13.57},{op:'+',t0:14.58},{s:'زيوت',t0:14.65},{op:'arrow',t0:16.58},{s:'صابون صلب',t0:16.71,acc:1}];
  const fs=46, ph=100, pad=34, gap=20, y=430;
  const ws=items.map(it=>it.op?(it.op==='arrow'?84:50):tw(it.s,fs,900)+pad*2), total=ws.reduce((p,q)=>p+q,0)+gap*(items.length-1), scl=Math.min(1,930/total);
  X.save(); X.globalAlpha=a; X.translate(540,y); X.scale(scl,scl); X.translate(-540,-y);
  let x=540+total/2;
  items.forEach((it,i)=>{ const w=ws[i], cx=x-w/2; x-=w+gap; const k=P(t,it.t0,it.t0+0.32); if(k<=0) return; const s=ob(k);
    X.save(); X.globalAlpha*=Math.min(1,k*2.5); X.translate(cx,y); X.scale(s,s); X.translate(-cx,-y);
    if(it.op==='+') txt('+',cx,y+2,66,{w:900,stroke:10,sh:16});
    else if(it.op==='arrow'){ X.save(); X.shadowColor='rgba(0,0,0,0.5)'; X.shadowBlur=14; arrowL(cx,y,76,'#FFFFFF'); X.restore(); }
    else if(it.acc){ X.save(); X.shadowColor=rgba(ACC,0.7); X.shadowBlur=36; rrect(cx-w/2,y-ph/2,w,ph,ph/2); X.fillStyle=ACC; X.fill(); X.restore(); txt(it.s,cx,y+3,fs,{w:900}); }
    else { glass(cx-w/2,y-ph/2,w,ph,ph/2,0.82); txt(it.s,cx,y+3,fs,{w:900}); }
    X.restore(); });
  X.restore(); }

/* 6) تحذير السلامة — فلات تحريري (لوحة سلامة صناعية): شريط بزوايا حادة · خطوط تحذير · خط عريض · مثلث خطّي */
function warn(t){ const s0=22.38, s1=24.80; if(t<s0||t>s1) return;
  const kin=eo(P(t,s0,s0+0.26)), kout=eo(P(t,s1-0.22,s1)), hit=t>=23.26?1-P(t,23.26,23.66):0;
  const y=300, h=212, wv=1080*kin*(1-kout), shx=hit>0?Math.sin(t*90)*7*hit:0;
  X.save(); X.beginPath(); X.rect(1080-wv,y-4,wv,h+8); X.clip(); X.translate(shx,0);
  X.fillStyle=rgba(BG,0.95); X.fillRect(0,y,1080,h);
  X.save(); X.beginPath(); X.rect(0,y,170,h); X.clip(); const off=(t*90)%64;
  for(let x=-h-64+off;x<240;x+=64){ X.fillStyle=ACC; X.beginPath(); X.moveTo(x,y+h); X.lineTo(x+32,y+h); X.lineTo(x+32+h,y); X.lineTo(x+h,y); X.closePath(); X.fill(); }
  X.restore();
  X.fillStyle=ACC; X.fillRect(1058,y,22,h);
  X.fillStyle='rgba(255,255,255,0.16)'; X.fillRect(170,y,868,2); X.fillRect(170,y+h-2,868,2);
  if(hit>0){ const sx=lp(1040,180,1-hit); X.fillStyle='rgba(255,255,255,'+(0.85*hit)+')'; X.fillRect(sx-3,y,6,h); }
  const tr=1020, kt=eo(P(t,s0+0.12,s0+0.40));
  X.save(); X.beginPath(); X.rect(tr-600*kt,y,600*kt+20,h); X.clip(); txt('تحذير',tr,y+74,96,{w:900,al:'right'}); X.restore();
  const ks=eo(P(t,s0+0.28,s0+0.55)); if(ks>0){ X.save(); X.globalAlpha=ks; txt('تحرق اليد عند الملامسة المباشرة',tr,y+160+(1-ks)*10,40,{w:800,al:'right',c:'rgba(255,255,255,0.88)'}); X.restore(); }
  const ix=tr-tw('تحذير',96,900)-78, iy=y+78, kd=P(t,s0+0.20,s0+0.62);
  if(kd>0){ const pts=[[0,-46],[52,42],[-52,42],[0,-46]]; let seg=[],tot=0; for(let q=0;q<3;q++){const L=Math.hypot(pts[q+1][0]-pts[q][0],pts[q+1][1]-pts[q][1]); seg.push(L); tot+=L;}
    X.save(); X.translate(ix,iy); const sc=1+0.2*hit; X.scale(sc,sc); X.strokeStyle='#FFFFFF'; X.lineWidth=7; X.lineJoin='miter'; X.lineCap='square';
    let rem=tot*eo(kd); X.beginPath(); X.moveTo(...pts[0]);
    for(let q=0;q<3&&rem>0;q++){ const f=Math.min(1,rem/seg[q]); X.lineTo(pts[q][0]+(pts[q+1][0]-pts[q][0])*f, pts[q][1]+(pts[q+1][1]-pts[q][1])*f); rem-=seg[q]; }
    X.stroke(); if(kd>=1){ X.fillStyle=ACC; X.fillRect(-5,-14,10,32); X.fillRect(-5,24,10,10); } X.restore(); }
  X.restore(); }

/* 6.5) الكلمة المفتاحية لحالها — تطلع وتنمطّ بالكشيدة (قـــشـــور · يـــحـــرق) */
const JOINF='بتثجحخسشصضطظعغفقكلمنهيئ', ARL=/[\u0621-\u064A]/;
function slots(w){ const pre=w.startsWith('ال')?2:0, s=[];
  for(let i=pre;i<w.length-1;i++){ const a=w[i], b=w[i+1]; if(!JOINF.includes(a)||!ARL.test(b)) continue; if(a==='ل'&&'اأإآ'.includes(b)) continue; s.push(i); }
  return s.length>3?[...new Set([s[0],s[Math.floor(s.length/2)],s[s.length-1]])]:s; }
function stretched(ph,n){ return ph.split(' ').map(w=>{ const sl=slots(w); let o=''; for(let i=0;i<w.length;i++){ o+=w[i]; if(sl.includes(i)) o+='\u0640'.repeat(n); } return o; }).join(' '); }
function kwCap(t){ const c=CAPS.find(c=>c.kw&&t>=c.s&&t<c.e); if(!c) return;
  const ph=c.w.map(w=>w.t).join(' '), NM=3; let fs=120; while(tw(stretched(ph,NM),fs,900)>800&&fs>70) fs-=6;
  const k=NM*eio(P(t,c.s+0.06,c.s+0.40)), n0=Math.floor(k), n1=Math.min(NM,n0+1), fr=k-n0;
  const s1=stretched(ph,n1), w0=tw(stretched(ph,n0),fs,900), w1=tw(s1,fs,900), tgt=w0+(w1-w0)*fr, sx=tgt/w1;
  const kp=P(t,c.s,c.s+0.14), a=Math.min(1,kp*2)*(1-P(t,c.e-0.09,c.e)), sc=1+0.16*(1-eo(kp)), y=1078;
  X.save(); X.globalAlpha=a; X.translate(540,y); X.scale(sc*sx,sc); X.translate(-540,-y);
  txt(s1,540,y,fs,{w:900,c:ACC,stroke:Math.round(fs*0.13),sh:22}); X.restore(); }

/* 7) دعوة للتعليق — صندوق ينكتب فيه كلامه */
function bubble(cx,cy,c){ X.save(); X.fillStyle=c; rrect(cx-24,cy-19,48,34,10); X.fill(); X.beginPath(); X.moveTo(cx+8,cy+14); X.lineTo(cx+18,cy+26); X.lineTo(cx+18,cy+12); X.closePath(); X.fill(); X.restore(); }
function comment(t){ if(t<25.13||t>29.73) return; const a=win(t,25.13,29.73,0.25,0.25), k=eo(P(t,25.13,25.48));
  const w=860, h=124, x=110, y=340;
  X.save(); X.globalAlpha=a; X.translate(0,(1-k)*40);
  bubble(x+w-28,y-50,ACC); txt('التعليقات',x+w-66,y-48,36,{w:800,al:'right',stroke:7});
  X.save(); X.shadowColor='rgba(0,0,0,0.45)'; X.shadowBlur=40; X.shadowOffsetY=12; rrect(x,y,w,h,h/2); X.fillStyle='rgba(255,255,255,0.97)'; X.fill(); X.restore();
  const bs=1+0.18*Math.sin(Math.PI*P(t,27.60,27.90));
  X.save(); X.translate(x+h/2,y+h/2); X.scale(bs,bs); X.beginPath(); X.arc(0,0,44,0,7); X.fillStyle=ACC; X.fill();
  X.beginPath(); X.moveTo(-18,0); X.lineTo(14,-16); X.lineTo(6,0); X.lineTo(14,16); X.closePath(); X.fillStyle='#FFFFFF'; X.fill(); X.restore();
  const full='أهم إجراءات السلامة؟', n=Math.floor(full.length*P(t,26.20,27.54)), tx=x+w-46, ty=y+h/2+3;
  if(n<=0) txt('اكتب تعليقك…',tx,ty,42,{w:700,al:'right',c:rgba(BG,0.38)});
  else { const s=full.slice(0,n); txt(s,tx,ty,46,{w:900,al:'right',c:BG});
    if(n<full.length||Math.floor(t*3)%2===0){ const cw=tw(s,46,900); X.fillStyle=ACC; X.fillRect(tx-cw-12,ty-26,5,52); } }
  X.restore(); }

/* 8) كرت الطلب — المنتج بدائرته + يربط بأرقام البانر الأصلية تحته */
function chev(cx,cy,s,c){ X.save(); X.strokeStyle=c; X.lineWidth=9; X.lineCap='round'; X.lineJoin='round'; X.beginPath(); X.moveTo(cx-s,cy-s*0.5); X.lineTo(cx,cy+s*0.5); X.lineTo(cx+s,cy-s*0.5); X.stroke(); X.restore(); }
function cta(t){ if(t<29.80) return;
  hero(t,29.85,540,420,200,410,1);
  const k2=eo(P(t,30.05,30.35)); if(k2>0){ X.save(); X.globalAlpha=k2; txt('كوستك صودا',540,742+(1-k2)*24,116,{w:900,stroke:16,sh:26}); X.restore(); }
  const k3=eo(P(t,30.25,30.52)); if(k3>0){ X.save(); X.globalAlpha=k3; txt('قشور  ·  تركيز ⁦99%⁩',540,840+(1-k3)*18,46,{w:800,stroke:7}); X.restore(); }
  const k4=P(t,30.43,30.73);
  if(k4>0){ X.save(); X.globalAlpha=Math.min(1,k4*2); X.translate(540,950); const sc=0.85+0.15*ob(k4); X.scale(sc,sc); X.translate(-540,-950); pill('للطلب والتوريد تواصل معنا',540,950,48,ACC); X.restore(); }
  const k5=P(t,30.73,31.03);
  if(k5>0){ const bob=Math.sin((t-30.73)*7)*8;
    X.save(); X.globalAlpha=k5*0.95; chev(540,1062+bob,30,'#FFFFFF'); X.globalAlpha=k5*0.55; chev(540,1098+bob,30,'#FFFFFF'); X.restore();
    const pulse=0.55+0.45*Math.sin((t-30.73)*6);
    X.save(); X.globalAlpha=k5*pulse; rrect(108,1650,824,94,47); X.lineWidth=5; X.strokeStyle='#FFFFFF'; X.shadowColor=rgba(ACC,0.9); X.shadowBlur=20; X.stroke(); X.restore(); }
}


/* 9) نهاية البراند (توقيع ثابت لكل فيديو): كحلي يطلع من تحت ← «المراسيل» ممطوطة تنضم ← تعريف ← تواصل ← عنوان */
const ID0=32.28, ID1=35.28;
function ident(t){ if(t<31.95) return;
  const kw=eio(P(t,31.95,ID0)), top=1920*(1-kw);
  const g=X.createLinearGradient(0,0,0,1920); g.addColorStop(0,'#0A0F1C'); g.addColorStop(0.45,'#132340'); g.addColorStop(1,'#0A0F1C');
  X.save(); X.fillStyle=g; X.fillRect(0,top,1080,1920-top); if(kw<1){ X.fillStyle=ACC; X.fillRect(0,top-10,1080,10); } X.restore();
  if(t<ID0) return; const u=t-ID0, cy=760;
  const kc=eo(P(u,0,0.6));
  const hg=X.createRadialGradient(540,cy,40,540,cy,520*kc+1); hg.addColorStop(0,rgba(ACC,0.42)); hg.addColorStop(1,rgba(ACC,0)); X.fillStyle=hg; X.fillRect(0,cy-560,1080,1120);
  [[255,0.5,[]],[318,0.35,[5,18]]].forEach(([R,a,d],i)=>{ const k=eo(P(u,0.05+i*0.1,0.7+i*0.1)); if(k<=0) return;
    X.save(); X.globalAlpha=a*k; X.strokeStyle=i?'#FFFFFF':ACC; X.lineWidth=3; X.setLineDash(d); X.lineDashOffset=-u*40; X.beginPath(); X.arc(540,cy,R*lp(0.85,1,k),0,7); X.stroke(); X.restore(); });
  // الاسم: يطلع ممطوط (3 كشيدات) وينضم للاسم الطبيعي — نفس حركة الكلمات المفتاحية = توقيع البراند
  const ka=P(u,0.0,0.18), kn=eio(P(u,0.15,0.80)), k=3*(1-kn), n1=Math.ceil(k-1e-6), n0=Math.max(0,n1-1), fr=n1?(k-n0):0;
  const fs=172, sN=stretched('المراسيل',n1), w1=tw(sN,fs,900), w0=tw(stretched('المراسيل',n0),fs,900), wt=n1?(w0+(w1-w0)*fr):w1, sx=wt/w1, sc=lp(1.08,1,eo(P(u,0,0.8)))*Math.min(1,960/(wt*lp(1.08,1,eo(P(u,0,0.8)))));
  if(ka>0){ X.save(); X.globalAlpha=Math.min(1,ka*1.5); X.translate(540,cy); X.scale(sc*sx,sc); X.translate(-540,-cy); txt(sN,540,cy,fs,{w:900,stroke:14,sh:30}); X.restore(); }
  const ku=eo(P(u,0.78,1.08)); if(ku>0){ const w=260*ku; X.save(); X.shadowColor=rgba(ACC,0.9); X.shadowBlur=18; X.fillStyle=ACC; rrect(540-w/2,cy+96,w,10,5); X.fill(); X.restore(); }
  const kt=eo(P(u,0.90,1.20)); if(kt>0){ X.save(); X.globalAlpha=kt; txt('لتجارة المواد الأولية للمنظفات',540,cy+160+(1-kt)*14,42,{w:800,c:'rgba(255,255,255,0.9)',stroke:5}); X.restore(); }
  const kl=eo(P(u,1.20,1.45)); if(kl>0){ X.save(); X.globalAlpha=kl; txt('للطلب والتواصل',540,1110,38,{w:800,c:'rgba(255,255,255,0.75)',stroke:4}); X.restore(); }
  [['0772-112-7339',1200,1.30],['0771-679-1043',1310,1.42]].forEach(([n,y,t0])=>{ const kp=P(u,t0,t0+0.3); if(kp<=0) return;
    X.save(); X.globalAlpha=Math.min(1,kp*2); X.translate(540,y); const s2=ob(kp); X.scale(s2,s2); X.translate(-540,-y); pill(n,540,y,50,ACC); X.restore(); });
  const kd=eo(P(u,1.65,1.95)); if(kd>0){ X.save(); X.globalAlpha=kd; txt('الموصل – الأيمن – شارع السايلو',540,1420,36,{w:800,c:'rgba(255,255,255,0.7)',stroke:4}); X.restore(); }
}

SCENE_LIST.push(['m_vzoom',vzoom,'video'],['m_blur',bgblur,'video'],['m_photos',photos,'video'],['m_dim',dim,'video'],['m_whip',whip,'video'],['m_vig',vignette,'video']);
SCENE_LIST.push(['m_hook',hook],['m_labels',labels],['m_pack',pack],['m_gauge',gauge],['m_usage',usage],['m_warn',warn],['m_kw',kwCap],['m_comment',comment],['m_cta',cta]);
SCENE_LIST.push(['m_ident',ident]);   // آخر شي — فوق كرت الطلب وقت المسح
})();

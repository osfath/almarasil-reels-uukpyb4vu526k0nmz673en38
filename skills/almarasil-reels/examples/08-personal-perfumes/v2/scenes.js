/* ═══ العطور الشخصية (08) — v2 · Promax · أكشن + الشاشة أكثر ═══
   ملاحظات v2 (صاحب الشغل): فصلات بين الجُمل · المشاهد مكررة ← قلّل وغيّر · الشاشة أكثر واحترافية.
   كل التوقيت مربوط بالكلمات: T('كلمة', رقم الظهور, إزاحة) من CAPS (يتغير التايم-لاين ← ما ينكسر شي).
   الهيكل: هوك (مرور فوق العيّنات + انقسام «يقلّد») ← صفحة المشكلة (قنينتين: المنافس ينسخ اللون/الشكل/الملصق ← العطر يطلع من منتجك بس ← الشكل ينمسح والعطر يبقى)
           ← وقفة ← الجركن «والحل» ← صفحة المواصفة (صورة ملصق PARNZO حقيقية) ← علبتين العيّنات ← الهرم ← وقفة ← كروت «مستوحى من» ← وقفة ← صفحة البراند.
   النص فوق الفيديو: ⛔ بلا ستروك ولا صندوق — ظل للكلمة نفسها بزاوية بسيطة وبعد بسيط. ⛔ كتل فاصلة. فلات تحريري، بلا توهّج/ارتداد.
   ⛔ لا نص مخترع: كل كلمة على الشاشة من السكربت. */
(function(){
window.NOBAR = true; window.NO_OUTRO = true; window.CAP_STROKE = 0.085;
const PURP='#6B4BC2', NAVY='#0E1524', INKD='#16213A', GRAY='#A7AFBD', K=window.K07;
const IMG={};
const INSP=['carolina-herrera-212-vip-men','cacharel-amor-amor','tommy-hilfiger-tommy','kenzo-leau-pour-femme','kenzo-flower-original','sunnamusk-golden-dust-elixir','lancome-poeme','gucci-rush-2','joop-nightflight','armani-black-code'];
INSP.forEach(n=>{ const im=new Image(); im.src='assets/img/inspired/'+n+'.png'; IMG[n]=im; });
{ const im=new Image(); im.src='assets/img/parnzo-label-window.jpg'; IMG.label=im; }
const _init0 = window.init;
window.init = function(o){ const p=_init0(o); const th=(o&&o.theme)||{};
  window.ACC_TXT=th.accText||'#4FA3FF';
  for(const c of (o.cards||[])) SCENES.push({s:c.s,e:c.e,m:R_FULL,nocap:true});   // كابشن المحرّك (بالستروك) مطفي كله ← capBox()
  return Promise.all([p, ...Object.values(IMG).map(im=>(im.decode?im.decode():Promise.resolve()).catch(()=>console.error('⚠️ صورة ما انقرت: '+im.src)))]).then(a=>a[0]); };

/* ── أدوات ── */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lp=(a,b,k)=>a+(b-a)*k, P=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const _c01=k=>clamp(k,0,1); const eo=k=>1-Math.pow(1-_c01(k),3), eo5=k=>1-Math.pow(1-_c01(k),5), eio=k=>{k=_c01(k); return k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;};
function rgba(h,a){h=String(h).replace('#','');const n=parseInt(h,16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;}
function mixc(h1,h2,k){ const f=h=>{const n=parseInt(String(h).replace('#',''),16);return[n>>16&255,n>>8&255,n&255];}; const a=f(h1),b=f(h2); return `rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*_c01(k))).join(',')})`; }
function win(t,s,e,fi,fo){ if(t<s||t>e) return 0; return Math.min(fi?P(t,s,s+fi):1, fo?1-P(t,e-fo,e):1); }
const txt=K.txt, tw=K.tw, AT=()=>window.ACC_TXT||'#4FA3FF';
/* ── المراسي: T('كلمة', n=1, إزاحة) = بداية الظهور رقم n على التايم-لاين (من CAPS) ── */
let _W=null;
function T(w,n,o){ if(!_W){ _W={}; for(const c of (typeof CAPS!=='undefined'?CAPS:[])) for(const x of c.w){ (_W[x.t]=_W[x.t]||[]).push(x.s); } }
  const a=_W[w]; if(!a||!a[(n||1)-1]) { console.error('⚠️ مرساة ناقصة: '+w+'#'+(n||1)); return 999; } return a[(n||1)-1]+(o||0); }
let S=null;   // كل الأزمنة تنحسب مرة وحدة
function setup(){ if(S) return S; S={
  split:T('يقلّد'), pA:T('لون',1,-0.36), shape:T('الشكل'), lab:T('والملصق'), but:T('لكن'), scent:T('عطر'), ident:T('الهوية'), mem:T('والي'), memW:T('بذاكرة'), forget:T('نسى شكل'),
  sol:T('والحل'), solB:T('وفرناه'), pB:T('زيوت'), ind:T('صناعية'), ded:T('مخصصة'), det:T('للمنظفات'), cos:T('والكوزمتك'), choose:T('تختار'), link:T('وتربط'),
  cards:T('عطور'), grid:T('تختار',2), brand:T('ويا'), mar:T('المراسيل'), khal:T('خَلِّ'), lmon:T('لمنتجك'), hw:T('هويّة'), smell:T('تشمها') };
  S.PAGES=[[S.pA,S.sol-0.36,'push','zoom',problemPage,true],[S.pB,S.choose-0.36,'wipe','slide',specPage,true],[S.brand,99,'push',null,brandPage,false,200]];
  S.CARD_END=S.brand; const CD=[]; { let d=1.0; for(let i=0;i<10;i++){ CD.push(Math.max(0.25,d)); d*=0.715; } const s=CD.reduce((a,b)=>a+b,0), f=(S.grid-S.cards)/s; for(let i=0;i<10;i++) CD[i]*=f; }
  S.CD=CD; S.CT=[]; { let x=S.cards; CD.forEach(d=>{ S.CT.push(x); x+=d; }); }
  return S; }

/* ═════════ النص فوق الفيديو: ظل للكلمة نفسها (مرجع صاحب الشغل) ═════════ */
function stxt(s,x,y,fs,col){ const u=fs/70;
  X.save(); X.shadowColor='rgba(8,11,24,0.55)'; X.shadowBlur=7*u; X.shadowOffsetX=0; X.shadowOffsetY=0; txt(s,x,y,fs,{c:col}); X.restore();
  X.save(); X.shadowColor='rgba(8,11,24,0.92)'; X.shadowBlur=3*u; X.shadowOffsetX=5*u; X.shadowOffsetY=6*u; txt(s,x,y,fs,{c:col}); X.restore(); }
const CFS=70;
function capBox(t){ const s=setup(); const c=(typeof CAPS!=='undefined'?CAPS:[]).find(c=>t>=c.s&&t<c.e); if(!c||c.nocap) return; if(pageAt(t)||(t>=s.cards&&t<s.CARD_END+PW)) return;
  const ws=c.w.map(w=>({...w,ww:tw(w.t,CFS)})), sp=tw(' ',CFS)*1.1, n=ws.length, cut=n<=3?n:Math.ceil(n/2), lines=[ws.slice(0,cut),ws.slice(cut)].filter(l=>l.length);
  const ki=eo5(P(t,c.s,c.s+0.18)), ko=P(t,c.e-0.12,c.e), lh=Math.round(CFS*1.3), yb=1150;
  X.save(); X.globalAlpha*=ki*(1-ko); X.translate(0,(1-ki)*18);
  lines.forEach((ln,li)=>{ const lw=ln.reduce((a,w)=>a+w.ww,0)+sp*(ln.length-1), cy=yb-(lines.length-li-0.5)*lh; let xr=540+lw/2;
    ln.forEach(wd=>{ stxt(wd.t,xr-wd.ww/2,cy,CFS,(wd.hot&&t>=wd.s)?AT():'#FFFFFF'); xr-=wd.ww+sp; }); });
  X.restore(); }

/* ═════════ الصفحة البيضاء ═════════ */
function drawPageBase(t,header,top){ top=top||380;
  const H=1920; const g=X.createLinearGradient(0,0,0,H); g.addColorStop(0,'#F9FBFF'); g.addColorStop(1,'#EEF2FB'); X.fillStyle=g; X.fillRect(0,0,1080,H);
  for(let x=60;x<1080;x+=60){ const maj=x%240===60; X.strokeStyle=rgba(maj?PURP:ACC,maj?0.16:0.08); X.lineWidth=maj?2:1; X.beginPath(); X.moveTo(x,0); X.lineTo(x,H); X.stroke(); }
  for(let y=60;y<H;y+=60){ const maj=y%240===60; X.strokeStyle=rgba(maj?PURP:ACC,maj?0.16:0.08); X.lineWidth=maj?2:1; X.beginPath(); X.moveTo(0,y); X.lineTo(1080,y); X.stroke(); }
  X.strokeStyle=PURP; X.lineWidth=4; [[90,top,1],[990,top,-1],[90,1362,1],[990,1362,-1]].forEach(([x,y,s],i)=>{ const dy=i<2?1:-1; X.beginPath(); X.moveTo(x,y+36*dy); X.lineTo(x,y); X.lineTo(x+36*s,y); X.stroke(); });
  if(header){ txt('المراسيل',540,236,96,{c:PURP}); txt('لتجارة المواد الأولية للمنظفات',540,318,34,{c:ACC}); }     // ⛔ بلا خط تحت الشعار
  X.fillStyle=rgba(PURP,0.22); X.fillRect(140,1398,800,2); txt('للطلب والتواصل',540,1432,30,{c:rgba(INKD,0.7)}); K.contactRow(1492);
}
const PW=0.36, ZC=[760,900];   // مدة الانتقال · مركز زوم خروج صفحة المشكلة (قنينة منتجك)
window.CAP_DARK=t=>{ const s=setup(); for(const p of s.PAGES) if(t>=p[0]+PW*0.7&&t<p[1]+PW*0.3) return true; return false; };
const _pb=document.createElement('canvas'); _pb.width=1080; _pb.height=1920; const _pbx=_pb.getContext('2d');
function grabVideo(){ _pbx.clearRect(0,0,1080,1920); _pbx.drawImage(C,0,0); }
function pageAt(t){ const s=setup(); for(const p of s.PAGES){ if(t>=p[0]&&t<=p[1]+PW) return p; } return null; }
function pageBody(t,p){ drawPageBase(t,p[5],p[6]); p[4](t); }
function page(t){ const p=pageAt(t); if(!p) return; const [p0,p1,tin,tout]=p;
  const kin=t<p0+PW?eio(P(t,p0,p0+PW)):1, kout=t>p1?eio(P(t,p1,p1+PW)):0;
  if(tin==='push'&&kin<1){ grabVideo(); X.fillStyle=NAVY; X.fillRect(0,0,1080,1920); X.drawImage(_pb,0,-kin*1920);
    const y=(1-kin)*1920; X.save(); X.translate(0,y); pageBody(t,p); X.restore(); X.fillStyle=PURP; X.fillRect(0,y-10,1080,10); return; }
  if(tout==='slide'&&kout>0){ grabVideo(); const x=(1-kout)*1080; X.fillStyle=NAVY; X.fillRect(0,0,1080,1920);
    X.drawImage(_pb,x,0); X.save(); X.translate(x-1080,0); pageBody(t,p); X.restore(); X.fillStyle=PURP; X.fillRect(x-5,0,10,1920); return; }
  if(tout==='zoom'&&kout>0){ const s=1+4*Math.pow(kout,2.2); X.save(); X.globalAlpha=1-eo(P(t,p1+PW*0.30,p1+PW));            // يخترق قنينة منتجك ← الجركن
    X.translate(ZC[0],ZC[1]); X.scale(s,s); X.translate(-ZC[0],-ZC[1]); pageBody(t,p); X.restore(); return; }
  let clip=null; if(tin==='wipe'&&t<p0+PW) clip=kin;
  X.save(); if(clip!==null){ const sk=260, x0=lp(1080+sk,-sk,clip); X.beginPath(); X.moveTo(x0,0); X.lineTo(1080+sk,0); X.lineTo(1080+sk,1920); X.lineTo(x0-sk,1920); X.closePath(); X.clip(); }
  pageBody(t,p); X.restore();
  if(clip!==null&&clip>0&&clip<1){ const sk=260, x0=lp(1080+sk,-sk,clip); X.save(); X.strokeStyle=PURP; X.lineWidth=12; X.beginPath(); X.moveTo(x0,0); X.lineTo(x0-sk,1920); X.stroke(); X.restore(); } }
page.layer='video';
function onVideo(t,fn){ const s=setup(); X.save(); let ok=!(t>=s.cards&&t<s.CARD_END+PW);
  for(const p of s.PAGES){ const [p0,p1,tin,tout]=p;
    if(t>=p0+PW&&t<=p1){ ok=false; break; }
    if(t>=p0&&t<p0+PW){ const k=eio(P(t,p0,p0+PW));
      if(tin==='push') X.translate(0,-k*1920);
      else { const sk=260, x0=lp(1080+sk,-sk,k); X.beginPath(); X.moveTo(-sk,0); X.lineTo(x0,0); X.lineTo(x0-sk,1920); X.lineTo(-sk,1920); X.closePath(); X.clip(); } }
    if(t>p1&&t<=p1+PW&&tout==='slide') X.translate((1-eio(P(t,p1,p1+PW)))*1080,0); }
  if(ok) fn(t); X.restore(); }

/* ── صفحة المشكلة: قنينتين فيكتور (فلات) — يمين «منتجك» · يسار «منافسك» ينسخ لون/شكل/ملصق ← العطر من منتجك بس ← الشكل ينمسح والعطر يبقى ── */
// o: r (استدارة الأكتاف 0=مربع → 1=مدوّر) · liq (لون السائل) · cap · kl (الملصق 0→1) · a (شفافية) · dash (حدود متقطعة = النسيان)
function bottle(cx,base,w,h,o){ const r=lp(6,w*0.36,o.r), x=cx-w/2, nh=h*0.13, y=base-h, nw=w*0.36;
  X.save(); X.globalAlpha*=(o.a===undefined?1:o.a);
  const body=()=>{ X.beginPath(); X.moveTo(x,base-8); X.lineTo(x,y+nh+r); X.quadraticCurveTo(x,y+nh,x+r,y+nh); X.lineTo(x+w-r,y+nh); X.quadraticCurveTo(x+w,y+nh,x+w,y+nh+r); X.lineTo(x+w,base-8); X.quadraticCurveTo(x+w,base,x+w-8,base); X.lineTo(x+8,base); X.quadraticCurveTo(x,base,x,base-8); X.closePath(); };
  if(o.dash){ X.setLineDash([14,12]); X.strokeStyle=rgba(INKD,0.45); X.lineWidth=4; body(); X.stroke(); X.strokeRect(cx-nw/2,y,nw,nh); X.setLineDash([]); X.restore(); return; }
  X.fillStyle='#E9EEF7'; body(); X.fill();                                                                // زجاج
  X.save(); body(); X.clip(); X.fillStyle=o.liq; X.fillRect(x,y+nh+h*0.22,w,h); X.restore();            // سائل
  X.strokeStyle=INKD; X.lineWidth=5; body(); X.stroke();
  X.fillStyle=o.cap||NAVY; X.fillRect(cx-nw/2,y,nw,nh+4);                                               // غطاء
  if(o.kl>0){ const lw=w*0.78, lh=h*0.30, ly=base-h*0.47; X.save(); K.reveal(cx-lw/2,ly,lw,lh,eo5(o.kl),'r'); X.fillStyle='#FFFFFF'; X.fillRect(cx-lw/2,ly,lw,lh);
    X.fillStyle=PURP; X.fillRect(cx-lw/2,ly,lw,lh*0.28); X.fillStyle=rgba(INKD,0.55); X.fillRect(cx-lw*0.32,ly+lh*0.48,lw*0.64,8); X.fillRect(cx-lw*0.22,ly+lh*0.70,lw*0.44,8); X.restore(); }
  X.restore(); }
function copyArrow(t,t0){ const k=P(t,t0,t0+0.55); if(k<=0||k>=1) return; const e=eo5(k), a=1-P(t,t0+0.35,t0+0.55), x1=lp(620,450,e), y=880;   // سهم النسخ: من منتجك ← للمنافس
  X.save(); X.globalAlpha*=a; X.fillStyle=ACC; X.fillRect(x1,y-5,620-x1,10); X.beginPath(); X.moveTo(x1-24,y); X.lineTo(x1+4,y-19); X.lineTo(x1+4,y+19); X.closePath(); X.fill(); X.restore(); }
function scentWaves(t,t0,cx,top){ const k=eo(P(t,t0,t0+0.9)); if(k<=0) return;   // خطوط عطر صلبة تتصاعد (فلات، بلا توهّج)
  X.save(); X.strokeStyle=PURP; X.lineCap='round'; X.lineWidth=9; [[-46,0],[0,0.15],[46,0.3]].forEach(([dx,dl],i)=>{ const kk=_c01((k-dl)/(1-dl)); if(kk<=0) return; X.beginPath();
    for(let j=0;j<=Math.round(40*kk);j++){ const u=j/40, y=top-u*120, x=cx+dx+Math.sin(u*Math.PI*2.4+t*2.2+i)*16*(0.4+u); j?X.lineTo(x,y):X.moveTo(x,y); } X.stroke(); }); X.restore(); }
function chip(s,cx,cy,fs,k,fill,col){ if(k<=0) return; const w=tw(s,fs)+fs*1.0, h=Math.round(fs*1.5); X.save(); K.reveal(cx-w/2,cy-h/2,w,h,eo5(k),'r'); X.fillStyle=fill; X.fillRect(cx-w/2,cy-h/2,w,h); txt(s,cx,cy+fs*0.05,fs,{c:col}); X.restore(); }
function problemPage(t){ const s=setup();
  const kC=eo5(P(t,s.pA,s.pA+0.35)), kS=eio(P(t,s.shape,s.shape+0.40)), kL=P(t,s.lab,s.lab+0.35), kB=eio(P(t,s.but,s.but+0.4)), kF=eio(P(t,s.forget,s.forget+0.7));
  // العنوان (y≈470) يتبدّل بانسحاب أفقي: «يقلّد فكرة منتجك» ← «لكن عطر» ← «ذاكرة الزبون»
  if(t<s.but-0.15){ const o=eio(P(t,s.but-0.45,s.but-0.15)); X.save(); X.globalAlpha*=1-o; X.translate(-o*200,0); K.kMask(t,'يقلّد فكرة منتجك',s.pA,540,480,76,NAVY,{line:ACC}); X.restore(); }
  if(t>=s.but&&t<s.mem+0.3){ const o=eio(P(t,s.mem,s.mem+0.3)); X.save(); X.globalAlpha*=1-o; X.translate(-o*200,0);
    K.kLine(t,[['لكن',s.but]],540,440,54,rgba(INKD,0.75)); K.kStretch(t,'عطر',s.scent,540,528,116,ACC,{max:560,dur:0.6}); X.restore(); }
  if(t>=s.mem) K.kMask(t,'ذاكرة الزبون',s.memW,540,486,90,NAVY,{line:PURP});
  // القنينتين: الأصل (يمين) ثابت · النسخة (يسار) تتحول خطوة خطوة · بعد «لكن» النسخة تبهت · «نسى شكل» الشكلين ينمسحون والعطر يبقى
  const fA=1-0.75*kF;
  bottle(760,1140,220,400,{r:1,liq:ACC,kl:1,a:fA});
  bottle(320,1140,220,400,{r:kS,liq:mixc(GRAY,ACC,kC),cap:mixc('#7A8496',NAVY,kC),kl:kL,a:fA*lp(1,0.4,kB)});
  if(kF>0){ bottle(760,1140,220,400,{r:1,dash:1,a:kF}); bottle(320,1140,220,400,{r:1,dash:1,a:kF*0.4}); }
  [s.pA,s.shape,s.lab].forEach(t0=>copyArrow(t,t0));
  scentWaves(t,s.scent,760,722);                                                                // العطر يطلع من منتجك بس
  txt('منتجك',760,1196,42,{c:NAVY}); txt('منافسك',320,1196,42,{c:rgba(INKD,0.55)});
  // السطر السفلي (y≈1290): شرائح الخطوات ← «الهوية المميزة» ← «نسى شكل المنتج»
  if(t<s.but+0.3){ const o=eio(P(t,s.but,s.but+0.3)); X.save(); X.globalAlpha*=1-o;
    chip('لون',760,1290,46,P(t,s.pA,s.pA+0.3),ACC,'#FFFFFF'); chip('الشكل',540,1290,46,P(t,s.shape,s.shape+0.3),NAVY,'#FFFFFF'); chip('الملصق',320,1290,46,P(t,s.lab,s.lab+0.3),PURP,'#FFFFFF'); X.restore(); }
  if(t>=s.ident&&t<s.forget+0.3){ const o=eio(P(t,s.forget,s.forget+0.3)); X.save(); X.globalAlpha*=1-o; K.kMarker(t,'الهوية المميزة',s.ident,540,1290,66,NAVY,ACC,'#FFFFFF'); X.restore(); }
  if(t>=s.forget) chip('نسى شكل المنتج',540,1290,54,P(t,s.forget,s.forget+0.35),NAVY,'#FFFFFF');
}
/* ── صفحة المواصفة: «زيوت عطرية · صناعية» + نافذة ملصق PARNZO الحقيقي (دليل) + «مخصصة» + كتلتين ── */
function specPage(t){ const s=setup();
  K.kMask(t,'زيوت عطرية',s.pB+0.22,540,470,112,NAVY,{line:ACC});
  chip('صناعية',540,612,70,P(t,s.ind,s.ind+0.3),ACC,'#FFFFFF');
  const im=IMG.label; if(im&&im.complete&&t>=s.pB+0.45){ const k=eio(P(t,s.pB+0.45,s.pB+0.85)), w=640, h=Math.round(w*im.naturalHeight/im.naturalWidth), x=540-w/2, y=700, z=lp(1.0,1.06,P(t,s.pB+0.45,s.choose));
    X.save(); K.reveal(x,y,w,h,k,'r'); X.beginPath(); X.rect(x,y,w,h); X.clip(); X.translate(540,y+h/2); X.scale(z,z); X.translate(-540,-(y+h/2)); X.drawImage(im,x,y,w,h); X.restore();
    if(k>0){ X.save(); X.strokeStyle=PURP; X.lineWidth=4; X.strokeRect(x+w*(1-k),y,w*k,h); X.restore(); } }
  if(t>=s.ded){ const k=eo(P(t,s.ded,s.ded+0.3)); X.save(); X.globalAlpha*=k; txt('مخصصة',540,1124+(1-k)*20,46,{c:rgba(INKD,0.8)}); X.restore(); }
  const fs=62, h=Math.round(fs*1.55), y=1180, g=24, wA=tw('للمنظفات',fs)+fs*1.1, wB=tw('والكوزمتك',fs)+fs*1.1, x0=540+(wA+wB+g)/2;
  if(t>=s.det){ const k=eo5(P(t,s.det,s.det+0.3)); X.save(); K.reveal(x0-wA,y,wA,h,k,'r'); X.fillStyle=NAVY; X.fillRect(x0-wA,y,wA,h); txt('للمنظفات',x0-wA/2,y+h/2+4,fs,{c:'#FFFFFF'}); X.restore(); }
  if(t>=s.cos){ const k=eo5(P(t,s.cos,s.cos+0.3)), xr=x0-wA-g; X.save(); K.reveal(xr-wB,y,wB,h,k,'r'); X.fillStyle=PURP; X.fillRect(xr-wB,y,wB,h); txt('والكوزمتك',xr-wB/2,y+h/2+4,fs,{c:'#FFFFFF'}); X.restore(); }
}
/* ── صفحة البراند (بعد الوقفة) ── */
function brandPage(t){ const s=setup();
  K.kLine(t,[['ويا',s.brand]],540,320,64,rgba(INKD,0.75));
  K.kSlam(t,'المراسيل',s.mar,540,470,170,PURP);
  if(t>=s.mar+0.28){ X.save(); X.globalAlpha*=eo(P(t,s.mar+0.28,s.mar+0.58)); txt('لتجارة المواد الأولية للمنظفات',540,610,40,{c:ACC}); X.restore(); }   // ⛔ بلا خط تحت الشعار
  K.kLine(t,[['خَلِّ',s.khal],['لمنتجك',s.lmon]],540,820,90,NAVY);
  K.kSlam(t,'هويّة',s.hw,540,970,124,ACC);
  K.kStretch(t,'تشمها العين',s.smell,540,1140,108,PURP,{max:800,nm:2,dur:0.5});
}

/* ═════════ «مستوحى من»: كروت تتبدّل تسارعيًا ← الشبكة ═════════ */
const CARDS=[['212 VIP Men','Carolina Herrera'],['Amor Amor','Cacharel'],['Tommy','Tommy Hilfiger'],["L'Eau par Kenzo",'Kenzo · Pour Femme'],['Flower by Kenzo','Kenzo'],
  ['Golden Dust','Sunnamusk'],['Poême','Lancôme'],['Gucci Rush 2','Gucci'],['Nightflight','JOOP!'],['Armani Black Code','Giorgio Armani']];
function shelf(im,cx,base,mh,mw,sc){ if(!im||!im.complete||!im.naturalWidth) return; const k=Math.min(mh/im.naturalHeight,mw/im.naturalWidth)*(sc||1), w=im.naturalWidth*k, h=im.naturalHeight*k; X.drawImage(im,cx-w/2,base-h,w,h); }
function ltrT(s,x,y,fs,c){ X.save(); X.font='700 '+fs+'px '+FONT; X.fillStyle=c; X.direction='ltr'; X.textAlign='center'; X.textBaseline='middle'; X.fillText(s,x,y); X.restore(); }
function label(s,x,y,fs){ X.save(); X.font='700 '+fs+'px '+FONT; X.direction='ltr'; const w=X.measureText(s).width+fs*0.9, h=fs*1.45; X.restore(); X.fillStyle=ACC; X.fillRect(x-w/2,y-h/2,w,h); ltrT(s,x,y+fs*0.04,fs,'#FFFFFF'); }
function card(i,local){ const s=setup(); X.fillStyle=NAVY; X.fillRect(0,0,1080,1920); X.fillStyle=PURP; X.fillRect(0,0,1080,10);
  const ent=i===0?1:eo(local/Math.min(0.14,0.5*s.CD[i-1])), dx=(1-ent)*32, z=1+0.03*Math.min(1,local/0.9);
  X.save(); X.translate(dx,0); shelf(IMG[INSP[i]],540,880,640,760,z); X.restore();
  txt('مستوحى من',540,952,46,{c:'rgba(255,255,255,0.72)'});
  X.save(); X.translate(dx*0.5,0); const [n,b]=CARDS[i]; label(n,540,1036,n.length>14?64:76); ltrT(b,540,1110,32,'rgba(255,255,255,0.72)'); X.restore(); }
function grid(local){ X.fillStyle=NAVY; X.fillRect(0,0,1080,1920); X.fillStyle=PURP; X.fillRect(0,0,1080,10);
  txt('مستوحى من',540,150,54,{c:'#FFFFFF'}); const tw0=tw('مستوحى من',54); X.fillStyle=ACC; X.fillRect(540-tw0/2,196,tw0,6);
  const cw=200, gx=(1080-5*cw)/2, base=[590,1040];
  CARDS.forEach(([n,b],i)=>{ const col=4-(i%5), row=Math.floor(i/5), x=gx+col*cw+cw/2, y0=base[row], u=eo((local-i*0.035)/0.22); if(u<=0) return;
    X.save(); X.globalAlpha*=u; X.translate((1-u)*40,0); shelf(IMG[INSP[i]],x,y0,300,176);
    let fs=30; X.font='700 '+fs+'px '+FONT; X.direction='ltr'; while(X.measureText(n).width>cw-14&&fs>18){ fs--; X.font='700 '+fs+'px '+FONT; }
    ltrT(n,x,y0+40,fs,'#FFFFFF'); ltrT(b.split(' · ')[0],x,y0+74,22,'rgba(255,255,255,0.72)'); X.restore(); }); }
function inspired(t){ const s=setup(); if(t<s.cards||t>=s.CARD_END+PW) return;
  if(t>=s.grid) grid(t-s.grid); else { let i=0; while(i+1<s.CT.length&&t>=s.CT[i+1]) i++; card(i,t-s.CT[i]); }
  K.banner(t); }
inspired.layer='video';

/* ═════════ طبقة الفيديو ═════════ */
function vzoom(t){ const s=setup(); const PUNCH=[[s.sol,1.12,0.50,540,760],[s.link,1.08,0.35,540,760]]; let sc=1,cx=540,cy=700;
  for(const p of PUNCH) if(t>=p[0]&&t<p[0]+p[2]){ sc*=1+(p[1]-1)*(1-eo(P(t,p[0],p[0]+p[2]))); cx=p[3]; cy=p[4]; }
  if(sc===1) return; X.save(); X.translate(cx,cy); X.scale(sc,sc); X.translate(-cx,-cy); X.drawImage(VF,0,0,W,H); X.restore(); }
/* «يقلّد»: الكادر ينقسم لنسختين متطابقتين */
const _sc=document.createElement('canvas'); _sc.width=1080; _sc.height=1920; const _sx=_sc.getContext('2d');
function copySplit(t){ const s=setup(); if(t<s.split||t>=s.pA+PW) return; const k=eo5(P(t,s.split,s.split+0.28)); _sx.drawImage(C,0,0);
  const pw=lp(1080,528,k), g=lp(0,24,k); X.fillStyle=NAVY; X.fillRect(0,0,1080,1920);
  [540-g/2-pw, 540+g/2].forEach(x=>{ X.save(); X.beginPath(); X.rect(x,0,pw,1920); X.clip(); X.drawImage(_sc,270,0,540,1920,x+(pw-540)/2,0,540,1920); X.restore(); });
  if(k<1){ X.save(); X.globalAlpha=1-k; X.drawImage(_sc,0,0); X.restore(); } }
copySplit.layer='video';
/* whip عند قطع العلبتين ← الهرم */
const _wc=document.createElement('canvas'); _wc.width=1080; _wc.height=1920; const _wx=_wc.getContext('2d');
function trans(t){ const s=setup(); const c=s.link, u=(t-c)/0.12; if(u<-1||u>1) return; const sh=-300*Math.pow(1-Math.abs(u),2)*(u<0?1:-1), sp=Math.abs(sh)*0.7; _wx.drawImage(C,0,0);
  X.save(); for(let i=0;i<9;i++){ X.globalAlpha=i?0.22:1; X.drawImage(_wc,sh+(i-4)*sp/9*2,0); } X.restore(); }
trans.layer='video';
function dim(t){ const s=setup(); const a=0.30*win(t,s.sol,s.pB,0.12,0.12); if(a<=0) return;
  const g=X.createLinearGradient(0,0,0,1150); g.addColorStop(0,rgba(NAVY,a)); g.addColorStop(0.75,rgba(NAVY,a*0.8)); g.addColorStop(1,rgba(NAVY,0)); X.fillStyle=g; X.fillRect(0,0,1080,1150); }
dim.layer='video';
function bannerLayer(t){ const s=setup(); if(t>=s.cards&&t<s.CARD_END+PW) return; const p=pageAt(t); if(p&&t>=p[0]+PW&&t<=p[1]) return; K.banner(t); }
bannerLayer.layer='video';
SCENE_LIST.push(['m_vzoom',vzoom,'video'],['m_split',copySplit,'video'],['m_trans',trans,'video'],['m_dim',dim,'video'],['m_banner',bannerLayer,'video'],['m_inspired',inspired,'video'],['m_page',page,'video']);

/* ═════════ فوق الفيديو ═════════ */
function bar(s,xR,y,fs,fill,col,k){ const w=tw(s,fs)+fs*1.1, h=Math.round(fs*1.42); if(k<=0) return [w,h];
  X.save(); K.reveal(xR-w,y,w,h,k,'r'); X.fillStyle=fill; X.fillRect(xR-w,y,w,h); txt(s,xR-w/2,y+h/2+fs*0.05,fs,{c:col||'#FFFFFF'}); X.restore(); return [w,h]; }
function solutionW(t){ const s=setup(); if(t<s.sol||t>=s.pB+PW) return; onVideo(t,()=>{ const xR=960; const [,h]=bar('والحل',xR,360,110,PURP,'#FFFFFF',eo5(P(t,s.sol,s.sol+0.27)));
  bar('وفرناه إلك',xR,360+h+20,84,'#FFFFFF',NAVY,eo5(P(t,s.solB,s.solB+0.25))); }); }
SCENE_LIST.push(['m_solution',solutionW],['m_caps',capBox]);
})();

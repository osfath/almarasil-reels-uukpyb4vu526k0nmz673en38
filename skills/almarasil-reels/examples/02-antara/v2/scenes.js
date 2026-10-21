/* ═══ الأنتارا السويدية — مشاهد الريل (نفس نظام المراسيل) ═══
   باليت: كحلي · أزرق الهوية · أبيض (+ ألوان علم السويد الحقيقية للعلم فقط) · خط الجزيرة.
   كل الأوقات على التايم-لاين النهائي (VEND=19.0 + نهاية البراند 3 ث). */
(function(){
window.NOBAR = true; window.NO_OUTRO = true;
window.CAP_STROKE = 0.085;

const _init0 = window.init;
window.init = function(o){ const p=_init0(o); const th=(o&&o.theme)||{}; window.CAP_SC=th.stroke||'#3A2378'; window.ACC_TXT=th.accText||'#4FA3FF'; window.CAP_SC_HOT=th.strokeHot||'#0B1222'; window.CAP_SH=th.strokeShadow||'rgba(46,24,104,0.62)';
  for(const c of (o.cards||[])) if(c.kw) SCENES.push({s:c.s,e:c.e,m:R_FULL,nocap:true});
  return Promise.all([p, new Promise(r=>{ const im=new Image(); im.onload=()=>{ IMG.barrel=im; r(); }; im.onerror=()=>{ console.error('⚠️ البرميل ما تحمّل'); r(); }; im.src='assets/barrel_cut.png'; })]); };
const IMG={};

/* ── أدوات ── */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lp=(a,b,k)=>a+(b-a)*k;
const P=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const eo=k=>1-Math.pow(1-k,3), eo5=k=>1-Math.pow(1-k,5);
const eio=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
const ob=k=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2);};
function rgba(h,a){h=String(h).replace('#','');const n=parseInt(h,16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;}
function mix(h1,h2,k){const f=h=>{const n=parseInt(String(h).replace('#',''),16);return[n>>16&255,n>>8&255,n&255];};const a=f(h1),b=f(h2);return `rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*k)).join(',')})`;}
function win(t,s,e,fi,fo){ if(t<s||t>e) return 0; return Math.min(fi?P(t,s,s+fi):1, fo?1-P(t,e-fo,e):1); }
function rrect(x,y,w,h,r){X.beginPath();X.moveTo(x+r,y);X.arcTo(x+w,y,x+w,y+h,r);X.arcTo(x+w,y+h,x,y+h,r);X.arcTo(x,y+h,x,y,r);X.arcTo(x,y,x+w,y,r);X.closePath();}
const ISO=s=>String(s).replace(/(\d[\d\-.]*\d%?|\d%?)/g,'⁦$1⁩');   // الرقم كامل مع شرطاته ونقطته معزول
function txt(s,x,y,size,o){ o=o||{}; s=ISO(s); X.save(); X.font=(o.w||800)+' '+size+'px '+FONT; X.textAlign=o.al||'center'; X.textBaseline='middle'; X.direction='rtl';
  if(o.stroke){ X.lineJoin='round'; X.miterLimit=2; X.strokeStyle=o.sc||window.CAP_SC||rgba(BG,0.92); X.lineWidth=Math.max(4,o.stroke*0.65);
    X.shadowColor=window.CAP_SH||'rgba(0,0,0,0.55)'; X.shadowBlur=Math.max(o.sh||0,22); X.shadowOffsetY=6; X.strokeText(s,x,y); X.shadowColor='transparent'; X.shadowBlur=0; }
  else if(o.sh){ X.shadowColor='rgba(0,0,0,0.6)'; X.shadowBlur=o.sh; X.shadowOffsetY=4; }
  X.fillStyle=o.c||'#FFFFFF'; X.fillText(s,x,y); X.restore(); }
function tw(s,size,w){ X.save(); X.font=(w||800)+' '+size+'px '+FONT; X.direction='rtl'; const v=X.measureText(ISO(s)).width; X.restore(); return v; }
function glass(x,y,w,h,r,a,bar){
  X.save(); X.shadowColor='rgba(0,0,0,0.45)'; X.shadowBlur=40; X.shadowOffsetY=14; rrect(x,y,w,h,r); X.fillStyle=rgba(BG,a); X.fill(); X.restore();
  X.save(); rrect(x+1,y+1,w-2,h-2,r); X.strokeStyle='rgba(255,255,255,0.10)'; X.lineWidth=2; X.stroke(); X.restore();
  if(bar){ X.save(); rrect(x,y,w,h,r); X.clip(); X.fillStyle=bar; X.fillRect(x,y,w,7); X.restore(); } }
function pill(s,cx,cy,fs,fill,col){ const w=tw(s,fs,900)+fs*1.4, h=fs*2.05;
  X.save(); X.shadowColor='rgba(0,0,0,0.45)'; X.shadowBlur=28; X.shadowOffsetY=10; rrect(cx-w/2,cy-h/2,w,h,h/2); X.fillStyle=fill; X.fill(); X.restore();
  txt(s,cx,cy+2,fs,{w:900,c:col||'#FFFFFF'}); return w; }
function seeded(seed){ let s=seed; return ()=>{ s=(s*9301+49297)%233280; return s/233280; }; }

/* ═════════ طبقة الفيديو ═════════ */
const BN_Y=1180, BN_F=140;
const _bn=document.createElement('canvas'); _bn.width=1080; _bn.height=1920-BN_Y; const _bx=_bn.getContext('2d');
const _bg=_bx.createLinearGradient(0,0,0,BN_F); _bg.addColorStop(0,'rgba(0,0,0,0)'); _bg.addColorStop(1,'rgba(0,0,0,1)');
function restoreBanner(){ _bx.globalCompositeOperation='source-over'; _bx.clearRect(0,0,1080,_bn.height); _bx.drawImage(VF,0,BN_Y,1080,_bn.height,0,0,1080,_bn.height);
  _bx.globalCompositeOperation='destination-in'; _bx.fillStyle=_bg; _bx.fillRect(0,0,1080,_bn.height); _bx.globalCompositeOperation='source-over'; X.drawImage(_bn,0,BN_Y); }
const PUNCH=[[0.00,1.08,0.45,540,760,0],[2.84,1.06,0.35,540,820,0],[5.44,1.06,0.30,540,700,0],[10.04,1.06,0.35,540,700,0],[13.50,1.05,0.30,540,700,0]];
const PUSH=[[0.45,3.45,1.00,1.05,540,820],[7.40,8.62,1.00,1.04,540,640],[11.78,13.50,1.00,1.04,540,640],[17.02,19.0,1.00,1.06,540,640]];
function vzoom(t){ let s=1,cx=540,cy=640,dx=0,dy=0;
  for(const p of PUSH) if(t>=p[0]&&t<p[1]){ s*=lp(p[2],p[3],eio(P(t,p[0],p[1]))); cx=p[4]; cy=p[5]; }
  for(const p of PUNCH) if(t>=p[0]&&t<p[0]+p[2]){ const u=P(t,p[0],p[0]+p[2]); s*=1+(p[1]-1)*(1-eo(u)); cx=p[3]; cy=p[4]; if(p[5]){ const d=(1-u)*(1-u)*p[5]; dx+=Math.sin(t*95)*d; dy+=Math.cos(t*73)*d*0.6; } }
  if(s===1&&!dx&&!dy) return;
  X.save(); X.translate(cx+dx,cy+dy); X.scale(s,s); X.translate(-cx,-cy); X.drawImage(VF,0,0,W,H); X.restore(); restoreBanner(); }
const BLUR=[[8.62,12.20,0.25,0.2],[15.78,19.0,0.3,0]];
function bgblur(t){ let k=0; for(const b of BLUR) k=Math.max(k,win(t,b[0],b[1],b[2],b[3])); if(k<=0) return;
  X.save(); X.filter='blur('+(9*k).toFixed(1)+'px)'; X.translate(540,640); X.scale(1.04,1.04); X.translate(-540,-640); X.drawImage(VF,0,0,W,H); X.restore(); restoreBanner(); }
const DIMS=[[0.00,3.55,0.30,0,0.2],[3.45,8.70,0.32,0.2,0.2],[8.62,12.20,0.48,0.25,0.25],[11.90,15.85,0.36,0.25,0.25],[15.78,19.0,0.42,0.25,0]];
function dim(t){ let a=0; for(const d of DIMS) a=Math.max(a,d[2]*win(t,d[0],d[1],d[3],d[4])); if(a<=0) return;
  const g=X.createLinearGradient(0,0,0,1310); g.addColorStop(0,rgba(BG,a)); g.addColorStop(0.78,rgba(BG,a*0.85)); g.addColorStop(1,rgba(BG,0)); X.fillStyle=g; X.fillRect(0,0,1080,1310); }
const TRANS=[[3.50,'whip',1],[4.52,'zoom'],[5.44,'flash'],[6.08,'whip',-1],[7.40,'zoom'],[8.62,'whip',1],[10.10,'flash'],[11.78,'whip',-1],[13.50,'zoom'],[15.78,'whip',1],[17.02,'zoom']];
const WH=0.12, WA=300;
const _wc=document.createElement('canvas'); _wc.width=1080; _wc.height=1310; const _wx=_wc.getContext('2d');
const _wo=document.createElement('canvas'); _wo.width=1080; _wo.height=1310; const _wox=_wo.getContext('2d');
const _wg=_wox.createLinearGradient(0,1150,0,1310); _wg.addColorStop(0,'rgba(0,0,0,1)'); _wg.addColorStop(1,'rgba(0,0,0,0)');
function snap(){ _wx.clearRect(0,0,1080,1310); _wx.drawImage(C,0,0,1080,1310,0,0,1080,1310); _wox.globalCompositeOperation='source-over'; _wox.clearRect(0,0,1080,1310); }
function commit(){ _wox.globalAlpha=1; _wox.globalCompositeOperation='destination-in'; _wox.fillStyle=_wg; _wox.fillRect(0,0,1080,1310); _wox.globalCompositeOperation='source-over'; X.drawImage(_wo,0,0); }
/* انتقال على كل قطع: Whip يمين/يسار · زوم يخترق اللقطة · ومضة — كلها فوق البانر بس */
function trans(t){ for(const tr of TRANS){ const c=tr[0], kind=tr[1];
  if(kind==='whip'){ const u=(t-c)/WH; if(u<-1||u>1) continue; const sh=WA*tr[2]*Math.pow(1-Math.abs(u),2)*(u<0?-1:1), spread=Math.abs(sh)*0.7, N=9;
    snap(); for(let i=0;i<N;i++){ _wox.globalAlpha=i?0.22:1; _wox.drawImage(_wc,sh+(i-(N-1)/2)*spread/N*2,0); } commit();
    const fa=0.2*Math.pow(1-Math.abs(u),3); if(fa>0.01){ X.fillStyle='rgba(255,255,255,'+fa+')'; X.fillRect(0,0,1080,1180); } }
  else if(kind==='zoom'){ const u=(t-c)/0.16; if(u<-1||u>1) continue; const e=Math.pow(1-Math.abs(u),2), z=1+0.24*e;
    snap(); for(let i=0;i<6;i++){ const zz=z*(1+i*0.035*e); _wox.globalAlpha=i?0.2:1; _wox.save(); _wox.translate(540,700); _wox.scale(zz,zz); _wox.translate(-540,-700); _wox.drawImage(_wc,0,0); _wox.restore(); } commit(); }
  else if(kind==='flash'){ const u=(t-c)/0.10; if(u<-1||u>1) continue; const fa=0.55*Math.pow(1-Math.abs(u),2);
    const g=X.createLinearGradient(0,0,0,1300); g.addColorStop(0,'rgba(255,255,255,'+fa+')'); g.addColorStop(0.85,'rgba(255,255,255,'+fa+')'); g.addColorStop(1,'rgba(255,255,255,0)'); X.fillStyle=g; X.fillRect(0,0,1080,1300); } } }
function vignette(t){ if(t>=VEND) return; const g=X.createRadialGradient(540,620,380,540,620,1050); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,0.38)');
  X.save(); X.fillStyle=g; X.fillRect(0,0,1080,1180); X.restore(); }

/* ═════════ الرسوم ═════════ */

/* 1) الهوك: كأس زجاج شفاف يتعتّم إلى أبيض — يكمل مع «المعتم» */
function glassFx(t){ if(t<0.08||t>3.58) return;
  const a=win(t,0.08,3.58,0.3,0.25), ki=ob(P(t,0.08,0.5)), k=eio(P(t,1.95,3.05));
  const cx=540, gw=340, gh=420, gx=cx-gw/2, gy=250, lvl=gy+86, R=34;
  X.save(); X.globalAlpha=a; X.translate(cx,gy+gh/2); X.scale(lp(0.85,1,ki),lp(0.85,1,ki)); X.translate(-cx,-(gy+gh/2));
  const body=()=>{ X.beginPath(); X.moveTo(gx,gy); X.lineTo(gx,gy+gh-R); X.quadraticCurveTo(gx,gy+gh,gx+R,gy+gh); X.lineTo(gx+gw-R,gy+gh); X.quadraticCurveTo(gx+gw,gy+gh,gx+gw,gy+gh-R); X.lineTo(gx+gw,gy); };
  // زجاج + سائل
  X.save(); body(); X.closePath(); X.fillStyle='rgba(255,255,255,0.07)'; X.fill(); X.clip();
  const wave=y0=>{ X.beginPath(); X.moveTo(gx,y0); for(let x=0;x<=gw;x+=6) X.lineTo(gx+x,y0+Math.sin(x*0.05+t*5)*4); X.lineTo(gx+gw,gy+gh); X.lineTo(gx,gy+gh); X.closePath(); };
  wave(lvl); X.fillStyle='rgba(190,220,255,0.16)'; X.fill();
  const rnd=seeded(11);                                           // فقاعات وانكسار ضوء (المرحلة الشفافة)
  for(let i=0;i<14;i++){ const bx=gx+26+rnd()*(gw-52), sp=50+rnd()*80, by=gy+gh-((t*sp+rnd()*420)%(gh-100)); X.globalAlpha=a*(1-k)*0.7; X.strokeStyle='#FFFFFF'; X.lineWidth=2; X.beginPath(); X.arc(bx,by,4+rnd()*6,0,7); X.stroke(); }
  X.globalAlpha=a*(1-k)*0.35; X.fillStyle='#FFFFFF'; for(let i=0;i<3;i++){ X.fillRect(gx+60+i*86,lvl+28,4,gh-150); }
  // التعتيم: سحب بيضاء تنتشر من المنتصف ← أبيض معتم
  const r2=seeded(5); X.globalAlpha=a;
  for(let i=0;i<9;i++){ const bx=gx+gw*(0.2+r2()*0.6), by=lvl+(gh-64)*(0.3+r2()*0.6), rr=lp(6,200,eo(clamp(k*1.25-r2()*0.25,0,1)));
    const g=X.createRadialGradient(bx,by,0,bx,by,rr); g.addColorStop(0,'rgba(248,250,252,'+(0.9*k)+')'); g.addColorStop(1,'rgba(248,250,252,0)'); X.fillStyle=g; X.beginPath(); X.arc(bx,by,rr,0,7); X.fill(); }
  wave(lvl); const lg=X.createLinearGradient(gx,0,gx+gw,0); lg.addColorStop(0,'rgba(255,255,255,'+(0.97*k*k)+')'); lg.addColorStop(1,'rgba(226,232,240,'+(0.97*k*k)+')'); X.fillStyle=lg; X.fill();
  X.restore();
  // حدود الزجاج + لمعة + حافة الفم + علامات تدريج
  X.save(); body(); X.lineWidth=6; X.strokeStyle='rgba(255,255,255,0.95)'; X.shadowColor=window.CAP_SH; X.shadowBlur=20; X.stroke(); X.restore();
  X.save(); X.lineWidth=6; X.strokeStyle='#FFFFFF'; X.beginPath(); X.ellipse(cx,gy,gw/2,14,0,0,7); X.stroke(); X.restore();
  X.save(); const hl=X.createLinearGradient(gx+18,0,gx+60,0); hl.addColorStop(0,'rgba(255,255,255,0.45)'); hl.addColorStop(1,'rgba(255,255,255,0)'); X.fillStyle=hl; X.fillRect(gx+18,gy+26,42,gh-70); X.restore();
  X.save(); X.strokeStyle='rgba(255,255,255,0.75)'; X.lineWidth=3; for(let i=0;i<4;i++){ const y=gy+120+i*70; X.beginPath(); X.moveTo(gx+gw-18,y); X.lineTo(gx+gw-(i%2?44:66),y); X.stroke(); } X.restore();
  X.restore();
  // الحالة: «شفاف» ← «أبيض معتم»
  const fl=P(t,2.30,2.55), y=760;
  if(fl<1){ X.save(); X.globalAlpha=a*(1-fl); X.translate(cx,y); X.scale(1,1-fl); X.translate(-cx,-y); const w=tw('شفاف',52,900)+86; glass(cx-w/2,y-52,w,104,52,0.8); txt('شفاف',cx,y+2,52,{w:900}); X.restore(); }
  if(fl>0){ X.save(); X.globalAlpha=a*fl; X.translate(cx,y); X.scale(1,fl); X.translate(-cx,-y); pill('أبيض معتم',cx,y,52,ACC); X.restore(); }
}

/* 2) علم السويد يرفرف — «السويدية» (ألوان العلم الحقيقية) */
const _fl=document.createElement('canvas'); _fl.width=440; _fl.height=275; (()=>{ const f=_fl.getContext('2d'), w=440, h=275;
  f.fillStyle='#006AA7'; f.fillRect(0,0,w,h); f.fillStyle='#FECC00'; f.fillRect(w*5/16,0,w*2/16,h); f.fillRect(0,h*4/10,w,h*2/10); })();
function flag(t){ if(t<5.95||t>7.50) return; const a=win(t,5.95,7.50,0.15,0.2), ku=eo(P(t,6.02,6.42));
  const fw=440, fh=275, x0=320, y0=330, poleX=x0-14;
  X.save(); X.globalAlpha=a;
  X.fillStyle='rgba(255,255,255,0.92)'; rrect(poleX-6,y0-20,10,fh+150,5); X.fill(); X.beginPath(); X.arc(poleX-1,y0-24,10,0,7); X.fill();
  const vis=fw*ku;
  for(let x=0;x<vis;x+=4){ const amp=14*(x/fw), ph=x*0.028-t*7, off=Math.sin(ph)*amp, sh=Math.cos(ph)*(x/fw);
    X.drawImage(_fl,x,0,4,fh,x0+x,y0+off,4.6,fh);
    X.fillStyle=sh>0?'rgba(255,255,255,'+(sh*0.16)+')':'rgba(0,0,0,'+(-sh*0.28)+')'; X.fillRect(x0+x,y0+off,4.6,fh); }
  X.restore();
}

/* 3) نسبة الاستخدام: طن = 1000 خانة · كيلو = خانة وحدة تضيء ← 0.1% */
function usage(t){ if(t<8.62||t>12.25) return; const a=win(t,8.62,12.25,0.2,0.25);
  const cols=40, rows=25, cs=13, gp=2, gw=cols*(cs+gp)-gp, gh=rows*(cs+gp)-gp, gx=540-gw/2, gy=400;
  X.save(); X.globalAlpha=a;
  const hp=P(t,8.66,8.95); if(hp>0){ const w=tw('نسبة الاستخدام',38,900)+80; X.save(); X.globalAlpha*=Math.min(1,hp*2); glass(540-w/2,268,w,70,20,0.78); X.fillStyle=ACC; rrect(540+w/2-16,283,6,40,3); X.fill(); txt('نسبة الاستخدام',540+w/2-32,305,38,{w:900,al:'right'}); X.restore(); }
  const kg=P(t,8.75,9.70); const lit=t>=10.04, tc=33, tr=11;
  if(kg>0){ X.save(); X.globalAlpha*=Math.min(1,kg*2); X.fillStyle=rgba(BG,0.6); X.fillRect(gx-10,gy-10,gw+20,gh+20); X.restore(); }   // خلفية الشبكة قبل الخانات
  for(let c=0;c<cols;c++){ const cv=clamp((kg*1.15-(cols-1-c)/cols)*4,0,1); if(cv<=0) continue;   // تنفرش من اليمين (RTL)
    for(let r=0;r<rows;r++){ const x=gx+c*(cs+gp), y=gy+r*(cs+gp); const me=(c===tc&&r===tr);
      X.fillStyle= me&&lit ? ACC : 'rgba(255,255,255,'+(0.30*cv)+')'; X.fillRect(x,y,cs,cs); } }
  const kt=P(t,10.98,11.30); if(kt>0){ X.save(); X.globalAlpha*=kt; X.strokeStyle='#FFFFFF'; X.lineWidth=4; rrect(gx-10,gy-10,gw+20,gh+20,10); X.stroke(); X.restore(); }
  if(lit){ const tx=gx+tc*(cs+gp)+cs/2, ty=gy+tr*(cs+gp)+cs/2, u=P(t,10.04,10.40);
    X.save(); X.strokeStyle=ACC; X.lineWidth=5; X.shadowColor=ACC; X.shadowBlur=24; X.globalAlpha*=1-0.6*u; X.beginPath(); X.arc(tx,ty,lp(220,16,eo(u)),0,7); X.stroke(); X.restore();
    X.save(); X.shadowColor=ACC; X.shadowBlur=30; X.fillStyle=ACC; X.fillRect(tx-cs/2,ty-cs/2,cs,cs); X.strokeStyle='#FFFFFF'; X.lineWidth=3; X.beginPath(); X.arc(tx,ty,17,0,7); X.stroke(); X.restore();
    const kc=P(t,10.12,10.40); if(kc>0){ X.save(); X.globalAlpha*=Math.min(1,kc*2); X.strokeStyle='rgba(255,255,255,0.9)'; X.lineWidth=3; X.beginPath(); X.moveTo(tx+17,ty); X.lineTo(gx+gw+40,ty); X.stroke();
      X.translate(gx+gw+92,ty); const s=ob(kc); X.scale(s,s); X.translate(-(gx+gw+92),-ty); pill('1 كغ',gx+gw+92,ty,32,ACC); X.restore(); } }
  const kl=P(t,9.10,9.40); if(kl>0){ X.save(); X.globalAlpha*=kl; txt('1 طن = 1000 كغ',540,gy+gh+46,36,{w:800,c:'rgba(255,255,255,0.85)',stroke:5}); X.restore(); }
  const kr=P(t,11.36,11.62); if(kr>0){ const s=1+0.18*(1-eo(kr)); X.save(); X.globalAlpha*=Math.min(1,kr*2.5); X.translate(540,gy+gh+150); X.scale(s,s); X.translate(-540,-(gy+gh+150));
    txt('0.1%',540,gy+gh+150,120,{w:900,c:'#FFFFFF',stroke:14,sh:30}); X.restore(); }
  X.restore(); }

/* 4) زورونا: أرضية منظور + دبوس ينزل على «بالموصل» + كرت العنوان */
function visit(t){ if(t<11.90||t>15.85) return; const a=win(t,11.90,15.85,0.3,0.25);
  X.save(); X.globalAlpha=a;
  const kg=eo(P(t,11.95,12.6)), hz=470, by=760, vx=540;                 // أرضية بخطوط منظور
  X.save(); X.globalAlpha*=0.55*kg; X.strokeStyle=rgba(ACC,1); X.lineWidth=2;
  for(let i=-8;i<=8;i++){ X.beginPath(); X.moveTo(vx+i*14,hz); X.lineTo(vx+i*120,by); X.stroke(); }
  for(let j=0;j<6;j++){ const q=Math.pow(j/5,1.8), y=lp(hz,by,q), half=lp(112,960,q)/2; X.beginPath(); X.moveTo(vx-half,y); X.lineTo(vx+half,y); X.stroke(); }
  X.restore();
  const kb=P(t,12.72,13.0); if(kb>0){ X.save(); X.globalAlpha*=Math.min(1,kb*2); const w=tw('مكتب الشركة',38,900)+80; glass(540-w/2,290,w,70,20,0.78); X.fillStyle=ACC; rrect(540+w/2-16,305,6,40,3); X.fill(); txt('مكتب الشركة',540+w/2-32,327,38,{w:900,al:'right'}); X.restore(); }
  const kp=P(t,13.50,13.95), land=560;                                    // الدبوس
  if(kp>0){ const yy=kp<0.7?lp(160,land,eo5(kp/0.7)):land-Math.sin((kp-0.7)/0.3*Math.PI)*16;
    const ur=P(t,13.82,14.6); if(ur>0){ for(let i=0;i<2;i++){ const u=clamp(ur*1.3-i*0.3,0,1); if(u<=0) continue; X.save(); X.globalAlpha*=(1-u)*0.9; X.strokeStyle=i?'#FFFFFF':ACC; X.lineWidth=4; X.beginPath(); X.ellipse(540,land+6,lp(20,170,u),lp(6,46,u),0,0,7); X.stroke(); X.restore(); } }
    X.save(); X.fillStyle='rgba(0,0,0,0.45)'; X.beginPath(); X.ellipse(540,land+8,26,8,0,0,7); X.fill(); X.restore();
    X.save(); X.translate(540,yy); X.shadowColor=rgba(ACC,0.8); X.shadowBlur=30; X.fillStyle=ACC;
    X.beginPath(); X.moveTo(0,0); X.bezierCurveTo(-18,-34,-50,-58,-50,-98); X.arc(0,-98,50,Math.PI,0); X.bezierCurveTo(50,-58,18,-34,0,0); X.closePath(); X.fill();
    X.shadowBlur=0; X.fillStyle='#FFFFFF'; X.beginPath(); X.arc(0,-98,20,0,7); X.fill(); X.restore(); }
  const kc=P(t,14.08,14.42); if(kc>0){ X.save(); X.globalAlpha*=Math.min(1,kc*2); X.translate(0,(1-eo(kc))*20);
    const w=Math.max(tw('الموصل',58,900),tw('شارع السايلو',40,800))+120, h=150, x=540-w/2, y=650;
    X.strokeStyle='rgba(255,255,255,0.85)'; X.lineWidth=3; X.beginPath(); X.moveTo(540,land+12); X.lineTo(540,y-14); X.stroke();
    glass(x,y,w,h,24,0.9,ACC);
    X.fillStyle=rgba(BG,0.9); X.beginPath(); X.moveTo(540-16,y+1); X.lineTo(540,y-15); X.lineTo(540+16,y+1); X.closePath(); X.fill();
    txt('الموصل',540,y+52,58,{w:900}); txt('شارع السايلو',540,y+110,40,{w:800,c:'rgba(255,255,255,0.88)'}); X.restore(); }
  X.restore(); }

/* 5) الشحن لكل العراق: من الموصل مسارات تنرسم لعقد + شاحنة (شبكة مجرّدة — بلا خريطة مخترعة) */
const NODES=(()=>{ const r=seeded(23), n=[]; for(let i=0;i<8;i++) n.push([lp(190,890,(i+0.5)/8)+(r()-0.5)*50, lp(470,760,r())]); return n; })();
function ship(t){ if(t<15.78||t>18.70) return; const a=win(t,15.78,18.70,0.25,0.15);
  const ox=540, oy=330;
  X.save(); X.globalAlpha=a;
  NODES.forEach((nd,i)=>{ const k=eio(P(t,16.0+i*0.14,16.55+i*0.14)); if(k<=0) return;
    const mx=(ox+nd[0])/2, my=Math.min(oy,nd[1])-40, ex=lp(ox,nd[0],k), ey=lp(oy,nd[1],k);
    X.save(); X.strokeStyle='rgba(255,255,255,0.8)'; X.lineWidth=3; X.setLineDash([10,10]); X.lineDashOffset=-t*40; X.beginPath(); X.moveTo(ox,oy);
    for(let q=0;q<=1.0001;q+=0.05){ const s=q*k, x=(1-s)*(1-s)*ox+2*(1-s)*s*mx+s*s*nd[0], y=(1-s)*(1-s)*oy+2*(1-s)*s*my+s*s*nd[1]; X.lineTo(x,y); } X.stroke(); X.restore();
    if(k>=1){ const kp=P(t,16.55+i*0.14,16.85+i*0.14); X.save(); X.fillStyle=ACC; X.shadowColor=ACC; X.shadowBlur=18; X.beginPath(); X.arc(nd[0],nd[1],lp(4,10,ob(kp)),0,7); X.fill();
      X.strokeStyle='rgba(255,255,255,'+(0.8*(1-kp))+')'; X.lineWidth=3; X.beginPath(); X.arc(nd[0],nd[1],lp(10,34,kp),0,7); X.stroke(); X.restore(); } });
  X.save(); X.fillStyle='#FFFFFF'; X.shadowColor=ACC; X.shadowBlur=24; X.beginPath(); X.arc(ox,oy,14,0,7); X.fill(); X.restore();
  txt('الموصل',ox,oy-48,38,{w:900,stroke:5});
  const kt=P(t,16.40,18.10); if(kt>0&&kt<1){ const nd=NODES[4], mx=(ox+nd[0])/2, my=Math.min(oy,nd[1])-40, s=eio(kt);   // الشاحنة على المسار
    const x=(1-s)*(1-s)*ox+2*(1-s)*s*mx+s*s*nd[0], y=(1-s)*(1-s)*oy+2*(1-s)*s*my+s*s*nd[1];
    X.save(); X.translate(x,y-18); X.fillStyle='#FFFFFF'; X.shadowColor='rgba(0,0,0,0.5)'; X.shadowBlur=12; rrect(-30,-16,40,26,4); X.fill(); rrect(12,-8,18,18,4); X.fill();
    X.shadowBlur=0; X.fillStyle=BG; X.beginPath(); X.arc(-18,12,6,0,7); X.arc(18,12,6,0,7); X.fill(); X.restore(); }
  X.restore(); }

/* 6) الكلمة المفتاحية لحالها — تنمطّ بالكشيدة */
const JOINF='بتثجحخسشصضطظعغفقكلمنهيئ', ARL=/[ء-ي]/;
function slots(w){ const pre=w.startsWith('ال')?2:0, s=[]; for(let i=pre;i<w.length-1;i++){ const a=w[i],b=w[i+1]; if(!JOINF.includes(a)||!ARL.test(b)) continue; if(a==='ل'&&'اأإآ'.includes(b)) continue; s.push(i); }
  return s.length>3?[...new Set([s[0],s[Math.floor(s.length/2)],s[s.length-1]])]:s; }
function stretched(ph,n){ return ph.split(' ').map(w=>{ const sl=slots(w); let o=''; for(let i=0;i<w.length;i++){ o+=w[i]; if(sl.includes(i)) o+='ـ'.repeat(n); } return o; }).join(' '); }
function kwCap(t){ const c=CAPS.find(c=>c.kw&&t>=c.s&&t<c.e); if(!c) return;
  const ph=c.w.map(w=>w.t).join(' '), NM=3; let fs=120; while(tw(stretched(ph,NM),fs,900)>800&&fs>70) fs-=6;
  const k=NM*eio(P(t,c.s+0.06,c.s+0.40)), n0=Math.floor(k), n1=Math.min(NM,n0+1), fr=k-n0;
  const s1=stretched(ph,n1), w0=tw(stretched(ph,n0),fs,900), w1=tw(s1,fs,900), sx=(w0+(w1-w0)*fr)/w1;
  const kp=P(t,c.s,c.s+0.14), a=Math.min(1,kp*2)*(1-P(t,c.e-0.09,c.e)), sc=1+0.16*(1-eo(kp)), y=1078;
  X.save(); X.globalAlpha=a; X.translate(540,y); X.scale(sc*sx,sc); X.translate(-540,-y); txt(s1,540,y,fs,{w:900,c:window.ACC_TXT||ACC,sc:window.CAP_SC_HOT,stroke:Math.round(fs*0.13),sh:22}); X.restore(); }

/* 7) نهاية البراند (3 ث بعد VEND): كحلي يطلع ← «المراسيل» ممطوطة تنضم ← تعريف ← أرقام ← عنوان */
function ident(t){ const ID0=VEND; if(t<ID0-0.33) return;
  const kw=eio(P(t,ID0-0.33,ID0)), top=1920*(1-kw);
  const g=X.createLinearGradient(0,0,0,1920); g.addColorStop(0,'#0A0F1C'); g.addColorStop(0.45,'#132340'); g.addColorStop(1,'#0A0F1C');
  X.save(); X.fillStyle=g; X.fillRect(0,top,1080,1920-top); if(kw<1){ X.fillStyle=ACC; X.fillRect(0,top-10,1080,10); } X.restore();
  if(t<ID0) return; const u=t-ID0, cy=760, kc=eo(P(u,0,0.6));
  const hg=X.createRadialGradient(540,cy,40,540,cy,520*kc+1); hg.addColorStop(0,rgba(ACC,0.42)); hg.addColorStop(1,rgba(ACC,0)); X.fillStyle=hg; X.fillRect(0,cy-560,1080,1120);
  [[255,0.5,[]],[318,0.35,[5,18]]].forEach(([R,al,d],i)=>{ const k=eo(P(u,0.05+i*0.1,0.7+i*0.1)); if(k<=0) return; X.save(); X.globalAlpha=al*k; X.strokeStyle=i?'#FFFFFF':ACC; X.lineWidth=3; X.setLineDash(d); X.lineDashOffset=-u*40; X.beginPath(); X.arc(540,cy,R*lp(0.85,1,k),0,7); X.stroke(); X.restore(); });
  const ka=P(u,0,0.18), kn=eio(P(u,0.15,0.80)), k=3*(1-kn), n1=Math.ceil(k-1e-6), n0=Math.max(0,n1-1), fr=n1?(k-n0):0, fs=172;
  const sN=stretched('المراسيل',n1), w1=tw(sN,fs,900), w0=tw(stretched('المراسيل',n0),fs,900), wt=n1?(w0+(w1-w0)*fr):w1, sx=wt/w1, s0=lp(1.08,1,eo(P(u,0,0.8))), sc=s0*Math.min(1,960/(wt*s0));
  if(ka>0){ X.save(); X.globalAlpha=Math.min(1,ka*1.5); X.translate(540,cy); X.scale(sc*sx,sc); X.translate(-540,-cy); txt(sN,540,cy,fs,{w:900,stroke:14,sh:30}); X.restore(); }
  const ku=eo(P(u,0.78,1.08)); if(ku>0){ const w=260*ku; X.save(); X.shadowColor=rgba(ACC,0.9); X.shadowBlur=18; X.fillStyle=ACC; rrect(540-w/2,cy+96,w,10,5); X.fill(); X.restore(); }
  const kt=eo(P(u,0.90,1.20)); if(kt>0){ X.save(); X.globalAlpha=kt; txt('لتجارة المواد الأولية للمنظفات',540,cy+160+(1-kt)*14,42,{w:800,c:'rgba(255,255,255,0.9)',stroke:5}); X.restore(); }
  const kl=eo(P(u,1.20,1.45)); if(kl>0){ X.save(); X.globalAlpha=kl; txt('للطلب والتواصل',540,1110,38,{w:800,c:'rgba(255,255,255,0.75)',stroke:4}); X.restore(); }
  [['0772-112-7339',1200,1.30],['0771-679-1043',1310,1.42]].forEach(([n,y,t0])=>{ const kp=P(u,t0,t0+0.3); if(kp<=0) return; X.save(); X.globalAlpha=Math.min(1,kp*2); X.translate(540,y); const s2=ob(kp); X.scale(s2,s2); X.translate(-540,-y); pill(n,540,y,50,ACC); X.restore(); });
  const kd=eo(P(u,1.65,1.95)); if(kd>0){ X.save(); X.globalAlpha=kd; txt('الموصل – الأيمن – شارع السايلو',540,1420,36,{w:800,c:'rgba(255,255,255,0.7)',stroke:4}); X.restore(); }
}


/* ✓ «راح تحصل عليه» — دائرة وعلامة صح تنرسم */
function checkFx(t){ if(t<3.50||t>4.56) return; const a=win(t,3.50,4.56,0.12,0.16), cx=540, cy=470, R=150;
  const kr=eo(P(t,3.55,3.95)), kc=eo(P(t,3.85,4.15));
  X.save(); X.globalAlpha=a; X.fillStyle=rgba(BG,0.75); X.beginPath(); X.arc(cx,cy,R+18,0,7); X.fill();
  X.lineCap='round'; X.lineWidth=16; X.strokeStyle='#FFFFFF'; X.beginPath(); X.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+Math.PI*2*kr); X.stroke();
  if(kc>0){ const p0=[cx-68,cy+4], p1=[cx-18,cy+54], p2=[cx+74,cy-46], L1=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]), L2=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]); let rem=(L1+L2)*kc;
    X.strokeStyle=window.ACC_TXT||ACC; X.lineWidth=24; X.shadowColor=rgba(ACC,0.8); X.shadowBlur=20; X.beginPath(); X.moveTo(p0[0],p0[1]);
    if(rem<=L1) X.lineTo(p0[0]+(p1[0]-p0[0])*rem/L1,p0[1]+(p1[1]-p0[1])*rem/L1); else { X.lineTo(p1[0],p1[1]); rem-=L1; X.lineTo(p1[0]+(p2[0]-p1[0])*rem/L2,p1[1]+(p2[1]-p1[1])*rem/L2); } X.stroke(); }
  X.restore(); }

/* برميل الأنتارا الحقيقي (صورة مقصوصة) — ينزل على «تستخدم» ويلمع على «الأنتارا» */
const _br=document.createElement('canvas'); const _brx=_br.getContext('2d');
function drumFx(t){ const im=IMG.barrel; if(!im||t<4.55||t>6.75) return; const a=win(t,4.55,6.75,0.05,0.2), kd=P(t,4.58,5.0);
  const bh=440, bw=bh*im.width/im.height, cx=540, base=690, y=kd<0.7?lp(-300,base-bh,eo5(kd/0.7)):(base-bh)-Math.sin((kd-0.7)/0.3*Math.PI)*16;
  X.save(); X.globalAlpha=a;
  const sq=kd>=0.7?1-0.05*Math.sin((kd-0.7)/0.3*Math.PI):1;                                 // ارتداد خفيف عند الهبوط
  X.fillStyle='rgba(0,0,0,0.5)'; X.beginPath(); X.ellipse(cx,base+4,bw*0.5*(2-sq),18,0,0,7); X.fill();
  _br.width=Math.ceil(bw); _br.height=Math.ceil(bh); _brx.clearRect(0,0,_br.width,_br.height); _brx.globalCompositeOperation='source-over'; _brx.drawImage(im,0,0,bw,bh);
  _brx.globalCompositeOperation='source-atop';                                                // ملصق «الأنتارا» على جسم البرميل
  const ly=bh*0.47, lh=bh*0.17, lx=bw*0.13, lw=bw*0.74;
  _brx.fillStyle='rgba(246,248,250,0.96)'; _brx.beginPath(); _brx.roundRect(lx,ly,lw,lh,10); _brx.fill();
  const sg=_brx.createLinearGradient(0,0,bw,0); sg.addColorStop(0,'rgba(0,0,0,0.18)'); sg.addColorStop(0.35,'rgba(0,0,0,0)'); sg.addColorStop(1,'rgba(0,0,0,0.22)'); _brx.fillStyle=sg; _brx.fillRect(lx,ly,lw,lh);
  _brx.font='900 '+Math.round(lh*0.55)+'px '+FONT; _brx.textAlign='center'; _brx.textBaseline='middle'; _brx.direction='rtl'; _brx.fillStyle=BG; _brx.fillText('الأنتارا',bw/2,ly+lh/2+2);
  const sw=P(t,5.44,5.85); if(sw>0&&sw<1){ const x0=lp(-bw*0.5,bw*1.5,eio(sw)); const lg=_brx.createLinearGradient(x0-70,0,x0+70,bh*0.3); lg.addColorStop(0,'rgba(255,255,255,0)'); lg.addColorStop(0.5,'rgba(255,255,255,0.55)'); lg.addColorStop(1,'rgba(255,255,255,0)'); _brx.fillStyle=lg; _brx.fillRect(0,0,bw,bh); }
  _brx.globalCompositeOperation='source-over';
  X.translate(cx,y+bh); X.scale(2-sq,sq); X.translate(-cx,-(y+bh));
  X.shadowColor='rgba(0,0,0,0.5)'; X.shadowBlur=40; X.shadowOffsetY=18; X.drawImage(_br,cx-bw/2,y);
  X.restore(); }

/* ختم «متوفر لدى المراسيل» — ينضرب على «توفرها» */
function stampFx(t){ if(t<6.74||t>8.70) return; const a=win(t,6.74,8.70,0.01,0.2), k=P(t,6.80,7.05);
  const cx=540, cy=460, R=175, sc=k<1?lp(1.9,1,eo(k)):1, sh=(t>7.05&&t<7.3)?Math.sin(t*120)*6*(1-P(t,7.05,7.3)):0;
  if(k<=0) return;
  X.save(); X.globalAlpha=a*Math.min(1,k*3); X.translate(cx+sh,cy); X.rotate(-0.12); X.scale(sc,sc);
  X.fillStyle=rgba(BG,0.82); X.beginPath(); X.arc(0,0,R,0,7); X.fill();
  X.strokeStyle=window.ACC_TXT||ACC; X.lineWidth=10; X.beginPath(); X.arc(0,0,R-8,0,7); X.stroke();
  X.strokeStyle='rgba(255,255,255,0.8)'; X.lineWidth=3; X.setLineDash([6,10]); X.beginPath(); X.arc(0,0,R-26,0,7); X.stroke(); X.setLineDash([]);
  X.translate(-cx,-cy); txt('متوفر لدى',cx,cy-44,46,{w:800,c:'rgba(255,255,255,0.9)'}); txt('المراسيل',cx,cy+26,80,{w:900});
  X.fillStyle=window.ACC_TXT||ACC; rrect(cx-70,cy+80,140,8,4); X.fill();
  X.restore(); }

SCENE_LIST.push(['m_vzoom',vzoom,'video'],['m_blur',bgblur,'video'],['m_dim',dim,'video'],['m_trans',trans,'video'],['m_vig',vignette,'video']);
SCENE_LIST.push(['m_glass',glassFx],['m_check',checkFx],['m_drum',drumFx],['m_stamp',stampFx],['m_usage',usage],['m_visit',visit],['m_ship',ship],['m_kw',kwCap],['m_ident',ident]);
})();

/* ═══ الأصباغ (07) — Promax · قاعدة جاهزة قبل السكربت ═══
   الأدوات بـkit07.js (K07): kStretch (الكشيدة) · kSlam · kMask · kSlideRTL · kSwap · kMarker · kCount · typeScreen · packshot(powder|liquid) · banner.
   الصفحة: انتقالات push / zoom / slide / wipe (من العطور v3) · عناصر الفيديو بـonVideo(). ⛔ الفيديوهات بلا بانر محروق ← K07.banner على طبقة الفيديو.
   قواعد: صوت للانتقال وحده (±0.5 ث) · لا أرضية رثة · لا توهّج/ارتداد · لا خط تحت الشعار. */
(function(){
window.NOBAR = true; window.NO_OUTRO = true; window.CAP_STROKE = 0.085;
const PURP='#6B4BC2', NAVY='#0E1524', INKD='#16213A', YEL='#F7CC2F', K=window.K07;
const IMG={};
[['powder','assets/img/powder.png'],['liquid','assets/img/liquid.png'],...['C1-blue-full','C3-violet-full','C4-red-fill','C7-amaranth-stir','C6-green1-fill','C2-green-full','C5-yellow-flash-slow'].map(n=>[n,'assets/img/swatch/'+n+'.jpg']),['photo-yellow-2','assets/img/photo-yellow-2.jpg']].forEach(([k,s])=>{ const im=new Image(); im.src=s; IMG[k]=im; });
const _init0 = window.init;
window.init = function(o){ const p=_init0(o); const th=(o&&o.theme)||{};
  window.CAP_SC=th.stroke||'#3A2378'; window.CAP_SH=th.strokeShadow||'rgba(46,24,104,0.62)'; window.ACC_TXT=th.accText||'#4FA3FF'; window.CAP_SC_HOT=th.strokeHot||'#0B1222';
  for(const c of (o.cards||[])) if(c.nocap) SCENES.push({s:c.s,e:c.e,m:R_FULL,nocap:true});
  return Promise.all([p, ...Object.values(IMG).map(im=>(im.decode?im.decode():Promise.resolve()).catch(()=>console.error('⚠️ صورة ما انقرت: '+im.src)))]).then(a=>a[0]); };

/* ── أدوات ── */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lp=(a,b,k)=>a+(b-a)*k, P=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const eo=k=>1-Math.pow(1-k,3), eo5=k=>1-Math.pow(1-k,5), eio=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
const ob=k=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2);};
function rgba(h,a){h=String(h).replace('#','');const n=parseInt(h,16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;}
function mix(h1,h2,k){const f=h=>{const n=parseInt(String(h).replace('#',''),16);return[n>>16&255,n>>8&255,n&255];};const a=f(h1),b=f(h2);return `rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*k)).join(',')})`;}
function win(t,s,e,fi,fo){ if(t<s||t>e) return 0; return Math.min(fi?P(t,s,s+fi):1, fo?1-P(t,e-fo,e):1); }
function rrect(x,y,w,h,r){X.beginPath();X.moveTo(x+r,y);X.arcTo(x+w,y,x+w,y+h,r);X.arcTo(x+w,y+h,x,y+h,r);X.arcTo(x,y+h,x,y,r);X.arcTo(x,y,x+w,y,r);X.closePath();}
const ISO=s=>String(s).replace(/(\d[\d\-.]*\d%?|\d%?)/g,'⁦$1⁩');
function txt(s,x,y,size,o){ o=o||{}; s=ISO(s); X.save(); X.font=(o.w||900)+' '+size+'px '+FONT; X.textAlign=o.al||'center'; X.textBaseline='middle'; X.direction=o.ltr?'ltr':'rtl';
  if(o.stroke){ X.lineJoin='round'; X.miterLimit=2; X.strokeStyle=o.sc||window.CAP_SC||rgba(BG,0.92); X.lineWidth=Math.max(4,o.stroke*0.65);
    X.shadowColor=o.shc||window.CAP_SH||'rgba(0,0,0,0.55)'; X.shadowBlur=Math.max(o.sh||0,22); X.shadowOffsetY=6; X.strokeText(s,x,y); X.shadowColor='transparent'; X.shadowBlur=0; }
  else if(o.sh){ X.shadowColor=o.shc||'rgba(0,0,0,0.6)'; X.shadowBlur=o.sh; X.shadowOffsetY=o.shy??4; }
  X.fillStyle=o.c||'#FFFFFF'; X.fillText(s,x,y); X.restore(); }
function tw(s,size,w){ X.save(); X.font=(w||900)+' '+size+'px '+FONT; X.direction='rtl'; const v=X.measureText(ISO(s)).width; X.restore(); return v; }
function pill(s,cx,cy,fs,fill,col){ const w=tw(s,fs,900)+fs*1.4, h=fs*2.05;
  X.save(); X.shadowColor='rgba(0,0,0,0.3)'; X.shadowBlur=24; X.shadowOffsetY=8; rrect(cx-w/2,cy-h/2,w,h,h/2); X.fillStyle=fill; X.fill(); X.restore();
  txt(s,cx,cy+2,fs,{c:col||'#FFFFFF'}); return w; }
function glass(x,y,w,h,r,a,bar){ X.save(); X.shadowColor='rgba(0,0,0,0.45)'; X.shadowBlur=40; X.shadowOffsetY=14; rrect(x,y,w,h,r); X.fillStyle=rgba(BG,a); X.fill(); X.restore();
  if(bar){ X.save(); rrect(x,y,w,h,r); X.clip(); X.fillStyle=bar; X.fillRect(x,y,w,7); X.restore(); } }
const JOINF='بتثجحخسشصضطظعغفقكلمنهيئ', ARL=/[ء-ي]/;
function slots(w){ const pre=w.startsWith('ال')?2:0, s=[]; for(let i=pre;i<w.length-1;i++){ const a=w[i],b=w[i+1]; if(!JOINF.includes(a)||!ARL.test(b)) continue; if(a==='ل'&&'اأإآ'.includes(b)) continue; s.push(i); }
  return s.length>3?[...new Set([s[0],s[Math.floor(s.length/2)],s[s.length-1]])]:s; }
function stretched(ph,n){ return ph.split(' ').map(w=>{ const sl=slots(w); let o=''; for(let i=0;i<w.length;i++){ o+=w[i]; if(sl.includes(i)) o+='ـ'.repeat(n); } return o; }).join(' '); }
/* كلمة تنمطّ بالكشيدة (ناعمة بلا قفزات) */
function stretchWord(t,ph,t0,cx,cy,fs,c,o){ o=o||{}; const NM=o.nm||3; let f=fs; while(tw(stretched(ph,NM),f,900)>(o.max||900)&&f>60) f-=4;
  const k=NM*eio(P(t,t0+0.05,t0+0.42)), n0=Math.floor(k), n1=Math.min(NM,n0+1), fr=k-n0, s1=stretched(ph,n1), w0=tw(stretched(ph,n0),f,900), w1=tw(s1,f,900), sx=(w0+(w1-w0)*fr)/w1;
  const kp=P(t,t0,t0+0.16), sc=1+0.22*(1-eo(kp));
  X.save(); X.globalAlpha*=Math.min(1,kp*2.5); X.translate(cx,cy); X.scale(sc*sx,sc); X.translate(-cx,-cy); txt(s1,cx,cy,f,{c:c,sh:o.sh||0,shc:o.shc,shy:8}); X.restore(); }
/* كتابة حرف حرف + مؤشر */
function typeLine(t,s,t0,t1,cx,cy,fs,c,o){ o=o||{}; const n=Math.round(s.length*P(t,t0,t1)); if(n<=0) return; const part=s.slice(0,n);
  txt(part,cx,cy,fs,{c:c,al:o.al||'center'}); if(t<t1+0.5&&Math.floor(t*3.5)%2===0){ const w=tw(part,fs,900), x=(o.al==='right')?cx-w-14:cx-w/2-14; X.fillStyle=ACC; X.fillRect(x,cy-fs*0.55,7,fs*1.05); } }


/* ═════════ أساس الصفحة ═════════ */
function drawPageBase(t,p){
  const H=1920; const g=X.createLinearGradient(0,0,0,H); g.addColorStop(0,'#F9FBFF'); g.addColorStop(1,'#EEF2FB'); X.fillStyle=g; X.fillRect(0,0,1080,H);
  const kg=p[2]==='in0'?eo(P(t,0,0.6)):1;                                    // الشبكة تنرسم من النص (أول الفيديو)
  for(let x=60;x<1080;x+=60){ const maj=x%240===60; X.strokeStyle=rgba(maj?PURP:ACC,maj?0.16:0.08); X.lineWidth=maj?2:1; const h=H*kg; X.beginPath(); X.moveTo(x,(H-h)/2); X.lineTo(x,(H+h)/2); X.stroke(); }
  for(let y=60;y<H;y+=60){ const maj=y%240===60; X.strokeStyle=rgba(maj?PURP:ACC,maj?0.16:0.08); X.lineWidth=maj?2:1; const w=1080*kg; X.beginPath(); X.moveTo((1080-w)/2,y); X.lineTo((1080+w)/2,y); X.stroke(); }
  X.strokeStyle=PURP; X.lineWidth=4; [[90,380,1],[990,380,-1],[90,1362,1],[990,1362,-1]].forEach(([x,y,s],i)=>{ const dy=i<2?1:-1; X.beginPath(); X.moveTo(x,y+36*dy); X.lineTo(x,y); X.lineTo(x+36*s,y); X.stroke(); });
  // هيدر: الشعار بخط الجزيرة بنفسجي + التعريف أزرق
  txt('المراسيل',540,236,96,{c:PURP});
  txt('لتجارة المواد الأولية للمنظفات',540,318,34,{c:ACC});
  // فوتر: الأرقام على كل صفحة
  X.fillStyle=rgba(PURP,0.22); X.fillRect(140,1398,800,2);
  txt('للطلب والتواصل',540,1432,30,{c:rgba(INKD,0.7)});
  contactRow(1492,1);
}
/* أزرار التواصل (نفس ترتيب البانر): واتساب · اتصال · الرقمين */
const P_CALL=new Path2D('M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z');
const P_WA=new Path2D('M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z');
function glyph(P2,x,y,size,c){ X.save(); X.translate(x-size/2,y-size/2); X.scale(size/24,size/24); X.fillStyle=c; X.fill(P2); X.restore(); }
function waIcon(x,y,r){ X.save(); X.shadowColor='rgba(14,21,36,0.22)'; X.shadowBlur=12; X.shadowOffsetY=4; X.fillStyle='#25D366'; X.beginPath(); X.arc(x,y,r,0,7); X.fill(); X.restore(); glyph(P_WA,x,y,r*1.15,'#FFFFFF'); }
function callIcon(x,y,r){ X.save(); X.shadowColor='rgba(14,21,36,0.22)'; X.shadowBlur=12; X.shadowOffsetY=4; X.fillStyle=ACC; X.beginPath(); X.arc(x,y,r,0,7); X.fill(); X.restore(); glyph(P_CALL,x,y,r*1.1,'#FFFFFF'); }
function contactRow(cy,light){ const pw=300, ph=74, r=37, x0=540-(2*r*2+12+20+pw*2+16)/2;
  waIcon(x0+r,cy,r); callIcon(x0+3*r+12,cy,r);
  [['0771-679-1043',x0+4*r+12+20+pw/2],['0772-112-7339',x0+4*r+12+20+pw+16+pw/2]].forEach(([n,x])=>{ X.save(); X.shadowColor=light?'rgba(46,24,104,0.25)':'rgba(0,0,0,0.35)'; X.shadowBlur=18; X.shadowOffsetY=6; rrect(x-pw/2,cy-ph/2,pw,ph,ph/2); X.fillStyle=ACC; X.fill(); X.restore(); txt(n,x,cy+2,38,{c:'#FFFFFF'}); }); }
/* ═════════ الصفحة البيضاء (كامل الشاشة) — انتقالات حديثة ═════════
   دخول: wipe (مسح مائل) · push (الصفحة تدفع الفيديو لفوق) · خروج: wipe · zoom (زوم يخترق الجليكان ويكشف الفيديو) · slide (الصفحة تنسحب يسار والفيديو يدخل من اليمين) */
const PAGES=[[4.96,9.42,'push','slide'],[14.34,23.12,'wipe','slide'],[30.92,35.21,'push','wipe']];   // بهت/تعكّر · المنتجات+الألوان · الخاتمة
const PW=0.36, ZC=[540,1050];                                    // مدة الانتقال · مركز زوم الخروج (الجليكان)
function pageAlpha(t){ for(const p of PAGES){ if(t>=p[0]&&t<=p[1]+PW) return p; } return null; }
window.CAP_DARK=t=>{ for(const p of PAGES) if(t>=p[0]+PW*0.7&&t<p[1]+PW*0.3) return true; return false; };
const _pb=document.createElement('canvas'); _pb.width=1080; _pb.height=1920; const _pbx=_pb.getContext('2d');
function grabVideo(){ _pbx.clearRect(0,0,1080,1920); _pbx.drawImage(C,0,0); }
function pageBody(t,p){ drawPageBase(t,p); pageContent(t); }
function page(t){ const p=pageAlpha(t); if(!p) return; const [p0,p1,tin,tout]=p;
  const kin=t<p0+PW?eio(P(t,p0,p0+PW)):1, kout=t>p1?eio(P(t,p1,p1+PW)):0;
  if(tin==='push'&&kin<1){ grabVideo(); X.fillStyle=NAVY; X.fillRect(0,0,1080,1920); X.drawImage(_pb,0,-kin*1920);          // الفيديو ينطلع لفوق
    const y=(1-kin)*1920; X.save(); X.translate(0,y); pageBody(t,p); X.restore(); X.fillStyle=YEL; X.fillRect(0,y-12,1080,12); return; }   // حافة صفراء صلبة
  if(tout==='slide'&&kout>0){ grabVideo(); const x=(1-kout)*1080; X.fillStyle=NAVY; X.fillRect(0,0,1080,1920);
    X.drawImage(_pb,x,0); X.save(); X.translate(x-1080,0); pageBody(t,p); X.restore(); X.fillStyle=YEL; X.fillRect(x-6,0,12,1920); return; }
  if(tout==='zoom'&&kout>0){ const s=1+4*Math.pow(kout,2.2); X.save(); X.globalAlpha=1-eo(P(t,p1+PW*0.30,p1+PW));            // يخترق الجليكان
    X.translate(ZC[0],ZC[1]); X.scale(s,s); X.translate(-ZC[0],-ZC[1]); pageBody(t,p); X.restore(); return; }
  let clip=null; if(tin==='wipe'&&t<p0+PW) clip=kin; const out=tout==='wipe'?kout:0;
  X.save();
  if(clip!==null||out>0){ X.beginPath(); const sk=260;
    if(clip!==null){ const x0=lp(1080+sk,-sk,clip); X.moveTo(x0,0); X.lineTo(1080+sk,0); X.lineTo(1080+sk,1920); X.lineTo(x0-sk,1920); }
    else { const x0=lp(1080+sk,-sk,out); X.moveTo(-sk,0); X.lineTo(x0,0); X.lineTo(x0-sk,1920); X.lineTo(-sk,1920); }
    X.closePath(); X.clip(); }
  pageBody(t,p); X.restore();
  const edge=clip!==null?clip:(out>0?out:null);
  if(edge!==null&&edge>0&&edge<1){ const sk=260, x0=lp(1080+sk,-sk,edge); X.save(); X.strokeStyle=PURP; X.lineWidth=14; X.beginPath(); X.moveTo(x0,0); X.lineTo(x0-sk,1920); X.stroke(); X.restore(); }
}
page.layer='video';
/* عناصر الفيديو تتبع الانتقال: تنطلع مع الفيديو بالـpush · تدخل مع الفيديو بالـslide · تنقصّ بحافة الـwipe · مخفية تحت الصفحة */
function onVideo(t,fn){ X.save(); let ok=true;
  for(const p of PAGES){ const [p0,p1,tin,tout]=p;
    if(t>=p0+PW&&t<=p1){ ok=false; break; }
    if(t>=p0&&t<p0+PW){ const k=eio(P(t,p0,p0+PW));
      if(tin==='push') X.translate(0,-k*1920);
      else { const sk=260, x0=lp(1080+sk,-sk,k); X.beginPath(); X.moveTo(-sk,0); X.lineTo(x0,0); X.lineTo(x0-sk,1920); X.lineTo(-sk,1920); X.closePath(); X.clip(); } }
    if(t>p1&&t<=p1+PW&&tout==='slide') X.translate((1-eio(P(t,p1,p1+PW)))*1080,0); }
  if(ok) fn(t); X.restore(); }

/* محتوى الصفحات — قسم يدخل ويطلع بانسحاب أفقي */
function section(t,s0,s1,fn){ if(t<s0-0.05||t>s1+0.3) return; const ki=eo5(P(t,s0,s0+0.32)), ko=eio(P(t,s1,s1+0.3));
  X.save(); X.globalAlpha*=Math.min(1,ki*1.5)*(1-ko); X.translate((1-ki)*-160+ko*260,0); fn(t); X.restore(); }
const TEXD=0;                                                   // لو ADDR: توقيت التكسابون = توقيتنا + TEXD (الخريطة تدخل ↔ 23.51)
function pageContent(t){ section(t,4.96,9.9,problem); section(t,14.34,17.10,products); section(t,17.10,23.6,colors); section(t,30.92,36,finale); }
/* ═══ محتوى الصفحات ═══ */
const GRAY='#A7AFBD';
function mixc(h1,h2,k){ const f=h=>{const n=parseInt(String(h).replace('#',''),16);return[n>>16&255,n>>8&255,n&255];}; const a=f(h1),b=f(h2); return `rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*k)).join(',')})`; }
/* قارورة منظف فيكتور (فلات) — fade: البهتان 0→1 · murk: التعكّر 0→1 */
function bottle(cx,top,fade,murk,a){ const bw=280,bh=320,nw=110,nh=60,cw=140,ch=50, x=cx-bw/2, y=top+ch+nh;
  X.save(); X.globalAlpha*=a; X.fillStyle=NAVY; X.fillRect(cx-cw/2,top,cw,ch); X.fillStyle='#FFFFFF'; X.fillRect(cx-nw/2,top+ch,nw,nh); X.strokeStyle=INKD; X.lineWidth=5; X.strokeRect(cx-nw/2,top+ch,nw,nh);
  X.fillStyle='#FFFFFF'; rrect(x,y,bw,bh,40); X.fill(); X.save(); rrect(x,y,bw,bh,40); X.clip();
  const lc=mixc(ACC,GRAY,fade); X.fillStyle=lc; X.beginPath(); X.moveTo(x,y+70); for(let i=0;i<=bw;i+=10) X.lineTo(x+i,y+70+Math.sin(i/bw*Math.PI*2+VT*2)*8); X.lineTo(x+bw,y+bh); X.lineTo(x,y+bh); X.closePath(); X.fill();
  if(murk>0){ X.fillStyle=`rgba(236,232,222,${0.55*murk})`; X.fillRect(x,y+60,bw,bh); let s=7; const r=()=>{s=(s*9301+49297)%233280;return s/233280;};
    for(let i=0;i<90;i++){ const px=x+r()*bw, py=y+80+r()*(bh-90), sz=2+r()*7; X.fillStyle=`rgba(${r()>0.5?'120,110,95':'250,248,240'},${0.75*murk})`; X.beginPath(); X.arc(px,py+Math.sin(VT*1.5+i)*3,sz,0,7); X.fill(); } }
  X.restore(); X.strokeStyle=INKD; X.lineWidth=5; rrect(x,y,bw,bh,40); X.stroke(); X.fillStyle='rgba(255,255,255,0.85)'; X.fillRect(x+40,y+150,bw-80,110); X.restore(); }
let VT=0;
/* ① «إذا بهت لونه أو تعكّر · راح يفقد قيمته التسويقية» — الكلمات تمثّل معناها + قارورة تبهت وتتعكّر */
function problem(t){ VT=t; const fade=eio(P(t,5.55,6.15)), murk=eo(P(t,6.40,7.00)), lose=eio(P(t,7.60,8.30));
  if(t>=4.98){ const w1=tw('إذا بهت ',76), w2=tw('لونه',76), xr=540+(w1+w2)/2, k=eo5(P(t,4.98,5.30)), h=100;
    X.save(); X.beginPath(); X.rect(0,470-h/2,1080,h); X.clip(); const dy=(1-k)*h; txt('إذا بهت',xr,470+dy,76,{c:INKD,al:'right'});
    X.save(); X.globalAlpha*=lp(1,0.55,fade); txt('لونه',xr-w1,470+dy,76,{c:mixc(ACC,GRAY,fade),al:'right'}); X.restore(); X.restore(); }
  if(t>=6.14){ const w1=tw('أو ',76), w2=tw('تعكّر',76), xr=540+(w1+w2)/2, k=eo5(P(t,6.14,6.44)), h=100;
    X.save(); X.beginPath(); X.rect(0,590-h/2,1080,h); X.clip(); const dy=(1-k)*h; txt('أو',xr,590+dy,76,{c:INKD,al:'right'});
    X.save(); X.filter=`blur(${(murk*5).toFixed(1)}px)`; X.globalAlpha*=lp(1,0.7,murk); txt('تعكّر',xr-w1,590+dy,76,{c:mixc(ACC,'#8C8577',murk),al:'right'}); X.restore(); X.restore(); }
  const kb=eio(P(t,5.02,5.40)); if(kb>0){ X.save(); X.beginPath(); X.rect(0,690,1080,560*kb+20); X.clip(); bottle(540,690+lose*25,fade,murk,lp(1,0.45,lose)); X.restore(); }
  if(t>=7.28){ K.kLine(t,[['راح',6.98],['يفقد',7.28],['قيمته',7.68],['التسويقية',8.16,ACC]],540,1225,66,INKD); const bw=560, bx=540-bw/2, by=1290, kv=eio(P(t,7.70,8.60));
    X.fillStyle=K.rgba(INKD,0.12); X.fillRect(bx,by,bw,16); X.fillStyle=mixc(ACC,GRAY,kv); X.fillRect(bx+bw*lp(0,0.7,kv),by,bw*lp(1,0.3,kv),16); } }   // شريط القيمة ينكمش لليمين
/* ② «أصباغ مركزة ومخصصة للمنظفات» — الباكشوتين بخلفياتهم */
function products(t){ K.kMask(t,'أصباغ',14.40,540,470,72,INKD); K.kStretch(t,'مركزة',15.08,540,590,140,ACC,{max:700});
  K.packshot(t,IMG.powder,'powder',14.50,330,965,460,{R:200,hold:2.6}); K.packshot(t,IMG.liquid,'powder',14.78,770,975,490,{R:205,hold:2.4,col:PURP,col2:K.VIO_L});
  K.kLine(t,[['ومخصصة',15.64],['للمنظفات',16.14,ACC]],540,1290,66,PURP); }
/* ③ «بأكثر من عشر أنواع ودرجات لونية · من الألوان الشفافة إلى الدرجات الفسفورية» — عدّاد + 7 كروت حقيقية تتجمّع بمجموعتين */
const SW=[['C1-blue-full','t'],['C3-violet-full','t'],['C4-red-fill','t'],['C7-amaranth-stir','t'],['C6-green1-fill','t'],['C2-green-full','f'],['photo-yellow-2','f',[180,860,620,830]]];
const SRC=[230,640,620,830];                                         // قصّ البيكر من الفريم
function card(im,x,y,w,h,a,cr){ if(!im||!im.complete) return; const c=cr||SRC; X.save(); X.globalAlpha*=a; X.fillStyle='#FFFFFF'; X.fillRect(x-6,y-6,w+12,h+12); X.drawImage(im,c[0],c[1],c[2],c[3],x,y,w,h); X.strokeStyle=K.rgba(PURP,0.35); X.lineWidth=3; X.strokeRect(x-6,y-6,w+12,h+12); X.restore(); }
function colors(t){ const kb=eio(P(t,17.10,17.34)); if(kb>0){ const s=230, x=540-s/2, y=400; X.save(); K.reveal(x,y,s,s*0.62,kb,'r'); X.fillStyle=K.YEL; X.fillRect(x,y,s,s*0.62); X.fillStyle=NAVY; X.fillRect(x,y+s*0.62-12,s,12);
    const n=Math.floor(10*P(t,17.16,18.56)+1e-6); K.ltrCenter('+'+n,540,y+s*0.31-4,104,NAVY); X.restore(); }
  K.kLine(t,[['أنواع',18.08],['ودرجات',18.56],['لونية',19.02,ACC]],540,640,60,INKD);
  const kg=eio(P(t,20.30,20.80));                                    // من الشبكة ← المجموعتين
  const tIdx=SW.filter(s=>s[1]==='t').length;
  const fT=eio(P(t,22.08,22.40)), dimT=lp(1,0.28,fT), dimF=t<22.08?lp(1,0.28,eio(P(t,20.30,20.70))):lp(0.28,1,fT);   // الشفافة تضوي ← الفسفورية تبهت · وبالعكس
  SW.forEach(([n,g,cr],i)=>{ const t0=18.56+i*0.09, kp=eo5(P(t,t0,t0+0.3)); if(kp<=0) return;
    const r1=i<4, gw=180, gh=240, gx=r1? 540+(4*gw+3*20)/2-gw-(i)*(gw+20) : 540+(3*gw+2*20)/2-gw-(i-4)*(gw+20), gy=r1?730:1000;
    let fx,fy,fw,fh,j; if(g==='t'){ j=i; fw=158; fh=210; fx=540+(5*fw+4*14)/2-fw-j*(fw+14); fy=800; } else { j=i-tIdx; fw=165; fh=220; fx=540+(2*fw+30)/2-fw-j*(fw+30); fy=1110; }
    const x=lp(gx,fx,kg), y=lp(gy,fy,kg)+(1-kp)*40, w=lp(gw,fw,kg), h=lp(gh,fh,kg);
    card(IMG[n],x,y,w,h,kp*(g==='t'?dimT:dimF),cr); });
  if(t>=20.44){ X.save(); X.globalAlpha*=dimT; K.kMarker(t,'الشفافة',20.44,540,745,56,INKD,ACC,'#FFFFFF'); X.restore(); }
  if(t>=20.44){ X.save(); X.globalAlpha*=dimF*Math.min(1,P(t,20.44,20.70)); if(t<22.08) txt('الفسفورية',540,1055,56,{c:INKD}); else K.kMarker(t,'الفسفورية',22.08,540,1055,56,INKD,K.YEL,NAVY); X.restore(); } }
function finale(t){ K.typeScreen(t,{x:110,y:440,w:860,h:330},[['لأن اللي يسوق منتجك',31.44,32.40],['من أول نظرة',32.46,33.30,{c:PURP}]],{tIn:31.02,fs:64});
  if(t>=33.38){ const k=P(t,33.38,33.58); X.save(); X.globalAlpha*=k; txt('هو',540,890,64,{c:INKD}); X.restore(); }
  if(t>=33.70){ const g=X.createLinearGradient(170,0,910,0); ['#2E5BD8','#6B3FD0','#E0213A','#D6336C','#C9E62F','#33D15A'].forEach((c,i,a)=>g.addColorStop(i/(a.length-1),c));
    K.kStretch(t,'اللون',33.70,540,1070,230,g,{max:860,dur:0.6}); }
  const kf=P(t,34.0,34.4); if(kf>0){ X.save(); X.globalAlpha*=kf*0.75; txt('للاستخدام الصناعي في المنظفات',540,1300,28,{c:INKD}); X.restore(); } }


/* ④ «عنوانّا بالموصل» — فقرة الخريطة من تكسابون N70 (v5 المعتمدة) كما هي: شوارع OpenStreetMap الحقيقية. أوقاتها بتوقيت التكسابون ← TEXD */
const MX0=60, MY0=500, MW=960, MH=820, MS=2.1, MC=[-162,-140];
const mp=(q)=>[540+(q[0]-MC[0])*MS, 910-(q[1]-MC[1])*MS];
function plen(pts){ let L=0; for(let i=1;i<pts.length;i++) L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); return L; }
function partial(pts,k){ const L=plen(pts)*k, o=[pts[0]]; let acc=0; for(let i=1;i<pts.length;i++){ const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); if(acc+d>=L){ const f=(L-acc)/(d||1); o.push([lp(pts[i-1][0],pts[i][0],f),lp(pts[i-1][1],pts[i][1],f)]); return o; } acc+=d; o.push(pts[i]); } return o; }
function poly(pts){ X.beginPath(); X.moveTo(pts[0][0],pts[0][1]); for(let i=1;i<pts.length;i++) X.lineTo(pts[i][0],pts[i][1]); }
function mapPill(s,x,y,fs,fill,col){ const w=tw(s,fs,900)+fs*1.2, h=fs*1.9; X.save(); X.shadowColor='rgba(14,21,36,0.18)'; X.shadowBlur=16; X.shadowOffsetY=5; rrect(x-w/2,y-h/2,w,h,h/2); X.fillStyle=fill; X.fill(); X.restore(); txt(s,x,y+2,fs,{c:col}); }
function mapScene(t){ const M=window.MAPD; if(!M) return;
  const ki=eo5(P(t,23.51,23.85));
  { const w1=tw('عنوانّا ',62,900), w2=tw('بالموصل',62,900), xr=540+(w1+w2)/2; txt('عنوانّا',xr,436,62,{c:INKD,al:'right'});
    const km=P(t,24.55,24.85); if(km>0){ X.save(); X.globalAlpha*=km; txt('بالموصل',xr-w1,436,62,{c:ACC,al:'right'}); X.restore(); } }
  X.save(); X.shadowColor='rgba(14,21,36,0.13)'; X.shadowBlur=30; X.shadowOffsetY=10; rrect(MX0,MY0,MW,MH,30); X.fillStyle='#FFFFFF'; X.fill(); X.restore();
  X.save(); rrect(MX0,MY0,MW,MH,30); X.clip();
  const pz=1+0.06*eio(P(t,26.8,28.8)), co=mp(M.company); X.translate(co[0],co[1]); X.scale(pz,pz); X.translate(-co[0],-co[1]);
  const kr=eio(P(t,23.55,24.45));                                                        // الشوارع تنرسم
  const S=[['svc','#E6EBF5',9],['res','#DFE5F2',13],['silo','#DFE5F2',15],['main','#CCD8F2',26]];
  S.forEach(([k,c,lw])=>{ X.strokeStyle=c; X.lineWidth=lw; X.lineCap='round'; X.lineJoin='round';
    M.roads.filter(r=>r.k===k).forEach(r=>{ const pts=r.p.map(mp); poly(kr<1?partial(pts,kr):pts); X.stroke(); }); });
  // شارع السايلو يضوي بالبنفسجي
  const ks=eo(P(t,25.25,25.6)); if(ks>0){ X.save(); X.globalAlpha*=ks; X.strokeStyle=PURP; X.lineWidth=14; X.lineCap='round'; X.shadowColor=rgba(PURP,0.6); X.shadowBlur=18;
    M.roads.filter(r=>r.k==='silo').forEach(r=>{ poly(r.p.map(mp)); X.stroke(); }); X.restore(); }
  // المسار
  const R=M.route.map(mp), iJ=M.iJ; const segA=R.slice(0,iJ+1), segB=R.slice(iJ);
  const ka=eio(P(t,24.55,26.05)), kb=eio(P(t,26.05,26.75)); let path=null;
  if(ka>0){ path=ka<1?partial(segA,ka):segA; if(kb>0) path=path.concat(partial(segB,kb).slice(1)); }
  if(path){ X.save(); X.lineCap='round'; X.lineJoin='round'; poly(path); X.strokeStyle='#FFFFFF'; X.lineWidth=22; X.stroke(); poly(path); X.strokeStyle=ACC; X.lineWidth=12; X.stroke(); X.restore();
    const hd=path[path.length-1]; if(kb<1){ X.save(); X.fillStyle='#FFFFFF'; X.beginPath(); X.arc(hd[0],hd[1],17,0,7); X.fill(); X.fillStyle=ACC; X.beginPath(); X.arc(hd[0],hd[1],11,0,7); X.fill(); X.restore(); } }
  // دورة الحماميل
  const rb=mp([0,0]), kd=P(t,23.95,24.3); if(kd>0){ const s2=ob(kd); X.save(); X.translate(rb[0],rb[1]); X.scale(s2,s2); X.fillStyle='#FFFFFF'; X.strokeStyle=NAVY; X.lineWidth=8; X.beginPath(); X.arc(0,0,20,0,7); X.fill(); X.stroke(); X.fillStyle=NAVY; X.beginPath(); X.arc(0,0,7,0,7); X.fill(); X.restore();
    X.save(); X.globalAlpha*=Math.min(1,kd*2); mapPill('دورة الحماميل',rb[0]-50,rb[1]+70,32,NAVY,'#FFFFFF'); X.restore(); }
  // تسمية شارع السايلو
  if(ks>0){ const sp=mp([-198,-156]); X.save(); X.globalAlpha*=ks; X.translate(sp[0],sp[1]); const s3=lp(0.6,1,ob(P(t,25.25,25.6))); X.scale(s3,s3); X.translate(-sp[0],-sp[1]); mapPill('شارع السايلو',sp[0],sp[1],34,PURP,'#FFFFFF'); X.restore(); }
  // الدبوس: مكتب المراسيل
  const kp=P(t,26.75,27.05); if(kp>0){ const land=co[1], yy=lp(land-220,land,eo5(kp));
    X.save(); X.globalAlpha*=Math.min(1,kp*3); X.fillStyle='rgba(14,21,36,0.18)'; X.beginPath(); X.ellipse(co[0],land+4,18,6,0,0,7); X.fill();
    X.translate(co[0],yy); X.shadowColor=rgba(ACC,0.6); X.shadowBlur=20; X.fillStyle=ACC; X.beginPath(); X.moveTo(0,0); X.bezierCurveTo(-16,-30,-40,-48,-40,-80); X.arc(0,-80,40,Math.PI,0); X.bezierCurveTo(40,-48,16,-30,0,0); X.closePath(); X.fill(); X.shadowBlur=0; X.fillStyle='#FFFFFF'; X.beginPath(); X.arc(0,-80,15,0,7); X.fill(); X.restore();
    const kq=P(t,26.95,27.25); if(kq>0){ X.save(); X.globalAlpha*=eo(kq); const cx=co[0]+48, cw=400, ch=118, cy0=co[1]-140;
      X.shadowColor='rgba(14,21,36,0.18)'; X.shadowBlur=20; X.shadowOffsetY=6; rrect(cx,cy0,cw,ch,22); X.fillStyle='#FFFFFF'; X.fill(); X.shadowColor='transparent'; X.strokeStyle=rgba(ACC,0.5); X.lineWidth=3; rrect(cx,cy0,cw,ch,22); X.stroke();
      X.fillStyle=ACC; X.fillRect(cx+cw-8,cy0+18,8,ch-36);
      txt('شركة المراسيل',cx+cw-30,cy0+40,40,{c:INKD,al:'right'});
      const kw=eo(P(t,27.13,27.45)); if(kw>0){ X.globalAlpha*=kw; txt('قرب ورش الألمنيوم والبلاستيك',cx+cw-30,cy0+88,27,{c:PURP,al:'right'}); }
      X.restore(); } }
  X.restore();
  X.save(); X.globalAlpha*=0.6*ki; txt('© OpenStreetMap',MX0+24,MY0+MH-22,18,{ltr:1,al:'left',c:INKD}); X.restore();
  X.strokeStyle=rgba(PURP,0.25); X.lineWidth=3; rrect(MX0,MY0,MW,MH,30); X.stroke(); }

/* ═════════ أجزاء الفيديو ═════════ */
const BN_Y=1180, BN_F=140;
const _bn=document.createElement('canvas'); _bn.width=1080; _bn.height=1920-BN_Y; const _bx=_bn.getContext('2d');
const _bg=_bx.createLinearGradient(0,0,0,BN_F); _bg.addColorStop(0,'rgba(0,0,0,0)'); _bg.addColorStop(1,'rgba(0,0,0,1)');
function restoreBanner(){ _bx.globalCompositeOperation='source-over'; _bx.clearRect(0,0,1080,_bn.height); _bx.drawImage(VF,0,BN_Y,1080,_bn.height,0,0,1080,_bn.height);
  _bx.globalCompositeOperation='destination-in'; _bx.fillStyle=_bg; _bx.fillRect(0,0,1080,_bn.height); _bx.globalCompositeOperation='source-over'; X.drawImage(_bn,0,BN_Y); }
const PUNCH=[[2.42,1.08,0.35,540,900],[30.40,1.07,0.3,540,900]];   // «اللون» · «صح»
const PUSH=[[0.00,2.98,1.10,1.00,540,960],[11.68,14.70,1.00,1.06,540,900],[23.12,25.68,1.00,1.05,540,900],[27.74,31.28,1.00,1.06,540,900]];
function vzoom(t){ let s=1,cx=540,cy=640; for(const p of PUSH) if(t>=p[0]&&t<p[1]){ s*=lp(p[2],p[3],eio(P(t,p[0],p[1]))); cx=p[4]; cy=p[5]; }
  for(const p of PUNCH) if(t>=p[0]&&t<p[0]+p[2]){ s*=1+(p[1]-1)*(1-eo(P(t,p[0],p[0]+p[2]))); cx=p[3]; cy=p[4]; }
  if(s===1) return; X.save(); X.translate(cx,cy); X.scale(s,s); X.translate(-cx,-cy); X.drawImage(VF,0,0,W,H); X.restore(); restoreBanner(); }
const TRANS=[[2.98,'zoom',1],[10.50,'whip',1],[11.68,'zoom',1],[25.68,'whip',1],[27.74,'zoom',1]];   // لقطة القائد 25.68–27.74 بلا قطع
const _wc=document.createElement('canvas'); _wc.width=1080; _wc.height=1310; const _wx=_wc.getContext('2d');
const _wo=document.createElement('canvas'); _wo.width=1080; _wo.height=1310; const _wox=_wo.getContext('2d');
const _wg=_wox.createLinearGradient(0,1150,0,1310); _wg.addColorStop(0,'rgba(0,0,0,1)'); _wg.addColorStop(1,'rgba(0,0,0,0)');
function snap(){ _wx.clearRect(0,0,1080,1310); _wx.drawImage(C,0,0,1080,1310,0,0,1080,1310); _wox.globalCompositeOperation='source-over'; _wox.clearRect(0,0,1080,1310); }
function commit(){ _wox.globalAlpha=1; _wox.globalCompositeOperation='destination-in'; _wox.fillStyle=_wg; _wox.fillRect(0,0,1080,1310); _wox.globalCompositeOperation='source-over'; X.drawImage(_wo,0,0); }
function trans(t){ for(const tr of TRANS){ const c=tr[0];
  if(tr[1]==='whip'){ const u=(t-c)/0.12; if(u<-1||u>1) continue; const sh=300*tr[2]*Math.pow(1-Math.abs(u),2)*(u<0?-1:1), sp=Math.abs(sh)*0.7; snap(); for(let i=0;i<9;i++){ _wox.globalAlpha=i?0.22:1; _wox.drawImage(_wc,sh+(i-4)*sp/9*2,0); } commit(); }
  else { const u=(t-c)/0.16; if(u<-1||u>1) continue; const e=Math.pow(1-Math.abs(u),2), z=1+0.24*e; snap(); for(let i=0;i<6;i++){ const zz=z*(1+i*0.035*e); _wox.globalAlpha=i?0.2:1; _wox.save(); _wox.translate(540,700); _wox.scale(zz,zz); _wox.translate(-540,-700); _wox.drawImage(_wc,0,0); _wox.restore(); } commit(); } } }
const DIMS=[[0.00,5.40,0.28,0.01,0.1],[9.42,14.70,0.28,0.1,0.1],[23.12,31.30,0.28,0.1,0.1]];
function dim(t){ let a=0; for(const d of DIMS) a=Math.max(a,d[2]*win(t,d[0],d[1],d[3],d[4])); if(a<=0) return;
  const g=X.createLinearGradient(0,0,0,1310); g.addColorStop(0,rgba(BG,a)); g.addColorStop(0.78,rgba(BG,a*0.85)); g.addColorStop(1,rgba(BG,0)); X.fillStyle=g; X.fillRect(0,0,1080,1310); }


/* نهاية البراند (3 ث بعد VEND) */
function ident(t){ const ID0=VEND; if(t<ID0-0.33) return;
  const kw=eio(P(t,ID0-0.33,ID0)), top=1920*(1-kw);
  const g=X.createLinearGradient(0,0,0,1920); g.addColorStop(0,'#0A0F1C'); g.addColorStop(0.45,'#132340'); g.addColorStop(1,'#0A0F1C');
  X.save(); X.fillStyle=g; X.fillRect(0,top,1080,1920-top); if(kw<1){ X.fillStyle=ACC; X.fillRect(0,top-10,1080,10); } X.restore();
  if(t<ID0) return; const u=t-ID0, cy=760, kc=eo(P(u,0,0.6));
  const hg=X.createRadialGradient(540,cy,40,540,cy,520*kc+1); hg.addColorStop(0,rgba(ACC,0.42)); hg.addColorStop(1,rgba(ACC,0)); X.fillStyle=hg; X.fillRect(0,cy-560,1080,1120);
  [[255,0.5,[]],[318,0.35,[5,18]]].forEach(([R,al,d],i)=>{ const k=eo(P(u,0.05+i*0.1,0.7+i*0.1)); if(k<=0) return; X.save(); X.globalAlpha=al*k; X.strokeStyle=i?'#FFFFFF':ACC; X.lineWidth=3; X.setLineDash(d); X.lineDashOffset=-u*40; X.beginPath(); X.arc(540,cy,R*lp(0.85,1,k),0,7); X.stroke(); X.restore(); });
  const ka=P(u,0,0.18), kn=eio(P(u,0.15,0.80)), k=3*(1-kn), n1=Math.ceil(k-1e-6), n0=Math.max(0,n1-1), fr=n1?(k-n0):0, fs=172;
  const sN=stretched('المراسيل',n1), w1=tw(sN,fs,900), w0=tw(stretched('المراسيل',n0),fs,900), wt=n1?(w0+(w1-w0)*fr):w1, sx=wt/w1, s0=lp(1.08,1,eo(P(u,0,0.8))), sc=s0*Math.min(1,960/(wt*s0));
  if(ka>0){ X.save(); X.globalAlpha=Math.min(1,ka*1.5); X.translate(540,cy); X.scale(sc*sx,sc); X.translate(-540,-cy); txt(sN,540,cy,fs,{stroke:14,sh:30}); X.restore(); }
  const kt=eo(P(u,0.90,1.20)); if(kt>0){ X.save(); X.globalAlpha=kt; txt('لتجارة المواد الأولية للمنظفات',540,cy+130+(1-kt)*14,42,{w:800,c:'rgba(255,255,255,0.9)',stroke:5}); X.restore(); }
  const kl=eo(P(u,1.20,1.45)); if(kl>0){ X.save(); X.globalAlpha=kl; txt('للطلب والتواصل',540,1110,38,{w:800,c:'rgba(255,255,255,0.75)',stroke:4}); X.restore(); }
  const kp=P(u,1.30,1.62); if(kp>0){ X.save(); X.globalAlpha=Math.min(1,kp*2); X.translate(540,1200); const s2=ob(kp); X.scale(s2,s2); X.translate(-540,-1200); contactRow(1200,0); X.restore(); }
  const kd=eo(P(u,1.65,1.95)); if(kd>0){ X.save(); X.globalAlpha=kd; txt('الموصل – الأيمن – شارع السايلو',540,1310,36,{w:800,c:'rgba(255,255,255,0.7)',stroke:4}); X.restore(); }
}



/* بانر المراسيل الفيكتور فوق الفيديو (تحت الصفحة) — BANNER_OFF: فترات بلا بانر */
const BANNER_OFF=[];
function bannerLayer(t){ for(const [a,b] of BANNER_OFF) if(t>=a&&t<b) return; if(t>=VEND) return; K.banner(t); }
bannerLayer.layer='video';
/* محتوى الفيديو (بطاقات/كلمات) — بعد السكربت: SCENE_LIST.push(['m_x', t=>onVideo(t, fn)]) */
SCENE_LIST.push(['m_vzoom',vzoom,'video'],['m_dim',dim,'video'],['m_trans',trans,'video'],['m_banner',bannerLayer,'video'],['m_page',page,'video']);
/* ═══ عناصر فوق الفيديو (تتبع الانتقالات بـonVideo) ═══ */
function bar(s,xR,y,fs,fill,col,k){ const w=tw(s,fs)+fs*1.1, h=Math.round(fs*1.42); if(k<=0) return [w,h];
  X.save(); K.reveal(xR-w,y,w,h,k,'r'); X.fillStyle=fill; X.fillRect(xR-w,y,w,h); txt(s,xR-fs*0.55,y+h/2+fs*0.05,fs,{c:col||'#FFFFFF',al:'right'}); X.restore(); return [w,h]; }
function chipCheck(s,xR,y,fs,k1,k2){ const h=Math.round(fs*1.66), sq=h, w=tw(s,fs)+fs*1.25;
  if(k1>0){ X.save(); K.reveal(xR-sq,y,sq,h,k1,'r'); X.fillStyle=NAVY; X.fillRect(xR-sq,y,sq,h); X.translate(xR-sq/2,y+h/2); X.scale(h/120,h/120); X.strokeStyle='#FFFFFF'; X.lineWidth=7; X.lineCap='square'; X.beginPath(); X.moveTo(-30,2); X.lineTo(-8,24); X.lineTo(32,-22); X.stroke(); X.restore(); }
  if(k2>0){ const x=xR-sq-w; X.save(); K.reveal(x,y,w,h,k2,'r'); X.fillStyle='#FFFFFF'; X.fillRect(x,y,w,h); X.fillStyle=ACC; X.fillRect(x,y+h-8,w,8); txt(s,xR-sq-fs*0.62,y+h/2+fs*0.05,fs,{al:'right',c:NAVY}); X.restore(); } return h; }
function ltrBlock(s,xR,y,fs,k){ X.save(); X.font='900 '+fs+'px '+FONT; X.direction='ltr'; const m=X.measureText(s), w=m.actualBoundingBoxLeft+m.actualBoundingBoxRight+fs*1.1, h=Math.round(fs*1.6); X.restore();
  if(k<=0) return [w,h]; X.save(); K.reveal(xR-w,y,w,h,k,'r'); X.fillStyle=NAVY; X.fillRect(xR-w,y,w,h); X.fillStyle=ACC; X.fillRect(xR-w,y,10,h); K.ltrCenter(s,xR-w/2+5,y+h/2,fs,'#FFFFFF'); X.restore(); return [w,h]; }
const AT=()=>window.ACC_TXT||'#4FA3FF';
/* الهوك: «يسوق منتجك · من أول نظرة · هو اللون» فوق انفجار الأخضر الفلوري */
function hookW(t){ if(t>3.06) return; onVideo(t,()=>{ X.globalAlpha*=1-P(t,2.92,3.04); K.kLine(t,[['يسوق',0.30],['منتجك',0.62]],540,400,74,'#FFFFFF',{stroke:1}); K.kLine(t,[['من',1.10],['أول',1.24],['نظرة',1.50]],540,515,98,'#FFFFFF',{stroke:1});
  K.kStretch(t,'اللون',2.42,540,700,220,AT(),{stroke:1,max:860}); }); }
/* «لأن مهما كانت جودة المنتج» فوق بيكر الماء الصافي */
function qualityW(t){ if(t<2.98||t>5.5) return; onVideo(t,()=>{ K.kLine(t,[['مهما',3.32],['كانت',3.64]],540,330,72,'#FFFFFF',{stroke:1}); K.kLine(t,[['جودة',3.96],['المنتج',4.28,AT()]],540,450,108,'#FFFFFF',{stroke:1}); }); }
/* «وهنا المراسيل وفرت لك الحل» ← «مع أصباغ GULF CHEMICALS الصناعية» */
function solutionW(t){ if(t<9.42||t>15.0) return; onVideo(t,()=>{ const xR=960, out1=eio(P(t,11.45,11.70));
  if(out1<1){ X.save(); X.globalAlpha*=1-out1; X.translate(out1*120,0); const [w1,h1]=bar('المراسيل',xR,380,96,PURP,'#FFFFFF',eio(P(t,9.95,10.25))); chipCheck('وفرت لك الحل',xR,380+h1+24,74,eio(P(t,10.52,10.72)),eio(P(t,10.60,10.90))); X.restore(); }
  if(t>=11.90){ const [w2,h2]=bar('أصباغ',xR,380,96,ACC,'#FFFFFF',eio(P(t,11.92,12.20))); const [w3,h3]=ltrBlock('GULF CHEMICALS',xR,380+h2+18,64,eio(P(t,12.44,12.76)));
    bar('الصناعية',xR,380+h2+18+h3+18,62,'#FFFFFF',NAVY,eio(P(t,13.58,13.84))); } }); }
/* «حتى تختار اللون المناسب لهوية منتجك» فوق البنفسجي */
function chooseW(t){ if(t<23.12||t>25.8) return; onVideo(t,()=>{ K.kLine(t,[['حتى',23.12],['تختار',23.42]],540,330,70,'#FFFFFF',{stroke:1}); K.kLine(t,[['اللون',23.86,AT()],['المناسب',24.08]],540,455,94,'#FFFFFF',{stroke:1}); if(t>=24.54) K.kMarker(t,'لهوية منتجك',24.54,540,600,84,'#FFFFFF',K.YEL,NAVY); }); }
/* «لون أوضح» ← «مظهر أجمل» (تبديل مع الـWhip) */
function clearW(t){ if(t<25.68||t>27.9) return; onVideo(t,()=>{ const o=eio(P(t,26.62,26.80));
  if(o<1){ X.save(); X.globalAlpha*=1-o; X.translate(0,-o*60); K.kLine(t,[['لون',25.68]],540,420,104,'#FFFFFF',{stroke:1}); K.kStretch(t,'أوضح',26.18,540,575,170,AT(),{stroke:1,max:820}); X.restore(); }
  if(t>=26.74){ K.kLine(t,[['مظهر',26.74]],540,420,104,'#FFFFFF',{stroke:1}); K.kStretch(t,'أجمل',27.24,540,575,170,K.YEL,{stroke:1,max:820}); } }); }
/* «ومنتج يلفت من أول نظرة» ← «اختار صبغك صح» */
function eyeW(t){ if(t<27.74||t>31.4) return; onVideo(t,()=>{ const o=eio(P(t,29.30,29.52));
  if(o<1){ X.save(); X.globalAlpha*=1-o; K.kLine(t,[['ومنتج',27.80]],540,380,80,'#FFFFFF',{stroke:1}); K.kStretch(t,'يلفت',28.38,540,510,150,AT(),{stroke:1,max:800}); K.kLine(t,[['من',28.74],['أول',28.90],['نظرة',29.10]],540,650,84,'#FFFFFF',{stroke:1}); X.restore(); }
  if(t>=29.54){ K.kLine(t,[['اختار',29.54],['صبغك',30.10]],540,410,92,'#FFFFFF',{stroke:1}); K.kSlam(t,'صح',30.40,540,610,210,AT(),{stroke:1}); } }); }

SCENE_LIST.push(['m_hook',hookW],['m_quality',qualityW],['m_solution',solutionW],['m_choose',chooseW],['m_clear',clearW],['m_eye',eyeW],['m_ident',ident]);
})();
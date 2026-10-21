// يولّد الأغلفة العشرة: out/NN-اسم.png — node render.js
const path=require('path'), fs=require('fs'), {pathToFileURL}=require('url');
const puppeteer=require(require('path').join(require('os').homedir(), '.claude/skills/video-ad-editor/node_modules/puppeteer-core'));
(async()=>{
  const out=path.join(__dirname,'out4'); fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out);
  const b=await puppeteer.launch({executablePath:require(require('path').join(require('os').homedir(),'.claude/skills/almarasil-reels/workspace/kit/tools/chrome.js'))(),args:['--allow-file-access-from-files','--no-sandbox']});
  const p=await b.newPage(); await p.setViewport({width:1080,height:1920});
  p.on('console',m=>{ if(m.type()==='error') console.log('[page]',m.text()); }); p.on('pageerror',e=>console.log('[err]',e.message));
  await p.goto(pathToFileURL(path.join(__dirname,'covers4.html')).href); await p.evaluate(()=>window.READY);
  const n=await p.evaluate(()=>window.N), names=await p.evaluate(()=>window.NAMES);
  for(let i=0;i<n;i++){ const d=await p.evaluate(i=>window.draw(i),i);
    fs.writeFileSync(path.join(out,`${String(i+1).padStart(2,'0')}-${names[i]}.png`),Buffer.from(d.split(',')[1],'base64')); }
  console.log('wrote',n); await b.close();
})();

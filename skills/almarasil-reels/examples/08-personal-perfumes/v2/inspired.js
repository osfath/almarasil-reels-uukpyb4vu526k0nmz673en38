// node v2/inspired.js ← assets/clips/intro/inspired-cards-v.mp4 (فيديو بلا صوت) + _an/inspired_cuts.json (لحظات الكليك)
const path=require('path'), fs=require('fs'), {pathToFileURL}=require('url'), {spawn}=require('child_process');
const puppeteer=require(require('path').join(require('os').homedir(), '.claude/skills/video-ad-editor/node_modules/puppeteer-core'));
const W=path.dirname(__dirname), OUT=path.join(W,'assets','clips','intro');
(async()=>{ const b=await puppeteer.launch({executablePath:require(require('path').join(require('os').homedir(),'.claude/skills/almarasil-reels/workspace/kit/tools/chrome.js'))(),args:['--allow-file-access-from-files','--no-sandbox','--disable-gpu'],headless:true,timeout:180000,protocolTimeout:600000});
  const p=await b.newPage(); await p.setViewport({width:1080,height:1920}); p.on('console',m=>{ if(m.type()==='error') console.log('[page]',m.text()); }); p.on('pageerror',e=>console.log('[err]',e.message));
  await p.goto(pathToFileURL(path.join(__dirname,'inspired.html')).href); await p.evaluate(()=>window.READY);
  const {N,CUTS,DUR,T_GRID}=await p.evaluate(()=>({N:window.N,CUTS:window.CUTS,DUR:window.DUR,T_GRID:window.T_GRID}));
  fs.writeFileSync(path.join(W,'_an','inspired_cuts.json'),JSON.stringify({cuts:CUTS,dur:DUR,t_grid:T_GRID}));
  const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-crf','16','-preset','medium','-pix_fmt','yuv420p','-r','30',path.join(OUT,'inspired-cards-v.mp4')],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<N;i++){ const d=await p.evaluate(i=>window.draw(i),i); if(!ff.stdin.write(Buffer.from(d.split(',')[1],'base64'))) await new Promise(r=>ff.stdin.once('drain',r)); }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close();
  console.log(`فيديو ✔ ${N} فريم · ${DUR.toFixed(2)} ث · كليك عند`, CUTS.map(c=>c.toFixed(2)).join(' ')); })();

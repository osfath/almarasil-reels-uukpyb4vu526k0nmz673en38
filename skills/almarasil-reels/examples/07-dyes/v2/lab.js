// node lab.js ← lab/NN.jpg + lab/sheet.jpg (9 لحظات من أدوات kit07)
const path=require('path'), fs=require('fs'), {pathToFileURL}=require('url'), {execFileSync}=require('child_process');
const puppeteer=require(require('path').join(require('os').homedir(), '.claude/skills/video-ad-editor/node_modules/puppeteer-core'));
(async()=>{ const b=await puppeteer.launch({executablePath:require(require('path').join(require('os').homedir(),'.claude/skills/almarasil-reels/workspace/kit/tools/chrome.js'))(),args:['--allow-file-access-from-files','--no-sandbox']});
  const p=await b.newPage(); await p.setViewport({width:1080,height:1920}); p.on('console',m=>{ if(m.type()==='error') console.log('[page]',m.text()); }); p.on('pageerror',e=>console.log('[err]',e.message));
  await p.goto(pathToFileURL(path.join(__dirname,'lab.html')).href); await p.evaluate(()=>window.READY);
  const n=await p.evaluate(()=>window.N), names=await p.evaluate(()=>window.NAMES), files=[];
  for(let i=0;i<n;i++){ const d=await p.evaluate(i=>window.draw(i),i); const f=path.join(__dirname,'lab',String(i+1).padStart(2,'0')+'.jpg'); fs.writeFileSync(f,Buffer.from(d.split(',')[1],'base64')); files.push(f); }
  await b.close();
  const ins=files.flatMap(f=>['-i',f]); const fl=files.map((_,i)=>`[${i}:v]scale=360:640[s${i}]`).join(';')+';'+files.map((_,i)=>`[s${i}]`).join('')+`xstack=inputs=${n}:layout=`+files.map((_,i)=>`${(i%3)*360}_${Math.floor(i/3)*640}`).join('|');
  execFileSync('ffmpeg',['-v','error','-y',...ins,'-filter_complex',fl,'-q:v','3',path.join(__dirname,'lab','sheet.jpg')]); console.log('lab/sheet.jpg ✔', names.join(' · ')); })();

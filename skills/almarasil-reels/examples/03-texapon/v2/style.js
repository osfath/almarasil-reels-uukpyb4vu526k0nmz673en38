const path=require('path'), fs=require('fs'), {pathToFileURL}=require('url');
const puppeteer=require(require('path').join(require('os').homedir(), '.claude/skills/video-ad-editor/node_modules/puppeteer-core'));
(async()=>{ const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH,args:['--allow-file-access-from-files','--no-sandbox']});
  const p=await b.newPage(); await p.setViewport({width:1080,height:1920});
  await p.goto(pathToFileURL(path.join(__dirname,'style.html')).href); await p.waitForFunction('window.DONE===true',{timeout:20000});
  const d=await p.evaluate(()=>document.getElementById('cv').toDataURL('image/jpeg',0.92));
  fs.writeFileSync(path.join(__dirname,'style_frame.jpg'),Buffer.from(d.split(',')[1],'base64')); console.log('ok'); await b.close(); })();

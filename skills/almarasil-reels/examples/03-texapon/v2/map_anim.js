// node map_anim.js <outdir> [fps=30] [dur=5.5] [card=0] — فريمات PNG شفافة للخريطة المتحركة
const path=require('path'), fs=require('fs'), {pathToFileURL}=require('url');
const puppeteer=require(require('path').join(require('os').homedir(), '.claude/skills/video-ad-editor/node_modules/puppeteer-core'));
(async()=>{ const [out,fps=30,dur=5.5,card=0]=process.argv.slice(2); fs.mkdirSync(out,{recursive:true});
  const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH,args:['--allow-file-access-from-files','--no-sandbox']}); const p=await b.newPage();
  await p.goto(pathToFileURL(path.join(__dirname,'map_anim.html')).href+(+card?'?card=1&t=0':'?t=0')); await p.waitForFunction('window.DONE===true',{timeout:20000});
  const N=Math.round(dur*fps); for(let i=0;i<N;i++){ const d=await p.evaluate(t=>{ window.draw(t); return document.getElementById('cv').toDataURL('image/png'); }, i/fps);
    fs.writeFileSync(path.join(out,String(i).padStart(4,'0')+'.png'),Buffer.from(d.split(',')[1],'base64')); }
  console.log('frames',N); await b.close(); })();

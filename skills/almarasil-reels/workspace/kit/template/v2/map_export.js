// node v2/map_export.js <outdir> — يطلع خريطة-المراسيل.png (بلا خلفية) + خريطة-المراسيل-بكرت.png
const path=require('path'), fs=require('fs'), {pathToFileURL}=require('url');
const puppeteer=require(require('path').join(require('os').homedir(), '.claude/skills/video-ad-editor/node_modules/puppeteer-core'));
(async()=>{ const out=process.argv[2]||'.'; const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH,args:['--allow-file-access-from-files','--no-sandbox']});
  for(const [q,name] of [['','خريطة-المراسيل.png'],['?card=1','خريطة-المراسيل-بكرت.png']]){
    const p=await b.newPage(); await p.goto(pathToFileURL(path.join(__dirname,'map_export.html')).href+q); await p.waitForFunction('window.DONE===true',{timeout:20000});
    const d=await p.evaluate(()=>document.getElementById('cv').toDataURL('image/png')); fs.writeFileSync(path.join(out,name),Buffer.from(d.split(',')[1],'base64')); console.log(name); await p.close(); }
  await b.close(); })();

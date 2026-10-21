// يرسم الأغلفة الأربعة PNG 1080×1920 — node render.js
const path=require('path'), fs=require('fs'), {pathToFileURL}=require('url');
const puppeteer=require(require('path').join(require('os').homedir(), '.claude/skills/video-ad-editor/node_modules/puppeteer-core'));
(async()=>{
  const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH,args:['--allow-file-access-from-files','--no-sandbox']});
  const p=await b.newPage(); await p.setViewport({width:1080,height:1920});
  p.on('console',m=>{ if(m.type()==='error') console.log('[page]',m.text()); });
  await p.goto(pathToFileURL(path.join(__dirname,'covers.html')).href); await p.evaluate(()=>window.READY);
  const ok=await p.evaluate(()=>document.fonts.check("900 60px 'Al-Jazeera-Arabic'",'عربي')); console.log('font ok:',ok);
  const names=['A-المنتج-البطل','B-الرقم-99','C-الفضول-والخطر','D-كيف-يصنع-الصابون','A2-بطش-99'];
  for(let i=0;i<names.length;i++){ const d=await p.evaluate(i=>window.draw(i),i); fs.writeFileSync(path.join(__dirname,`غلاف-${names[i]}.png`),Buffer.from(d.split(',')[1],'base64')); console.log('wrote',names[i]); }
  await b.close();
})();

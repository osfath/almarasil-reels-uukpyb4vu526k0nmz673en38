// يولّد دفعة الأغلفة مرقّمة: bulk/NN-قالب-عنوان-خلفية.png — node bulk.js
const path=require('path'), fs=require('fs'), {pathToFileURL}=require('url');
const puppeteer=require(require('path').join(require('os').homedir(), '.claude/skills/video-ad-editor/node_modules/puppeteer-core'));
const HN={k:'كوستك-صودا',b:'بطش-99',p:'تركيز-99',c:'تحرق-وتصنع',q:'كيف-يصنع',h:'حاوية-وصلت'};
(async()=>{
  const out=path.join(__dirname,'bulk'); fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out);
  const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH,args:['--allow-file-access-from-files','--no-sandbox']});
  const p=await b.newPage(); await p.setViewport({width:1080,height:1920});
  p.on('console',m=>{ if(m.type()==='error') console.log('[page]',m.text()); });
  await p.goto(pathToFileURL(path.join(__dirname,'bulk.html')).href); await p.evaluate(()=>window.READY);
  const plan=await p.evaluate(()=>window.PLAN);
  for(let i=0;i<plan.length;i++){ const d=await p.evaluate(i=>window.draw(i),i); const [t,h,bg]=plan[i];
    fs.writeFileSync(path.join(out,`${String(i+1).padStart(2,'0')}-${t}-${HN[h]}-${bg}.png`),Buffer.from(d.split(',')[1],'base64')); }
  console.log('wrote',plan.length); await b.close();
})();

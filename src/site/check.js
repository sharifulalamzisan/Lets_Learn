const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/font|ERR_TUNNEL|Failed to load resource/i.test(m.text()))errs.push('console: '+m.text());});
const ids=process.argv.slice(2);
for(const h of ids){await p.goto('http://localhost:8765/index.html#'+h);await p.waitForTimeout(500);
 const r=await p.evaluate(()=>({w:document.documentElement.scrollWidth,widgets:[...document.querySelectorAll('.widget')].map(w=>w.innerHTML.length),secs:document.querySelectorAll('section.blk').length}));
 console.log(h,JSON.stringify(r),errs.splice(0).join('|'));}
await b.close();})();

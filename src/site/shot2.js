const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:+process.argv[4]||400,height:1000}});
await p.goto(process.argv[2]);await p.waitForTimeout(900);
const sel=process.argv[5]; if(sel){const el=await p.$(sel); if(el){await el.scrollIntoViewIfNeeded(); await p.evaluate(s=>document.querySelector(s).scrollIntoView(),sel);} if(process.argv[6]) await p.click(process.argv[6]); await p.waitForTimeout(300);}
await p.screenshot({path:process.argv[3]});await b.close();})();

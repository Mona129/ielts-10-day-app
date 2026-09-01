/* V28 — hard-wire the 8 already-uploaded reference videos into the actual 04 content and Douyin reference feed. No cloud timing, no upload UI. */
(function(){
  const BASE='https://mysbpummazvgyesuhlfg.supabase.co/functions/v1/kenzo-media-upload?slot=ref24-';
  const V=Array.from({length:8},(_,i)=>BASE+i+'&v=28');
  const META=[
    ['Live / 图文动态参考','Live / 圖文動態參考','静态封面点进去以后会动。','靜態封面點進去之後會動。'],
    ['Paper Cutout OOTD','Paper Cutout OOTD','纸片 / 拼贴式穿搭。','紙片 / 拼貼式穿搭。'],
    ['Product Scale Shift','Product Scale Shift','比例变化制造第一眼停留。','比例變化製造第一眼停留。'],
    ['Product Detail / Label','Product Detail / Label','从标签 / 产品细节开始。','從標籤 / 產品細節開始。'],
    ['Product Grid Game','Product Grid Game','格子 / 选择 / 抽卡机制。','格子 / 選擇 / 抽卡機制。'],
    ['Outfit Receipt','Outfit Receipt','扫描、识别、打印一套 Look。','掃描、辨識、列印一套 Look。'],
    ['Word Drag / 拖拽机制','Word Drag / 拖曳機制','拖动动作触发下一段变化。','拖曳動作觸發下一段變化。'],
    ['Extra Motion / 新增动态','Extra Motion / 新增動態','补充动态参考，继续扩玩法库。','補充動態參考，繼續擴充玩法庫。']
  ];
  const tw=()=>{try{return S.lang==='tw'}catch(e){return false}};
  const tr=(a,b)=>tw()?b:a;

  /* The upload is done. Remove the broken/redundant uploader so it cannot confuse the final report. */
  function removeUploader(){
    document.querySelectorAll('.r24-upload-btn,.r24-panel').forEach(x=>x.remove());
  }

  const css=document.createElement('style');
  css.textContent=`
    .v28-wrap{margin-top:18px}.v28-title{font-size:12px;font-weight:850;letter-spacing:.02em;margin:0 0 10px}.v28-grid{display:grid;grid-template-columns:1fr;gap:14px}.v28-card{display:block;width:100%;padding:0;border:1px solid #e8e8e8;border-radius:18px;overflow:hidden;background:#fff;color:#111;text-align:left}.v28-card video{display:block;width:100%;max-height:560px;aspect-ratio:9/16;object-fit:contain;background:#000}.v28-copy{padding:10px 12px 12px}.v28-copy b{display:block;font-size:12px}.v28-copy small{display:block;font-size:10px;color:#777;line-height:1.55;margin-top:5px}.v28-ready{display:inline-block;margin-left:6px;padding:2px 6px;border-radius:999px;background:#111;color:#fff;font-size:8px;vertical-align:1px}.app.dy .v28-card{background:#0b0b0b;border-color:#333;color:#fff}.app.dy .v28-copy small{color:#aaa}
    .v28-feed{position:fixed;z-index:1200;inset:0;background:#000;display:none;justify-content:center;touch-action:none}.v28-feed.on{display:flex}.v28-shell{position:relative;width:min(448px,100%);height:100dvh;background:#000;color:#fff;overflow:hidden}.v28-video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000}.v28-top{position:absolute;z-index:4;left:0;right:0;top:0;padding:calc(12px + env(safe-area-inset-top)) 14px 42px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(180deg,#000c,transparent)}.v28-close{border:0;background:#222d;color:#fff;border-radius:999px;padding:9px 13px;font-size:12px}.v28-counter{text-align:right;font-size:11px;color:#ddd}.v28-bottom{position:absolute;z-index:4;left:0;right:0;bottom:0;padding:90px 70px calc(28px + env(safe-area-inset-bottom)) 16px;background:linear-gradient(0deg,#000e,#0003,transparent)}.v28-bottom b{font-size:17px}.v28-bottom p{font-size:11px;color:#ddd;line-height:1.55;margin:6px 0 0}.v28-bottom small{display:block;color:#999;margin-top:10px;font-size:9px}
  `;
  document.head.appendChild(css);

  function cards(){
    return `<div class="section v28-wrap"><div class="slab">${tr('8 个参考视频 · 已完整接入','8 個參考影片 · 已完整接入')}</div><div class="ref24-status"><b>8 / 8 ${tr('已上传','已上傳')}</b><br>${tr('这里和抖音「参考案例」读取同一套 8 个视频。','這裡和抖音「參考案例」讀取同一套 8 支影片。')}</div><div class="v28-grid">${META.map((m,i)=>`<button class="v28-card" data-v28="${i}"><video src="${V[i]}" muted autoplay loop playsinline preload="metadata" controls></video><div class="v28-copy"><b>${String(i+1).padStart(2,'0')} · ${tw()?m[1]:m[0]} <span class="v28-ready">VIDEO</span></b><small>${tw()?m[3]:m[2]}</small></div></button>`).join('')}</div></div>`;
  }

  /* Replace only the reference-video part of 04 while preserving cases + ROMI image. */
  const oldContentLibrary=typeof contentLibrary==='function'?contentLibrary:null;
  window.contentLibrary=function(){
    let base='';
    if(oldContentLibrary){
      base=oldContentLibrary();
      /* Remove any previous 8-video blocks to avoid empty/black duplicates. */
      base=base.replace(/<div class="section"><div class="slab">8[^]*?<\/div><\/div>\s*$/,'');
      base=base.replace(/<div class="section"><div class="slab">8 个参考视频<\/div>[^]*?<\/div><\/div>\s*$/,'');
    }
    /* Build cases + image from known current sources if the old library became unreliable. */
    if(!base || !base.includes('ROMI STUDIO')){
      const c=typeof CASES!=='undefined'?CASES:[];
      base=`<div class="section"><div class="slab">${tr('我们下午做的 3 个案例','我們下午做的 3 個案例')}</div><div class="cards">${c.map((x,i)=>`<button class="mediaCard" data-a="media" data-kind="case" data-v="${i}"><video src="${x[1]}" muted autoplay loop playsinline></video><div class="mediaText"><b>${x[0]}</b><p>${x[2]}</p></div></button>`).join('')}</div></div><div class="section"><div class="slab">${tr('1 张图文参考','1 張圖文參考')}</div><button class="mediaCard" data-a="media" data-kind="image" data-v="0"><img src="assets/romi_bouquet.webp"><div class="mediaText"><b>ROMI STUDIO · ${tr('服装花束图文','服裝花束圖文')}</b></div></button></div>`;
    }
    return base+cards();
  };

  /* Keep legacy REFS in sync so all existing detail buttons also play the same files. */
  try{for(let i=0;i<8;i++){if(REFS[i])REFS[i][1]=V[i];}}catch(e){}

  const oldShowMedia=typeof showMedia==='function'?showMedia:null;
  window.showMedia=function(kind,i){
    if(kind!=='ref' && kind!=='v28') return oldShowMedia?oldShowMedia(kind,i):undefined;
    const m=META[i];
    const title=tw()?m[1]:m[0];
    const dt=document.querySelector('#detailTitle'),dl=document.querySelector('#detailLead'),db=document.querySelector('#detailBody'),sheet=document.querySelector('#detail');
    if(dt)dt.textContent=title;if(dl)dl.textContent='Reference / Case';
    if(db)db.innerHTML=`<video src="${V[i]}" controls autoplay loop playsinline preload="auto" style="width:100%;max-height:70dvh;object-fit:contain;border-radius:16px;background:#000"></video><div class="row"><b>${tr('参考点','參考點')}</b><p>${tw()?m[3]:m[2]}</p></div>`;
    if(sheet)sheet.classList.add('show');
  };

  /* Force refresh if chapter 04 is already open. */
  function refresh04(){
    try{if(S.chapter===3 && document.querySelector('#app')?.classList.contains('on'))render();}catch(e){}
    setTimeout(()=>document.querySelectorAll('.v28-card video').forEach(v=>v.play().catch(()=>{})),120);
  }

  /* Dedicated Douyin feed, independent of any old feed implementation. */
  let feed,idx=0,sy=0;
  function ensureFeed(){
    if(feed)return feed;
    feed=document.createElement('div');feed.className='v28-feed';feed.innerHTML=`<div class="v28-shell"><video class="v28-video" muted autoplay loop playsinline controls preload="auto"></video><div class="v28-top"><button class="v28-close">× ${tr('返回','返回')}</button><div class="v28-counter"></div></div><div class="v28-bottom"><b></b><p></p><small>${tr('↑ 上滑下一条 · ↓ 下滑上一条','↑ 上滑下一支 · ↓ 下滑上一支')}</small></div></div>`;document.body.appendChild(feed);
    feed.querySelector('.v28-close').onclick=closeFeed;
    feed.addEventListener('touchstart',e=>{sy=e.changedTouches[0].clientY},{passive:true});
    feed.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientY-sy;if(Math.abs(d)<45)return;if(d<0&&idx<7){idx++;paintFeed()}else if(d>0&&idx>0){idx--;paintFeed()}},{passive:true});
    return feed;
  }
  function paintFeed(){const f=ensureFeed(),m=META[idx],v=f.querySelector('.v28-video');v.pause();v.src=V[idx];v.load();v.play().catch(()=>{});f.querySelector('.v28-counter').textContent=`${idx+1} / 8`;f.querySelector('.v28-bottom b').textContent=tw()?m[1]:m[0];f.querySelector('.v28-bottom p').textContent=tw()?m[3]:m[2]}
  function openFeed(){idx=0;ensureFeed().classList.add('on');paintFeed()}
  function closeFeed(){if(!feed)return;feed.classList.remove('on');const v=feed.querySelector('video');v.pause();v.removeAttribute('src');v.load()}

  document.addEventListener('click',function(e){
    const c=e.target.closest('[data-v28]');if(c){e.preventDefault();e.stopImmediatePropagation();showMedia('v28',Number(c.dataset.v28));return}
    const b=e.target.closest('[data-a="dyRefs"]');if(b){e.preventDefault();e.stopImmediatePropagation();openFeed();return}
  },true);

  removeUploader();
  setTimeout(()=>{removeUploader();refresh04()},250);
  setTimeout(()=>{removeUploader();refresh04()},1200);
})();
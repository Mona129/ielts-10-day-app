/* V29 — final reference-video path: same-origin static MP4s on GitHub Pages. */
(function(){
  const V=Array.from({length:8},(_,i)=>`static-videos/${String(i+1).padStart(2,'0')}.mp4?v=29`);
  const CASE=[
    ['LOOK RECEIPT · 发票','https://mysbpummazvgyesuhlfg.supabase.co/storage/v1/object/public/kenzo-social-media/slots/case-0-1788279842958.gif','把一套 Look 变成一张会打印出来的 Receipt。'],
    ['PRODUCT COLLAGE · 拼贴','https://mysbpummazvgyesuhlfg.supabase.co/storage/v1/object/public/kenzo-social-media/slots/case-1-1788279849939.gif','产品和细节一块一块出现，最后组成完整视觉。'],
    ['KENZO BOUQUET · 鲜花','https://mysbpummazvgyesuhlfg.supabase.co/storage/v1/object/public/kenzo-social-media/slots/case-2-1788279853990.gif','衣服逐步被整理、包裹，最后成为一束“服装花束”。']
  ];
  const ROMI='https://mysbpummazvgyesuhlfg.supabase.co/storage/v1/object/public/kenzo-social-media/slots/image-0-1788279866197.jpeg';
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

  const css=document.createElement('style');css.textContent=`
  .v29-grid{display:grid;grid-template-columns:1fr;gap:14px;margin-top:12px}.v29-card{width:100%;border:1px solid #e7e7e7;border-radius:18px;overflow:hidden;background:#fff;color:#111;padding:0;text-align:left}.v29-card video{display:block;width:100%;aspect-ratio:9/16;max-height:560px;object-fit:contain;background:#000}.v29-card img{display:block;width:100%;height:auto;background:#f5f5f5}.v29-copy{padding:10px 12px 12px}.v29-copy b{display:block;font-size:12px}.v29-copy small{display:block;font-size:10px;line-height:1.55;color:#777;margin-top:5px}.v29-ok{display:inline-block;margin-left:5px;padding:2px 6px;border-radius:999px;background:#111;color:#fff;font-size:8px}.app.dy .v29-card{background:#0c0c0c;border-color:#333;color:#fff}.app.dy .v29-copy small{color:#aaa}.v29-dock{display:none;position:absolute;left:12px;right:12px;top:152px;z-index:90;border:1px solid rgba(255,255,255,.25);background:#fff;color:#111;border-radius:15px;padding:11px 13px;text-align:left;box-shadow:0 12px 34px #0006}.app.dy .v29-dock{display:block}.v29-dock b{display:block;font-size:13px}.v29-dock span{display:block;font-size:10px;color:#666;margin-top:4px}.v29-feed{position:fixed;z-index:2000;inset:0;background:#000;display:none;justify-content:center;touch-action:none}.v29-feed.on{display:flex}.v29-shell{position:relative;width:min(448px,100%);height:100dvh;background:#000;color:#fff;overflow:hidden}.v29-video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000}.v29-top{position:absolute;z-index:3;left:0;right:0;top:0;padding:calc(12px + env(safe-area-inset-top)) 14px 44px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(180deg,#000d,transparent)}.v29-close{border:0;background:#222d;color:#fff;border-radius:999px;padding:9px 13px}.v29-bottom{position:absolute;z-index:3;left:0;right:0;bottom:0;padding:90px 72px calc(30px + env(safe-area-inset-bottom)) 16px;background:linear-gradient(0deg,#000e,#0003,transparent)}.v29-bottom b{font-size:17px}.v29-bottom p{font-size:11px;color:#ddd;line-height:1.55;margin:6px 0 0}.v29-bottom small{font-size:9px;color:#999;display:block;margin-top:10px}`;document.head.appendChild(css);

  function library(){
    const cases=`<div class="section"><div class="slab">${tr('我们下午做的 3 个案例','我們下午做的 3 個案例')}</div><div class="v29-grid">${CASE.map((c,i)=>`<button class="v29-card" data-v29-kind="case" data-v29-i="${i}"><img src="${c[1]}" alt="${c[0]}"><div class="v29-copy"><b>${c[0]}</b><small>${c[2]}</small></div></button>`).join('')}</div></div>`;
    const image=`<div class="section"><div class="slab">${tr('1 张图文参考','1 張圖文參考')}</div><button class="v29-card" data-v29-kind="image" data-v29-i="0"><img src="${ROMI}" alt="ROMI STUDIO"><div class="v29-copy"><b>ROMI STUDIO · ${tr('服装花束图文','服裝花束圖文')}</b><small>${tr('第一眼像一束礼物，第二眼才发现“花材”全部是服装。','第一眼像一束禮物，第二眼才發現「花材」全部是服裝。')}</small></div></button></div>`;
    const refs=`<div class="section"><div class="slab">${tr('8 个参考视频 · 完整清晰版','8 個參考影片 · 完整清晰版')}</div><div class="ref24-status"><b>8 / 8 ${tr('已固定到网页本身','已固定到網頁本身')}</b><br>${tr('不再读取云端视频地址；04 和抖音参考案例都直接播放这 8 个 MP4。','不再讀取雲端影片網址；04 和抖音參考案例都直接播放這 8 支 MP4。')}</div><div class="v29-grid">${META.map((m,i)=>`<button class="v29-card" data-v29-kind="ref" data-v29-i="${i}"><video src="${V[i]}" muted autoplay loop playsinline preload="metadata" controls></video><div class="v29-copy"><b>${String(i+1).padStart(2,'0')} · ${tw()?m[1]:m[0]} <span class="v29-ok">MP4</span></b><small>${tw()?m[3]:m[2]}</small></div></button>`).join('')}</div></div>`;
    return cases+image+refs;
  }
  window.contentLibrary=library;
  try{for(let i=0;i<8;i++)if(REFS[i])REFS[i][1]=V[i]}catch(e){}

  const oldShow=typeof showMedia==='function'?showMedia:null;
  window.showMedia=function(kind,i){
    if(kind==='ref'){kind='v29ref'}
    let title='',body='';
    if(kind==='v29ref'){
      const m=META[i];title=tw()?m[1]:m[0];body=`<video src="${V[i]}" controls autoplay loop playsinline preload="auto" style="width:100%;max-height:70dvh;object-fit:contain;border-radius:16px;background:#000"></video><div class="row"><b>${tr('参考点','參考點')}</b><p>${tw()?m[3]:m[2]}</p></div>`;
    }else if(kind==='v29case'){
      const c=CASE[i];title=c[0];body=`<img src="${c[1]}" style="width:100%;border-radius:16px;display:block"><div class="row"><b>${tr('这个案例怎么用','這個案例怎麼用')}</b><p>${c[2]}</p></div>`;
    }else if(kind==='v29image'){
      title='ROMI STUDIO · '+tr('服装花束图文','服裝花束圖文');body=`<img src="${ROMI}" style="width:100%;border-radius:16px;display:block">`;
    }else return oldShow?oldShow(kind,i):undefined;
    const dt=document.querySelector('#detailTitle'),dl=document.querySelector('#detailLead'),db=document.querySelector('#detailBody'),sh=document.querySelector('#detail');if(dt)dt.textContent=title;if(dl)dl.textContent='Reference / Case';if(db)db.innerHTML=body;if(sh)sh.classList.add('show');
  };

  /* Replace the old Douyin dock with a clean one that only knows the static files. */
  document.querySelectorAll('.dyRefDock').forEach(x=>x.style.display='none');
  const dock=document.createElement('button');dock.className='v29-dock';dock.innerHTML=`<b>${tr('参考案例','參考案例')}</b>`;document.querySelector('.phone')?.appendChild(dock);
  let feed=null,idx=0,sy=0;
  function ensureFeed(){if(feed)return feed;feed=document.createElement('div');feed.className='v29-feed';feed.innerHTML=`<div class="v29-shell"><video class="v29-video" muted autoplay loop playsinline controls preload="auto"></video><div class="v29-top"><button class="v29-close">× ${tr('返回','返回')}</button><div class="v29-count"></div></div><div class="v29-bottom"><b></b><p></p><small>${tr('↑ 上滑下一条 · ↓ 下滑上一条','↑ 上滑下一支 · ↓ 下滑上一支')}</small></div></div>`;document.body.appendChild(feed);feed.querySelector('.v29-close').onclick=closeFeed;feed.addEventListener('touchstart',e=>sy=e.changedTouches[0].clientY,{passive:true});feed.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientY-sy;if(Math.abs(d)<45)return;if(d<0&&idx<7){idx++;paint()}else if(d>0&&idx>0){idx--;paint()}},{passive:true});return feed}
  function paint(){const f=ensureFeed(),m=META[idx],v=f.querySelector('video');v.pause();v.src=V[idx];v.load();v.play().catch(()=>{});f.querySelector('.v29-count').textContent=`${idx+1} / 8`;f.querySelector('.v29-bottom b').textContent=tw()?m[1]:m[0];f.querySelector('.v29-bottom p').textContent=tw()?m[3]:m[2]}
  function openFeed(){idx=0;ensureFeed().classList.add('on');paint()}
  function closeFeed(){if(!feed)return;feed.classList.remove('on');const v=feed.querySelector('video');v.pause();v.removeAttribute('src');v.load()}
  dock.onclick=openFeed;

  document.addEventListener('click',e=>{const b=e.target.closest('[data-v29-kind]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const i=Number(b.dataset.v29I),k=b.dataset.v29Kind;if(k==='ref')showMedia('v29ref',i);else if(k==='case')showMedia('v29case',i);else showMedia('v29image',i)},true);

  document.querySelectorAll('.r24-upload-btn,.r24-panel').forEach(x=>x.remove());
  setTimeout(()=>{document.querySelectorAll('.r24-upload-btn,.r24-panel').forEach(x=>x.remove());try{if(S.chapter===3&&document.querySelector('#app')?.classList.contains('on'))render()}catch(e){}},200);
})();

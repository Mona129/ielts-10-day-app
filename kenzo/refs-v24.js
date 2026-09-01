/* V24 — one clean source of truth for all 8 reference videos.
   Old MOV/cloud mappings are intentionally ignored. A reference is only accepted
   after the uploaded MP4 can actually load metadata in the browser. */
(function(){
  const SUPA='https://mysbpummazvgyesuhlfg.supabase.co';
  const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJteXNidW1tYXp2Z3llc3VobGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjc3NDMsImV4cCI6MjEwMzg0Mzc0M30.VLwxADqTs4_jRveJ0mbt-9CAGceObRShSno8nuJiiFY';
  const BUCKET='kenzo-social-media';
  const EDIT=new URLSearchParams(location.search).get('edit')==='1';
  const H={apikey:KEY,Authorization:'Bearer '+KEY};
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
  let cloud={text:{},media:{}}, feed=null, feedIndex=0, sy=0, sx=0, st=0, locked=false;
  const tw=()=>{try{return S.lang==='tw'}catch(e){return false}};
  const t=(cn,zh)=>tw()?zh:cn;
  const key=i=>'ref24-'+i;
  const src=i=>cloud.media?.[key(i)]?.url||'';
  const validCount=()=>META.filter((_,i)=>!!src(i)).length;

  const css=document.createElement('style');
  css.textContent=`
  .ref24-list{display:grid;grid-template-columns:1fr;gap:14px;margin-top:12px}.ref24-card{width:100%;border:1px solid #e7e7e7;border-radius:17px;overflow:hidden;background:#fff;color:#111;padding:0;text-align:left}.ref24-video{display:block;width:100%;aspect-ratio:9/16;max-height:560px;object-fit:contain;background:#090909}.ref24-copy{padding:10px 12px 12px}.ref24-copy b{font-size:12px;display:flex;align-items:center;gap:6px}.ref24-copy p{font-size:11px;line-height:1.55;color:#777;margin:5px 0 0}.ref24-ok{font-size:8px;background:#111;color:#fff;border-radius:999px;padding:2px 6px}.ref24-empty{aspect-ratio:9/16;max-height:440px;background:linear-gradient(145deg,#f3f3f3,#e8e8e8);display:grid;place-items:center;text-align:center;padding:20px;color:#777}.ref24-empty b{font-size:13px;color:#222;display:block;margin-bottom:6px}.ref24-empty span{font-size:10px;line-height:1.6}.ref24-status{margin:8px 0 0;padding:9px 11px;border-radius:12px;background:#f4f4f4;font-size:10px;line-height:1.55;color:#666}
  .r24-open{border:1px solid #ddd;background:#fff;color:#111;border-radius:14px;padding:12px 13px;width:100%;text-align:left;margin:12px 0}.app.dy .r24-open{border-color:#444;background:#111;color:#fff}.r24-open b{display:block;font-size:13px}.r24-open span{display:block;font-size:10px;color:#777;margin-top:4px}.app.dy .r24-open span{color:#aaa}
  .r24-upload-btn{position:fixed;z-index:160;left:12px;top:calc(10px + env(safe-area-inset-top));border:0;background:#fff;color:#111;border-radius:999px;padding:10px 13px;font-size:10px;font-weight:850;box-shadow:0 8px 28px #0007}.r24-panel{position:fixed;z-index:700;inset:0;background:#000c;display:none;align-items:flex-end;justify-content:center}.r24-panel.show{display:flex}.r24-sheet{width:min(448px,100%);max-height:92dvh;overflow:auto;background:#fff;color:#111;border-radius:25px 25px 0 0;padding:15px 14px calc(24px + env(safe-area-inset-bottom))}.r24-head{position:sticky;top:0;z-index:3;background:#fff;display:flex;justify-content:space-between;align-items:center;padding:2px 0 12px}.r24-head h3{font-size:18px;margin:0}.r24-x{border:0;width:36px;height:36px;border-radius:50%;font-size:20px}.r24-alert{background:#111;color:#fff;border-radius:15px;padding:12px;font-size:11px;line-height:1.65;margin-bottom:10px}.r24-picker{width:100%;border:1px dashed #aaa;border-radius:15px;padding:15px 12px;background:#fafafa;margin-bottom:10px}.r24-picker input{width:100%;font-size:11px}.r24-picker small{display:block;color:#777;line-height:1.6;margin-top:7px}.r24-summary{background:#f4f4f4;border-radius:14px;padding:10px 11px;font-size:11px;line-height:1.6;margin-bottom:8px}.r24-row{padding:11px 0;border-top:1px solid #eee}.r24-top{display:flex;align-items:center;justify-content:space-between;gap:8px}.r24-top b{font-size:11px}.r24-state{font-size:10px;color:#888;text-align:right}.r24-state.ok{color:#16813a}.r24-name{font-size:9px;color:#777;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.r24-bar{height:5px;background:#eee;border-radius:999px;overflow:hidden;margin-top:7px;display:none}.r24-bar i{display:block;height:100%;width:0;background:#111;transition:width .12s}.r24-error{font-size:10px;color:#c22;line-height:1.55;margin-top:6px;display:none}
  .r24-feed{position:fixed;z-index:800;inset:0;background:#000;display:none;justify-content:center;overflow:hidden;touch-action:none}.r24-feed.show{display:flex}.r24-shell{position:relative;width:min(448px,100%);height:100%;background:#000;color:#fff;overflow:hidden}.r24-stage{position:absolute;inset:0;display:grid;place-items:center}.r24-feed-video{width:100%;height:100%;object-fit:contain;background:#000;display:block}.r24-feed-empty{padding:28px;text-align:center;color:#aaa;line-height:1.7}.r24-feed-top{position:absolute;z-index:4;left:0;right:0;top:0;padding:calc(12px + env(safe-area-inset-top)) 14px 30px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(180deg,rgba(0,0,0,.8),transparent)}.r24-feed-top button{border:0;background:#222b;color:#fff;border-radius:999px;height:38px;padding:0 13px}.r24-feed-title{text-align:center;font-size:13px;font-weight:750}.r24-count{font-size:10px;color:#bbb;margin-top:3px}.r24-feed-bottom{position:absolute;z-index:4;left:0;right:0;bottom:0;padding:80px 72px calc(32px + env(safe-area-inset-bottom)) 16px;background:linear-gradient(0deg,rgba(0,0,0,.85),rgba(0,0,0,.15),transparent)}.r24-feed-name{font-size:17px;font-weight:750}.r24-feed-desc{font-size:11px;color:#ddd;line-height:1.55;margin-top:6px}.r24-feed-hint{font-size:9px;color:#999;margin-top:10px}
  `;document.head.appendChild(css);

  async function readCloud(){
    const r=await fetch(SUPA+'/rest/v1/kenzo_app_state?id=eq.main&select=content,updated_at&_='+Date.now(),{headers:H,cache:'no-store'});
    if(!r.ok)throw new Error('读取云端失败：'+r.status+' '+await r.text());
    const a=await r.json(),c=a[0]?.content||{};cloud={text:c.text||{},media:c.media||{}};syncLegacyArrays();return cloud;
  }
  function syncLegacyArrays(){
    try{for(let i=0;i<8;i++)if(REFS?.[i]&&src(i))REFS[i][1]=src(i)}catch(e){}
  }
  async function mergeAndSave(pairs){
    const r=await fetch(SUPA+'/rest/v1/kenzo_app_state?id=eq.main&select=content&_='+Date.now(),{headers:H,cache:'no-store'});
    if(!r.ok)throw new Error('保存前读取失败：'+r.status);
    const a=await r.json(),content=a[0]?.content||{text:{},media:{}};content.text=content.text||{};content.media=content.media||{};
    Object.entries(pairs).forEach(([k,v])=>content.media[k]=v);
    const w=await fetch(SUPA+'/rest/v1/kenzo_app_state?id=eq.main',{method:'PATCH',headers:{...H,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({content,updated_at:new Date().toISOString()}),cache:'no-store'});
    if(!w.ok)throw new Error('写入云端失败：'+w.status+' '+await w.text());
    cloud={text:content.text,media:content.media};syncLegacyArrays();
  }

  function caseSrc(i){return cloud.media?.['case-'+i]?.url || (typeof CASES!=='undefined'?CASES[i]?.[1]:'')}
  function imageSrc(){return cloud.media?.['image-0']?.url || 'assets/romi_bouquet.webp'}
  function refCard(i){
    const m=META[i],u=src(i);
    if(!u)return `<div class="ref24-card"><div class="ref24-empty"><div><b>${String(i+1).padStart(2,'0')} · ${tw()?m[1]:m[0]}</b><span>${t('旧云端视频已作废。等待本轮重新上传并验证可播放。','舊雲端影片已作廢。等待本輪重新上傳並驗證可播放。')}</span></div></div><div class="ref24-copy"><b>${tw()?m[1]:m[0]}</b><p>${tw()?m[3]:m[2]}</p></div></div>`;
    return `<button class="ref24-card" data-r24-media="${i}"><video class="ref24-video" src="${u}" muted autoplay loop playsinline preload="auto"></video><div class="ref24-copy"><b>${tw()?m[1]:m[0]} <span class="ref24-ok">VERIFIED</span></b><p>${tw()?m[3]:m[2]}</p></div></button>`;
  }
  function library(){
    const cases=`<div class="section"><div class="slab">${t('我们下午做的 3 个案例','我們下午做的 3 個案例')}</div><div class="cards">${[0,1,2].map(i=>{const c=CASES[i],u=caseSrc(i);return `<button class="mediaCard" data-a="media" data-kind="case" data-v="${i}"><video src="${u}" muted autoplay loop playsinline preload="auto"></video><div class="mediaText"><b>${c[0]}</b><p>${c[2]}</p></div></button>`}).join('')}</div></div>`;
    const image=`<div class="section"><div class="slab">${t('1 张图文参考','1 張圖文參考')}</div><button class="mediaCard" data-a="media" data-kind="image" data-v="0"><img src="${imageSrc()}" alt="ROMI STUDIO"><div class="mediaText"><b>ROMI STUDIO · ${t('服装花束图文','服裝花束圖文')}</b><p>${t('第一眼像一束礼物，第二眼才发现“花材”全部是服装。','第一眼像一束禮物，第二眼才發現「花材」全部是服裝。')}</p></div></button></div>`;
    const n=validCount();
    const refs=`<div class="section"><div class="slab">8 ${t('个参考视频 · 重新上传版','個參考影片 · 重新上傳版')}</div><div class="ref24-status"><b>${n} / 8 ${t('已重新上传并验证可播放','已重新上傳並驗證可播放')}</b><br>${n===8?t('这 8 条同时用于 04 内容和抖音「参考案例」。','這 8 支同時用於 04 內容與抖音「參考案例」。'):t('旧 7 条已全部作废；只有本轮验证成功的视频才会出现在这里。','舊 7 支已全部作廢；只有本輪驗證成功的影片才會出現在這裡。')}</div><div class="ref24-list">${META.map((_,i)=>refCard(i)).join('')}</div></div>`;
    return cases+image+refs;
  }

  /* Take over the 04 library. */
  try{contentLibrary=library}catch(e){}

  function rerender(){
    syncLegacyArrays();
    try{if(document.querySelector('#app')?.classList.contains('on'))render()}catch(e){}
    setTimeout(()=>document.querySelectorAll('.ref24-video').forEach(v=>v.play().catch(()=>{})),120);
  }

  /* Reference media detail: use the same verified source as 04. */
  const oldShowMedia=typeof showMedia==='function'?showMedia:null;
  try{showMedia=function(kind,i){
    if(kind!=='ref')return oldShowMedia?oldShowMedia(kind,i):undefined;
    const m=META[i],u=src(i);$('#detailTitle').textContent=tw()?m[1]:m[0];$('#detailLead').textContent='Reference / Case';
    $('#detailBody').innerHTML=u?`<video src="${u}" controls autoplay loop playsinline preload="auto" style="width:100%;max-height:70dvh;object-fit:contain;border-radius:16px;background:#000"></video><div class="row"><b>${t('参考点','參考點')}</b><p>${tw()?m[3]:m[2]}</p></div>`:`<div class="ref24-empty"><div><b>${t('等待重新上传','等待重新上傳')}</b><span>${t('旧文件已作废，这里不会再显示黑屏占位。','舊檔案已作廢，這裡不會再顯示黑屏佔位。')}</span></div></div>`;$('#detail').classList.add('show')
  }}catch(e){}

  /* Douyin immersive feed — same 8 URLs, no duplicate media source. */
  function ensureFeed(){
    if(feed)return;
    feed=document.createElement('div');feed.className='r24-feed';feed.innerHTML=`<div class="r24-shell"><div class="r24-stage"></div><div class="r24-feed-top"><button class="r24-back">‹ ${t('返回','返回')}</button><div class="r24-feed-title">${t('参考案例','參考案例')}<div class="r24-count">1 / 8</div></div><button class="r24-sound">${t('声音','聲音')}</button></div><div class="r24-feed-bottom"><div class="r24-feed-name"></div><div class="r24-feed-desc"></div><div class="r24-feed-hint">${t('↑ 上滑下一条 · ↓ 下滑上一条','↑ 上滑下一支 · ↓ 下滑上一支')}</div></div></div>`;document.body.appendChild(feed);
    feed.querySelector('.r24-back').onclick=hideFeed;
    feed.querySelector('.r24-sound').onclick=()=>{const v=feed.querySelector('video');if(!v)return;v.muted=!v.muted;feed.querySelector('.r24-sound').textContent=v.muted?t('声音','聲音'):t('静音','靜音')};
    feed.addEventListener('touchstart',e=>{e.stopPropagation();const p=e.changedTouches[0];sy=p.clientY;sx=p.clientX;st=Date.now()},{passive:true,capture:true});
    feed.addEventListener('touchmove',e=>{e.stopPropagation();e.preventDefault()},{passive:false,capture:true});
    feed.addEventListener('touchend',e=>{e.stopPropagation();if(locked)return;const p=e.changedTouches[0],dy=p.clientY-sy,dx=p.clientX-sx,dt=Date.now()-st;if(Math.abs(dy)<55||Math.abs(dy)<Math.abs(dx)*1.15||dt>1000)return;feedIndex=dy<0?(feedIndex+1)%8:(feedIndex+7)%8;paintFeed()},{passive:true,capture:true});
  }
  function paintFeed(){
    ensureFeed();locked=true;const m=META[feedIndex],u=src(feedIndex),stage=feed.querySelector('.r24-stage');
    stage.innerHTML=u?`<video class="r24-feed-video" src="${u}" muted autoplay loop playsinline preload="auto"></video>`:`<div class="r24-feed-empty"><b>${String(feedIndex+1).padStart(2,'0')} · ${tw()?m[1]:m[0]}</b><br>${t('这条尚未完成本轮重新上传。','這支尚未完成本輪重新上傳。')}</div>`;
    feed.querySelector('.r24-count').textContent=(feedIndex+1)+' / 8';feed.querySelector('.r24-feed-name').textContent=tw()?m[1]:m[0];feed.querySelector('.r24-feed-desc').textContent=tw()?m[3]:m[2];feed.querySelector('.r24-sound').textContent=t('声音','聲音');
    const v=stage.querySelector('video');if(v){v.addEventListener('loadeddata',()=>v.play().catch(()=>{}),{once:true});v.onclick=()=>v.paused?v.play().catch(()=>{}):v.pause()}
    locked=false;
  }
  async function showFeed(){
    try{if(S.world!=='dy')return}catch(e){return}
    try{await readCloud()}catch(e){}ensureFeed();feedIndex=0;feed.classList.add('show');document.documentElement.style.overflow='hidden';paintFeed();
  }
  function hideFeed(){if(!feed)return;const v=feed.querySelector('video');if(v)v.pause();feed.classList.remove('show');document.documentElement.style.overflow=''}

  function injectRefEntry(){
    let dy=false;try{dy=S.world==='dy'}catch(e){}
    if(!dy)return;
    const strip=document.querySelector('.dyStrip');if(strip&&!strip.querySelector('[data-r24-feed]')){const b=document.createElement('button');b.className='pill';b.dataset.r24Feed='1';b.textContent=t('参考案例','參考案例');const p=[...strip.querySelectorAll('.pill')].find(x=>/内容|內容/.test(x.textContent||''));p?p.after(b):strip.appendChild(b)}
    if(S.chapter===3){const cap=document.querySelector('.caption');if(cap&&!cap.querySelector('[data-r24-feed]')){const b=document.createElement('button');b.className='r24-open';b.dataset.r24Feed='1';b.innerHTML=`<b>${t('参考案例 · 像刷抖音一样看','參考案例 · 像刷抖音一樣看')}</b><span>${t('同一套 8 个重新上传的视频，上下滑切换。','同一套 8 支重新上傳的影片，上下滑切換。')}</span>`;cap.appendChild(b)}}
  }

  document.addEventListener('click',e=>{
    const r=e.target.closest('[data-r24-media]');if(r){e.preventDefault();showMedia('ref',Number(r.dataset.r24Media));return}
    const f=e.target.closest('[data-r24-feed], [data-a="dyRefs"]');if(f){e.preventDefault();e.stopImmediatePropagation();showFeed()}
  },true);
  new MutationObserver(()=>{clearTimeout(window.__r24i);window.__r24i=setTimeout(injectRefEntry,40)}).observe(document.body,{childList:true,subtree:true});

  /* One-shot 8-file verified uploader. */
  function verifyVideo(url,timeout=20000){
    return new Promise((resolve,reject)=>{const v=document.createElement('video');let done=false;const finish=(ok,msg)=>{if(done)return;done=true;clearTimeout(timer);v.removeAttribute('src');v.load();ok?resolve():reject(new Error(msg))};v.preload='metadata';v.muted=true;v.playsInline=true;v.onloadedmetadata=()=>{if(Number.isFinite(v.duration)&&v.duration>0.1)finish(true);else finish(false,'视频没有有效时长')};v.onerror=()=>finish(false,'浏览器无法解码这个 MP4');const timer=setTimeout(()=>finish(false,'上传完成，但 20 秒内无法读取视频画面'),timeout);v.src=url+(url.includes('?')?'&':'?')+'verify='+Date.now();v.load()})
  }
  function xhrUpload(path,file,onProgress){
    return new Promise((resolve,reject)=>{const x=new XMLHttpRequest();x.open('POST',`${SUPA}/storage/v1/object/${BUCKET}/${path}`,true);x.setRequestHeader('apikey',KEY);x.setRequestHeader('Authorization','Bearer '+KEY);x.setRequestHeader('Content-Type','video/mp4');x.setRequestHeader('x-upsert','true');x.timeout=180000;x.upload.onprogress=e=>{if(e.lengthComputable)onProgress(e.loaded/e.total)};x.onload=()=>x.status>=200&&x.status<300?resolve():reject(new Error(`上传 HTTP ${x.status} ${x.responseText||''}`));x.onerror=()=>reject(new Error('网络连接中断'));x.ontimeout=()=>reject(new Error('上传超过 3 分钟，已停止'));x.send(file)})
  }
  function sorted8(files){return [...files].sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:'base'}))}
  function uploader(){
    if(!EDIT)return;
    const btn=document.createElement('button');btn.className='r24-upload-btn';btn.textContent='REPLACE ALL 8 VIDEOS';document.body.appendChild(btn);
    const panel=document.createElement('div');panel.className='r24-panel';panel.innerHTML=`<div class="r24-sheet"><div class="r24-head"><h3>重新上传 8 个参考视频</h3><button class="r24-x">×</button></div><div class="r24-alert"><b>旧 7 条已经全部作废。</b><br>这一版只认本轮重新上传、并且实际通过浏览器播放验证的 8 个 MP4。不会再出现“云端显示成功，但 04 里是黑屏”的情况。</div><label class="r24-picker"><input type="file" accept="video/mp4,.mp4" multiple><small>一次选择 8 个 MP4。建议使用我整理好的 01–08 文件；系统会按文件名顺序对应 8 个参考案例，并逐个上传 + 验证。</small></label><div class="r24-summary">等待选择 8 个视频。</div><div class="r24-rows"></div></div>`;document.body.appendChild(panel);
    const rowsBox=panel.querySelector('.r24-rows');META.forEach((m,i)=>{const row=document.createElement('div');row.className='r24-row';row.innerHTML=`<div class="r24-top"><b>${String(i+1).padStart(2,'0')} · ${m[0]}</b><span class="r24-state">等待</span></div><div class="r24-name">—</div><div class="r24-bar"><i></i></div><div class="r24-error"></div>`;rowsBox.appendChild(row)});
    const rows=[...panel.querySelectorAll('.r24-row')];
    btn.onclick=()=>{panel.classList.add('show');paintSummary(panel)};panel.querySelector('.r24-x').onclick=()=>panel.classList.remove('show');
    panel.querySelector('input').onchange=async e=>{
      const files=sorted8(e.target.files||[]),sum=panel.querySelector('.r24-summary');
      if(files.length!==8){sum.innerHTML=`<b>需要一次选满 8 个 MP4。</b><br>现在选择了 ${files.length} 个。`;return}
      if(files.some(f=>!(/\.mp4$/i.test(f.name)||f.type==='video/mp4'))){sum.innerHTML='<b>只接受 MP4。</b><br>请使用兼容版 01–08 MP4，不要再选 MOV。';return}
      e.target.disabled=true;sum.innerHTML='<b>0 / 8</b> · 正在重新上传并验证，请保持页面打开。';
      const saved={};let success=0;
      for(let i=0;i<8;i++){
        const file=files[i],row=rows[i],stateEl=row.querySelector('.r24-state'),nameEl=row.querySelector('.r24-name'),bar=row.querySelector('.r24-bar'),fill=bar.querySelector('i'),err=row.querySelector('.r24-error');
        err.style.display='none';bar.style.display='block';fill.style.width='0%';nameEl.textContent=file.name+' · '+(file.size/1024/1024).toFixed(1)+' MB';stateEl.textContent='上传中 0%';stateEl.classList.remove('ok');
        try{
          const path=`final-v24/ref-${String(i+1).padStart(2,'0')}.mp4`;
          let last=null;for(let attempt=1;attempt<=2;attempt++){try{await xhrUpload(path,file,p=>{const q=Math.round(p*100);fill.style.width=q+'%';stateEl.textContent=`上传中 ${q}%`});last=null;break}catch(ex){last=ex;if(attempt<2){stateEl.textContent='网络波动，自动重试…';await new Promise(r=>setTimeout(r,900))}}}if(last)throw last;
          fill.style.width='100%';stateEl.textContent='验证画面…';const base=`${SUPA}/storage/v1/object/public/${BUCKET}/${path}`;await verifyVideo(base);
          const stamp=Date.now(),url=base+'?v='+stamp;saved[key(i)]={url,name:file.name,type:'video/mp4',verified:true,updatedAt:new Date().toISOString()};await mergeAndSave({[key(i)]:saved[key(i)]});success++;stateEl.textContent='✓ 已上传 · 可播放';stateEl.classList.add('ok');sum.innerHTML=`<b>${success} / 8 已完成</b><br>每一条都在真正能读取画面后才算成功。`;rerender();
        }catch(ex){stateEl.textContent='失败';err.style.display='block';err.textContent='真实错误：'+(ex?.message||String(ex));sum.innerHTML=`<b>${success} / 8 已完成</b><br>第 ${String(i+1).padStart(2,'0')} 条失败，已停止；修好这一条后重新选择 8 个即可覆盖。`;e.target.disabled=false;return}
      }
      await readCloud();rerender();sum.innerHTML='<b>✓ 8 / 8 全部重新上传，并验证可播放。</b><br>04 内容和抖音「参考案例」现在读取的是同一套新 MP4。';e.target.disabled=false;
    }
  }
  function paintSummary(panel){const n=validCount(),s=panel.querySelector('.r24-summary');s.innerHTML=n===8?'<b>✓ 当前 8 / 8 已通过本轮播放验证。</b><br>如需替换，仍然一次选择新的 8 个 MP4。':`<b>当前 ${n} / 8 为本轮有效视频。</b><br>旧云端记录不再计数。请一次选择 8 个新 MP4 重新上传。`}

  uploader();
  readCloud().then(()=>{rerender();injectRefEntry()}).catch(e=>console.error('V24 cloud',e));
  window.addEventListener('focus',()=>readCloud().then(()=>rerender()).catch(()=>{}));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)readCloud().then(()=>rerender()).catch(()=>{})});
})();
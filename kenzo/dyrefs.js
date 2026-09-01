/* Douyin-only immersive reference feed: swipe through all 8 reference videos. */
(function(){
  const SUPA='https://mysbpummazvgyesuhlfg.supabase.co';
  const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJteXNidW1tYXp2Z3llc3VobGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjc3NDMsImV4cCI6MjEwMzg0Mzc0M30.VLwxADqTs4_jRveJ0mbt-9CAGceObRShSno8nuJiiFY';
  const H={apikey:KEY,Authorization:'Bearer '+KEY};
  const DEF=[
    {slot:'ref-0',name:'Live / 图文动态参考',tw:'Live / 圖文動態參考',src:'assets/ref_live_visual.mp4',desc:'静态封面点进去以后会动。',descTw:'靜態封面點進去之後會動。'},
    {slot:'ref-1',name:'Paper Cutout OOTD',tw:'Paper Cutout OOTD',src:'assets/ref_paper_cutout.mp4',desc:'纸片 / 拼贴式穿搭。',descTw:'紙片 / 拼貼式穿搭。'},
    {slot:'ref-2',name:'Product Scale Shift',tw:'Product Scale Shift',src:'assets/ref_scale_shift.mp4',desc:'比例变化制造第一眼停留。',descTw:'比例變化製造第一眼停留。'},
    {slot:'ref-3',name:'Product Detail / Label',tw:'Product Detail / Label',src:'assets/ref_label_detail.mp4',desc:'从标签 / 产品细节开始。',descTw:'從標籤 / 產品細節開始。'},
    {slot:'ref-4',name:'Product Grid Game',tw:'Product Grid Game',src:'assets/ref_grid_game.mp4',desc:'格子 / 选择 / 抽卡机制。',descTw:'格子 / 選擇 / 抽卡機制。'},
    {slot:'ref-5',name:'Outfit Receipt',tw:'Outfit Receipt',src:'assets/ref_outfit_receipt.mp4',desc:'扫描、识别、打印一套 Look。',descTw:'掃描、辨識、列印一套 Look。'},
    {slot:'ref-6',name:'Word Drag / 拖拽机制',tw:'Word Drag / 拖曳機制',src:'assets/ref_word_drag.mp4',desc:'拖动动作触发下一段变化。',descTw:'拖曳動作觸發下一段變化。'},
    {slot:'ref-7',name:'Extra Motion / 新增动态',tw:'Extra Motion / 新增動態',src:'assets/ref_extra_motion.mp4',desc:'补充动态参考，继续扩玩法库。',descTw:'補充動態參考，繼續擴充玩法庫。'}
  ];
  let cloud={media:{}},idx=0,overlay=null,sy=0,sx=0,st=0,locked=false;
  const tw=()=>{try{return S.lang==='tw'}catch(e){return false}};
  const t=(a,b)=>tw()?b:a;

  const css=document.createElement('style');
  css.textContent=`
  .dyr-feed{position:fixed;z-index:500;inset:0;background:#000;display:none;justify-content:center;overflow:hidden;touch-action:none}.dyr-feed.show{display:flex}.dyr-shell{position:relative;width:min(448px,100%);height:100%;background:#000;overflow:hidden;color:#fff}.dyr-stage{position:absolute;inset:0;background:#000;display:grid;place-items:center}.dyr-video{width:100%;height:100%;object-fit:contain;background:#000;display:block;transition:transform .22s ease,opacity .22s ease}.dyr-video.outUp{transform:translateY(-10%);opacity:.1}.dyr-video.outDown{transform:translateY(10%);opacity:.1}.dyr-top{position:absolute;z-index:3;left:0;right:0;top:0;padding:calc(12px + env(safe-area-inset-top)) 14px 28px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(180deg,rgba(0,0,0,.78),transparent)}.dyr-close,.dyr-sound{border:0;background:rgba(0,0,0,.38);color:#fff;border-radius:999px;height:38px;padding:0 13px;font-size:13px;backdrop-filter:blur(12px)}.dyr-titleTop{font-size:13px;font-weight:700;letter-spacing:.04em}.dyr-count{font-size:11px;color:#bbb;margin-top:2px;text-align:center}.dyr-bottom{position:absolute;z-index:3;left:0;right:0;bottom:0;padding:80px 74px calc(30px + env(safe-area-inset-bottom)) 16px;background:linear-gradient(0deg,rgba(0,0,0,.82),rgba(0,0,0,.18),transparent)}.dyr-user{font-size:13px;font-weight:700;margin-bottom:8px}.dyr-name{font-size:18px;font-weight:750;line-height:1.35}.dyr-desc{font-size:12px;line-height:1.55;color:#ddd;margin-top:6px}.dyr-hint{font-size:10px;color:#aaa;margin-top:10px}.dyr-side{position:absolute;z-index:4;right:12px;bottom:95px;display:grid;gap:17px;text-align:center}.dyr-ico{width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,.4);display:grid;place-items:center;font-size:19px;backdrop-filter:blur(10px)}.dyr-side small{font-size:9px;color:#ddd;margin-top:-12px}.dyr-launch{border-color:#fff!important;background:#fff!important;color:#111!important;font-weight:700}.dyr-inline{margin:12px 14px 20px;border:1px solid #333;background:#111;color:#fff;border-radius:16px;padding:14px 15px;text-align:left;width:calc(100% - 28px)}.dyr-inline b{display:block;font-size:13px}.dyr-inline span{display:block;font-size:11px;color:#aaa;margin-top:5px;line-height:1.5}
  `;document.head.appendChild(css);

  function ensure(){
    if(overlay)return;
    overlay=document.createElement('div');overlay.className='dyr-feed';overlay.innerHTML=`<div class="dyr-shell"><div class="dyr-stage"><video class="dyr-video" playsinline muted autoplay loop preload="metadata"></video></div><div class="dyr-top"><button class="dyr-close">‹ ${t('返回','返回')}</button><div><div class="dyr-titleTop">${t('参考案例','參考案例')}</div><div class="dyr-count">1 / 8</div></div><button class="dyr-sound">${t('声音','聲音')}</button></div><div class="dyr-bottom"><div class="dyr-user">@ Reference Case</div><div class="dyr-name"></div><div class="dyr-desc"></div><div class="dyr-hint">${t('↑ 上滑下一个 · ↓ 下滑上一个','↑ 上滑下一個 · ↓ 下滑上一個')}</div></div><div class="dyr-side"><div class="dyr-ico">♥</div><small>LIKE</small><div class="dyr-ico">☆</div><small>SAVE</small><div class="dyr-ico">↗</div><small>SHARE</small></div></div>`;document.body.appendChild(overlay);
    overlay.querySelector('.dyr-close').onclick=hide;
    overlay.querySelector('.dyr-sound').onclick=()=>{const v=overlay.querySelector('video');v.muted=!v.muted;overlay.querySelector('.dyr-sound').textContent=v.muted?t('声音','聲音'):t('静音','靜音')};
    overlay.querySelector('.dyr-stage').onclick=()=>{const v=overlay.querySelector('video');v.paused?v.play().catch(()=>{}):v.pause()};
    overlay.addEventListener('touchstart',e=>{e.stopPropagation();const p=e.changedTouches[0];sy=p.clientY;sx=p.clientX;st=Date.now()},{passive:true,capture:true});
    overlay.addEventListener('touchmove',e=>{e.stopPropagation();e.preventDefault()},{passive:false,capture:true});
    overlay.addEventListener('touchend',e=>{e.stopPropagation();if(locked)return;const p=e.changedTouches[0],dy=p.clientY-sy,dx=p.clientX-sx,dt=Date.now()-st;if(Math.abs(dy)<58||Math.abs(dy)<Math.abs(dx)*1.15||dt>900)return;dy<0?next():prev()},{passive:true,capture:true});
    overlay.addEventListener('wheel',e=>{e.preventDefault();if(locked)return;e.deltaY>0?next():prev()},{passive:false});
  }
  async function readCloud(){
    try{const r=await fetch(SUPA+'/rest/v1/kenzo_app_state?id=eq.main&select=content,updated_at&_='+Date.now(),{headers:H,cache:'no-store'});if(!r.ok)return;const a=await r.json();cloud=a[0]?.content||{media:{}}}catch(e){console.error('dyr cloud',e)}
  }
  function srcFor(i){return cloud.media?.[DEF[i].slot]?.url||DEF[i].src}
  function render(dir=0){
    ensure();const d=DEF[idx],v=overlay.querySelector('.dyr-video');locked=true;
    v.classList.remove('outUp','outDown');if(dir)v.classList.add(dir>0?'outUp':'outDown');
    setTimeout(()=>{v.classList.remove('outUp','outDown');v.src=srcFor(idx);v.muted=true;v.currentTime=0;v.load();v.play().catch(()=>{});overlay.querySelector('.dyr-count').textContent=`${idx+1} / ${DEF.length}`;overlay.querySelector('.dyr-titleTop').textContent=t('参考案例','參考案例');overlay.querySelector('.dyr-name').textContent=tw()?d.tw:d.name;overlay.querySelector('.dyr-desc').textContent=tw()?d.descTw:d.desc;overlay.querySelector('.dyr-hint').textContent=t('↑ 上滑下一个 · ↓ 下滑上一个','↑ 上滑下一個 · ↓ 下滑上一個');overlay.querySelector('.dyr-sound').textContent=t('声音','聲音');locked=false},dir?150:0);
  }
  async function show(){try{if(S.world!=='dy')return}catch(e){return}ensure();idx=0;overlay.classList.add('show');document.documentElement.style.overflow='hidden';await readCloud();render()}
  function hide(){if(!overlay)return;overlay.classList.remove('show');overlay.querySelector('video').pause();document.documentElement.style.overflow=''}
  function next(){if(idx>=DEF.length-1){idx=0}else idx++;render(1)}
  function prev(){if(idx<=0){idx=DEF.length-1}else idx--;render(-1)}

  function inject(){
    let isDy=false;try{isDy=S.world==='dy'}catch(e){}
    if(!isDy)return;
    const strip=document.querySelector('.dyStrip');
    if(strip&&!strip.querySelector('[data-a="dyRefs"]')){
      const b=document.createElement('button');b.className='pill dyr-launch';b.dataset.a='dyRefs';b.textContent=t('参考案例','參考案例');
      const pills=[...strip.querySelectorAll('.pill')];const after=pills.find(x=>/内容|內容/.test(x.textContent||''));after?after.after(b):strip.appendChild(b);
    }
    const guide=document.querySelector('#guideList');
    if(guide&&!guide.querySelector('[data-a="dyRefs"]')){
      const b=document.createElement('button');b.className='gitem';b.dataset.a='dyRefs';b.innerHTML=`<small>VIDEO</small><b>${t('参考案例','參考案例')}</b>`;guide.appendChild(b)
    }
    if(S.chapter===3){const cap=document.querySelector('.caption');if(cap&&!cap.querySelector('[data-a="dyRefs"]')){const b=document.createElement('button');b.className='dyr-inline';b.dataset.a='dyRefs';b.innerHTML=`<b>${t('参考案例 · 像刷抖音一样看','參考案例 · 像刷抖音一樣看')}</b><span>${t('8 个参考视频，上下滑动切换。','8 個參考影片，上下滑動切換。')}</span>`;cap.appendChild(b)}}
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-a="dyRefs"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();show()},true);
  const mo=new MutationObserver(()=>{clearTimeout(window.__dyrInject);window.__dyrInject=setTimeout(inject,50)});mo.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',e=>{const a=e.target.closest('[data-a]')?.dataset.a;if(a==='lang'||a==='toggleLang')setTimeout(()=>{inject();if(overlay?.classList.contains('show'))render()},100)},true);
  window.addEventListener('focus',()=>{if(overlay?.classList.contains('show'))readCloud().then(()=>render())});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&overlay?.classList.contains('show'))readCloud().then(()=>render())});
  inject();
})();
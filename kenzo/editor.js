/* KENZO cloud editor: edits auto-save to Supabase and are visible to every viewer. */
(function(){
  const SUPA='https://mysbpummazvgyesuhlfg.supabase.co';
  const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15c2JwdW1tYXp2Z3llc3VobGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjc3NDMsImV4cCI6MjEwMzg0Mzc0M30.VLwxADqTs4_jRveJ0mbt-9CAGceObRShSno8nuJiiFY';
  const BUCKET='kenzo-social-media';
  const EDIT_MODE=new URLSearchParams(location.search).get('edit')==='1';
  let edit=false,panel=null,state={text:{},media:{}},saveTimer=null,applying=false,lastMediaNodes=new WeakMap();
  const H={'apikey':KEY,'Authorization':'Bearer '+KEY};

  const style=document.createElement('style');
  style.textContent=`
  .ke-btn{position:fixed;z-index:120;right:12px;top:calc(10px + env(safe-area-inset-top));border:1px solid #333;background:#111;color:#fff;border-radius:999px;padding:9px 12px;font-size:11px;font-weight:700;letter-spacing:.06em;box-shadow:0 8px 25px #0005}.ke-btn.on{background:#ff2442;border-color:#ff2442}.ke-sync{position:fixed;z-index:119;right:12px;top:calc(50px + env(safe-area-inset-top));font-size:9px;color:#777;background:#fff;border:1px solid #eee;border-radius:999px;padding:5px 8px;box-shadow:0 5px 18px #0001}.app.dy~.ke-sync{background:#111;color:#aaa;border-color:#292929}.ke-editing [contenteditable=true]{outline:1px dashed #ff2442!important;outline-offset:3px;border-radius:4px;cursor:text}.ke-editing .mediaCard img,.ke-editing .mediaCard video,.ke-editing .refCard img,.ke-editing .refCard video,.ke-editing .caseMini img,.ke-editing .caseMini video{outline:2px dashed #ff2442;outline-offset:-4px;cursor:pointer}.ke-panel{position:fixed;z-index:130;inset:0;background:#0009;display:none;align-items:flex-end;justify-content:center}.ke-panel.show{display:flex}.ke-sheet{width:min(448px,100%);max-height:86dvh;overflow:auto;background:#fff;color:#111;border-radius:24px 24px 0 0;padding:14px 14px calc(22px + env(safe-area-inset-bottom))}.ke-head{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;padding:4px 0 12px;z-index:2}.ke-head h3{margin:0;font-size:18px}.ke-close{border:0;background:#f1f1f1;border-radius:50%;width:34px;height:34px;font-size:20px}.ke-note{font-size:11px;line-height:1.65;color:#777;margin-bottom:12px}.ke-cloud{padding:9px 11px;border-radius:13px;background:#f5f5f5;font-size:10px;line-height:1.55;margin-bottom:12px}.ke-grid{display:grid;gap:9px}.ke-row{border:1px solid #e8e8e8;border-radius:15px;padding:11px;display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center}.ke-row b{display:block;font-size:12px}.ke-row small{display:block;color:#999;margin-top:4px;font-size:10px}.ke-pick{border:1px solid #111;background:#111;color:#fff;border-radius:999px;padding:8px 10px;font-size:10px}.ke-tools{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}.ke-tools button{height:42px;border-radius:12px;border:1px solid #ddd;background:#fff;font-size:11px}.ke-tools .danger{color:#c22}.ke-toast{position:fixed;z-index:160;left:50%;bottom:90px;transform:translateX(-50%) translateY(12px);background:#111;color:#fff;padding:9px 12px;border-radius:999px;font-size:11px;opacity:0;pointer-events:none;transition:.2s}.ke-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
  `;document.head.appendChild(style);

  const toast=document.createElement('div');toast.className='ke-toast';document.body.appendChild(toast);
  const sync=document.createElement('div');sync.className='ke-sync';sync.textContent='读取云端…';document.body.appendChild(sync);
  let btn=null;
  if(EDIT_MODE){btn=document.createElement('button');btn.className='ke-btn';btn.textContent='EDIT';document.body.appendChild(btn)}

  const slots=[
    ['case-0','案例 01 · 发票 GIF','GIF / 图片 / 视频'],['case-1','案例 02 · 拼贴 GIF','GIF / 图片 / 视频'],['case-2','案例 03 · 鲜花 GIF','GIF / 图片 / 视频'],['image-0','图文参考 · ROMI STUDIO','图片'],
    ['ref-0','参考视频 01','视频'],['ref-1','参考视频 02','视频'],['ref-2','参考视频 03','视频'],['ref-3','参考视频 04','视频'],['ref-4','参考视频 05','视频'],['ref-5','参考视频 06','视频'],['ref-6','参考视频 07','视频'],['ref-7','参考视频 08','视频']
  ];
  function showToast(t){toast.textContent=t;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1500)}
  function syncText(t){sync.textContent=t}

  async function loadState(){
    try{
      const r=await fetch(SUPA+'/rest/v1/kenzo_app_state?id=eq.main&select=content',{headers:H,cache:'no-store'});
      if(!r.ok)throw new Error(await r.text());
      const a=await r.json();
      const c=a[0]?.content||{};
      state={text:c.text||{},media:c.media||{}};
      syncText(EDIT_MODE?'云端已连接 · 自动保存':'FINAL · 云端同步');
      refresh();
    }catch(e){console.error(e);syncText('云端连接失败')}
  }
  async function saveState(){
    clearTimeout(saveTimer);
    syncText('保存中…');
    try{
      const r=await fetch(SUPA+'/rest/v1/kenzo_app_state?id=eq.main',{
        method:'PATCH',headers:{...H,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({content:state,updated_at:new Date().toISOString()})
      });
      if(!r.ok)throw new Error(await r.text());
      syncText('已自动保存到云端');
    }catch(e){console.error(e);syncText('保存失败 · 再改一下会重试')}
  }
  function queueSave(){clearTimeout(saveTimer);syncText('等待保存…');saveTimer=setTimeout(saveState,550)}

  function keyForText(el,idx){let w='xhs',c=0,t=0;try{w=S.world;c=S.chapter;t=S.tab||0}catch(e){}return `${w}:${c}:${t}:${el.tagName}.${el.className||''}:${idx}`}
  const textSel='.note h2,.lead,.row b,.row p,.dir h3,.dir p,.platformBox b,.platformBox p,.quote,.check b,.check p,.sheetLead,.caption h2,.caption p,.mediaText b,.mediaText p,.refText b,.refText small,.slab,.tags';
  function applyText(){
    applying=true;
    const els=[...document.querySelectorAll(textSel)];
    els.forEach((el,i)=>{
      const k=keyForText(el,i);el.dataset.ke=k;
      if(state.text[k]!=null&&el.innerText!==state.text[k])el.innerText=state.text[k];
      el.contentEditable=edit?'true':'false';el.spellcheck=false;
    });
    applying=false;
  }
  function logicalKeyFromCard(card){if(!card)return null;const kind=card.dataset.kind||'',v=card.dataset.v||'0';if(kind==='case')return `case-${v}`;if(kind==='ref')return `ref-${v}`;if(kind==='image')return 'image-0';return null}
  function mediaKind(m){return (m?.type||'').startsWith('video/')?'video':'image'}
  function replaceNodeMedia(node,m,controls=false){
    if(!node||!m?.url)return node;
    const kind=mediaKind(m),want=kind==='video'?'VIDEO':'IMG';let n=node;
    if(node.tagName!==want){n=document.createElement(want.toLowerCase());n.className=node.className;node.replaceWith(n)}
    if(lastMediaNodes.get(n)===m.url)return n;
    lastMediaNodes.set(n,m.url);n.src=m.url;
    if(want==='VIDEO'){n.autoplay=!controls;n.muted=!controls;n.loop=true;n.playsInline=true;n.controls=controls;n.preload='metadata';n.load();if(!controls)n.play().catch(()=>{})}
    return n;
  }
  function applyMedia(){
    const cards=[...document.querySelectorAll('[data-a="media"]')];
    for(const card of cards){const k=logicalKeyFromCard(card),m=state.media[k];if(!m)continue;const node=card.querySelector('img,video');replaceNodeMedia(node,m,false)}
    const minis=[...document.querySelectorAll('.caseMini img,.caseMini video')];
    for(let i=0;i<Math.min(3,minis.length);i++){const m=state.media[`case-${i}`];if(m)replaceNodeMedia(minis[i],m,false)}
  }
  function refresh(){document.body.classList.toggle('ke-editing',edit);if(btn){btn.textContent=edit?'DONE':'EDIT';btn.classList.toggle('on',edit)}applyText();applyMedia()}

  async function uploadFile(slot,file){
    if(!file)return;
    const ext=(file.name.split('.').pop()||'bin').toLowerCase().replace(/[^a-z0-9]/g,'');
    const path=`slots/${slot}-${Date.now()}.${ext||'bin'}`;
    syncText('上传素材中…');showToast('正在上传到云端…');
    try{
      const r=await fetch(`${SUPA}/storage/v1/object/${BUCKET}/${path}`,{method:'POST',headers:{...H,'Content-Type':file.type||'application/octet-stream','x-upsert':'true'},body:file});
      if(!r.ok)throw new Error(await r.text());
      const url=`${SUPA}/storage/v1/object/public/${BUCKET}/${path}`;
      state.media[slot]={url,type:file.type||'',name:file.name,updatedAt:new Date().toISOString()};
      await saveState();refresh();showToast('已上传并自动保存');
    }catch(e){console.error(e);syncText('素材上传失败');showToast('上传失败，请重试')}
  }
  function pickFile(k){const inp=document.createElement('input');inp.type='file';inp.accept=k==='image-0'?'image/*':'image/*,video/*';inp.onchange=()=>uploadFile(k,inp.files&&inp.files[0]);inp.click()}

  document.addEventListener('input',e=>{if(!EDIT_MODE||!edit||applying)return;const el=e.target.closest('[contenteditable=true]');if(!el||!el.dataset.ke)return;state.text[el.dataset.ke]=el.innerText;queueSave()});
  document.addEventListener('click',e=>{
    if(!EDIT_MODE||!edit)return;
    const media=e.target.closest('.mediaCard img,.mediaCard video,.refCard img,.refCard video,.caseMini img,.caseMini video');if(!media)return;
    const card=media.closest('[data-a="media"]');let k=logicalKeyFromCard(card);
    if(!k&&media.closest('.caseMini')){const minis=[...document.querySelectorAll('.caseMini img,.caseMini video')];k=`case-${minis.indexOf(media)}`}
    if(!k)return;e.preventDefault();e.stopImmediatePropagation();pickFile(k);
  },true);

  if(btn)btn.addEventListener('click',()=>{edit=!edit;refresh();if(edit)openPanel()});
  function openPanel(){
    if(!panel){
      panel=document.createElement('div');panel.className='ke-panel';
      panel.innerHTML=`<div class="ke-sheet"><div class="ke-head"><h3>编辑 App</h3><button class="ke-close">×</button></div><div class="ke-cloud"><b>云端自动保存已开启</b><br>文字停止输入约半秒自动保存；GIF / 图片 / 视频上传完成后自动保存。领导打开普通链接看到的就是最新版本。</div><div class="ke-note">文字：关闭这个面板后，直接点页面上的文字修改。素材：在下面选择文件，或在 EDIT 模式下直接点页面里的图片 / 视频替换。</div><div class="ke-grid">${slots.map(s=>`<div class="ke-row"><div><b>${s[1]}</b><small>${s[2]}</small></div><button class="ke-pick" data-slot="${s[0]}">选择文件</button></div>`).join('')}</div><div class="ke-tools"><button id="keReload">重新读取云端</button><button id="keView">打开领导查看版</button><button id="keClearText" class="danger">清空文字修改</button><button id="keClearMedia" class="danger">清空素材替换</button></div></div>`;
      document.body.appendChild(panel);
      panel.querySelector('.ke-close').onclick=()=>panel.classList.remove('show');
      panel.addEventListener('click',e=>{const p=e.target.closest('[data-slot]');if(p)pickFile(p.dataset.slot)});
      panel.querySelector('#keReload').onclick=async()=>{await loadState();showToast('已读取云端最新版')};
      panel.querySelector('#keView').onclick=()=>window.open(location.pathname+'?v=cloud-final','_blank');
      panel.querySelector('#keClearText').onclick=async()=>{if(!confirm('清空线上所有文字修改？'))return;state.text={};await saveState();location.reload()};
      panel.querySelector('#keClearMedia').onclick=async()=>{if(!confirm('清空线上所有素材替换？'))return;state.media={};await saveState();location.reload()};
    }
    panel.classList.add('show');
  }

  const obs=new MutationObserver(()=>{clearTimeout(window.__keCloudT);window.__keCloudT=setTimeout(refresh,80)});obs.observe(document.body,{childList:true,subtree:true});

  /* When a cloud-replaced card is opened, replace the modal media with the cloud asset too. */
  document.addEventListener('click',e=>{
    if(edit)return;const card=e.target.closest('[data-a="media"]');if(!card)return;const k=logicalKeyFromCard(card),m=state.media[k];if(!m)return;
    setTimeout(()=>{const box=document.querySelector('#detail .mediaBox');if(!box)return;box.classList.remove('hide');box.innerHTML='';const n=document.createElement(mediaKind(m)==='video'?'video':'img');n.className='detailMedia';box.appendChild(n);replaceNodeMedia(n,m,true)},80);
  });

  loadState();

  /* Deliberate Douyin swipe only: tiny scrolls and sheet scrolling never change chapter. */
  try{
    bindSwipe=function(){
      if(S.world!=='dy')return;const reel=document.querySelector('#reel');if(!reel)return;
      let sy=0,sx=0,st=0;
      reel.addEventListener('touchstart',e=>{if(document.querySelector('#detail')?.classList.contains('show')||document.querySelector('#guide')?.classList.contains('show'))return;const t=e.changedTouches[0];sy=t.clientY;sx=t.clientX;st=Date.now()},{passive:true});
      reel.addEventListener('touchend',e=>{if(document.querySelector('#detail')?.classList.contains('show')||document.querySelector('#guide')?.classList.contains('show'))return;const t=e.changedTouches[0],dy=t.clientY-sy,dx=t.clientX-sx,dt=Date.now()-st;if(Math.abs(dy)<220||Math.abs(dx)>80||dt>700)return;if(dy<0&&S.chapter<6){S.chapter++;S.tab=0;render()}else if(dy>0&&S.chapter>0){S.chapter--;S.tab=0;render()}},{passive:true});
    };
  }catch(e){}
})();
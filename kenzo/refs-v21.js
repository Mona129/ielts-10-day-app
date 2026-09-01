/* V21: reference videos are first-class content, not optional cloud decorations. */
(function(){
  const SUPA='https://mysbpummazvgyesuhlfg.supabase.co';
  const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJteXNidW1tYXp2Z3llc3VobGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjc3NDMsImV4cCI6MjEwMzg0Mzc0M30.VLwxADqTs4_jRveJ0mbt-9CAGceObRShSno8nuJiiFY';
  const UPLOAD='https://mysbpummazvgyesuhlfg.supabase.co/functions/v1/kenzo-media-upload';
  const EDIT=new URLSearchParams(location.search).get('edit')==='1';
  const H={apikey:KEY,Authorization:'Bearer '+KEY};
  const DIRECT=[
    null,
    'https://mysbpummazvgyesuhlfg.supabase.co/storage/v1/object/public/kenzo-social-media/slots/ref-1-1788279938913.mov',
    'https://mysbpummazvgyesuhlfg.supabase.co/storage/v1/object/public/kenzo-social-media/slots/ref-3-1788279989515.mov',
    'https://mysbpummazvgyesuhlfg.supabase.co/storage/v1/object/public/kenzo-social-media/slots/ref-2-1788279978290.mov',
    'https://mysbpummazvgyesuhlfg.supabase.co/storage/v1/object/public/kenzo-social-media/slots/ref-4-1788280004014.mov',
    'https://mysbpummazvgyesuhlfg.supabase.co/storage/v1/object/public/kenzo-social-media/slots/ref-5-1788280011260.mov',
    'https://mysbpummazvgyesuhlfg.supabase.co/storage/v1/object/public/kenzo-social-media/slots/ref-6-1788280023661.mov',
    'https://mysbpummazvgyesuhlfg.supabase.co/storage/v1/object/public/kenzo-social-media/slots/ref-7-1788280034038.mov'
  ];
  const NAMES=['Live / 图文动态参考','Paper Cutout OOTD','Product Scale Shift','Product Detail / Label','Product Grid Game','Outfit Receipt','Word Drag / 拖拽机制','Extra Motion / 新增动态'];
  const DESC=['静态封面点进去以后会动。','纸片 / 拼贴式穿搭。','比例变化制造第一眼停留。','从标签 / 产品细节开始。','格子 / 选择 / 抽卡机制。','扫描、识别、打印一套 Look。','拖动动作触发下一段变化。','补充的动态参考，继续扩玩法库。'];
  let state={text:{},media:{}},panel=null,rows=[];

  const style=document.createElement('style');
  style.textContent=`
    .ku-btn,.ku-panel{display:none!important}
    .refFullList{display:grid;grid-template-columns:1fr;gap:14px;margin-top:12px}
    .refFullCard{border:1px solid #e8e8e8;border-radius:16px;overflow:hidden;background:#fff;text-align:left;padding:0;color:#111}
    .refFullCard video{width:100%;aspect-ratio:9/16;max-height:520px;display:block;background:#090909;object-fit:contain}
    .refFullText{padding:10px 12px 12px}.refFullText b{font-size:12px}.refFullText p{font-size:11px;line-height:1.6;color:#777;margin:5px 0 0}
    .refCloudMark{display:inline-flex;margin-left:6px;padding:2px 6px;border-radius:999px;background:#111;color:#fff;font-size:8px;vertical-align:1px}
    .kv-btn{display:none;position:fixed;z-index:145;left:12px;top:calc(10px + env(safe-area-inset-top));border:0;background:#fff;color:#111;border-radius:999px;padding:10px 13px;font-size:10px;font-weight:850;box-shadow:0 8px 26px #0006}.kv-btn.show{display:block}
    .kv-panel{position:fixed;z-index:220;inset:0;background:#000b;display:none;align-items:flex-end;justify-content:center}.kv-panel.show{display:flex}
    .kv-sheet{width:min(448px,100%);max-height:91dvh;overflow:auto;background:#fff;color:#111;border-radius:24px 24px 0 0;padding:14px 14px calc(24px + env(safe-area-inset-bottom))}
    .kv-head{position:sticky;top:0;z-index:2;background:#fff;display:flex;justify-content:space-between;align-items:center;padding:4px 0 12px}.kv-head h3{margin:0;font-size:18px}.kv-x{width:34px;height:34px;border:0;border-radius:50%;font-size:19px}
    .kv-summary{padding:10px 11px;background:#f3f3f3;border-radius:13px;font-size:11px;line-height:1.6;margin-bottom:8px}.kv-row{padding:12px 0;border-top:1px solid #eee}.kv-top{display:flex;justify-content:space-between;gap:8px}.kv-top b{font-size:12px}.kv-status{font-size:10px;color:#888}.kv-status.ok{color:#16813a}.kv-name{font-size:10px;color:#777;margin:5px 0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .kv-file{width:100%;font-size:11px;background:#111;color:#fff;border-radius:11px;padding:10px;display:block}.kv-file::file-selector-button{border:0;background:#fff;color:#111;border-radius:999px;padding:6px 9px;margin-right:8px;font-weight:700}
    .kv-err{font-size:10px;color:#c22;line-height:1.5;margin-top:7px;display:none}.kv-wait{font-size:10px;color:#555;line-height:1.5;margin-top:7px;display:none}
  `;document.head.appendChild(style);

  function currentSource(i){return state.media?.['ref-'+i]?.url || DIRECT[i] || (typeof REFS!=='undefined' ? REFS[i]?.[1] : '');}
  function syncRefs(){try{for(let i=0;i<8;i++)if(REFS[i])REFS[i][1]=currentSource(i)}catch(e){} }
  async function readState(){
    const r=await fetch(SUPA+'/rest/v1/kenzo_app_state?id=eq.main&select=content',{headers:H,cache:'no-store'});
    if(!r.ok)throw new Error(await r.text());
    const a=await r.json(),c=a[0]?.content||{};state={text:c.text||{},media:c.media||{}};syncRefs();return state;
  }

  /* Replace the old 2-column tiny references with eight full, clear videos. */
  try{
    contentLibrary=function(){
      const cases=`<div class="section"><div class="slab">我们下午做的 3 个案例</div><div class="cards">${CASES.map((c,i)=>`<button class="mediaCard" data-a="media" data-kind="case" data-v="${i}"><video src="${c[1]}" muted autoplay loop playsinline preload="metadata"></video><div class="mediaText"><b>${c[0]}</b><p>${c[2]}</p></div></button>`).join('')}</div></div>`;
      const image=`<div class="section"><div class="slab">1 张图文参考</div><button class="mediaCard" data-a="media" data-kind="image" data-v="0"><img src="assets/romi_bouquet.webp" alt="ROMI STUDIO 服装花束参考"><div class="mediaText"><b>ROMI STUDIO · 服装花束图文</b><p>第一眼像一束礼物，第二眼才发现“花材”全部是服装。</p></div></button></div>`;
      const refs=`<div class="section"><div class="slab">8 个参考视频 · 完整清晰版</div><div class="refFullList">${NAMES.map((n,i)=>`<button class="refFullCard" data-a="media" data-kind="ref" data-v="${i}"><video src="${currentSource(i)}" muted playsinline controls preload="metadata"></video><div class="refFullText"><b>${n}${state.media?.['ref-'+i]?.url||DIRECT[i]?'<span class="refCloudMark">ONLINE</span>':''}</b><p>${DESC[i]}</p></div></button>`).join('')}</div></div>`;
      return cases+image+refs;
    };
  }catch(e){console.error('contentLibrary override',e)}

  function rerenderIfOpen(){
    syncRefs();
    try{if(document.querySelector('#app')?.classList.contains('on'))render()}catch(e){}
    setTimeout(()=>{
      document.querySelectorAll('.refFullCard video').forEach(v=>{try{v.load()}catch(e){}});
    },80);
    window.dispatchEvent(new CustomEvent('kenzoRefsUpdated'));
  }

  function makePanel(){
    if(!EDIT)return;
    const btn=document.createElement('button');btn.className='kv-btn show';btn.textContent='8 REFERENCE VIDEOS';document.body.appendChild(btn);
    panel=document.createElement('div');panel.className='kv-panel';panel.innerHTML=`<div class="kv-sheet"><div class="kv-head"><h3>8 个参考视频 · 直接上传</h3><button class="kv-x">×</button></div><div class="kv-summary">读取云端…</div><div class="kv-list"></div></div>`;document.body.appendChild(panel);
    panel.querySelector('.kv-x').onclick=()=>panel.classList.remove('show');btn.onclick=async()=>{panel.classList.add('show');await refreshPanel()};
    const list=panel.querySelector('.kv-list');
    for(let i=0;i<8;i++){
      const row=document.createElement('div');row.className='kv-row';row.innerHTML=`<div class="kv-top"><b>参考视频 ${String(i+1).padStart(2,'0')} · ${NAMES[i]}</b><span class="kv-status">检查中</span></div><div class="kv-name">—</div><input class="kv-file" type="file" accept="video/*,.mp4,.mov,.m4v"><div class="kv-wait"></div><div class="kv-err"></div>`;list.appendChild(row);rows.push(row);
      row.querySelector('.kv-file').addEventListener('change',e=>{const f=e.target.files?.[0];if(f)upload(i,f)});
    }
  }
  function paint(){
    if(!panel)return;let done=0;
    rows.forEach((r,i)=>{const m=state.media?.['ref-'+i];const ok=!!(m?.url||DIRECT[i]);const s=r.querySelector('.kv-status'),n=r.querySelector('.kv-name');if(ok){done++;s.textContent='✓ 已在线';s.classList.add('ok');n.textContent=m?.name||'已固定到线上清晰素材'}else{s.textContent='未上传';s.classList.remove('ok');n.textContent='—'}});
    panel.querySelector('.kv-summary').innerHTML=`<b>当前线上 ${done} / 8</b><br>${done===8?'8 条已经全部可用，04 内容和抖音「参考案例」都会读取同一套视频。':'已有的不用重传；只补没有打 ✓ 的位置。上传后会同时进入 04 内容和抖音参考案例。'}`;
  }
  async function refreshPanel(){try{await readState();paint()}catch(e){panel.querySelector('.kv-summary').textContent='读取失败：'+e.message}}
  async function upload(i,file){
    const row=rows[i],status=row.querySelector('.kv-status'),name=row.querySelector('.kv-name'),wait=row.querySelector('.kv-wait'),err=row.querySelector('.kv-err'),inp=row.querySelector('.kv-file');
    err.style.display='none';wait.style.display='block';name.textContent=file.name+' · '+(file.size/1024/1024).toFixed(1)+' MB';status.textContent='准备上传';inp.disabled=true;
    wait.textContent='已选中视频，正在上传到云端。请不要关闭这个页面…';
    try{
      const fd=new FormData();fd.append('slot','ref-'+i);fd.append('file',file,file.name);
      status.textContent='上传中…';
      const r=await fetch(UPLOAD,{method:'POST',body:fd,cache:'no-store'});
      const j=await r.json().catch(()=>({ok:false,error:'服务器没有返回 JSON'}));
      if(!r.ok||!j.ok)throw new Error(j.error||('HTTP '+r.status));
      status.textContent='✓ 上传成功';status.classList.add('ok');wait.textContent='已写入云端，正在刷新 04 内容和抖音参考案例…';
      await readState();paint();rerenderIfOpen();setTimeout(()=>{wait.style.display='none'},1200);
    }catch(e){status.textContent='上传失败';status.classList.remove('ok');err.style.display='block';err.textContent='真实错误：'+(e?.message||String(e));wait.style.display='none'}finally{inp.disabled=false}
  }

  makePanel();
  readState().then(()=>{rerenderIfOpen();if(panel)paint()}).catch(e=>console.error('refs state',e));
  window.addEventListener('focus',()=>readState().then(()=>{syncRefs();if(panel)paint()}).catch(()=>{}));
})();
/* Reliable uploader for the 8 Douyin reference videos. Independent from the general editor uploader. */
(function(){
  const EDIT=new URLSearchParams(location.search).get('edit')==='1';
  if(!EDIT)return;
  const SUPA='https://mysbpummazvgyesuhlfg.supabase.co';
  const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15c2JwdW1tYXp2Z3llc3VobGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjc3NDMsImV4cCI6MjEwMzg0Mzc0M30.VLwxADqTs4_jRveJ0mbt-9CAGceObRShSno8nuJiiFY';
  const BUCKET='kenzo-social-media';
  const H={apikey:KEY,Authorization:'Bearer '+KEY};
  const labels=['参考视频 01','参考视频 02','参考视频 03','参考视频 04','参考视频 05','参考视频 06','参考视频 07','参考视频 08'];
  let state={text:{},media:{}},panel,rows=[];

  const st=document.createElement('style');
  st.textContent=`
  .ku-btn{position:fixed;z-index:121;left:12px;top:calc(10px + env(safe-area-inset-top));border:1px solid #fff;background:#fff;color:#111;border-radius:999px;padding:9px 12px;font-size:10px;font-weight:800;box-shadow:0 8px 25px #0005}.ku-panel{position:fixed;z-index:190;inset:0;background:#000b;display:none;align-items:flex-end;justify-content:center}.ku-panel.show{display:flex}.ku-sheet{width:min(448px,100%);max-height:90dvh;overflow:auto;background:#fff;color:#111;border-radius:24px 24px 0 0;padding:14px 14px calc(24px + env(safe-area-inset-bottom))}.ku-head{position:sticky;top:0;background:#fff;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:4px 0 12px}.ku-head h3{margin:0;font-size:18px}.ku-x{width:34px;height:34px;border:0;border-radius:50%;font-size:19px}.ku-summary{padding:10px 11px;border-radius:14px;background:#f4f4f4;font-size:11px;line-height:1.6;margin-bottom:10px}.ku-row{border-top:1px solid #eee;padding:12px 0}.ku-top{display:flex;justify-content:space-between;gap:10px;align-items:center}.ku-top b{font-size:12px}.ku-status{font-size:10px;color:#888;text-align:right}.ku-file{font-size:10px;color:#777;margin-top:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ku-pick{margin-top:8px;width:100%;height:38px;border:0;border-radius:11px;background:#111;color:#fff;font-size:11px;font-weight:700}.ku-pick:disabled{opacity:.45}.ku-bar{height:4px;background:#eee;border-radius:99px;overflow:hidden;margin-top:8px;display:none}.ku-bar i{display:block;height:100%;width:0;background:#111;transition:width .1s}.ku-err{font-size:10px;color:#c33;line-height:1.45;margin-top:6px;display:none}.ku-ok{color:#16813a}.ku-note{font-size:10px;line-height:1.6;color:#777;margin:10px 0 2px}
  `;document.head.appendChild(st);

  const btn=document.createElement('button');btn.className='ku-btn';btn.textContent='UPLOAD 8 VIDEOS';document.body.appendChild(btn);

  function fmt(n){return n<1024*1024?(n/1024).toFixed(1)+' KB':(n/1024/1024).toFixed(1)+' MB'}
  async function read(){
    const r=await fetch(SUPA+'/rest/v1/kenzo_app_state?id=eq.main&select=content&limit=1',{headers:{...H,'Cache-Control':'no-cache','Pragma':'no-cache'},cache:'no-store'});
    if(!r.ok)throw new Error(await r.text());
    const a=await r.json(),c=a[0]?.content||{};state={text:c.text||{},media:c.media||{}};
  }
  async function save(){
    const r=await fetch(SUPA+'/rest/v1/kenzo_app_state?id=eq.main',{method:'PATCH',headers:{...H,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({content:state,updated_at:new Date().toISOString()})});
    if(!r.ok)throw new Error(await r.text());
  }
  function ensure(){
    if(panel)return;
    panel=document.createElement('div');panel.className='ku-panel';panel.innerHTML=`<div class="ku-sheet"><div class="ku-head"><h3>上传 8 个参考视频</h3><button class="ku-x">×</button></div><div class="ku-summary"></div><div class="ku-list"></div><div class="ku-note">上传会直接写入云端并自动保存。已经有 ✓ 的不用重传；只补没有保存的位置即可。</div></div>`;document.body.appendChild(panel);panel.querySelector('.ku-x').onclick=()=>panel.classList.remove('show');
    const list=panel.querySelector('.ku-list');
    labels.forEach((lab,i)=>{const d=document.createElement('div');d.className='ku-row';d.innerHTML=`<div class="ku-top"><b>${lab}</b><span class="ku-status">未上传</span></div><div class="ku-file">—</div><button class="ku-pick">选择视频</button><div class="ku-bar"><i></i></div><div class="ku-err"></div>`;list.appendChild(d);rows.push(d);d.querySelector('.ku-pick').onclick=()=>pick(i)});
  }
  function paint(){
    ensure();let done=0;
    rows.forEach((r,i)=>{const m=state.media['ref-'+i],s=r.querySelector('.ku-status'),f=r.querySelector('.ku-file');if(m?.url){done++;s.textContent='✓ 已保存';s.classList.add('ku-ok');f.textContent=m.name||m.url}else{s.textContent='未上传';s.classList.remove('ku-ok');f.textContent='—'}});
    panel.querySelector('.ku-summary').innerHTML=`<b>云端当前已保存 ${done} / 8</b><br>${done===8?'8 条已经全部在线。':'只需要补没有打 ✓ 的位置；已经成功的不用重新传。'}`;
  }
  function pick(i){const inp=document.createElement('input');inp.type='file';inp.accept='video/*,.mp4,.mov,.m4v';inp.onchange=()=>{const f=inp.files?.[0];if(f)upload(i,f)};inp.click()}
  function xhrUpload(path,file,onProgress){
    return new Promise((resolve,reject)=>{const x=new XMLHttpRequest();x.open('POST',`${SUPA}/storage/v1/object/${BUCKET}/${path}`,true);x.setRequestHeader('apikey',KEY);x.setRequestHeader('Authorization','Bearer '+KEY);x.setRequestHeader('Content-Type',file.type||'application/octet-stream');x.setRequestHeader('x-upsert','true');x.timeout=240000;x.upload.onprogress=e=>{if(e.lengthComputable)onProgress(e.loaded/e.total)};x.onload=()=>x.status>=200&&x.status<300?resolve(x.responseText):reject(new Error(`HTTP ${x.status} ${x.responseText||''}`));x.onerror=()=>reject(new Error('网络连接中断'));x.ontimeout=()=>reject(new Error('上传超时'));x.send(file)})
  }
  async function upload(i,file){
    const row=rows[i],pick=row.querySelector('.ku-pick'),status=row.querySelector('.ku-status'),bar=row.querySelector('.ku-bar'),fill=bar.querySelector('i'),err=row.querySelector('.ku-err'),fileBox=row.querySelector('.ku-file');
    pick.disabled=true;err.style.display='none';bar.style.display='block';fill.style.width='0%';fileBox.textContent=`${file.name} · ${fmt(file.size)}`;
    if(file.size>49*1024*1024){pick.disabled=false;status.textContent='文件过大';err.style.display='block';err.textContent=`这个文件是 ${fmt(file.size)}。请改用小于 49 MB 的 MP4 / MOV。`;return}
    const ext=(file.name.split('.').pop()||'mp4').toLowerCase().replace(/[^a-z0-9]/g,'')||'mp4',path=`slots/ref-${i}-${Date.now()}.${ext}`;
    let last;
    for(let attempt=1;attempt<=3;attempt++){
      try{status.textContent=attempt===1?'上传中…':`重试 ${attempt}/3…`;await xhrUpload(path,file,p=>{fill.style.width=Math.max(2,Math.round(p*100))+'%';status.textContent=`上传 ${Math.round(p*100)}%`});last=null;break}catch(e){last=e;await new Promise(r=>setTimeout(r,900*attempt))}
    }
    if(last){pick.disabled=false;status.textContent='上传失败';err.style.display='block';err.textContent=last.message||String(last);return}
    try{status.textContent='保存到页面…';const url=`${SUPA}/storage/v1/object/public/${BUCKET}/${path}`;state.media['ref-'+i]={url,type:file.type||'video/mp4',name:file.name,updatedAt:new Date().toISOString()};await save();fill.style.width='100%';status.textContent='✓ 已保存';status.classList.add('ku-ok');pick.disabled=false;await read();paint();setTimeout(()=>location.reload(),450)}catch(e){pick.disabled=false;status.textContent='视频已上传，保存映射失败';err.style.display='block';err.textContent=e.message||String(e)}
  }
  btn.onclick=async()=>{ensure();panel.classList.add('show');panel.querySelector('.ku-summary').textContent='读取云端…';try{await read();paint()}catch(e){panel.querySelector('.ku-summary').textContent='读取云端失败：'+e.message}};
})();
/* V27: server upload + Safari-safe range proxy verification. */
(function(){
  const ENDPOINT='https://mysbpummazvgyesuhlfg.supabase.co/functions/v1/kenzo-media-upload';
  let busy=false;

  function rowEls(i){
    const row=document.querySelectorAll('.r24-row')[i];
    if(!row)return {};
    return {row,state:row.querySelector('.r24-state'),name:row.querySelector('.r24-name'),bar:row.querySelector('.r24-bar'),fill:row.querySelector('.r24-bar i'),err:row.querySelector('.r24-error')};
  }
  function summary(html){const el=document.querySelector('.r24-summary');if(el)el.innerHTML=html}
  function setRow(i,status,file,pct,error){
    const e=rowEls(i);if(!e.row)return;
    if(e.state){e.state.textContent=status;e.state.classList.toggle('ok',status.includes('✓'))}
    if(e.name&&file)e.name.textContent=file.name+' · '+(file.size/1024/1024).toFixed(1)+' MB';
    if(e.bar)e.bar.style.display='block';if(e.fill)e.fill.style.width=Math.max(0,Math.min(100,pct||0))+'%';
    if(e.err){e.err.style.display=error?'block':'none';e.err.textContent=error||''}
  }
  function verifyVideo(url){
    return new Promise((resolve,reject)=>{
      const v=document.createElement('video');let done=false;
      const finish=(ok,msg)=>{if(done)return;done=true;clearTimeout(timer);v.pause();v.removeAttribute('src');try{v.load()}catch(e){};ok?resolve(true):reject(new Error(msg||'Safari 无法读取视频'))};
      const timer=setTimeout(()=>finish(false,'上传成功，但 Safari 读取视频超时'),22000);
      v.preload='auto';v.muted=true;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');
      v.onloadedmetadata=()=>finish(true);v.onloadeddata=()=>finish(true);v.oncanplay=()=>finish(true);
      v.onerror=()=>finish(false,'Safari 无法读取视频（MediaError '+(v.error?.code||'unknown')+'）');
      const u=new URL(url,location.href);u.searchParams.set('_verify',String(Date.now()));v.src=u.toString();
      try{v.load()}catch(e){finish(false,e.message||String(e))}
    });
  }
  async function uploadOne(i,file){
    setRow(i,'上传中…',file,20,'');
    const fd=new FormData();fd.append('slot','ref24-'+i);fd.append('file',file,file.name);
    const r=await fetch(ENDPOINT,{method:'POST',body:fd,cache:'no-store'});let j={};
    try{j=await r.json()}catch(e){throw new Error('服务器返回异常（HTTP '+r.status+'）')}
    if(!r.ok||!j.ok)throw new Error(j.error||('上传 HTTP '+r.status));
    setRow(i,'Safari 验证播放…',file,78,'');await verifyVideo(j.url);
    setRow(i,'✓ 已上传并可播放',file,100,'');return j;
  }

  document.addEventListener('change',async function(ev){
    const input=ev.target;if(!(input instanceof HTMLInputElement)||!input.matches('.r24-picker input[type="file"]'))return;
    ev.preventDefault();ev.stopImmediatePropagation();if(busy)return;
    const files=Array.from(input.files||[]).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:'base'}));
    if(files.length!==8){summary('<b>请选择 8 个 MP4</b><br>必须一次选中 01–08 共 8 个文件。');input.value='';return}
    busy=true;input.disabled=true;let ok=0;const errors=[];
    summary('<b>0 / 8 已完成</b><br>正在重新上传，并通过 Safari 可播放代理逐条验证。');
    for(let i=0;i<8;i++){
      try{await uploadOne(i,files[i]);ok++}catch(err){const msg=err&&err.message?err.message:String(err);errors.push('第 '+String(i+1).padStart(2,'0')+' 条：'+msg);setRow(i,'失败',files[i],100,'真实错误：'+msg)}
      summary('<b>'+ok+' / 8 已完成</b><br>'+(errors.length?('已有 '+errors.length+' 条失败，其余继续。'):'正在继续上传并验证…'));
    }
    busy=false;input.disabled=false;
    if(ok===8){summary('<b>8 / 8 全部完成 ✓</b><br>04 内容和抖音「参考案例」将使用同一套 8 个视频。正在刷新…');setTimeout(()=>{const u=new URL(location.href);u.searchParams.set('edit','1');u.searchParams.set('v','27-'+Date.now());location.href=u.toString()},700)}
    else{summary('<b>'+ok+' / 8 已完成</b><br>'+errors.join('<br>')+'<br><br>可重新一次选择 8 个文件覆盖。');input.value=''}
  },true);
})();

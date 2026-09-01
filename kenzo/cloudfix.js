/* Cloud media bridge: make Supabase-saved uploads immediately replace cards and modal media. */
(function(){
  const SUPA='https://mysbpummazvgyesuhlfg.supabase.co';
  const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15c2JwdW1tYXp2Z3llc3VobGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjc3NDMsImV4cCI6MjEwMzg0Mzc0M30.VLwxADqTs4_jRveJ0mbt-9CAGceObRShSno8nuJiiFY';
  const H={apikey:KEY,Authorization:'Bearer '+KEY};
  const EDIT=new URLSearchParams(location.search).get('edit')==='1';
  let cloud={text:{},media:{}},busy=false,lastStamp='';

  const CASE_DEF=[
    {slot:'case-0',name:'LOOK RECEIPT · 发票',src:'assets/kenzo_receipt.mp4',desc:'发票从上到下打印出来，最后把一套 Look 交代完整。'},
    {slot:'case-1',name:'PRODUCT COLLAGE · 拼贴',src:'assets/kenzo_collage.mp4',desc:'每个拼贴细节依次出现，最后拼成完整的产品视觉。'},
    {slot:'case-2',name:'KENZO BOUQUET · 鲜花',src:'assets/kenzo_bouquet.mp4',desc:'衣服一步一步被包成鲜花，让产品换一个说法。'}
  ];
  const REF_DEF=[
    {slot:'image-0',tab:'image',name:'ROMI STUDIO · 服装花束图文',kind:'image',src:'assets/romi_bouquet.webp',desc:'第一眼像一束礼物，第二眼才发现“花材”全部是服装。'},
    {slot:'ref-0',tab:'video',name:'Live / 图文动态参考',kind:'video',src:'assets/ref_live_visual.mp4',desc:'静态封面点进去以后会动。'},
    {slot:'ref-1',tab:'video',name:'Paper Cutout OOTD',kind:'video',src:'assets/ref_paper_cutout.mp4',desc:'纸片 / 拼贴式穿搭。'},
    {slot:'ref-2',tab:'video',name:'Product Scale Shift',kind:'video',src:'assets/ref_scale_shift.mp4',desc:'比例变化制造第一眼停留。'},
    {slot:'ref-3',tab:'video',name:'Product Detail / Label',kind:'video',src:'assets/ref_label_detail.mp4',desc:'从标签 / 产品细节开始。'},
    {slot:'ref-4',tab:'video',name:'Product Grid Game',kind:'video',src:'assets/ref_grid_game.mp4',desc:'格子 / 选择 / 抽卡机制。'},
    {slot:'ref-5',tab:'video',name:'Outfit Receipt',kind:'video',src:'assets/ref_outfit_receipt.mp4',desc:'扫描、识别、打印一套 Look。'},
    {slot:'ref-6',tab:'video',name:'Word Drag / 拖拽机制',kind:'video',src:'assets/ref_word_drag.mp4',desc:'拖动动作触发下一段变化。'},
    {slot:'ref-7',tab:'video',name:'Extra Motion / 新增动态',kind:'video',src:'assets/ref_extra_motion.mp4',desc:'补充动态参考，继续扩玩法库。'}
  ];

  window.cases=function(){
    return `<div class="caseRail">${CASE_DEF.map((x,i)=>`<button class="caseCard" data-a="cloudmedia" data-slot="${x.slot}" data-v="${i}"><div class="caseReal"><video class="realMedia" src="${x.src}" autoplay muted loop playsinline preload="metadata"></video></div><div class="caseText"><b>${x.name}</b><p>${x.desc}</p></div></button>`).join('')}</div>`;
  };
  window.refs=function(kind){
    return `<div class="refGrid">${REF_DEF.filter(x=>x.tab===kind).map((x)=>`<button class="refCard" data-a="cloudmedia" data-slot="${x.slot}"><div class="refReal ${x.kind==='image'?'image':''}">${x.kind==='image'?`<img class="realMedia" src="${x.src}" alt="${x.name}">`:`<video class="realMedia" src="${x.src}" autoplay muted loop playsinline preload="metadata"></video>`}</div><div class="refText"><b>${x.name}</b><small>${x.desc}</small></div></button>`).join('')}</div>`;
  };

  function kindOf(m){return (m?.type||'').startsWith('video/')?'video':'image'}
  function replace(node,m,controls=false){
    if(!node||!m?.url)return;
    const want=kindOf(m)==='video'?'VIDEO':'IMG'; let n=node;
    if(node.tagName!==want){n=document.createElement(want.toLowerCase());n.className=node.className||'realMedia';node.replaceWith(n)}
    if(n.dataset.cloudUrl===m.url)return;
    n.dataset.cloudUrl=m.url;n.src=m.url;
    if(want==='VIDEO'){n.playsInline=true;n.loop=true;n.preload='metadata';n.controls=controls;n.muted=!controls;n.autoplay=!controls;n.load();if(!controls)n.play().catch(()=>{})}
  }
  function slotFor(card){
    if(!card)return null;
    if(card.dataset.slot)return card.dataset.slot;
    const a=card.dataset.a,k=card.dataset.kind,v=Number(card.dataset.v||0);
    if(k==='case'||a==='case')return `case-${v}`;
    if(k==='image')return 'image-0';
    if(k==='ref')return `ref-${v}`;
    if(a==='ref'){
      const isImage=!!card.querySelector('.refReal.image,img') && v===0;
      return isImage?'image-0':`ref-${Math.max(0,v-1)}`;
    }
    return null;
  }
  function apply(){
    document.querySelectorAll('.caseCard,.refCard,.mediaCard,[data-a="media"]').forEach(card=>{
      const slot=slotFor(card),m=cloud.media?.[slot];if(!m)return;
      const node=card.querySelector('img,video');replace(node,m,false);
    });
    document.querySelectorAll('.caseMini img,.caseMini video').forEach((node,i)=>{const m=cloud.media?.[`case-${i}`];if(m)replace(node,m,false)});
  }
  async function readCloud(){
    if(busy)return;busy=true;
    try{
      const r=await fetch(SUPA+'/rest/v1/kenzo_app_state?id=eq.main&select=content,updated_at',{headers:H,cache:'no-store'});
      if(!r.ok)throw new Error(await r.text());
      const arr=await r.json(),row=arr[0];if(!row)return;
      cloud=row.content||{text:{},media:{}};
      if(row.updated_at!==lastStamp){lastStamp=row.updated_at;apply()}
    }catch(e){console.error('cloudfix read',e)}finally{busy=false}
  }
  function openCloud(slot){
    const def=CASE_DEF.find(x=>x.slot===slot)||REF_DEF.find(x=>x.slot===slot);if(!def)return;
    const m=cloud.media?.[slot]||{url:def.src,type:def.kind==='video'?'video/mp4':'image/jpeg'};
    const detail=document.querySelector('#detail');if(!detail)return;
    const title=document.querySelector('#detailTitle'),lead=document.querySelector('#detailLead'),body=document.querySelector('#detailBody'),box=document.querySelector('#mediaBox');
    if(title)title.textContent=def.name;if(lead)lead.textContent=slot.startsWith('case-')?'我们自己的创意案例':'REFERENCE';if(body)body.innerHTML=`<div class="row"><b>参考点</b><p>${def.desc}</p></div>`;
    if(box){box.classList.remove('hide');box.innerHTML='';const n=document.createElement(kindOf(m)==='video'?'video':'img');n.className='detailMedia';box.appendChild(n);replace(n,m,true)}
    detail.classList.add('show');
  }

  document.addEventListener('click',e=>{
    const card=e.target.closest('[data-a="cloudmedia"]');if(!card)return;
    if(document.body.classList.contains('ke-editing'))return;
    e.preventDefault();e.stopImmediatePropagation();openCloud(card.dataset.slot);
  },true);

  const mo=new MutationObserver(()=>{clearTimeout(window.__cloudFixDom);window.__cloudFixDom=setTimeout(apply,60)});mo.observe(document.body,{childList:true,subtree:true});
  const sync=document.querySelector('.ke-sync');if(sync)new MutationObserver(()=>{if(/已自动保存|云端已连接|上传/.test(sync.textContent||''))setTimeout(readCloud,150)}).observe(sync,{childList:true,characterData:true,subtree:true});
  readCloud();setInterval(readCloud,EDIT?1200:6000);
})();
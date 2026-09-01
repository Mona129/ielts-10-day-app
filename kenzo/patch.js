/* Final interaction/media patch for KENZO Social Worlds. */
(function(){
  const MEDIA_CASES=[
    {src:'assets/kenzo_receipt.mp4',title:'LOOK RECEIPT · 发票'},
    {src:'assets/kenzo_collage.mp4',title:'PRODUCT COLLAGE · 拼贴'},
    {src:'assets/kenzo_bouquet.mp4',title:'KENZO BOUQUET · 包装成鲜花'}
  ];
  const MEDIA_REFS=[
    {name:'ROMI STUDIO Bouquet',tab:'image',kind:'image',src:'assets/romi_bouquet.webp',desc:'服装花束：熟悉物件被重新组织成一个新视觉。'},
    {name:'Live Motion',tab:'video',kind:'video',src:'assets/ref_live_visual.mp4',desc:'静态封面点进去以后才发现会动，适合小红书 Live 图。'},
    {name:'Label Check',tab:'video',kind:'video',src:'assets/ref_label_detail.mp4',desc:'从真实标签 / 产品细节开始，把信息变成内容入口。'},
    {name:'Paper Cutout',tab:'image',kind:'video',src:'assets/ref_paper_cutout.mp4',desc:'纸片 / 拼贴式 OOTD，制作轻，但视觉记忆点很明确。'},
    {name:'Scale Shift',tab:'video',kind:'video',src:'assets/ref_scale_shift.mp4',desc:'比例突然变化，更适合抖音第一眼停留。'},
    {name:'Grid Game',tab:'video',kind:'video',src:'assets/ref_grid_game.mp4',desc:'格子互动可以延伸成选颜色、选 Look、抽卡。'},
    {name:'Outfit Receipt',tab:'image',kind:'video',src:'assets/ref_outfit_receipt.mp4',desc:'Receipt 视觉语言：先看形式，再回到产品。'},
    {name:'Word Drag',tab:'video',kind:'video',src:'assets/ref_word_drag.mp4',desc:'拖动动作触发变化，可延伸成拉线 / 拖颜色 / 拖徽章。'}
  ];
  const mediaTag=(m,cls='realMedia')=>m.kind==='image'
    ? `<img class="${cls}" src="${m.src}" alt="${m.name||m.title}" loading="eager">`
    : `<video class="${cls}" src="${m.src}" autoplay muted loop playsinline preload="auto"></video>`;

  const style=document.createElement('style');
  style.textContent=`
    .realMedia{width:100%;height:100%;display:block;object-fit:cover;background:#eee}
    .caseReal{height:310px;position:relative;overflow:hidden;background:#eee}
    .caseReal:after,.refReal:after{content:'LIVE';position:absolute;right:9px;top:9px;padding:4px 7px;border-radius:999px;background:rgba(0,0,0,.58);color:#fff;font-size:8px;letter-spacing:.09em;pointer-events:none}
    .refReal{height:180px;position:relative;overflow:hidden;background:#eee}
    .refReal.image:after{content:'REFERENCE'}
    .mediaBox .detailMedia{display:block;width:100%;max-height:62vh;object-fit:contain;background:#080808}
    .mediaBox img.detailMedia{background:#f2f0eb}
    .app.dy .caseCard,.app.dy .refCard{background:#171717;border-color:#292929;color:#fff}
    .app.dy .caseText p,.app.dy .refText small{color:#aaa}
    .app.dy .caseReal,.app.dy .refReal{background:#111}
  `;
  document.head.appendChild(style);

  cases=function(){
    return `<div class="caseRail">${D().cases.map((x,i)=>{
      const m=MEDIA_CASES[i];
      return `<button class="caseCard" data-a="case" data-v="${i}"><div class="caseReal">${mediaTag({...m,kind:'video'})}</div><div class="caseText"><b>${e(x.name)} · ${e(x.sub)}</b><p>${e(x.desc)}</p></div></button>`;
    }).join('')}</div>`;
  };

  refs=function(kind){
    const list=MEDIA_REFS.map((r,i)=>({...r,index:i})).filter(r=>r.tab===kind);
    return `<div class="refGrid">${list.map(r=>`<button class="refCard" data-a="ref" data-v="${r.index}"><div class="refReal ${r.kind==='image'?'image':''}">${mediaTag(r)}</div><div class="refText"><b>${e(r.name)}</b><small>${e(r.desc)}</small></div></button>`).join('')}</div>`;
  };

  function openMedia(title,lead,body,m){
    $('#detailTitle').textContent=title;
    $('#detailLead').textContent=lead||'';
    $('#detailBody').innerHTML=body||'';
    const box=$('#mediaBox');
    box.classList.remove('hide');
    box.innerHTML=m.kind==='image'
      ? `<img class="detailMedia" src="${m.src}" alt="${e(title)}">`
      : `<video class="detailMedia" src="${m.src}" autoplay muted loop playsinline controls preload="auto"></video>`;
    $('#detail').classList.add('show');
  }

  document.addEventListener('click',function(ev){
    const b=ev.target.closest('[data-a]'); if(!b) return;
    const a=b.dataset.a;

    if(S.world==='dy' && $('#detail').classList.contains('show') && (a==='ctab'||a==='wtab')){
      ev.preventDefault(); ev.stopImmediatePropagation();
      if(a==='ctab') S.contentTab=Number(b.dataset.v);
      if(a==='wtab') S.workflowTab=Number(b.dataset.v);
      $('#detailBody').innerHTML=details();
      return;
    }

    if(a==='case'){
      ev.preventDefault(); ev.stopImmediatePropagation();
      const i=Number(b.dataset.v), item=D().cases[i], m={...MEDIA_CASES[i],kind:'video'};
      openMedia(`${item.name} · ${item.sub}`,'我们自己的创意案例',`<div class="row"><p>${e(item.desc)}</p></div>`,m);
      return;
    }

    if(a==='ref'){
      ev.preventDefault(); ev.stopImmediatePropagation();
      const r=MEDIA_REFS[Number(b.dataset.v)];
      openMedia(r.name,C().ui.reference||'REFERENCE',`<div class="row"><p>${e(r.desc)}</p></div>`,r);
      return;
    }
  },true);
})();
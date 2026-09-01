/* V22: fixed, directly-hosted reference videos for 04 content. No Supabase ref overrides. */
(function(){
  const FINAL_REFS=[
    'assets/ref_final_01.mp4','assets/ref_final_02.mp4','assets/ref_final_03.mp4','assets/ref_final_04.mp4',
    'assets/ref_final_05.mp4','assets/ref_final_06.mp4','assets/ref_final_07.mp4','assets/ref_final_08.mp4'
  ];
  const NAMES=['Live / 图文动态参考','Paper Cutout OOTD','Product Scale Shift','Product Detail / Label','Product Grid Game','Outfit Receipt','Word Drag / 拖拽机制','Extra Motion / 新增动态'];
  const DESC=['静态封面点进去以后会动。','纸片 / 拼贴式穿搭。','比例变化制造第一眼停留。','从标签 / 产品细节开始。','格子 / 选择 / 抽卡机制。','扫描、识别、打印一套 Look。','拖动动作触发下一段变化。','补充的动态参考，继续扩玩法库。'];

  const style=document.createElement('style');
  style.textContent=`
    .ku-btn,.ku-panel,.kv-btn,.kv-panel{display:none!important}
    .refFullList{display:grid;grid-template-columns:1fr;gap:14px;margin-top:12px}
    .refFullCard{border:1px solid #e8e8e8;border-radius:16px;overflow:hidden;background:#fff;color:#111}
    .refFullCard video{width:100%;aspect-ratio:9/16;max-height:520px;display:block;background:#0a0a0a;object-fit:contain}
    .refFullText{padding:10px 12px 12px}.refFullText b{font-size:12px}.refFullText p{font-size:11px;line-height:1.6;color:#777;margin:5px 0 0}
    .refReady{display:inline-flex;margin-left:6px;padding:2px 6px;border-radius:999px;background:#111;color:#fff;font-size:8px;vertical-align:1px}
  `;
  document.head.appendChild(style);

  function syncRefs(){
    try{for(let i=0;i<8;i++)if(REFS[i])REFS[i][1]=FINAL_REFS[i]}catch(e){}
  }
  syncRefs();

  try{
    contentLibrary=function(){
      const cases=`<div class="section"><div class="slab">我们下午做的 3 个案例</div><div class="cards">${CASES.map((c,i)=>`<button class="mediaCard" data-a="media" data-kind="case" data-v="${i}"><video src="${c[1]}" muted autoplay loop playsinline preload="metadata"></video><div class="mediaText"><b>${c[0]}</b><p>${c[2]}</p></div></button>`).join('')}</div></div>`;
      const image=`<div class="section"><div class="slab">1 张图文参考</div><button class="mediaCard" data-a="media" data-kind="image" data-v="0"><img src="assets/romi_bouquet.webp" alt="ROMI STUDIO 服装花束参考"><div class="mediaText"><b>ROMI STUDIO · 服装花束图文</b><p>第一眼像一束礼物，第二眼才发现“花材”全部是服装。</p></div></button></div>`;
      const refs=`<div class="section"><div class="slab">8 个参考视频 · 完整版</div><div class="refFullList">${NAMES.map((n,i)=>`<div class="refFullCard"><video class="fixedRefVideo" data-fixed-ref="${i}" src="${FINAL_REFS[i]}?v=22" muted autoplay loop playsinline controls preload="auto"></video><div class="refFullText"><b>${n}<span class="refReady">VIDEO</span></b><p>${DESC[i]}</p></div></div>`).join('')}</div></div>`;
      return cases+image+refs;
    };
  }catch(e){console.error('V22 contentLibrary',e)}

  function forceFixed(){
    syncRefs();
    document.querySelectorAll('.fixedRefVideo').forEach((v,i)=>{
      const src=FINAL_REFS[Number(v.dataset.fixedRef ?? i)]+'?v=22';
      if(v.getAttribute('src')!==src){v.src=src;v.load()}
      v.muted=true;v.playsInline=true;v.loop=true;
      v.play().catch(()=>{});
    });
  }

  const mo=new MutationObserver(()=>{clearTimeout(window.__refV22);window.__refV22=setTimeout(forceFixed,60)});
  mo.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',e=>{const a=e.target.closest('[data-a]')?.dataset.a;if(['enter','world','toggleWorld','go','next','prev','closeDetail'].includes(a))setTimeout(forceFixed,100)},true);
  window.addEventListener('pageshow',forceFixed);
  window.addEventListener('focus',forceFixed);
})();
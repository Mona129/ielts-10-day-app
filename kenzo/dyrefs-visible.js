/* Make the Douyin reference-cases entry impossible to miss. */
(function(){
  const css=document.createElement('style');
  css.textContent=`
    .dyr-row-entry{display:none;width:calc(100% - 24px);margin:0 12px 10px;border:1px solid rgba(255,255,255,.22);background:#fff;color:#111;border-radius:14px;padding:11px 13px;text-align:left;align-items:center;justify-content:space-between;gap:10px;box-shadow:0 8px 24px #0005;position:relative;z-index:35}
    .app.dy .dyr-row-entry{display:flex}
    .dyr-row-entry b{font-size:12px;letter-spacing:.01em}
    .dyr-row-entry span{font-size:10px;color:#666;white-space:nowrap}
    .dyr-row-entry i{font-style:normal;font-size:16px;margin-left:auto}
    .dyr-guide-entry{order:5}
  `;
  document.head.appendChild(css);

  function isTw(){
    try{return typeof S!=='undefined'&&S.lang==='tw'}catch(e){return false}
  }
  function label(){return isTw()?'參考案例':'参考案例'}
  function sub(){return isTw()?'像刷抖音一樣，上下滑看 8 個影片':'像刷抖音一样，上下滑看 8 个视频'}

  function inject(){
    const app=document.querySelector('#app');
    const head=document.querySelector('.dyHead');
    if(!app||!head||!app.classList.contains('dy'))return;

    let row=head.querySelector('.dyr-row-entry');
    if(!row){
      row=document.createElement('button');
      row.className='dyr-row-entry';
      row.dataset.a='dyRefs';
      const strip=head.querySelector('.dyStrip');
      strip?strip.after(row):head.appendChild(row);
    }
    row.innerHTML=`<div><b>${label()}</b><span style="display:block;margin-top:3px">${sub()}</span></div><i>›</i>`;

    const guide=document.querySelector('#guideList');
    if(guide&&!guide.querySelector('.dyr-guide-entry')){
      const items=[...guide.querySelectorAll('.gitem')];
      const b=document.createElement('button');
      b.className='gitem dyr-guide-entry';
      b.dataset.a='dyRefs';
      b.innerHTML=`<small>VIDEO</small><b>${label()}</b>`;
      const fourth=items[3];
      fourth?fourth.after(b):guide.appendChild(b);
    }else if(guide){
      const b=guide.querySelector('.dyr-guide-entry b');if(b)b.textContent=label();
    }
  }

  const mo=new MutationObserver(()=>{clearTimeout(window.__dyrVisible);window.__dyrVisible=setTimeout(inject,30)});
  mo.observe(document.body,{childList:true,subtree:true,class:true});
  document.addEventListener('click',e=>{
    const a=e.target.closest('[data-a]')?.dataset.a;
    if(['enter','world','toggleWorld','go','next','prev','lang','toggleLang','closeGuide'].includes(a))setTimeout(inject,60);
  },true);
  inject();
})();
/* V30 — leader-facing cleanup: keep the Douyin reference entry concise. */
(function(){
  function cleanDock(){
    const dock=document.querySelector('.v29-dock');
    if(!dock)return false;
    let label='参考案例';
    try{if(typeof S!=='undefined'&&S.lang==='tw')label='參考案例'}catch(e){}
    dock.innerHTML='<b>'+label+' <span aria-hidden="true" style="display:inline;font-size:15px;color:inherit;margin:0 0 0 5px">›</span></b>';
    return true;
  }
  cleanDock();
  const mo=new MutationObserver(()=>cleanDock());
  mo.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-a="lang"],[data-a="toggleLang"]'))setTimeout(cleanDock,0);
  },true);
})();

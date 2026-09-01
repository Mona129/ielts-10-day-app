/* V30 — leader-facing cleanup: keep the Douyin reference entry concise. */
(function(){
  function cleanDock(){
    const dock=document.querySelector('.v29-dock');
    if(!dock)return false;
    let label='参考案例';
    try{if(typeof S!=='undefined'&&S.lang==='tw')label='參考案例'}catch(e){}
    const desired='<b>'+label+'</b>';
    if(dock.innerHTML!==desired)dock.innerHTML=desired;
    return true;
  }
  cleanDock();
  const mo=new MutationObserver(()=>cleanDock());
  mo.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-a="lang"],[data-a="toggleLang"]'))setTimeout(cleanDock,0);
  },true);
})();

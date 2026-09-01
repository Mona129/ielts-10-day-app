/* KENZO stability layer: always load latest cloud state, true zh-TW display, 04 GIF ratio fix */
(function(){
  const SUPA='https://mysbpummazvgyesuhlfg.supabase.co';
  const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15c2JwdW1tYXp2Z3llc3VobGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjc3NDMsImV4cCI6MjEwMzg0Mzc0M30.VLwxADqTs4_jRveJ0mbt-9CAGceObRShSno8nuJiiFY';
  const H={apikey:KEY,Authorization:'Bearer '+KEY,'Cache-Control':'no-cache','Pragma':'no-cache'};
  const EDIT=new URLSearchParams(location.search).get('edit')==='1';
  let latest={text:{},media:{}}, stamp='', reading=false, applying=false;
  const textSel='.note h2,.lead,.row b,.row p,.dir h3,.dir p,.platformBox b,.platformBox p,.quote,.check b,.check p,.sheetLead,.caption h2,.caption p,.mediaText b,.mediaText p,.refText b,.refText small,.slab,.tags';

  const style=document.createElement('style');
  style.textContent=`
    /* 04 首页三个案例：全部按原始 4:5 比例完整显示，不裁切、不互相挡住 */
    .m3{background:#f1eee8!important;display:block!important}
    .m3 .caseMini{height:auto!important;aspect-ratio:4/5!important;border-radius:14px!important;overflow:hidden!important;background:#f6f3ee!important;box-shadow:0 12px 28px #0001!important;animation:float 4.6s ease-in-out infinite!important}
    .m3 .cm1{width:30%!important;left:3%!important;top:24%!important;right:auto!important;bottom:auto!important;transform:rotate(-2deg)}
    .m3 .cm2{width:30%!important;left:35%!important;top:17%!important;right:auto!important;bottom:auto!important;transform:none}
    .m3 .cm3{width:30%!important;left:67%!important;top:24%!important;right:auto!important;bottom:auto!important;transform:rotate(2deg)}
    .m3 .caseMini img,.m3 .caseMini video{width:100%!important;height:100%!important;object-fit:contain!important;object-position:center!important;background:#f6f3ee!important;display:block!important}
    .caseReal .realMedia,.mediaCard img,.mediaCard video{object-fit:contain!important}
  `;
  document.head.appendChild(style);

  function keyForText(el,idx){let w='xhs',c=0,t=0;try{w=S.world;c=S.chapter;t=S.tab||0}catch(e){}return `${w}:${c}:${t}:${el.tagName}.${el.className||''}:${idx}`}
  function mediaKind(m){return (m?.type||'').startsWith('video/')?'video':'image'}
  function logicalSlot(card){
    if(!card)return null;
    if(card.dataset.slot)return card.dataset.slot;
    const kind=card.dataset.kind||'',v=Number(card.dataset.v||0),a=card.dataset.a||'';
    if(kind==='case'||a==='case2')return `case-${v}`;
    if(kind==='image'||a==='imgref2')return 'image-0';
    if(kind==='ref'||a==='vref2')return `ref-${v}`;
    return null;
  }
  function replaceMedia(node,m,controls=false){
    if(!node||!m?.url)return node;
    const want=mediaKind(m)==='video'?'VIDEO':'IMG';let n=node;
    if(n.tagName!==want){const nn=document.createElement(want.toLowerCase());nn.className=n.className;n.replaceWith(nn);n=nn}
    const src=m.url+(m.url.includes('?')?'&':'?')+'cloud='+(m.updatedAt?encodeURIComponent(m.updatedAt):Date.now());
    if(n.dataset.latestSrc===src)return n;
    n.dataset.latestSrc=src;n.src=src;
    if(want==='VIDEO'){n.playsInline=true;n.loop=true;n.preload='metadata';n.controls=controls;n.muted=!controls;n.autoplay=!controls;n.load();if(!controls)n.play().catch(()=>{})}
    return n;
  }
  function applyLatest(){
    if(applying)return;applying=true;
    try{
      const els=[...document.querySelectorAll(textSel)];
      els.forEach((el,i)=>{const k=keyForText(el,i);if(latest.text?.[k]!=null&&el.innerText!==latest.text[k])el.innerText=latest.text[k]});
      document.querySelectorAll('.mediaCard,.refCard,.caseCard,[data-a="media"],[data-a="cloudmedia"]').forEach(card=>{
        const slot=logicalSlot(card),m=latest.media?.[slot];if(!m)return;const node=card.querySelector('img,video');if(node)replaceMedia(node,m,false)
      });
      document.querySelectorAll('.caseMini img,.caseMini video').forEach((node,i)=>{const m=latest.media?.[`case-${i}`];if(m)replaceMedia(node,m,false)});
      if(typeof S!=='undefined'&&S.lang==='tw')applyTW();
    }finally{applying=false}
  }
  async function readLatest(force=false){
    if(reading)return;reading=true;
    try{
      const r=await fetch(SUPA+'/rest/v1/kenzo_app_state?id=eq.main&select=content,updated_at',{headers:H,cache:'no-store'});
      if(!r.ok)throw new Error(await r.text());
      const a=await r.json(),row=a[0];if(!row)return;
      latest=row.content||{text:{},media:{}};
      if(force||row.updated_at!==stamp){stamp=row.updated_at;applyLatest()}
      else applyLatest();
      const s=document.querySelector('.ke-sync');if(s&&EDIT)s.textContent='云端最新版 · 自动保存';
    }catch(e){console.error('latest cloud read failed',e)}finally{reading=false}
  }

  /* zh-TW：先做台湾用语，再做繁体字转换。 */
  const phrases=[
    ['创建账号目标','建立帳號目標'],['目标人群','目標受眾'],['账号定位','帳號定位'],['数据复盘','數據回顧'],['需要支持','所需支援'],
    ['小红书世界','小紅書世界'],['展开 / 翻页 / 收藏','展開 / 翻頁 / 收藏'],['变化 / 停留 / 记忆','變化 / 停留 / 記憶'],['进入体验','進入體驗'],['返回上一步','返回上一步'],
    ['上一章','上一章'],['下一章','下一章'],['导览','導覽'],['切换平台世界','切換平台世界'],['简体','簡體'],
    ['账号','帳號'],['用户','使用者'],['视频','影片'],['图文','圖文'],['页面','頁面'],['门店','門市'],['支持','支援'],['制作','製作'],['制造','製造'],['质量','品質'],['产品','產品'],['信息','資訊'],['搜索','搜尋'],['保存','儲存'],['打开','開啟'],['链接','連結'],['后台','後台'],['数据','數據'],['发布','發布'],['剪辑','剪輯'],['复盘','回顧'],['第一帧','第一幀'],['点击率','點擊率'],['点击','點擊'],['转化','轉換'],['内容生产','內容製作'],['三脚架','三腳架'],['相机','相機'],['小红书','小紅書'],['薯条','薯條'],['里面','裡面'],['通过','透過'],['干净','乾淨'],['真实','真實'],['当前','目前'],['优先','優先'],['建议','建議'],['基础','基礎'],['长期','長期'],['短期','短期']
  ];
  const smap={
    '万':'萬','与':'與','专':'專','东':'東','两':'兩','严':'嚴','个':'個','丰':'豐','临':'臨','为':'為','丽':'麗','举':'舉','义':'義','乌':'烏','乐':'樂','习':'習','乡':'鄉','书':'書','买':'買','乱':'亂','争':'爭','亏':'虧','云':'雲','亚':'亞','产':'產','亲':'親','亿':'億','仅':'僅','从':'從','仪':'儀','们':'們','价':'價','众':'眾','优':'優','会':'會','传':'傳','伤':'傷','体':'體','储':'儲','儿':'兒','党':'黨','兰':'蘭','关':'關','兴':'興','养':'養','内':'內','册':'冊','写':'寫','军':'軍','农':'農','冲':'衝','决':'決','况':'況','冻':'凍','净':'淨','凉':'涼','减':'減','凭':'憑','击':'擊','则':'則','刚':'剛','创':'創','删':'刪','别':'別','剧':'劇','务':'務','动':'動','劳':'勞','势':'勢','区':'區','医':'醫','华':'華','协':'協','单':'單','卖':'賣','卫':'衛','却':'卻','厂':'廠','厅':'廳','历':'歷','压':'壓','厌':'厭','双':'雙','发':'發','变':'變','叶':'葉','号':'號','叹':'嘆','吗':'嗎','听':'聽','启':'啟','员':'員','响':'響','团':'團','园':'園','围':'圍','国':'國','图':'圖','圆':'圓','场':'場','坏':'壞','块':'塊','坚':'堅','声':'聲','处':'處','备':'備','复':'復','够':'夠','头':'頭','奖':'獎','妇':'婦','妈':'媽','孙':'孫','学':'學','宁':'寧','宝':'寶','实':'實','审':'審','宽':'寬','宾':'賓','对':'對','寻':'尋','导':'導','寿':'壽','将':'將','尔':'爾','尘':'塵','尝':'嘗','层':'層','届':'屆','属':'屬','岁':'歲','岗':'崗','岛':'島','岭':'嶺','币':'幣','师':'師','帐':'帳','带':'帶','帧':'幀','帮':'幫','广':'廣','庆':'慶','库':'庫','应':'應','废':'廢','开':'開','异':'異','弃':'棄','张':'張','弯':'彎','弹':'彈','强':'強','归':'歸','当':'當','录':'錄','后':'後','态':'態','总':'總','恶':'惡','恼':'惱','悦':'悅','惧':'懼','惯':'慣','戏':'戲','户':'戶','扑':'撲','执':'執','扩':'擴','扫':'掃','扬':'揚','扰':'擾','护':'護','报':'報','担':'擔','拟':'擬','拢':'攏','拥':'擁','拦':'攔','拨':'撥','择':'擇','挂':'掛','挥':'揮','挤':'擠','损':'損','捡':'撿','换':'換','据':'據','摄':'攝','摆':'擺','摇':'搖','撑':'撐','数':'數','断':'斷','无':'無','旧':'舊','时':'時','显':'顯','暂':'暫','术':'術','机':'機','杂':'雜','权':'權','条':'條','来':'來','极':'極','构':'構','标':'標','样':'樣','树':'樹','档':'檔','梦':'夢','检':'檢','楼':'樓','欢':'歡','欧':'歐','残':'殘','气':'氣','汇':'匯','汉':'漢','沟':'溝','没':'沒','泪':'淚','泼':'潑','泽':'澤','洁':'潔','浅':'淺','测':'測','济':'濟','浓':'濃','润':'潤','涨':'漲','渐':'漸','湾':'灣','湿':'濕','满':'滿','灯':'燈','灵':'靈','灾':'災','炼':'煉','烟':'煙','烦':'煩','热':'熱','爱':'愛','爷':'爺','状':'狀','独':'獨','猎':'獵','猫':'貓','献':'獻','环':'環','现':'現','电':'電','画':'畫','畅':'暢','监':'監','盘':'盤','矿':'礦','码':'碼','础':'礎','确':'確','礼':'禮','离':'離','种':'種','积':'積','称':'稱','稳':'穩','穷':'窮','窍':'竅','竞':'競','笔':'筆','简':'簡','签':'簽','篮':'籃','类':'類','粮':'糧','紧':'緊','纪':'紀','约':'約','红':'紅','级':'級','纯':'純','纳':'納','纵':'縱','纸':'紙','纹':'紋','纽':'紐','线':'線','练':'練','组':'組','细':'細','织':'織','终':'終','经':'經','绑':'綁','结':'結','绕':'繞','绘':'繪','给':'給','络':'絡','绝':'絕','统':'統','绣':'繡','继':'繼','续':'續','缩':'縮','编':'編','缘':'緣','缝':'縫','网':'網','罗':'羅','罚':'罰','职':'職','联':'聯','肤':'膚','胜':'勝','脑':'腦','脚':'腳','脱':'脫','脸':'臉','舰':'艦','艺':'藝','节':'節','荐':'薦','药':'藥','获':'獲','营':'營','蓝':'藍','虑':'慮','虫':'蟲','虽':'雖','补':'補','装':'裝','见':'見','观':'觀','规':'規','视':'視','览':'覽','觉':'覺','触':'觸','订':'訂','认':'認','讨':'討','让':'讓','训':'訓','议':'議','讯':'訊','记':'記','讲':'講','许':'許','论':'論','设':'設','访':'訪','证':'證','评':'評','识':'識','词':'詞','试':'試','诚':'誠','话':'話','询':'詢','该':'該','详':'詳','语':'語','误':'誤','说':'說','请':'請','读':'讀','谁':'誰','调':'調','谈':'談','谢':'謝','贝':'貝','负':'負','财':'財','责':'責','败':'敗','账':'賬','货':'貨','质':'質','购':'購','费':'費','资':'資','赞':'讚','赠':'贈','赶':'趕','趋':'趨','跃':'躍','车':'車','轨':'軌','转':'轉','轮':'輪','软':'軟','较':'較','辅':'輔','轻':'輕','辆':'輛','辑':'輯','输':'輸','辞':'辭','边':'邊','辽':'遼','达':'達','迁':'遷','过':'過','运':'運','还':'還','进':'進','远':'遠','连':'連','迟':'遲','适':'適','选':'選','递':'遞','逻':'邏','遗':'遺','邻':'鄰','释':'釋','针':'針','钟':'鐘','钢':'鋼','钩':'鉤','钱':'錢','铁':'鐵','铃':'鈴','铜':'銅','铭':'銘','链':'鏈','销':'銷','锁':'鎖','错':'錯','锦':'錦','键':'鍵','镜':'鏡','长':'長','门':'門','闪':'閃','闭':'閉','问':'問','间':'間','闻':'聞','阅':'閱','队':'隊','阶':'階','际':'際','陆':'陸','陈':'陳','险':'險','随':'隨','隐':'隱','难':'難','静':'靜','顶':'頂','项':'項','顺':'順','须':'須','顾':'顧','预':'預','领':'領','频':'頻','题':'題','额':'額','颜':'顏','风':'風','飞':'飛','饭':'飯','饮':'飲','饰':'飾','馆':'館','马':'馬','验':'驗','骑':'騎','鱼':'魚','鲜':'鮮','鸟':'鳥','黄':'黃','点':'點','龙':'龍'
  };
  function toTW(s){
    let x=String(s||'');
    phrases.forEach(([a,b])=>{x=x.split(a).join(b)});
    x=[...x].map(ch=>smap[ch]||ch).join('');
    return x;
  }
  function translateEl(el){if(!el||el.closest('[contenteditable="true"]'))return;const t=el.textContent;if(t&&/[\u3400-\u9fff]/.test(t))el.textContent=toTW(t)}
  function applyTW(){
    document.documentElement.lang='zh-TW';
    document.querySelectorAll('#entry b,#entry small,#entry .primary,#entry .secondary,#content h1,#content h2,#content p,#content b,#content small,#content .lead,#content .tags,#content .pill,#content .comment,#guide h3,#guide .sheetLead,#guide .gitem b,#guide .switches button,#detail h3,#detail .sheetLead,#detail b,#detail p,.present button').forEach(translateEl);
  }
  function syncLanguage(){
    if(typeof S==='undefined')return;
    if(S.lang==='tw')applyTW();else document.documentElement.lang='zh-CN';
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-a]');if(!b)return;
    const a=b.dataset.a;
    if(a==='lang'||a==='toggleLang'||a==='enter'||a==='go'||a==='next'||a==='prev'||a==='toggleWorld'||a==='tab'||a==='openDetail'){
      setTimeout(()=>{applyLatest();syncLanguage()},40);
      setTimeout(()=>{applyLatest();syncLanguage()},220);
    }
  });

  const mo=new MutationObserver(()=>{
    clearTimeout(window.__stabilityDom);
    window.__stabilityDom=setTimeout(()=>{applyLatest();syncLanguage()},70);
  });
  mo.observe(document.body,{childList:true,subtree:true});

  window.addEventListener('pageshow',()=>readLatest(true));
  window.addEventListener('focus',()=>readLatest(true));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)readLatest(true)});
  setInterval(()=>readLatest(false),EDIT?1800:5000);
  readLatest(true);
})();
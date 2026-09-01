/* KENZO Social Worlds · 04 content/media patch */
(function(){
const CASES2=[
{src:'assets/kenzo_receipt.mp4?v=11',title:'LOOK RECEIPT · 发票',desc:'发票从上到下打印出来，最后把一套 Look 交代完整。'},
{src:'assets/kenzo_collage.mp4?v=11',title:'PRODUCT COLLAGE · 拼贴',desc:'产品和细节依次出现，最后组成一张完整拼贴。'},
{src:'assets/kenzo_bouquet.mp4?v=11',title:'KENZO BOUQUET · 鲜花',desc:'衣服一步步被整理、包裹，最后变成一束服装花束。'}];
const IMAGE_REF={name:'ROMI STUDIO · 服装花束图文',kind:'image',src:'assets/romi_bouquet.webp?v=11',desc:'熟悉的花束形式和服装被重新组合。第一眼先被形式吸引，第二眼再发现内容仍然在讲衣服。'};
const VIDEO_REFS=[
{name:'Live Visual / 动态图文',src:'assets/ref_live_visual.mp4?v=11',desc:'静态封面点开以后发生变化，适合小红书 Live 图。'},
{name:'Paper Cutout OOTD',src:'assets/ref_paper_cutout.mp4?v=11',desc:'纸片、拼贴式 OOTD，制作轻，但视觉记忆点明确。'},
{name:'Product Scale Shift',src:'assets/ref_scale_shift.mp4?v=11',desc:'产品比例突然变化，用第一眼的反差制造停留。'},
{name:'Product Detail / Label',src:'assets/ref_label_detail.mp4?v=11',desc:'从真实标签或产品细节开始，把细节直接变成内容入口。'},
{name:'Product Grid Game',src:'assets/ref_grid_game.mp4?v=11',desc:'格子、选择、抽卡机制，可以延伸成选颜色、选 Look。'},
{name:'Outfit Receipt',src:'assets/ref_outfit_receipt.mp4?v=11',desc:'扫描、识别、打印一套 Look，先看到形式，再回到产品。'},
{name:'Word Drag / 拖拽机制',src:'assets/ref_word_drag.mp4?v=11',desc:'拖动动作触发下一段变化，可延伸成拉线、拖颜色、拖徽章。'},
{name:'Extra Motion / 动态参考',src:'assets/ref_extra_motion.mp4?v=11',desc:'补充动态参考，用简单动作触发画面变化。'}];
const css=document.createElement('style');css.textContent=`
.realMedia{width:100%;height:100%;display:block;object-fit:cover;background:#eee;filter:none!important}.caseReal{height:330px;position:relative;overflow:hidden;background:#eee}.refReal{height:210px;position:relative;overflow:hidden;background:#eee}.caseReal:after,.refReal:after{content:'LIVE';position:absolute;right:10px;top:10px;padding:4px 8px;border-radius:999px;background:rgba(0,0,0,.64);color:#fff;font-size:9px;letter-spacing:.08em}.refReal.image:after{content:'REFERENCE'}.detailMedia{display:block;width:100%;max-height:68dvh;object-fit:contain;background:#080808}.detailMedia.image{background:#f4f1ec}.app.dy .caseCard,.app.dy .refCard{background:#171717;border-color:#292929;color:#fff}.app.dy .caseText p,.app.dy .refText small{color:#aaa}`;document.head.appendChild(css);
function tag(m,cls='realMedia'){return m.kind==='image'?`<img class="${cls}" src="${m.src}" alt="${m.name||m.title}">`:`<video class="${cls}" src="${m.src}" autoplay muted loop playsinline preload="auto"></video>`}
window.cases=function(){return `<div class="caseRail">${CASES2.map((m,i)=>`<button class="caseCard" data-a="case2" data-v="${i}"><div class="caseReal">${tag({...m,kind:'video'})}</div><div class="caseText"><b>${m.title}</b><p>${m.desc}</p></div></button>`).join('')}</div>`};
window.refs=function(kind){if(kind==='image')return `<div class="refGrid"><button class="refCard" data-a="imgref2"><div class="refReal image">${tag(IMAGE_REF)}</div><div class="refText"><b>${IMAGE_REF.name}</b><small>${IMAGE_REF.desc}</small></div></button></div>`;return `<div class="refGrid">${VIDEO_REFS.map((m,i)=>`<button class="refCard" data-a="vref2" data-v="${i}"><div class="refReal">${tag({...m,kind:'video'})}</div><div class="refText"><b>${m.name}</b><small>${m.desc}</small></div></button>`).join('')}</div>`};
function openM(m,lead){document.querySelector('#detailTitle').textContent=m.title||m.name;document.querySelector('#detailLead').textContent=lead;const box=document.querySelector('#mediaBox');box.classList.remove('hide');box.innerHTML=m.kind==='image'?`<img class="detailMedia image" src="${m.src}" alt="${m.name}">`:`<video class="detailMedia" src="${m.src}" autoplay muted loop playsinline controls preload="auto"></video>`;document.querySelector('#detailBody').innerHTML=`<div class="row"><p>${m.desc}</p></div>`;document.querySelector('#detail').classList.add('show')}
document.addEventListener('click',function(ev){const b=ev.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;if(a==='case2'){ev.preventDefault();ev.stopImmediatePropagation();openM({...CASES2[+b.dataset.v],kind:'video'},'我们自己的创意案例');return}if(a==='imgref2'){ev.preventDefault();ev.stopImmediatePropagation();openM(IMAGE_REF,'图文参考');return}if(a==='vref2'){ev.preventDefault();ev.stopImmediatePropagation();openM({...VIDEO_REFS[+b.dataset.v],kind:'video'},'视频参考');return}},true);
})();
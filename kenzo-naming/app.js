(function () {
  const esc = (value) => String(value).replace(/[&<>"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  if (document.body.dataset.page === "plans") {
    const plans = window.KENZO_PLANS;
    const grid = document.getElementById("planGrid");
    const filters = document.getElementById("filters");
    const count = document.getElementById("starCount");
    const dialog = document.getElementById("detailDialog");
    const detail = document.getElementById("detailContent");
    let active = "all";
    let stars = read("kenzo-public-plan-stars", []);
    let notes = read("kenzo-public-plan-notes", {});
    const groups = [["all","全部方向",9],["brand","带 KENZO",5],["ip","独立 IP",3],["system","肯玩体系",1]];

    function toggleStar(id) {
      stars = stars.includes(id) ? stars.filter((item) => item !== id) : stars.concat(id);
      write("kenzo-public-plan-stars", stars); render();
      if (dialog.open) openDetail(id);
    }
    function renderFilters() {
      filters.innerHTML = groups.map(([id,label,total]) => `<button class="filter ${active===id?"active":""}" data-filter="${id}"><span>${label}</span><small>${String(total).padStart(2,"0")}</small></button>`).join("");
      filters.querySelectorAll("button").forEach((button) => button.onclick = () => { active = button.dataset.filter; render(); });
    }
    function render() {
      renderFilters(); count.textContent = stars.length;
      const visible = active === "all" ? plans : active === "starred" ? plans.filter((item) => stars.includes(item.id)) : plans.filter((item) => item.group === active);
      grid.innerHTML = visible.length ? visible.map((item) => `<article class="plan-card ${stars.includes(item.id)?"chosen":""}"><div class="card-top"><span>${item.no}</span><button class="star" data-star="${item.id}" aria-label="选择${esc(item.name)}">${stars.includes(item.id)?"★":"☆"}</button></div><button class="open-plan" data-open="${item.id}"><h2>${esc(item.name)}</h2><p>${esc(item.bio)}</p><div class="tags">${item.tags.map((tag)=>`<span>${esc(tag)}</span>`).join("")}</div><span class="more">查看完整想法 <b>↗</b></span></button></article>`).join("") : `<div class="empty"><p>还没有标记候选。</p><button id="backAll">返回全部方向</button></div>`;
      grid.querySelectorAll("[data-star]").forEach((button) => button.onclick = () => toggleStar(button.dataset.star));
      grid.querySelectorAll("[data-open]").forEach((button) => button.onclick = () => openDetail(button.dataset.open));
      if (document.getElementById("backAll")) document.getElementById("backAll").onclick = () => { active = "all"; render(); };
    }
    function openDetail(id) {
      const item = plans.find((plan) => plan.id === id); if (!item) return;
      detail.innerHTML = `<header class="detail-header"><span>DIRECTION ${item.no}</span><h2>${esc(item.name)}</h2><p>${esc(item.bio)}</p><button class="detail-star ${stars.includes(id)?"active":""}" data-detail-star="${id}">${stars.includes(id)?"★ 已加入讨论候选":"☆ 加入讨论候选"}</button></header>
      <section class="detail-section"><label>01 / 核心想法</label><p>${esc(item.idea)}</p></section>
      <section class="detail-section"><label>02 / 账号人设</label><p>${esc(item.persona)}</p></section>
      <section class="detail-section"><label>03 / 内容体系</label><div class="modules">${item.modules.map((module,index)=>`<div><b>${String(index+1).padStart(2,"0")}</b><span><strong>${esc(module[0])}</strong><small>${esc(module[1])}</small></span></div>`).join("")}</div></section>
      <section class="detail-section"><label>04 / 固定表达</label>${item.phrases.map((phrase)=>`<blockquote>“${esc(phrase)}”</blockquote>`).join("")}</section>
      <section class="detail-section split"><div><label>05 / 优势</label><p>${esc(item.strength)}</p></div><div><label>06 / 需要注意</label><p>${esc(item.caution)}</p></div></section>
      <section class="detail-section"><label for="noteField">07 / 讨论备注</label><textarea id="noteField">${esc(notes[id]||"")}</textarea></section>`;
      detail.querySelector("[data-detail-star]").onclick = () => toggleStar(id);
      detail.querySelector("textarea").oninput = (event) => { notes[id] = event.target.value; write("kenzo-public-plan-notes", notes); };
      if (!dialog.open) dialog.showModal();
    }
    document.getElementById("showSelected").onclick = () => { active = active === "starred" ? "all" : "starred"; render(); };
    document.getElementById("dialogClose").onclick = () => dialog.close();
    dialog.onclick = (event) => { if (event.target === dialog) dialog.close(); };
    document.getElementById("compareBody").innerHTML = plans.map((item)=>`<tr><td>${esc(item.name)}</td><td>${esc(item.compare[0])}</td><td>${esc(item.compare[1])}</td></tr>`).join("");
    render();
  }

  if (document.body.dataset.page === "all") {
    const groups = window.KENZO_NAME_GROUPS;
    const root = document.getElementById("nameGroups");
    const chips = document.getElementById("selectedChips");
    const count = document.getElementById("selectedCount");
    let selected = read("kenzo-public-all-selected", []);
    let only = false;
    const all = groups.flatMap((group) => group.names);
    function toggle(id) { selected = selected.includes(id) ? selected.filter((item)=>item!==id) : selected.concat(id); write("kenzo-public-all-selected",selected); render(); }
    function render() {
      count.textContent = String(selected.length).padStart(2,"0");
      const chosen = all.filter((item)=>selected.includes(item[0]));
      chips.innerHTML = chosen.length ? chosen.map((item)=>`<button data-remove="${item[0]}">${esc(item[1])}<i>×</i></button>`).join("") : `<span>点击下方名称进行选择</span>`;
      chips.querySelectorAll("button").forEach((button)=>button.onclick=()=>toggle(button.dataset.remove));
      root.innerHTML = groups.map((group)=>{
        const names = only ? group.names.filter((item)=>selected.includes(item[0])) : group.names;
        if (!names.length) return "";
        return `<section class="name-group"><header><span>${group.no}</span><div><h2>${esc(group.title)}</h2><p>${esc(group.note)}</p></div><small>${String(names.length).padStart(2,"0")}</small></header><div class="name-list">${names.map((item,index)=>`<button class="name-option ${selected.includes(item[0])?"selected":""}" data-name-id="${item[0]}"><span class="option-no">${String(index+1).padStart(2,"0")}</span><div><h3>${esc(item[1])}</h3><p>${esc(item[2])}</p></div><span class="check">${selected.includes(item[0])?"✓":""}</span></button>`).join("")}</div></section>`;
      }).join("");
      root.querySelectorAll("[data-name-id]").forEach((button)=>button.onclick=()=>toggle(button.dataset.nameId));
      document.getElementById("onlySelected").textContent = only ? "查看全部" : "只看已选";
    }
    document.getElementById("onlySelected").onclick=()=>{only=!only;render();};
    document.getElementById("clearSelected").onclick=()=>{selected=[];write("kenzo-public-all-selected",selected);render();};
    render();
  }
})();

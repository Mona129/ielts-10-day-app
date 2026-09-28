(() => {
  const editMode = new URLSearchParams(location.search).get("edit") === "1";
  const draftKey = "kenzo-october-2026-draft-v2";
  const fileApi = "https://api.github.com/repos/Mona129/ielts-10-day-app/contents/kenzo-october-2026/content.json";
  const editable = [...document.querySelectorAll("[data-edit]")];
  const initial = Object.fromEntries(editable.map(el => [el.dataset.edit, el.textContent.trim()]));
  let state = { priority: "A", fields: { ...initial } };
  const status = document.getElementById("editorStatus");
  const bar = document.getElementById("editorBar");
  const select = document.getElementById("priority");
  const publish = document.getElementById("publish");
  const copyDraft = document.getElementById("copyDraft");
  const setStatus = message => { if (status) status.textContent = message; };

  function apply() {
    editable.forEach(el => { el.textContent = state.fields[el.dataset.edit] ?? initial[el.dataset.edit]; });
    const first = document.querySelector('.sample[data-variant="' + state.priority + '"]');
    if (first) document.querySelector(".sample-grid").prepend(first);
    document.querySelector('[data-label-for="A"]').textContent = state.priority === "A" ? "A / 建议首发 · 8 秒" : "A / 备选 · 8 秒";
    document.querySelector('[data-label-for="B"]').textContent = state.priority === "B" ? "B / 建议首发 · 12 秒" : "B / 备选 · 12 秒";
    select.value = state.priority;
  }
  function saveDraft() {
    localStorage.setItem(draftKey, JSON.stringify(state));
    setStatus("草稿已自动保存在此浏览器。点击「保存并同步公开页」后，其他人才能看到修改。");
  }
  function changePriority(value) {
    state.priority = value;
    state.fields.sampleSummary = value === "A"
      ? "两版均为纯产品画面，可直接播放。格纹开衫优先，蓝线郁金香备选。"
      : "两版均为纯产品画面，可直接播放。蓝线郁金香优先，格纹开衫备选。";
    state.fields.post2 = value === "A" ? "格纹落块样片 A；B 为备选" : "蓝线郁金香样片 B；A 为备选";
    state.fields.rationale = value === "A"
      ? "玩法来自衣服本身：格纹像游戏棋盘，蓝色花纹是一笔连续的线。让图案先动起来，再回到完整单品，把观看过程和产品记忆连在一起。建议 10/16 优先发格纹落块；蓝线郁金香作备选。两版均不使用人物。"
      : "玩法来自衣服本身：格纹像游戏棋盘，蓝色花纹是一笔连续的线。让图案先动起来，再回到完整单品，把观看过程和产品记忆连在一起。建议 10/16 优先发蓝线郁金香；格纹落块作备选。两版均不使用人物。";
    apply();
    saveDraft();
  }
  function encodeUtf8(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 16384)
      binary += String.fromCharCode(...bytes.subarray(i, i + 16384));
    return btoa(binary);
  }
  async function syncPublic() {
    const token = document.getElementById("token").value.trim();
    if (!token) {
      setStatus("草稿已在本机保存。要同步公开网页，请先填写 GitHub 写入令牌。");
      return;
    }
    publish.disabled = true;
    setStatus("正在同步公开页面…");
    const headers = { "Accept": "application/vnd.github+json", "Authorization": "Bearer " + token, "X-GitHub-Api-Version": "2022-11-28" };
    try {
      const currentResponse = await fetch(fileApi + "?t=" + Date.now(), { headers, cache: "no-store" });
      if (!currentResponse.ok) throw new Error("无法读取公开内容（" + currentResponse.status + "）");
      const current = await currentResponse.json();
      const updated = await fetch(fileApi, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Update KENZO October proposal", content: encodeUtf8(JSON.stringify(state, null, 2) + "\n"), sha: current.sha, branch: "main" })
      });
      if (!updated.ok) {
        if (updated.status === 403) throw new Error("同步被拒绝（403）：当前令牌没有本仓库的写入权限。请按下方设置新令牌，Contents 选 Read and write");
        if (updated.status === 409) throw new Error("公开文件刚被更新（409），请保留草稿并重试");
        throw new Error("同步未完成（" + updated.status + "）");
      }
      setStatus("已提交公开更新。其他人刷新页面后可看到新内容；网页发布通常需要片刻。");
    } catch (error) {
      setStatus(error.message + "。草稿仍保存在此浏览器，可稍后重试。");
    } finally { publish.disabled = false; }
  }
  async function init() {
    try {
      const response = await fetch("content.json?t=" + Date.now(), { cache: "no-store" });
      if (response.ok) {
        const remote = await response.json();
        state = { priority: remote.priority === "B" ? "B" : "A", fields: { ...initial, ...remote.fields } };
      }
    } catch {}
    if (editMode) {
      try {
        const saved = JSON.parse(localStorage.getItem(draftKey) || "null");
        if (saved && saved.fields) state = { priority: saved.priority === "B" ? "B" : "A", fields: { ...initial, ...saved.fields } };
      } catch {}
    }
    apply();
    if (!editMode) return;
    document.body.classList.add("editing");
    bar.hidden = false;
    editable.forEach(el => {
      el.contentEditable = "true";
      el.spellcheck = false;
      el.setAttribute("aria-label", "可编辑：" + (el.dataset.edit || "内容"));
      el.addEventListener("input", () => {
        state.fields[el.dataset.edit] = el.innerText.trim();
        saveDraft();
      });
    });
    select.addEventListener("change", event => changePriority(event.target.value));
    publish.addEventListener("click", syncPublic);
    copyDraft.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(state, null, 2));
        setStatus("草稿已复制，内容不含 GitHub 令牌。");
      } catch {
        setStatus("浏览器不允许自动复制；草稿仍保存在此浏览器。");
      }
    });
  }
  init();
})();

const STORE='ielts_sprint_v3';
function loadState(){try{return JSON.parse(localStorage.getItem(STORE))||{done:{},reminders:{},stats:{}}}catch{return {done:{},reminders:{},stats:{}}}}
function saveState(s){localStorage.setItem(STORE,JSON.stringify(s))}
function isDone(id){return !!loadState().done[id]}
function toggleDone(id){const s=loadState();s.done[id]=!s.done[id];if(s.done[id])s.done[id]=Date.now();else delete s.done[id];saveState(s)}
function reminder(id){return loadState().reminders[id]||null}
function setReminder(id,iso){const s=loadState();s.reminders[id]=iso;saveState(s)}
function clearReminder(id){const s=loadState();delete s.reminders[id];saveState(s)}
function classify(t){const x=(t.module+' '+t.task).toLowerCase();if(t.module==='听力')return 'listening';if(t.module==='阅读')return 'reading';if(t.module==='口语')return 'speaking';if(t.module==='写作')return 'writing';if(t.module==='词汇')return 'vocab';if(t.module==='复盘')return 'review';return x.includes('剑雅')||x.includes('真题')?'tests':'other'}
function statistics(){const s=loadState(),r={listening:[0,0],reading:[0,0],speaking:[0,0],writing:[0,0],vocab:[0,0],review:[0,0],tests:[0,0]};for(const d of DATES)for(const t of SCHEDULE[d]){const k=classify(t);if(r[k]){r[k][1]++;if(s.done[t.id])r[k][0]++}}return r}
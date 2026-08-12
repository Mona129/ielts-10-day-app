let deferredPrompt=null;
function requestNotifications(){if(!('Notification'in window)){toast('此浏览器不支持通知');return Promise.resolve(false)}return Notification.requestPermission().then(p=>{toast(p==='granted'?'提醒权限已开启':'请允许通知');return p==='granted'})}
function scheduleReminder(id,iso){setReminder(id,iso);toast('提醒已保存')}
function checkDueReminders(){if(!('Notification'in window)||Notification.permission!=='granted')return;const s=loadState(),now=Date.now();for(const id in s.reminders){const t=new Date(s.reminders[id]).getTime();if(t<=now&&t>now-60000){const task=Object.values(SCHEDULE).flat().find(x=>x.id===id);if(task)new Notification('雅思打卡提醒',{body:task.module+' · '+task.task,tag:id});delete s.reminders[id]}}saveState(s)}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e});
async function installApp(){if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null}else toast('iPhone 请用 Safari：分享 → 添加到主屏幕')}
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
setInterval(checkDueReminders,20000);
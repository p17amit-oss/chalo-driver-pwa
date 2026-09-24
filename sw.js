const CACHE='chalo-driver-v5-push';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});
self.addEventListener('push',e=>{
  let d={title:'Chalo Driver',body:'You have a new duty update.',url:'/'};
  try{d={...d,...e.data.json()}}catch{}
  e.waitUntil(self.registration.showNotification(d.title,{body:d.body,icon:'/icon-192.png',badge:'/icon-192.png',tag:'chalo-driver-update',renotify:true,data:{url:d.url||'/'}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const target=(e.notification.data&&e.notification.data.url)||'/';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){if('focus' in c){c.navigate(target);return c.focus()}}
    return clients.openWindow(target);
  }));
});

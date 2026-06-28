/* ============================================================
   منازل الود · Manazil Alwed — Service Worker
   يجعل الموقع قابلاً للتثبيت كتطبيق ويخزّن الصفحات للفتح السريع
   ============================================================ */

const CACHE_NAME = 'manazil-alwed-v1';

// الملفات الأساسية التي نخزّنها عند التثبيت
const CORE_ASSETS = [
  './',
  './index.html',
  './checkin.html',
  './apartment.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// عند التثبيت: خزّن الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS).catch(() => Promise.resolve()))
      .then(() => self.skipWaiting())
  );
});

// عند التفعيل: امسح النسخ القديمة من الكاش
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// عند الطلب: "الشبكة أولاً ثم الكاش"
// نجيب أحدث نسخة من النت، ولو ما فيه نت نرجع للنسخة المخزّنة
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // تجاهل الطلبات الخارجية (خرائط/خطوط/Smoobu/واتساب) — تمر طبيعي
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, resClone).catch(() => {});
        });
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || caches.match('./index.html'))
      )
  );
});

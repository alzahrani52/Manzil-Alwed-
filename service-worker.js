/* ============================================================
   منازل الود · Manazil Alwed — Service Worker (v2)
   • الصفحات (HTML): الشبكة أولاً  → دائماً أحدث محتوى
   • الصور والأيقونات والملفات الثابتة: الكاش أولاً → فتح فوري
     مع تحديث الصورة في الخلفية بهدوء (stale-while-revalidate)
   ============================================================ */

const CACHE_NAME = 'manazil-alwed-v5';

/* الملفات الأساسية التي نخزّنها عند التثبيت */
const CORE_ASSETS = [
  './',
  './index.html',
  './offers.html',
  './book.html',
  './checkin.html',
  './apartment.html',
  './terms.html',
  './privacy.html',
  './manifest.json',
  './favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

/* عند التثبيت: خزّن الملفات الأساسية */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS).catch(() => Promise.resolve()))
      .then(() => self.skipWaiting())
  );
});

/* عند التفعيل: احذف النسخ القديمة من الكاش */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* هل الطلب لصورة أو ملف ثابت؟ */
function isStaticAsset(url, req) {
  if (req.destination === 'image' || req.destination === 'font' || req.destination === 'style') return true;
  return /\.(?:jpg|jpeg|png|webp|gif|svg|ico|css|woff2?)$/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* تجاهل الطلبات الخارجية (خرائط/خطوط Google/Smoobu/واتساب) — تمر طبيعي */
  if (url.origin !== self.location.origin) return;

  /* تجاهل ملفات OneSignal (إشعارات) — لها service worker خاص في /push/onesignal/ */
  if (url.pathname.startsWith('/push/')) return;

  /* الصفحات (HTML / تنقّل): الشبكة أولاً ثم الكاش */
  const isHTML = req.mode === 'navigate' ||
                 (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone).catch(() => {}));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  /* الصور والملفات الثابتة: الكاش أولاً + تحديث في الخلفية */
  if (isStaticAsset(url, req)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone).catch(() => {}));
          }
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  /* أي طلب آخر من نفس الموقع: الشبكة ثم الكاش */
  event.respondWith(
    fetch(req)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, clone).catch(() => {}));
        return res;
      })
      .catch(() => caches.match(req))
  );
});

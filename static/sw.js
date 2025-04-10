const CACHE_NAME = 'static-cache-Vxx.xx.xx';

const FILES_TO_CACHE = [
    "/",
    "/manifest.json",
    "/favicon.png",
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          console.log('[ServiceWorker] Pre-caching offline page');
          return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    evt.waitUntil(
        caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache', key);
              return caches.delete(key);
            }
          }));
        })
    );

    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    // console.log('[ServiceWorker] Fetch', evt.request.url);
    // CODELAB: Add fetch event handler here.
    if (evt.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
            return caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.match('index.html');
                });
            })
    );
});

let last_notify_see_more = null;

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved with ", e.data);

  const { message, image, url } = data;

  self.registration.showNotification(message, {
    icon: image || "/logo/icon-256x256.png",
  });

  last_notify_see_more = url;
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close(); // Android needs explicit close.

  if (!last_notify_see_more) {
    return;
  }

  clients.openWindow(last_notify_see_more);
});

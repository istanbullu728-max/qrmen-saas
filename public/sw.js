self.addEventListener('install', (event) => {
    console.log('[SW] Service Worker installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker activated');
});

self.addEventListener('fetch', (event) => {
    // Pass through all requests for now
    event.respondWith(fetch(event.request));
});

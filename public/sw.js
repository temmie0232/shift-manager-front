// public/sw.js (updated)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/icon-192x192.png',
                '/icon-512x512.png',
                '/login',
                '/schedule',
                '/shift_request',
                '/preset_creation',
                '/update_profile',
                '/_next/static/chunks/main.js',
                '/_next/static/chunks/webpack.js',
                '/_next/static/chunks/pages/_app.js',
                '/_next/static/css/styles.chunk.css',
                '/globals.css',
                // Add icons from Lucide React (commonly used icons)
                '/icons/calendar.svg',
                '/icons/edit.svg',
                '/icons/user.svg',
                '/icons/log-out.svg',
                // Add placeholder images
                '/api/placeholder/400/320',
            ]);
        })
    );
});

// The fetch event listener remains the same
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
// 🌐 Offline-First & Stale-While-Revalidate PWA Service Worker (স্থায়ী অফলাইন ক্যাশিং)

const CACHE_NAME = 'khamar-app-v21';

// ১. লোকাল ফাইলসমূহ
const localUrlsToCache = [
    './', 
    './index.html', 
    './stock.js', 
    './daily_report.js',
    './medicine.js?v=21',
    './notifications.js',
    './admin.html',
    './manifest.json',
    './icon.png'
];

// ২. এক্সটার্নাল সিডিএন ফাইলসমূহ (টেলউইন্ড সিএসএস, ফন্ট, ফায়ারবেস ইত্যাদি যা অফলাইনে অপরিহার্য)
const cdnUrlsToCache = [
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js',
    'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js',
    'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            // লোকাল ফাইল ক্যাশ করা
            try {
                await cache.addAll(localUrlsToCache);
            } catch (err) {
                console.warn('Local cache batch notice:', err);
                for (const u of localUrlsToCache) {
                    try { await cache.add(u); } catch (e) {}
                }
            }

            // সিডিএন ফাইলগুলো নির্ভরযোগ্যভাবে প্রি-ক্যাশ করা (Promise.allSettled)
            await Promise.allSettled(
                cdnUrlsToCache.map(async url => {
                    try {
                        const res = await fetch(url, { mode: 'cors' }).catch(() => fetch(url, { mode: 'no-cors' }));
                        if (res && (res.status === 200 || res.type === 'opaque' || res.type === 'cors')) {
                            await cache.put(url, res);
                        }
                    } catch (e) {
                        console.warn('CDN pre-cache notice:', url, e);
                    }
                })
            );
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    // ⛔ লাইভ এপিআই, রিয়েলটাইম ডাটাবেজ, ওয়েবসকেট ও অথেনটিকেশন রিকোয়েস্ট বাইপাস করবে
    if (req.method !== 'GET' || 
        url.pathname.includes('/api/') || 
        url.search.includes('_t=') || 
        url.hostname.includes('firebaseio.com') ||
        url.hostname.includes('identitytoolkit') ||
        url.hostname.includes('securetoken') ||
        url.hostname.includes('formsubmit.co') ||
        url.hostname.includes('24-7-live-weather.vercel.app')) {
        return;
    }

    // ১. ন্যাভিগেশন / HTML রিকোয়েস্ট (index.html, admin.html)
    // নেটওয়ার্ক ফার্স্ট -> অফলাইনে সাথে সাথে ক্যাশ থেকে লোড হবে
    if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(req)
                .then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const match = await caches.match(req);
                    if (match) return match;
                    if (url.pathname.includes('admin')) {
                        return (await caches.match('./admin.html')) || (await caches.match('admin.html'));
                    }
                    return (await caches.match('./index.html')) || (await caches.match('./')) || (await caches.match('index.html'));
                })
        );
        return;
    }

    // ২. স্ট্যাটিক ফাইলসমূহ (Tailwind CSS, স্ক্রিপ্ট, ফন্টস, আইকন ও ছবি)
    // ক্যাশ ফার্স্ট + ব্যাকগ্রাউন্ড আপডেট (Stale-While-Revalidate):
    // ক্যাশে থাকলে ১ মিলি-সেকেন্ডে সাথে সাথে লোড করবে, তাই অফলাইনে ডিজাইন ভাঙার কোনো সুযোগ থাকবে না।
    // একই সাথে ইন্টারনেট থাকলে ব্যাকগ্রাউন্ডে ক্যাশ আপডেট করে রাখবে।
    event.respondWith(
        caches.match(req).then(cachedResponse => {
            const fetchPromise = fetch(req)
                .then(networkResponse => {
                    // CORS এবং Opaque রেসপন্সও ক্যাশে সংরক্ষণ করবে (Tailwind, Fonts etc.)
                    if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque' || networkResponse.type === 'cors')) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
                    }
                    return networkResponse;
                })
                .catch(() => cachedResponse || null);

            return cachedResponse || fetchPromise;
        })
    );
});

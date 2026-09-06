// 🌐 Network First Strategy (নিরাপদ অফলাইন সিস্টেম)

const CACHE_NAME = 'khamar-app-v10';
const urlsToCache = [
    './', 
    './index.html', 
    './stock.js', 
    './daily_report.js',
    './medicine.js',
    './notifications.js',
    './admin.html',
    './manifest.json',
    './icon.png'
];

self.addEventListener('install', event => {
    self.skipWaiting(); // আপডেট পেলে সাথে সাথে চালু হবে
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) return caches.delete(cache); // পুরোনো ক্যাশ মুছে ফেলবে
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // API এবং নন-GET রিকোয়েস্ট ক্যাশ করা যাবে না
    if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
        .then(response => {
            // শুধুমাত্র সফল রেসপন্স ক্যাশে সেভ হবে
            if (response && response.status === 200 && response.type === 'basic') {
                const clonedResponse = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clonedResponse));
            }
            return response;
        })
        .catch(() => {
            // ইন্টারনেট না থাকলে (অফলাইনে) ক্যাশ থেকে দেখাবে
            return caches.match(event.request);
        })
    );
});

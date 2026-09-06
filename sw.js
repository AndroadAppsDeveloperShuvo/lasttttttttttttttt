// 🌐 Network First Strategy (নিরাপদ অফলাইন সিস্টেম)

const CACHE_NAME = 'khamar-app-v12';
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
                    if (cache !== CACHE_NAME) return caches.delete(cache); // পুরোনো সমস্ত ক্যাশ মুছে ফেলবে
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    // ⛔ API এবং নন-GET রিকোয়েস্ট কোনো অবস্থাতেই সার্ভিস ওয়ার্কার ধরবে না
    if (req.method !== 'GET' || url.pathname.startsWith('/api/') || url.search.includes('_t=')) {
        return;
    }

    event.respondWith(
        fetch(req)
        .then(response => {
            // শুধুমাত্র সফল রেসপন্স ক্যাশে সেভ হবে
            if (response && response.status === 200 && response.type === 'basic') {
                const clonedResponse = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(req, clonedResponse));
            }
            return response;
        })
        .catch(() => {
            // ইন্টারনেট না থাকলে (অফলাইনে) ক্যাশ থেকে দেখাবে
            return caches.match(req);
        })
    );
});

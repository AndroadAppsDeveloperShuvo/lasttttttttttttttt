/* 🥣 FEED & WATER INTAKE METER (আদর্শ খাদ্য ও পানি পরিমাপক)
   মুরগির বয়স, সংখ্যা ও জাত অনুযায়ী সঠিক খাবার ও পানির পরিমাণ হিসাব এবং খামারের পারফরম্যান্স মনিটরিং
*/

// স্ট্যান্ডার্ড পুষ্টি ও গ্রহণ ডাটাবেজ (বয়সভিত্তিক গ্রাম/মিলি)
const standardPoultryData = {
    Broiler: {
        name: "ব্রয়লার (Broiler Cobb 500 / Ross 308)",
        // দিন অনুযায়ী [দৈনিক খাদ্য (গ্রাম), আদর্শ ওজন (গ্রাম), আদর্শ পানি (মিলি)]
        days: [
            { day: 1, feed: 15, weight: 42, water: 35 },
            { day: 2, feed: 19, weight: 58, water: 45 },
            { day: 3, feed: 24, weight: 75, water: 55 },
            { day: 4, feed: 29, weight: 95, water: 68 },
            { day: 5, feed: 34, weight: 118, water: 80 },
            { day: 6, feed: 40, weight: 144, water: 95 },
            { day: 7, feed: 47, weight: 175, water: 110 },
            { day: 8, feed: 54, weight: 210, water: 125 },
            { day: 9, feed: 62, weight: 250, water: 142 },
            { day: 10, feed: 70, weight: 295, water: 160 },
            { day: 11, feed: 78, weight: 345, water: 180 },
            { day: 12, feed: 86, weight: 400, water: 200 },
            { day: 13, feed: 95, weight: 460, water: 220 },
            { day: 14, feed: 104, weight: 525, water: 240 },
            { day: 15, feed: 113, weight: 595, water: 260 },
            { day: 16, feed: 122, weight: 670, water: 280 },
            { day: 17, feed: 131, weight: 750, water: 300 },
            { day: 18, feed: 140, weight: 835, water: 320 },
            { day: 19, feed: 148, weight: 925, water: 340 },
            { day: 20, feed: 156, weight: 1020, water: 360 },
            { day: 21, feed: 164, weight: 1120, water: 380 },
            { day: 22, feed: 171, weight: 1225, water: 395 },
            { day: 23, feed: 177, weight: 1335, water: 410 },
            { day: 24, feed: 183, weight: 1450, water: 425 },
            { day: 25, feed: 188, weight: 1570, water: 435 },
            { day: 26, feed: 193, weight: 1695, water: 445 },
            { day: 27, feed: 197, weight: 1825, water: 455 },
            { day: 28, feed: 201, weight: 1960, water: 465 },
            { day: 29, feed: 205, weight: 2100, water: 475 },
            { day: 30, feed: 208, weight: 2245, water: 485 },
            { day: 31, feed: 211, weight: 2395, water: 495 },
            { day: 32, feed: 214, weight: 2550, water: 505 },
            { day: 33, feed: 216, weight: 2710, water: 515 },
            { day: 34, feed: 218, weight: 2875, water: 525 },
            { day: 35, feed: 220, weight: 3045, water: 535 }
        ]
    },
    Sonali: {
        name: "সোনালি / সোনালি ক্লাসিক",
        days: [
            { day: 1, feed: 5, weight: 32, water: 12 },
            { day: 3, feed: 8, weight: 45, water: 18 },
            { day: 7, feed: 13, weight: 75, water: 30 },
            { day: 10, feed: 17, weight: 105, water: 40 },
            { day: 14, feed: 22, weight: 150, water: 52 },
            { day: 18, feed: 27, weight: 200, water: 65 },
            { day: 21, feed: 32, weight: 245, water: 76 },
            { day: 25, feed: 37, weight: 310, water: 88 },
            { day: 28, feed: 42, weight: 380, water: 100 },
            { day: 35, feed: 50, weight: 520, water: 120 },
            { day: 42, feed: 58, weight: 670, water: 140 },
            { day: 49, feed: 65, weight: 810, water: 155 },
            { day: 56, feed: 70, weight: 930, water: 170 },
            { day: 60, feed: 73, weight: 1000, water: 180 }
        ]
    },
    ColorBird: {
        name: "কালার বার্ড / টাইগার / ফাউমি",
        days: [
            { day: 1, feed: 8, weight: 36, water: 18 },
            { day: 7, feed: 20, weight: 110, water: 48 },
            { day: 14, feed: 38, weight: 260, water: 90 },
            { day: 21, feed: 55, weight: 460, water: 130 },
            { day: 28, feed: 72, weight: 710, water: 170 },
            { day: 35, feed: 88, weight: 1010, water: 210 },
            { day: 42, feed: 102, weight: 1330, water: 245 },
            { day: 49, feed: 115, weight: 1650, water: 275 },
            { day: 56, feed: 125, weight: 1950, water: 300 }
        ]
    },
    Layer: {
        name: "লেয়ার (গ্রোয়িং ও প্রোডাকশন)",
        days: [
            { day: 1, feed: 10, weight: 35, water: 25 },
            { day: 7, feed: 16, weight: 70, water: 38 },
            { day: 14, feed: 24, weight: 130, water: 58 },
            { day: 28, feed: 40, weight: 310, water: 95 },
            { day: 42, feed: 55, weight: 540, water: 130 },
            { day: 56, feed: 68, weight: 790, water: 160 },
            { day: 70, feed: 78, weight: 1050, water: 185 },
            { day: 100, feed: 95, weight: 1400, water: 220 },
            { day: 140, feed: 110, weight: 1750, water: 250 }
        ]
    }
};

// সহায়ক ফাংশন: মধ্যবর্তী দিনের জন্য আনুমানিক মান বের করা (Linear Interpolation)
function getIntakeData(breed, targetDay) {
    const breedData = standardPoultryData[breed] || standardPoultryData.Broiler;
    const list = breedData.days;

    if (targetDay <= list[0].day) {
        return { feed: list[0].feed, weight: list[0].weight, water: list[0].water };
    }
    const lastItem = list[list.length - 1];
    if (targetDay >= lastItem.day) {
        // অতিরিক্ত দিনের জন্য বৃদ্ধি
        const extraDays = targetDay - lastItem.day;
        return {
            feed: Math.round(lastItem.feed + (extraDays * 1.5)),
            weight: Math.round(lastItem.weight + (extraDays * (breed === 'Broiler' ? 60 : 15))),
            water: Math.round(lastItem.water + (extraDays * 3))
        };
    }

    for (let i = 0; i < list.length - 1; i++) {
        const curr = list[i];
        const next = list[i + 1];
        if (targetDay >= curr.day && targetDay <= next.day) {
            const ratio = (targetDay - curr.day) / (next.day - curr.day);
            return {
                feed: Math.round(curr.feed + (next.feed - curr.feed) * ratio),
                weight: Math.round(curr.weight + (next.weight - curr.weight) * ratio),
                water: Math.round(curr.water + (next.water - curr.water) * ratio)
            };
        }
    }
    return { feed: 50, weight: 300, water: 100 };
}

// পুঞ্জীভূত (Cumulative) খাদ্য বের করা
function getCumulativeFeedPerBird(breed, targetDay) {
    let sum = 0;
    for (let d = 1; d <= targetDay; d++) {
        const val = getIntakeData(breed, d);
        sum += val.feed;
    }
    return sum; // গ্রাম
}

// পেজের HTML স্ট্রাকচার
const feedWaterPageHTML = `
<div id="feed-water-page" class="page tab-page bg-gray-50 dark:bg-gray-900 transition-all duration-300">
    <header class="sticky top-0 z-10 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 flex items-center shadow-sm">
        <button onclick="goBack()" class="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span class="material-symbols-outlined dark:text-white">arrow_back</span>
        </button>
        <div class="flex-grow">
            <h1 class="text-xl font-bold dark:text-white">খাদ্য ও পানি পরিমাপক</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">স্ট্যান্ডার্ড খাদ্য ও পানি গ্রহণ ক্যালকুলেটর</p>
        </div>
    </header>

    <div class="p-5 pb-28 space-y-5 max-w-lg mx-auto">
        
        <!-- সক্রিয় চালান থেকে অটো-ফিল অপশন -->
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <span class="material-symbols-outlined text-teal-600 text-sm">sync</span>
                    সক্রিয় চালান থেকে তথ্য নিন
                </label>
                <span class="text-[10px] text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full font-bold">অটো ক্যালকুলেশন</span>
            </div>
            <select id="fw-shipment-select" onchange="autoFillFromShipment(this.value)" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white text-sm font-medium focus:ring-2 focus:ring-teal-500">
                <option value="">-- কোনো চালান সিলেক্ট করুন (অপশনাল) --</option>
            </select>
        </div>

        <!-- ইনপুট ফর্ম -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            
            <!-- জাত নির্বাচন -->
            <div>
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-2">১. মুরগির জাত</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button type="button" onclick="selectFWBreed('Broiler')" id="fw-breed-Broiler" class="fw-breed-btn py-2 px-3 rounded-xl text-xs font-bold border border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">ব্রয়লার</button>
                    <button type="button" onclick="selectFWBreed('Sonali')" id="fw-breed-Sonali" class="fw-breed-btn py-2 px-3 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">সোনালি</button>
                    <button type="button" onclick="selectFWBreed('ColorBird')" id="fw-breed-ColorBird" class="fw-breed-btn py-2 px-3 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">কালার বার্ড</button>
                    <button type="button" onclick="selectFWBreed('Layer')" id="fw-breed-Layer" class="fw-breed-btn py-2 px-3 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">লেয়ার</button>
                </div>
            </div>

            <!-- বয়স ও সংখ্যা -->
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">২. বয়স (দিন)</label>
                    <div class="flex items-center">
                        <button type="button" onclick="adjustFWDay(-1)" class="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-l-xl font-bold dark:text-white">-</button>
                        <input type="number" id="fw-age-days" value="21" min="1" max="100" oninput="calculateFeedWater()" class="w-full p-3 text-center border-y border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-lg focus:outline-none">
                        <button type="button" onclick="adjustFWDay(1)" class="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-r-xl font-bold dark:text-white">+</button>
                    </div>
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">৩. মুরগির সংখ্যা</label>
                    <input type="number" id="fw-bird-count" value="1000" min="1" placeholder="সংখ্যা" oninput="calculateFeedWater()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-base focus:ring-2 focus:ring-teal-500">
                </div>
            </div>

            <!-- আবহাওয়া / তাপমাত্রা মোড -->
            <div>
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-2">৪. তাপমাত্রা ও আবহাওয়া</label>
                <div class="grid grid-cols-3 gap-2">
                    <button type="button" onclick="selectFWTemp('normal')" id="fw-temp-normal" class="fw-temp-btn py-2 px-2 rounded-xl text-xs font-bold border border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 flex flex-col items-center">
                        <span>⛅ স্বাভাবিক</span>
                        <span class="text-[10px] font-normal opacity-80">(২০°-২৫° সে.)</span>
                    </button>
                    <button type="button" onclick="selectFWTemp('warm')" id="fw-temp-warm" class="fw-temp-btn py-2 px-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 flex flex-col items-center">
                        <span>☀️ গরম</span>
                        <span class="text-[10px] font-normal opacity-80">(২৬°-৩২° সে.)</span>
                    </button>
                    <button type="button" onclick="selectFWTemp('hot')" id="fw-temp-hot" class="fw-temp-btn py-2 px-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 flex flex-col items-center">
                        <span>🔥 তীব্র গরম</span>
                        <span class="text-[10px] font-normal opacity-80">(৩৩°+ সে.)</span>
                    </button>
                </div>
            </div>

            <!-- আসল খাদ্য ইনপুট (ঐচ্ছিক) -->
            <div class="pt-2 border-t border-gray-100 dark:border-gray-700">
                <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1 flex items-center justify-between">
                    <span>আজকে মোট কত কেজি খাবার দিয়েছেন? (অপশনাল)</span>
                    <span class="text-[10px] text-gray-400">তুলনা দেখার জন্য</span>
                </label>
                <div class="relative">
                    <input type="number" id="fw-actual-feed" step="0.5" placeholder="যেমন: ১৬০ কেজি" oninput="calculateFeedWater()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold focus:ring-2 focus:ring-teal-500">
                    <span class="absolute right-4 top-3 text-sm text-gray-400 font-bold">কেজি</span>
                </div>
            </div>
        </div>

        <!-- ফলাফল ড্যাশবোর্ড -->
        <div class="space-y-3">
            <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">আজকের আদর্শ চাহিদা ও লক্ষ্যমাত্রা</h3>
            
            <div class="grid grid-cols-2 gap-3">
                <!-- খাবার কার্ড -->
                <div class="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-2xl text-white shadow-md">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-bold text-amber-100">আজকের মোট খাবার</span>
                        <span class="text-xl">🥣</span>
                    </div>
                    <h3 class="text-2xl font-black" id="fw-total-feed">0 কেজি</h3>
                    <p class="text-xs text-amber-100 mt-1" id="fw-feed-bags">০ বস্তা ০ কেজি</p>
                    <div class="mt-2 pt-2 border-t border-amber-400/50 text-[11px] text-amber-100 flex justify-between">
                        <span>প্রতি মুরগি:</span>
                        <b id="fw-per-bird-feed">0 গ্রাম</b>
                    </div>
                </div>

                <!-- পানি কার্ড -->
                <div class="bg-gradient-to-br from-cyan-600 to-blue-600 p-4 rounded-2xl text-white shadow-md">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-bold text-cyan-100">আজকের মোট পানি</span>
                        <span class="text-xl">💧</span>
                    </div>
                    <h3 class="text-2xl font-black" id="fw-total-water">0 লিটার</h3>
                    <p class="text-xs text-cyan-100 mt-1" id="fw-water-temp-factor">স্বাভাবিক আবহাওয়া</p>
                    <div class="mt-2 pt-2 border-t border-cyan-400/50 text-[11px] text-cyan-100 flex justify-between">
                        <span>প্রতি মুরগি:</span>
                        <b id="fw-per-bird-water">0 মিলি</b>
                    </div>
                </div>
            </div>

            <!-- ওজন ও মোট খাবার কার্ড -->
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                    <p class="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">আদর্শ গড় ওজন</p>
                    <h4 class="text-xl font-bold text-indigo-600 dark:text-indigo-400" id="fw-standard-weight">0 গ্রাম</h4>
                    <p class="text-[10px] text-gray-400 mt-0.5" id="fw-total-flock-weight">মোট ওজন: ০ কেজি</p>
                </div>

                <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                    <p class="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">আজ পর্যন্ত মোট খাদ্য</p>
                    <h4 class="text-xl font-bold text-emerald-600 dark:text-emerald-400" id="fw-cumulative-feed">0 বস্তা</h4>
                    <p class="text-[10px] text-gray-400 mt-0.5" id="fw-cum-per-bird">প্রতি মুরগি: ০ গ্রাম</p>
                </div>
            </div>

            <!-- আসল খাদ্য তুলনা ও স্মার্ট এনালিসিস বক্স -->
            <div id="fw-analysis-box" class="hidden bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-2">
                <div class="flex items-center justify-between">
                    <h4 class="text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                        <span id="fw-status-icon" class="text-base">🔍</span>
                        <span>খাদ্য গ্রহণের বিশ্লেষণ ও পরামর্শ</span>
                    </h4>
                    <span id="fw-diff-badge" class="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">0%</span>
                </div>
                <p id="fw-advice-text" class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed"></p>
            </div>

            <!-- গুরুত্বপূর্ণ ম্যানেজমেন্ট গাইডলাইন -->
            <div class="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl border border-teal-100 dark:border-teal-800">
                <h4 class="text-xs font-bold text-teal-800 dark:text-teal-300 mb-2 flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">lightbulb</span>
                    খামারিদের জন্য গুরুত্বপূর্ণ টিপস:
                </h4>
                <ul class="text-xs text-teal-900/80 dark:text-teal-200 space-y-1.5 list-disc list-inside">
                    <li>প্রতি ১ কেজি খাবারের সাথে মুরগি স্বাভাবিক তাপমাত্রায় প্রায় ২ লিটার পানি পান করে।</li>
                    <li>গরমকালে পানি পানের পরিমাণ ১.৫ থেকে ২ গুণ পর্যন্ত বৃদ্ধি পায়। পানির পাত্র সর্বদা পরিষ্কার ও শীতল রাখুন।</li>
                    <li>খাবারের পাত্র সবসময় মুরগির পিঠের উচ্চতায় রাখুন যাতে খাবার অপচয় বা ছড়িয়ে নষ্ট না হয়।</li>
                </ul>
            </div>

        </div>

    </div>
</div>
`;

let currentSelectedFWBreed = 'Broiler';
let currentSelectedFWTemp = 'normal';

// DOM লোড হলে পেজটি ইনজেক্ট করা
document.addEventListener('DOMContentLoaded', () => {
    const mainApp = document.getElementById('main-app');
    if (mainApp && !document.getElementById('feed-water-page')) {
        mainApp.insertAdjacentHTML('beforeend', feedWaterPageHTML);
    }
});

// পেজ ওপেন করার ফাংশন
function openFeedWaterPage() {
    navigate('feed-water-page');
    loadFWShipmentsDropdown();
    calculateFeedWater();
}

// ড্রপডাউন লোড
function loadFWShipmentsDropdown() {
    const select = document.getElementById('fw-shipment-select');
    if (!select) return;
    select.innerHTML = `<option value="">-- কোনো চালান সিলেক্ট করুন (অপশনাল) --</option>`;

    if (typeof activeShipmentsForTimer === 'object' && activeShipmentsForTimer) {
        Object.entries(activeShipmentsForTimer).forEach(([id, chalan]) => {
            select.innerHTML += `<option value="${id}">${chalan.name} (${chalan.chickenCount} টি - ${chalan.startDate})</option>`;
        });
    }
}

// চালান সিলেক্ট করলে অটো-ফিল
function autoFillFromShipment(shipmentId) {
    if (!shipmentId || !activeShipmentsForTimer || !activeShipmentsForTimer[shipmentId]) return;
    const chalan = activeShipmentsForTimer[shipmentId];
    
    // বয়স বের করা
    const startDate = new Date(chalan.startDate);
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

    document.getElementById('fw-age-days').value = diffDays;
    document.getElementById('fw-bird-count').value = chalan.chickenCount || 1000;
    
    calculateFeedWater();
}

// ব্রিড নির্বাচন
function selectFWBreed(breed) {
    currentSelectedFWBreed = breed;
    document.querySelectorAll('.fw-breed-btn').forEach(btn => {
        btn.className = 'fw-breed-btn py-2 px-3 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300';
    });
    const activeBtn = document.getElementById(`fw-breed-${breed}`);
    if (activeBtn) {
        activeBtn.className = 'fw-breed-btn py-2 px-3 rounded-xl text-xs font-bold border border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300';
    }
    calculateFeedWater();
}

// আবহাওয়া নির্বাচন
function selectFWTemp(temp) {
    currentSelectedFWTemp = temp;
    document.querySelectorAll('.fw-temp-btn').forEach(btn => {
        btn.className = 'fw-temp-btn py-2 px-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 flex flex-col items-center';
    });
    const activeBtn = document.getElementById(`fw-temp-${temp}`);
    if (activeBtn) {
        activeBtn.className = 'fw-temp-btn py-2 px-2 rounded-xl text-xs font-bold border border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 flex flex-col items-center';
    }
    calculateFeedWater();
}

// বয়স +/- করা
function adjustFWDay(delta) {
    const input = document.getElementById('fw-age-days');
    let current = parseInt(input.value) || 1;
    current = Math.max(1, current + delta);
    input.value = current;
    calculateFeedWater();
}

// মূল হিসাব ফাংশন
function calculateFeedWater() {
    const ageInput = document.getElementById('fw-age-days');
    const birdInput = document.getElementById('fw-bird-count');
    if (!ageInput || !birdInput) return;

    const age = parseInt(ageInput.value) || 1;
    const birds = parseInt(birdInput.value) || 0;
    const actualFeedInput = parseFloat(document.getElementById('fw-actual-feed').value) || 0;

    if (birds <= 0) return;

    // স্ট্যান্ডার্ড পুষ্টি ডাটা নেওয়া
    const intake = getIntakeData(currentSelectedFWBreed, age);
    
    // তাপমাত্রা অনুযায়ী পানির ফ্যাক্টর
    let waterFactor = 1.0;
    let tempDesc = "স্বাভাবিক আবহাওয়া (১.০x)";
    if (currentSelectedFWTemp === 'warm') {
        waterFactor = 1.5;
        tempDesc = "উষ্ণ আবহাওয়া (১.৫x চাহিদা)";
    } else if (currentSelectedFWTemp === 'hot') {
        waterFactor = 2.0;
        tempDesc = "তীব্র গরম (২.০x বেশি পানি)";
    }

    // ১. খাদ্য হিসাব
    const perBirdFeedGram = intake.feed;
    const totalFeedKg = (perBirdFeedGram * birds) / 1000;
    const feedBags = Math.floor(totalFeedKg / 50);
    const extraFeedKg = (totalFeedKg % 50).toFixed(1);

    // ২. পানি হিসাব
    const perBirdWaterMl = Math.round(intake.water * waterFactor);
    const totalWaterLiter = Math.round((perBirdWaterMl * birds) / 1000);

    // ৩. গড় ওজন ও পাল মোট ওজন
    const stdWeightGram = intake.weight;
    const totalFlockWeightKg = ((stdWeightGram * birds) / 1000).toFixed(0);

    // ৪. কিউমুলেটিভ খাদ্য
    const cumFeedPerBirdGram = getCumulativeFeedPerBird(currentSelectedFWBreed, age);
    const cumTotalFeedKg = (cumFeedPerBirdGram * birds) / 1000;
    const cumBags = (cumTotalFeedKg / 50).toFixed(1);

    // UI আপডেট
    document.getElementById('fw-total-feed').innerText = `${totalFeedKg.toFixed(1)} কেজি`;
    document.getElementById('fw-feed-bags').innerText = `${feedBags} বস্তা ${extraFeedKg} কেজি (৫০ কেজি বস্তা)`;
    document.getElementById('fw-per-bird-feed').innerText = `${perBirdFeedGram} গ্রাম/মুরগি`;

    document.getElementById('fw-total-water').innerText = `${totalWaterLiter} লিটার`;
    document.getElementById('fw-water-temp-factor').innerText = tempDesc;
    document.getElementById('fw-per-bird-water').innerText = `${perBirdWaterMl} মিলি/মুরগি`;

    document.getElementById('fw-standard-weight').innerText = `${stdWeightGram >= 1000 ? (stdWeightGram/1000).toFixed(2) + ' কেজি' : stdWeightGram + ' গ্রাম'}`;
    document.getElementById('fw-total-flock-weight').innerText = `মোট ওজন: ~${Number(totalFlockWeightKg).toLocaleString()} কেজি`;

    document.getElementById('fw-cumulative-feed').innerText = `${cumBags} বস্তা`;
    document.getElementById('fw-cum-per-bird').innerText = `প্রতি মুরগি: ${(cumFeedPerBirdGram/1000).toFixed(2)} কেজি`;

    // আসল খাবারের সাথে তুলনা ও পরামর্শ
    const analysisBox = document.getElementById('fw-analysis-box');
    if (actualFeedInput > 0) {
        analysisBox.classList.remove('hidden');
        const diffKg = actualFeedInput - totalFeedKg;
        const diffPercent = ((diffKg / totalFeedKg) * 100).toFixed(1);
        const badge = document.getElementById('fw-diff-badge');
        const advice = document.getElementById('fw-advice-text');
        const icon = document.getElementById('fw-status-icon');

        if (Math.abs(diffPercent) <= 5) {
            badge.className = "text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
            badge.innerText = `${diffPercent > 0 ? '+' : ''}${diffPercent}% (স্বাভাবিক)`;
            icon.innerText = "✅";
            advice.innerText = "চমৎকার! খাদ্য গ্রহণ আদর্শ মানের মধ্যেই রয়েছে। মুরগির গ্রোথ সঠিক গতিতে এগোচ্ছে। নিয়মিত পানির পাত্র ও লিটার শুকনো রাখুন।";
        } else if (diffPercent < -5) {
            badge.className = "text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
            badge.innerText = `${diffPercent}% (কম গ্রহণ)`;
            icon.innerText = "⚠️";
            advice.innerText = "মুরগি আদর্শ পরিমাণের চেয়ে কম খাবার খাচ্ছে! কারণগুলো পরীক্ষা করুন: ঘরের তাপমাত্রা খুব বেশি বা কম কিনা, অ্যামোনিয়া গ্যাস হয়েছে কিনা, বা কোনো প্রাথমিক রোগের লক্ষণ (ঠান্ডা/চুনা পায়খানা) আছে কিনা। প্রয়োজনে লিভার টনিক বা বি-কমপ্লেক্স প্রয়োগ করুন।";
        } else {
            badge.className = "text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
            badge.innerText = `+${diffPercent}% (বেশি গ্রহণ)`;
            icon.innerText = "ℹ️";
            advice.innerText = "আদর্শের চেয়ে বেশি খাবার গ্রহণ করছে অথবা পাত্র থেকে খাবার অপচয় হচ্ছে। ফিডারের উচ্চতা মুরগির পিঠের সমান করে দিন যাতে মেঝেতে খাবার না ফেলে।";
        }
    } else {
        analysisBox.classList.add('hidden');
    }
}

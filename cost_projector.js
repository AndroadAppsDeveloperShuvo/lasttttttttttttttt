/* 💰 COST PER KG & BREAK-EVEN CALCULATOR (উৎপাদন খরচ ও লাভ প্রজেক্টর)
   বাস্তব চালানের নিখুঁত লাভ-ক্ষতি, ব্রেক-ইভেন রেট এবং বাচ্চা তোলার পূর্বানুমান ক্যালকুলেটর
*/

const costProjectorPageHTML = `
<div id="cost-projector-page" class="page tab-page bg-gray-50 dark:bg-gray-900 transition-all duration-300">
    <header class="sticky top-0 z-10 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 flex items-center shadow-sm">
        <button onclick="goBack()" class="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span class="material-symbols-outlined dark:text-white">arrow_back</span>
        </button>
        <div class="flex-grow">
            <h1 class="text-xl font-bold dark:text-white">উৎপাদন খরচ ও লাভ প্রজেক্টর</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">নিখুঁত উৎপাদন খরচ, FCR ও ব্রেক-ইভেন ক্যালকুলেটর</p>
        </div>
    </header>

    <div class="p-5 pb-28 space-y-5 max-w-lg mx-auto">

        <!-- মোড সিলেকশন ট্যাব (বাস্তব চালান হিসাব বনাম পূর্বানুমান) -->
        <div class="bg-gray-200 dark:bg-gray-800 p-1 rounded-2xl flex">
            <button type="button" onclick="switchCostMode('actual')" id="cp-mode-actual-btn" class="w-1/2 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm bg-white dark:bg-gray-700 text-teal-700 dark:text-teal-300 flex items-center justify-center gap-1.5">
                <span>📋 বাস্তব চালানের হিসাব</span>
            </button>
            <button type="button" onclick="switchCostMode('projected')" id="cp-mode-projected-btn" class="w-1/2 py-2.5 rounded-xl font-bold text-xs transition-all text-gray-600 dark:text-gray-400 hover:text-gray-900 flex items-center justify-center gap-1.5">
                <span>🔮 ভবিষ্যৎ পূর্বানুমান</span>
            </button>
        </div>

        <!-- সক্রিয় চালান থেকে অটো-লোড অপশন -->
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <span class="material-symbols-outlined text-teal-600 text-sm">sync</span>
                    সক্রিয় চালান থেকে তথ্য নিন
                </label>
                <span class="text-[10px] text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full font-bold">অটো ফিল</span>
            </div>
            <select id="cp-shipment-select" onchange="autoFillCostFromShipment(this.value)" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white text-sm font-medium focus:ring-2 focus:ring-teal-500">
                <option value="">-- কোনো চালান সিলেক্ট করুন (ঐচ্ছিক) --</option>
            </select>
        </div>

        <!-- কুইক টেমপ্লেট / জাত নির্বাচন (পূর্বানুমান মোডের জন্য) -->
        <div id="cp-preset-container" class="hidden bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-2">কুইক প্রি-সেট নির্বাচন করুন:</label>
            <div class="grid grid-cols-3 gap-2">
                <button type="button" onclick="loadCostPreset('Broiler')" id="cp-preset-Broiler" class="cp-preset-btn py-2 px-2 rounded-xl text-xs font-bold border border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                    🐔 ব্রয়লার
                </button>
                <button type="button" onclick="loadCostPreset('Sonali')" id="cp-preset-Sonali" class="cp-preset-btn py-2 px-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                    🐣 সোনালি
                </button>
                <button type="button" onclick="loadCostPreset('ColorBird')" id="cp-preset-ColorBird" class="cp-preset-btn py-2 px-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                    🐓 কালার বার্ড
                </button>
            </div>
        </div>

        <!-- ইনপুট প্যারামিটারস -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span id="cp-input-section-title">১. খামারের খরচ ও বিক্রির তথ্য</span>
                <span class="text-[10px] text-teal-600 dark:text-teal-400 font-bold lowercase" id="cp-mode-badge">বাস্তব ডাটা</span>
            </h3>

            <!-- বাচ্চার সংখ্যা ও দর -->
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">বাচ্চার সংখ্যা (টি)</label>
                    <input type="number" id="cp-chicks-count" value="300" min="1" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">১টি বাচ্চার দর (৳)</label>
                    <input type="number" id="cp-chick-price" value="15" step="0.5" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
            </div>

            <!-- মৃত্যু সংক্রান্ত তথ্য -->
            <div class="grid grid-cols-2 gap-3">
                <div id="cp-dead-count-box">
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">মরেছে (টি মুরগি)</label>
                    <input type="number" id="cp-dead-count" value="38" min="0" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
                <div id="cp-mortality-rate-box" class="hidden">
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">প্রত্যাশিত মৃত্যুহার (%)</label>
                    <input type="number" id="cp-mortality-rate" value="12.66" step="0.1" min="0" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">জীবিত মুরগি ও মৃত্যুহার</label>
                    <div class="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700/60 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center justify-between">
                        <span id="cp-live-birds-label">২৬২ টি</span>
                        <span id="cp-calc-mortality-badge" class="text-[11px] text-amber-600 dark:text-amber-400">১২.৭% মৃত্যু</span>
                    </div>
                </div>
            </div>

            <!-- মুরগির মোট বিক্রি ওজন বনাম গড় ওজন -->
            <div class="space-y-2">
                <div class="grid grid-cols-2 gap-3">
                    <div id="cp-total-weight-box">
                        <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">মোট বিক্রিত ওজন (কেজি)</label>
                        <input type="number" id="cp-total-weight-kg" value="720" step="0.5" oninput="onTotalWeightChange()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">প্রতিটির গড় ওজন (কেজি)</label>
                        <input type="number" id="cp-avg-weight-kg" value="2.75" step="0.01" oninput="onAvgWeightChange()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                    </div>
                </div>
            </div>

            <!-- খাদ্য সংক্রান্ত তথ্য -->
            <div class="p-3.5 bg-amber-50/60 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/40 space-y-3">
                <div class="flex items-center justify-between">
                    <label class="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                        <span>🥣 খাদ্যের খরচ ও FCR</span>
                    </label>
                    <span id="cp-fcr-badge" class="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-800/40 px-2 py-0.5 rounded-full">FCR: ১.২৮</span>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">ফিডের বস্তা দর (৳/৫০ কেজি)</label>
                        <input type="number" id="cp-feed-bag-price" value="3250" step="10" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                    </div>
                    
                    <!-- আসল মোডে মোট বস্তা ও কেজি -->
                    <div id="cp-feed-bags-box">
                        <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">মোট খাদ্য (বস্তা ও কেজি)</label>
                        <div class="grid grid-cols-2 gap-1.5">
                            <input type="number" id="cp-feed-bags-input" value="18" min="0" placeholder="বস্তা" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white font-bold text-xs text-center focus:ring-2 focus:ring-teal-500">
                            <input type="number" id="cp-feed-extra-kg-input" value="25" min="0" max="49" placeholder="কেজি" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white font-bold text-xs text-center focus:ring-2 focus:ring-teal-500">
                        </div>
                    </div>

                    <!-- প্রজেকশন মোডে টার্গেট FCR -->
                    <div id="cp-target-fcr-box" class="hidden">
                        <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">কাঙ্ক্ষিত এফসিআর (FCR)</label>
                        <input type="number" id="cp-target-fcr" value="1.28" step="0.01" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                    </div>
                </div>
            </div>

            <!-- অন্যান্য খরচ ও বিক্রয় বাজারদর -->
            <div class="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">অন্যান্য খরচ/মুরগি (৳)</label>
                    <p class="text-[10px] text-gray-400 mb-1 leading-tight">মেডিসিন, লিটার, বিদ্যুৎ ও পরিবহন</p>
                    <input type="number" id="cp-other-cost" value="15" step="1" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">বিক্রয় দর (৳/কেজি)</label>
                    <p class="text-[10px] text-gray-400 mb-1 leading-tight">পাইকারি বিক্রয় মূল্য</p>
                    <input type="number" id="cp-market-rate" value="132" step="1" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
            </div>
        </div>

        <!-- মূল ফলাফল কার্ডস -->
        <div class="space-y-3">
            <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">উৎপাদন খরচ ও মুনাফার নিখুঁত ফলাফল</h3>

            <!-- হাইলাইট কার্ড (উৎপাদন খরচ ও ব্রেক ইভেন) -->
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-gradient-to-br from-purple-600 to-indigo-700 p-4 rounded-2xl text-white shadow-md">
                    <span class="text-xs font-bold text-purple-100">প্রতি কেজি খরচ</span>
                    <h3 class="text-2xl font-black mt-1" id="cp-cost-per-kg">৳০.০০</h3>
                    <p class="text-[10px] text-purple-200 mt-1" id="cp-cost-per-bird-desc">প্রতি মুরগি: ৳০</p>
                </div>

                <div class="bg-gradient-to-br from-emerald-600 to-teal-700 p-4 rounded-2xl text-white shadow-md">
                    <span class="text-xs font-bold text-emerald-100">ব্রেক-ইভেন রেট</span>
                    <h3 class="text-2xl font-black mt-1" id="cp-break-even-rate">৳০.০০</h3>
                    <p class="text-[10px] text-emerald-200 mt-1">লাভ-ক্ষতি শূন্য হওয়ার দাম</p>
                </div>
            </div>

            <!-- মোট লাভ/ক্ষতি ও মোট বিক্রি কার্ড -->
            <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">মোট লাভ / ক্ষতি</p>
                        <h2 class="text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-400" id="cp-total-profit">৳০</h2>
                    </div>
                    <div class="text-right">
                        <span class="text-xs text-gray-400 block font-bold">প্রতি মুরগিতে লাভ</span>
                        <b class="text-lg text-teal-700 dark:text-teal-400 font-bold" id="cp-profit-per-bird">৳০</b>
                    </div>
                </div>

                <!-- বিস্তারিত খরচের ব্রেকডাউন -->
                <div class="space-y-2 text-xs">
                    <div class="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>🐣 বাচ্চার মোট খরচ (<span id="cp-chicks-label-count">৩০০ টি</span>):</span>
                        <b id="cp-total-chick-cost">৳৪,৫০০</b>
                    </div>
                    <div class="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>🥣 খাদ্যের মোট খরচ (<span id="cp-total-feed-bags-count">১৮.৫ বস্তা</span>):</span>
                        <b id="cp-total-feed-cost">৳৬০,১২৫</b>
                    </div>
                    <div class="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>💊 মেডিসিন ও অন্যান্য খরচ:</span>
                        <b id="cp-total-other-cost">৳৪,৫০০</b>
                    </div>
                    <div class="flex justify-between text-gray-800 dark:text-white font-bold pt-2 border-t border-gray-100 dark:border-gray-700 text-sm">
                        <span>📦 মোট উৎপাদন ব্যয়:</span>
                        <b class="text-red-500" id="cp-grand-total-cost">৳৬৯,১২৫</b>
                    </div>
                    <div class="flex justify-between text-gray-800 dark:text-white font-bold text-sm">
                        <span>💰 মোট বিক্রয় মূল্য (<span id="cp-total-live-weight">৭২০ কেজি</span>):</span>
                        <b class="text-teal-600 dark:text-teal-400" id="cp-grand-total-revenue">৳৯৫,০৪০</b>
                    </div>
                </div>

                <!-- খরচ অনুপাত প্রগ্রেস বার -->
                <div class="pt-2">
                    <p class="text-[11px] font-bold text-gray-400 mb-1.5 flex justify-between">
                        <span>খরচের অনুপাত (খাবার : বাচ্চা : অন্যান্য)</span>
                        <span id="cp-ratio-text">৮৭% : ৭% : ৬%</span>
                    </p>
                    <div class="w-full h-2.5 rounded-full overflow-hidden flex bg-gray-200 dark:bg-gray-700">
                        <div id="cp-bar-feed" class="bg-amber-500 h-full" style="width: 87%" title="খাবার"></div>
                        <div id="cp-bar-chick" class="bg-indigo-500 h-full" style="width: 7%" title="বাচ্চা"></div>
                        <div id="cp-bar-other" class="bg-teal-500 h-full" style="width: 6%" title="অন্যান্য"></div>
                    </div>
                    <div class="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> খাদ্য</span>
                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span> বাচ্চা</span>
                        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-teal-500 inline-block"></span> অন্যান্য</span>
                    </div>
                </div>
            </div>

            <!-- বাজারদর সংবেদনশীলতা টেবিল (Market Sensitivity Matrix) -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h4 class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center justify-between">
                    <span>📈 বিভিন্ন বাজারদরে লাভ-ক্ষতির তুলনা</span>
                    <span class="text-[10px] text-gray-400">প্রতি কেজি দর</span>
                </h4>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs text-left">
                        <thead>
                            <tr class="border-b border-gray-100 dark:border-gray-700 text-gray-400">
                                <th class="py-2">বাজার দর</th>
                                <th class="py-2 text-right">মোট বিক্রি</th>
                                <th class="py-2 text-right">নিট লাভ / ক্ষতি</th>
                            </tr>
                        </thead>
                        <tbody id="cp-sensitivity-tbody" class="divide-y divide-gray-50 dark:divide-gray-700/50">
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- কপি ও শেয়ার বাটন -->
            <button type="button" onclick="copyCostProjectionSummary()" class="w-full p-3.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-98">
                <span class="material-symbols-outlined text-base">content_copy</span>
                সম্পূর্ণ হিসাবের সারসংক্ষেপ কপি করুন
            </button>

        </div>

    </div>
</div>
`;

let currentCostMode = 'actual'; // 'actual' | 'projected'

// DOM লোড হলে পেজ ইনজেক্ট
document.addEventListener('DOMContentLoaded', () => {
    const mainApp = document.getElementById('main-app');
    if (mainApp && !document.getElementById('cost-projector-page')) {
        mainApp.insertAdjacentHTML('beforeend', costProjectorPageHTML);
    }
});

// পেজ ওপেন
function openCostProjectorPage() {
    navigate('cost-projector-page');
    loadCostShipmentsDropdown();
    calculateCostProjection();
}

// মোড সুইচ
function switchCostMode(mode) {
    currentCostMode = mode;
    const actualBtn = document.getElementById('cp-mode-actual-btn');
    const projectedBtn = document.getElementById('cp-mode-projected-btn');
    const deadBox = document.getElementById('cp-dead-count-box');
    const mortalityBox = document.getElementById('cp-mortality-rate-box');
    const feedBagsBox = document.getElementById('cp-feed-bags-box');
    const targetFcrBox = document.getElementById('cp-target-fcr-box');
    const presetContainer = document.getElementById('cp-preset-container');
    const modeBadge = document.getElementById('cp-mode-badge');
    const sectionTitle = document.getElementById('cp-input-section-title');

    if (mode === 'actual') {
        actualBtn.className = "w-1/2 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm bg-white dark:bg-gray-700 text-teal-700 dark:text-teal-300 flex items-center justify-center gap-1.5";
        projectedBtn.className = "w-1/2 py-2.5 rounded-xl font-bold text-xs transition-all text-gray-600 dark:text-gray-400 hover:text-gray-900 flex items-center justify-center gap-1.5";
        
        deadBox.classList.remove('hidden');
        mortalityBox.classList.add('hidden');
        feedBagsBox.classList.remove('hidden');
        targetFcrBox.classList.add('hidden');
        presetContainer.classList.add('hidden');

        modeBadge.innerText = "বাস্তব ডাটা";
        sectionTitle.innerText = "১. খামারের খরচ ও বিক্রির তথ্য";
    } else {
        projectedBtn.className = "w-1/2 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm bg-white dark:bg-gray-700 text-teal-700 dark:text-teal-300 flex items-center justify-center gap-1.5";
        actualBtn.className = "w-1/2 py-2.5 rounded-xl font-bold text-xs transition-all text-gray-600 dark:text-gray-400 hover:text-gray-900 flex items-center justify-center gap-1.5";

        deadBox.classList.add('hidden');
        mortalityBox.classList.remove('hidden');
        feedBagsBox.classList.add('hidden');
        targetFcrBox.classList.remove('hidden');
        presetContainer.classList.remove('hidden');

        modeBadge.innerText = "পূর্বানুমান";
        sectionTitle.innerText = "১. ভবিষ্যৎ প্রজেকশন প্যারামিটার";
    }

    calculateCostProjection();
}

// ড্রপডাউন লোড
function loadCostShipmentsDropdown() {
    const select = document.getElementById('cp-shipment-select');
    if (!select) return;
    select.innerHTML = `<option value="">-- কোনো চালান সিলেক্ট করুন (ঐচ্ছিক) --</option>`;

    if (typeof activeShipmentsForTimer === 'object' && activeShipmentsForTimer) {
        Object.entries(activeShipmentsForTimer).forEach(([id, chalan]) => {
            select.innerHTML += `<option value="${id}">${chalan.name} (${chalan.chickenCount} টি - ${chalan.startDate})</option>`;
        });
    }
}

// চালান সিলেক্ট করলে অটো ফিল
function autoFillCostFromShipment(shipmentId) {
    if (!shipmentId || !activeShipmentsForTimer || !activeShipmentsForTimer[shipmentId]) return;
    const chalan = activeShipmentsForTimer[shipmentId];

    document.getElementById('cp-chicks-count').value = chalan.chickenCount || 1000;
    
    // মোট ব্যয় ও স্টক থেকে খাদ্য
    let deadCount = 0;
    let chickCost = 0;
    let otherCost = 0;

    if (chalan.expenses) {
        Object.values(chalan.expenses).forEach(exp => {
            const cat = (exp.category || '').toLowerCase();
            const note = (exp.note || '').toLowerCase();
            if (cat.includes('বাচ্চা') || note.includes('বাচ্চা') || cat.includes('chick')) {
                chickCost += (exp.amount || 0);
            } else if (!cat.includes('খাদ্য') && !cat.includes('feed')) {
                otherCost += (exp.amount || 0);
            }
        });
    }

    if (chickCost > 0 && chalan.chickenCount > 0) {
        document.getElementById('cp-chick-price').value = (chickCost / chalan.chickenCount).toFixed(1);
    }
    if (otherCost > 0 && chalan.chickenCount > 0) {
        document.getElementById('cp-other-cost').value = Math.round(otherCost / chalan.chickenCount);
    }

    // ডেইলি রিপোর্ট থেকে মৃত্যু বের করা
    if (chalan.dailyReports) {
        Object.values(chalan.dailyReports).forEach(rep => {
            deadCount += parseInt(rep.deadCount) || 0;
        });
        document.getElementById('cp-dead-count').value = deadCount;
    }

    switchCostMode('actual');
    calculateCostProjection();
}

// মোট ওজন পরিবর্তন হলে গড় ওজন সমন্বয়
function onTotalWeightChange() {
    const chicks = parseFloat(document.getElementById('cp-chicks-count').value) || 0;
    const totalWeight = parseFloat(document.getElementById('cp-total-weight-kg').value) || 0;
    
    let surviving = chicks;
    if (currentCostMode === 'actual') {
        const dead = parseFloat(document.getElementById('cp-dead-count').value) || 0;
        surviving = Math.max(1, chicks - dead);
    } else {
        const mortality = parseFloat(document.getElementById('cp-mortality-rate').value) || 0;
        surviving = Math.max(1, Math.round(chicks * (1 - (mortality / 100))));
    }

    if (surviving > 0 && totalWeight > 0) {
        const avg = (totalWeight / surviving).toFixed(2);
        document.getElementById('cp-avg-weight-kg').value = avg;
    }
    calculateCostProjection();
}

// গড় ওজন পরিবর্তন হলে মোট ওজন সমন্বয়
function onAvgWeightChange() {
    const chicks = parseFloat(document.getElementById('cp-chicks-count').value) || 0;
    const avgWeight = parseFloat(document.getElementById('cp-avg-weight-kg').value) || 0;

    let surviving = chicks;
    if (currentCostMode === 'actual') {
        const dead = parseFloat(document.getElementById('cp-dead-count').value) || 0;
        surviving = Math.max(1, chicks - dead);
    } else {
        const mortality = parseFloat(document.getElementById('cp-mortality-rate').value) || 0;
        surviving = Math.max(1, Math.round(chicks * (1 - (mortality / 100))));
    }

    if (surviving > 0 && avgWeight > 0) {
        const total = (surviving * avgWeight).toFixed(1);
        document.getElementById('cp-total-weight-kg').value = total;
    }
    calculateCostProjection();
}

// প্রিসেট লোড (পূর্বানুমান মোড)
function loadCostPreset(breed) {
    document.querySelectorAll('.cp-preset-btn').forEach(btn => {
        btn.className = 'cp-preset-btn py-2 px-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300';
    });
    const active = document.getElementById(`cp-preset-${breed}`);
    if (active) {
        active.className = 'cp-preset-btn py-2 px-2 rounded-xl text-xs font-bold border border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300';
    }

    if (breed === 'Broiler') {
        document.getElementById('cp-chicks-count').value = "1000";
        document.getElementById('cp-chick-price').value = "55";
        document.getElementById('cp-feed-bag-price').value = "3450";
        document.getElementById('cp-target-fcr').value = "1.52";
        document.getElementById('cp-avg-weight-kg').value = "2.00";
        document.getElementById('cp-mortality-rate').value = "3";
        document.getElementById('cp-other-cost').value = "15";
        document.getElementById('cp-market-rate').value = "180";
    } else if (breed === 'Sonali') {
        document.getElementById('cp-chicks-count').value = "1000";
        document.getElementById('cp-chick-price').value = "35";
        document.getElementById('cp-feed-bag-price').value = "3300";
        document.getElementById('cp-target-fcr').value = "1.85";
        document.getElementById('cp-avg-weight-kg').value = "0.85";
        document.getElementById('cp-mortality-rate').value = "4";
        document.getElementById('cp-other-cost').value = "25";
        document.getElementById('cp-market-rate').value = "290";
    } else if (breed === 'ColorBird') {
        document.getElementById('cp-chicks-count').value = "1000";
        document.getElementById('cp-chick-price').value = "40";
        document.getElementById('cp-feed-bag-price').value = "3400";
        document.getElementById('cp-target-fcr').value = "1.65";
        document.getElementById('cp-avg-weight-kg').value = "1.50";
        document.getElementById('cp-mortality-rate').value = "3";
        document.getElementById('cp-other-cost').value = "20";
        document.getElementById('cp-market-rate').value = "220";
    }

    onAvgWeightChange();
}

let lastCalculatedCostSummary = {};

// মূল হিসাব ফাংশন
function calculateCostProjection() {
    const chicksCount = parseFloat(document.getElementById('cp-chicks-count').value) || 0;
    const chickPrice = parseFloat(document.getElementById('cp-chick-price').value) || 0;
    const feedBagPrice = parseFloat(document.getElementById('cp-feed-bag-price').value) || 0;
    const otherCostPerBird = parseFloat(document.getElementById('cp-other-cost').value) || 0;
    const marketRate = parseFloat(document.getElementById('cp-market-rate').value) || 0;

    if (chicksCount <= 0) return;

    let deadCount = 0;
    let mortalityRate = 0;
    let survivingBirds = chicksCount;

    if (currentCostMode === 'actual') {
        deadCount = parseFloat(document.getElementById('cp-dead-count').value) || 0;
        survivingBirds = Math.max(0, chicksCount - deadCount);
        mortalityRate = chicksCount > 0 ? ((deadCount / chicksCount) * 100) : 0;
    } else {
        mortalityRate = parseFloat(document.getElementById('cp-mortality-rate').value) || 0;
        deadCount = Math.round(chicksCount * (mortalityRate / 100));
        survivingBirds = Math.max(0, chicksCount - deadCount);
    }

    // UI তে জীবিত ও মৃত্যুহার দেখানো
    document.getElementById('cp-live-birds-label').innerText = `${survivingBirds} টি জীবিত`;
    document.getElementById('cp-calc-mortality-badge').innerText = `${mortalityRate.toFixed(1)}% মৃত্যু (${deadCount} টি)`;

    // মোট ওজন ও গড় ওজন
    let totalMeatWeightKg = parseFloat(document.getElementById('cp-total-weight-kg').value) || 0;
    let avgWeight = parseFloat(document.getElementById('cp-avg-weight-kg').value) || 0;

    if (totalMeatWeightKg <= 0 && avgWeight > 0 && survivingBirds > 0) {
        totalMeatWeightKg = survivingBirds * avgWeight;
        document.getElementById('cp-total-weight-kg').value = totalMeatWeightKg.toFixed(1);
    }

    // খাদ্য হিসাব (খাদ্যের মোট কেজি ও FCR)
    let totalFeedKg = 0;
    let totalFeedBags = 0;
    let calculatedFcr = 0;
    const feedPricePerKg = feedBagPrice / 50;

    if (currentCostMode === 'actual') {
        const feedBags = parseFloat(document.getElementById('cp-feed-bags-input').value) || 0;
        const extraKg = parseFloat(document.getElementById('cp-feed-extra-kg-input').value) || 0;
        totalFeedKg = (feedBags * 50) + extraKg;
        totalFeedBags = (totalFeedKg / 50).toFixed(1);

        calculatedFcr = totalMeatWeightKg > 0 ? (totalFeedKg / totalMeatWeightKg) : 0;
        document.getElementById('cp-fcr-badge').innerText = `FCR: ${calculatedFcr.toFixed(2)}`;
    } else {
        calculatedFcr = parseFloat(document.getElementById('cp-target-fcr').value) || 1.5;
        totalFeedKg = totalMeatWeightKg * calculatedFcr;
        totalFeedBags = (totalFeedKg / 50).toFixed(1);
        document.getElementById('cp-fcr-badge').innerText = `কাঙ্ক্ষিত FCR: ${calculatedFcr.toFixed(2)}`;
    }

    // খরচের ব্রেকডাউন
    const totalChickCost = chicksCount * chickPrice;
    const totalFeedCost = totalFeedKg * feedPricePerKg;
    const totalOtherCost = chicksCount * otherCostPerBird;
    const grandTotalCost = totalChickCost + totalFeedCost + totalOtherCost;

    // প্রতি কেজি ও প্রতি মুরগি খরচ
    const costPerKg = totalMeatWeightKg > 0 ? (grandTotalCost / totalMeatWeightKg) : 0;
    const costPerBird = survivingBirds > 0 ? (grandTotalCost / survivingBirds) : 0;

    // ব্রেক-ইভেন রেট
    const breakEvenRate = costPerKg;

    // রাজস্ব ও নিট লাভ
    const grandTotalRevenue = totalMeatWeightKg * marketRate;
    const totalProfit = grandTotalRevenue - grandTotalCost;
    const profitPerBird = survivingBirds > 0 ? (totalProfit / survivingBirds) : 0;

    // খরচের অনুপাত
    const feedPct = grandTotalCost > 0 ? Math.round((totalFeedCost / grandTotalCost) * 100) : 0;
    const chickPct = grandTotalCost > 0 ? Math.round((totalChickCost / grandTotalCost) * 100) : 0;
    const otherPct = Math.max(0, 100 - feedPct - chickPct);

    // স্টেট সেভ
    lastCalculatedCostSummary = {
        chicksCount,
        survivingBirds,
        deadCount,
        mortalityRate,
        avgWeight: totalMeatWeightKg > 0 && survivingBirds > 0 ? (totalMeatWeightKg / survivingBirds).toFixed(2) : avgWeight,
        totalMeatWeightKg,
        fcr: calculatedFcr.toFixed(2),
        totalFeedKg,
        totalFeedBags,
        costPerKg,
        costPerBird,
        breakEvenRate,
        marketRate,
        grandTotalCost,
        grandTotalRevenue,
        totalProfit,
        profitPerBird,
        totalChickCost,
        totalFeedCost,
        totalOtherCost
    };

    // UI আপডেট
    document.getElementById('cp-cost-per-kg').innerText = `৳${costPerKg.toFixed(2)}`;
    document.getElementById('cp-cost-per-bird-desc').innerText = `প্রতি জীবিত মুরগিতে খরচ: ৳${costPerBird.toFixed(1)}`;
    document.getElementById('cp-break-even-rate').innerText = `৳${breakEvenRate.toFixed(2)}`;

    const profitEl = document.getElementById('cp-total-profit');
    profitEl.innerText = `৳${Math.round(totalProfit).toLocaleString('bn-BD')}`;
    if (totalProfit >= 0) {
        profitEl.className = "text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-400";
    } else {
        profitEl.className = "text-3xl font-black mt-1 text-red-500 dark:text-red-400";
    }

    const profitBirdEl = document.getElementById('cp-profit-per-bird');
    profitBirdEl.innerText = `৳${profitPerBird.toFixed(1)}`;
    profitBirdEl.className = profitPerBird >= 0 ? "text-lg text-teal-700 dark:text-teal-400 font-bold" : "text-lg text-red-500 font-bold";

    document.getElementById('cp-chicks-label-count').innerText = `${chicksCount} টি`;
    document.getElementById('cp-total-chick-cost').innerText = `৳${Math.round(totalChickCost).toLocaleString('bn-BD')}`;
    document.getElementById('cp-total-feed-cost').innerText = `৳${Math.round(totalFeedCost).toLocaleString('bn-BD')}`;
    document.getElementById('cp-total-feed-bags-count').innerText = `${totalFeedBags} বস্তা (${Math.round(totalFeedKg)} কেজি)`;
    document.getElementById('cp-total-other-cost').innerText = `৳${Math.round(totalOtherCost).toLocaleString('bn-BD')}`;
    document.getElementById('cp-grand-total-cost').innerText = `৳${Math.round(grandTotalCost).toLocaleString('bn-BD')}`;
    document.getElementById('cp-grand-total-revenue').innerText = `৳${Math.round(grandTotalRevenue).toLocaleString('bn-BD')}`;
    document.getElementById('cp-total-live-weight').innerText = `${Math.round(totalMeatWeightKg).toLocaleString('bn-BD')} কেজি`;

    // বার আপডেট
    document.getElementById('cp-bar-feed').style.width = `${feedPct}%`;
    document.getElementById('cp-bar-chick').style.width = `${chickPct}%`;
    document.getElementById('cp-bar-other').style.width = `${otherPct}%`;
    document.getElementById('cp-ratio-text').innerText = `${feedPct}% : ${chickPct}% : ${otherPct}%`;

    // সেনসিটিভিটি টেবিল
    renderSensitivityTable(totalMeatWeightKg, grandTotalCost, marketRate);
}

// বাজারদর ম্যাট্রিক্স রেন্ডার
function renderSensitivityTable(totalMeatKg, totalCost, currentMarketRate) {
    const tbody = document.getElementById('cp-sensitivity-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const rateDeltas = [-20, -10, -5, 0, 5, 10, 20];
    rateDeltas.forEach(delta => {
        const testRate = currentMarketRate + delta;
        if (testRate <= 0) return;
        const testRevenue = totalMeatKg * testRate;
        const testProfit = testRevenue - totalCost;
        const isCurrent = delta === 0;

        const row = document.createElement('tr');
        if (isCurrent) {
            row.className = 'bg-teal-50/70 dark:bg-teal-900/30 font-bold';
        }
        row.innerHTML = `
            <td class="py-2.5 ${isCurrent ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'}">
                ৳${testRate} /কেজি ${isCurrent ? '<span class="text-[10px] bg-teal-200 dark:bg-teal-800 text-teal-900 dark:text-teal-100 px-1.5 py-0.5 rounded ml-1">বর্তমান</span>' : ''}
            </td>
            <td class="py-2.5 text-right text-gray-500 dark:text-gray-400">
                ৳${Math.round(testRevenue).toLocaleString('bn-BD')}
            </td>
            <td class="py-2.5 text-right font-bold ${testProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}">
                ${testProfit >= 0 ? '+' : ''}৳${Math.round(testProfit).toLocaleString('bn-BD')}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// হিসাবের সারসংক্ষেপ কপি
function copyCostProjectionSummary() {
    const s = lastCalculatedCostSummary;
    if (!s || !s.chicksCount) return;

    const text = `📊 খামার উৎপাদন খরচ ও লাভ হিসাব
------------------------------------
🐔 বাচ্চার সংখ্যা: ${s.chicksCount} টি (জীবিত: ${s.survivingBirds} টি, মৃত্যু: ${s.deadCount} টি)
⚖️ মোট বিক্রিত মাংস: ${Math.round(s.totalMeatWeightKg)} কেজি (গড় ওজন: ${s.avgWeight} কেজি)
🥣 মোট খাদ্য: ${s.totalFeedBags} বস্তা (${Math.round(s.totalFeedKg)} কেজি) | FCR: ${s.fcr}
------------------------------------
🏷️ প্রতি কেজি উৎপাদন খরচ: ৳${s.costPerKg.toFixed(2)}
🎯 ব্রেক-ইভেন বিক্রি দর: ৳${s.breakEvenRate.toFixed(2)}
📦 মোট উৎপাদন ব্যয়: ৳${Math.round(s.grandTotalCost).toLocaleString()}
💵 বিক্রয় দর: ৳${s.marketRate}/কেজি (মোট বিক্রি: ৳${Math.round(s.grandTotalRevenue).toLocaleString()})
📈 নিট লাভ / ক্ষতি: ৳${Math.round(s.totalProfit).toLocaleString()} (প্রতি মুরগিতে: ৳${s.profitPerBird.toFixed(1)})
------------------------------------
📱 আমার খামার স্মার্ট ম্যানেজার`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast("হিসাব কপি হয়েছে! মেসেঞ্জার বা নোটপ্যাডে পেস্ট করতে পারেন 📋");
        }).catch(() => {
            prompt("হিসাবটি কপি করুন:", text);
        });
    } else {
        prompt("হিসাবটি কপি করুন:", text);
    }
}

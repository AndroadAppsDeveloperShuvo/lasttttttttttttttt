/* 💰 COST PER KG & BREAK-EVEN CALCULATOR (উৎপাদন খরচ ও লাভ প্রজেক্টর)
   বাচ্চা তোলার আগে বা পালনকালে প্রতি কেজি উৎপাদন খরচ, ব্রেক-ইভেন রেট এবং নিখুঁত লাভ-ক্ষতির পূর্বানুমান
*/

const costProjectorPageHTML = `
<div id="cost-projector-page" class="page tab-page bg-gray-50 dark:bg-gray-900 transition-all duration-300">
    <header class="sticky top-0 z-10 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 flex items-center shadow-sm">
        <button onclick="goBack()" class="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span class="material-symbols-outlined dark:text-white">arrow_back</span>
        </button>
        <div class="flex-grow">
            <h1 class="text-xl font-bold dark:text-white">উৎপাদন খরচ ও লাভ প্রজেক্টর</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">প্রতি কেজি খরচ ও ব্রেক-ইভেন ক্যালকুলেটর</p>
        </div>
    </header>

    <div class="p-5 pb-28 space-y-5 max-w-lg mx-auto">

        <!-- কুইক টেমপ্লেট / জাত নির্বাচন -->
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
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
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">১. খামারের প্রাথমিক তথ্য</h3>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">বাচ্চার সংখ্যা (টি)</label>
                    <input type="number" id="cp-chicks-count" value="1000" min="10" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">১টি বাচ্চার দর (৳)</label>
                    <input type="number" id="cp-chick-price" value="55" step="0.5" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">ফিডের বস্তা দর (৳/৫০ কেজি)</label>
                    <input type="number" id="cp-feed-bag-price" value="3450" step="10" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">কাঙ্ক্ষিত এফসিআর (FCR)</label>
                    <input type="number" id="cp-target-fcr" value="1.52" step="0.01" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">গড় বিক্রয় ওজন (কেজি)</label>
                    <input type="number" id="cp-target-weight" value="2.00" step="0.05" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">প্রত্যাশিত মৃত্যুহার (%)</label>
                    <input type="number" id="cp-mortality-rate" value="3" step="0.5" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">অন্যান্য খরচ/মুরগি (৳)</label>
                    <p class="text-[10px] text-gray-400 mb-1 leading-tight">মেডিসিন, লিটার, বিদ্যুৎ ও পরিবহন</p>
                    <input type="number" id="cp-other-cost" value="15" step="1" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">প্রত্যাশিত বাজারদর (৳/কেজি)</label>
                    <p class="text-[10px] text-gray-400 mb-1 leading-tight">পাইকারি বিক্রয় মূল্য</p>
                    <input type="number" id="cp-market-rate" value="180" step="1" oninput="calculateCostProjection()" class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white font-bold text-sm focus:ring-2 focus:ring-teal-500">
                </div>
            </div>
        </div>

        <!-- মূল ফলাফল কার্ডস -->
        <div class="space-y-3">
            <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">উৎপাদন খরচ ও মুনাফার সারাংশ</h3>

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
                        <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">মোট প্রত্যাশিত লাভ / ক্ষতি</p>
                        <h2 class="text-3xl font-black mt-1 text-green-600 dark:text-green-400" id="cp-total-profit">৳০</h2>
                    </div>
                    <div class="text-right">
                        <span class="text-xs text-gray-400 block font-bold">প্রতি মুরগিতে লাভ</span>
                        <b class="text-lg text-teal-700 dark:text-teal-400" id="cp-profit-per-bird">৳০</b>
                    </div>
                </div>

                <!-- বিস্তারিত খরচের ব্রেকডাউন -->
                <div class="space-y-2 text-xs">
                    <div class="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>🐣 বাচ্চার মোট খরচ:</span>
                        <b id="cp-total-chick-cost">৳০</b>
                    </div>
                    <div class="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>🥣 খাদ্যের মোট খরচ (<span id="cp-total-feed-bags-count">০ বস্তা</span>):</span>
                        <b id="cp-total-feed-cost">৳০</b>
                    </div>
                    <div class="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>💊 মেডিসিন ও অন্যান্য খরচ:</span>
                        <b id="cp-total-other-cost">৳০</b>
                    </div>
                    <div class="flex justify-between text-gray-800 dark:text-white font-bold pt-2 border-t border-gray-100 dark:border-gray-700 text-sm">
                        <span>📦 মোট উৎপাদন ব্যয়:</span>
                        <b class="text-red-500" id="cp-grand-total-cost">৳০</b>
                    </div>
                    <div class="flex justify-between text-gray-800 dark:text-white font-bold text-sm">
                        <span>💰 মোট বিক্রয় মূল্য (<span id="cp-total-live-weight">০ কেজি</span>):</span>
                        <b class="text-teal-600 dark:text-teal-400" id="cp-grand-total-revenue">৳০</b>
                    </div>
                </div>

                <!-- খরচ অনুপাত প্রগ্রেস বার -->
                <div class="pt-2">
                    <p class="text-[11px] font-bold text-gray-400 mb-1.5 flex justify-between">
                        <span>খরচের অনুপাত (ফিড : বাচ্চা : অন্যান্য)</span>
                        <span id="cp-ratio-text">৭০% : ২০% : ১০%</span>
                    </p>
                    <div class="w-full h-2.5 rounded-full overflow-hidden flex bg-gray-200 dark:bg-gray-700">
                        <div id="cp-bar-feed" class="bg-amber-500 h-full" style="width: 70%" title="খাবার"></div>
                        <div id="cp-bar-chick" class="bg-indigo-500 h-full" style="width: 20%" title="বাচ্চা"></div>
                        <div id="cp-bar-other" class="bg-teal-500 h-full" style="width: 10%" title="অন্যান্য"></div>
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
                    <span class="text-[10px] text-gray-400">প্রতি কেজি বিক্রয় দর</span>
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
    calculateCostProjection();
}

// প্রিসেট লোড
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
        document.getElementById('cp-target-weight').value = "2.00";
        document.getElementById('cp-mortality-rate').value = "3";
        document.getElementById('cp-other-cost').value = "15";
        document.getElementById('cp-market-rate').value = "180";
    } else if (breed === 'Sonali') {
        document.getElementById('cp-chicks-count').value = "1000";
        document.getElementById('cp-chick-price').value = "35";
        document.getElementById('cp-feed-bag-price').value = "3300";
        document.getElementById('cp-target-fcr').value = "1.85";
        document.getElementById('cp-target-weight').value = "0.85";
        document.getElementById('cp-mortality-rate').value = "4";
        document.getElementById('cp-other-cost').value = "25";
        document.getElementById('cp-market-rate').value = "290";
    } else if (breed === 'ColorBird') {
        document.getElementById('cp-chicks-count').value = "1000";
        document.getElementById('cp-chick-price').value = "40";
        document.getElementById('cp-feed-bag-price').value = "3400";
        document.getElementById('cp-target-fcr').value = "1.65";
        document.getElementById('cp-target-weight').value = "1.50";
        document.getElementById('cp-mortality-rate').value = "3";
        document.getElementById('cp-other-cost').value = "20";
        document.getElementById('cp-market-rate').value = "220";
    }

    calculateCostProjection();
}

let lastCalculatedCostSummary = {};

// মূল হিসাব ফাংশন
function calculateCostProjection() {
    const chicksCount = parseFloat(document.getElementById('cp-chicks-count').value) || 0;
    const chickPrice = parseFloat(document.getElementById('cp-chick-price').value) || 0;
    const feedBagPrice = parseFloat(document.getElementById('cp-feed-bag-price').value) || 0;
    const targetFcr = parseFloat(document.getElementById('cp-target-fcr').value) || 1.5;
    const targetWeight = parseFloat(document.getElementById('cp-target-weight').value) || 0;
    const mortalityRate = parseFloat(document.getElementById('cp-mortality-rate').value) || 0;
    const otherCostPerBird = parseFloat(document.getElementById('cp-other-cost').value) || 0;
    const marketRate = parseFloat(document.getElementById('cp-market-rate').value) || 0;

    if (chicksCount <= 0 || targetWeight <= 0) return;

    // ১. জীবিত মুরগির সংখ্যা ও মোট বিক্রয়যোগ্য মাংসের ওজন
    const survivingBirds = Math.round(chicksCount * (1 - (mortalityRate / 100)));
    const totalMeatWeightKg = survivingBirds * targetWeight;

    // ২. খাদ্য খরচ
    const feedPricePerKg = feedBagPrice / 50;
    const totalFeedKg = totalMeatWeightKg * targetFcr;
    const totalFeedBags = (totalFeedKg / 50).toFixed(1);
    const totalFeedCost = totalFeedKg * feedPricePerKg;

    // ৩. বাচ্চা খরচ
    const totalChickCost = chicksCount * chickPrice;

    // ৪. মেডিসিন ও অন্যান্য খরচ
    const totalOtherCost = chicksCount * otherCostPerBird;

    // ৫. মোট উৎপাদন ব্যয়
    const grandTotalCost = totalChickCost + totalFeedCost + totalOtherCost;
    const costPerKg = totalMeatWeightKg > 0 ? (grandTotalCost / totalMeatWeightKg) : 0;
    const costPerBird = survivingBirds > 0 ? (grandTotalCost / survivingBirds) : 0;

    // ৬. ব্রেক-ইভেন রেট (যে দরে বিক্রি করলে লাভ বা ক্ষতি কিছুই হবে না)
    const breakEvenRate = costPerKg;

    // ৭. মোট রাজস্ব ও নিট লাভ
    const grandTotalRevenue = totalMeatWeightKg * marketRate;
    const totalProfit = grandTotalRevenue - grandTotalCost;
    const profitPerBird = survivingBirds > 0 ? (totalProfit / survivingBirds) : 0;

    // খরচের অনুপাত
    const feedPct = Math.round((totalFeedCost / grandTotalCost) * 100) || 0;
    const chickPct = Math.round((totalChickCost / grandTotalCost) * 100) || 0;
    const otherPct = Math.max(0, 100 - feedPct - chickPct);

    // স্টেট সেভ
    lastCalculatedCostSummary = {
        chicksCount,
        survivingBirds,
        targetWeight,
        totalMeatWeightKg,
        targetFcr,
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
    document.getElementById('cp-cost-per-bird-desc').innerText = `প্রতি মুরগি উৎপাদন খরচ: ৳${costPerBird.toFixed(1)}`;
    document.getElementById('cp-break-even-rate').innerText = `৳${breakEvenRate.toFixed(2)}`;

    const profitEl = document.getElementById('cp-total-profit');
    profitEl.innerText = `৳${Math.round(totalProfit).toLocaleString('bn-BD')}`;
    if (totalProfit >= 0) {
        profitEl.className = "text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-400";
    } else {
        profitEl.className = "text-3xl font-black mt-1 text-red-500 dark:text-red-400";
    }

    document.getElementById('cp-profit-per-bird').innerText = `৳${profitPerBird.toFixed(1)}`;
    document.getElementById('cp-profit-per-bird').className = profitPerBird >= 0 ? "text-lg text-teal-700 dark:text-teal-400 font-bold" : "text-lg text-red-500 font-bold";

    document.getElementById('cp-total-chick-cost').innerText = `৳${Math.round(totalChickCost).toLocaleString('bn-BD')}`;
    document.getElementById('cp-total-feed-cost').innerText = `৳${Math.round(totalFeedCost).toLocaleString('bn-BD')}`;
    document.getElementById('cp-total-feed-bags-count').innerText = `${totalFeedBags} বস্তা`;
    document.getElementById('cp-total-other-cost').innerText = `৳${Math.round(totalOtherCost).toLocaleString('bn-BD')}`;
    document.getElementById('cp-grand-total-cost').innerText = `৳${Math.round(grandTotalCost).toLocaleString('bn-BD')}`;
    document.getElementById('cp-grand-total-revenue').innerText = `৳${Math.round(grandTotalRevenue).toLocaleString('bn-BD')}`;
    document.getElementById('cp-total-live-weight').innerText = `${Math.round(totalMeatWeightKg).toLocaleString('bn-BD')} কেজি`;

    // বার আপডেট
    document.getElementById('cp-bar-feed').style.width = `${feedPct}%`;
    document.getElementById('cp-bar-chick').style.width = `${chickPct}%`;
    document.getElementById('cp-bar-other').style.width = `${otherPct}%`;
    document.getElementById('cp-ratio-text').innerText = `${feedPct}% : ${chickPct}% : ${otherPct}%`;

    // সেনসিটিভিটি টেবিল জেনারেট
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

    const text = `📊 খামার উৎপাদন খরচ ও ব্রেক-ইভেন প্রজেকশন
------------------------------------
🐔 বাচ্চার সংখ্যা: ${s.chicksCount} টি (জীবিত: ${s.survivingBirds} টি)
⚖️ কাঙ্ক্ষিত ওজন: ${s.targetWeight} কেজি | মোট মাংস: ${Math.round(s.totalMeatWeightKg)} কেজি
🥣 মোট খাদ্য: ${s.totalFeedBags} বস্তা (${Math.round(s.totalFeedKg)} কেজি) | FCR: ${s.targetFcr}
------------------------------------
🏷️ প্রতি কেজি উৎপাদন খরচ: ৳${s.costPerKg.toFixed(2)}
🎯 ব্রেক-ইভেন বিক্রি মূল্য: ৳${s.breakEvenRate.toFixed(2)}
💰 মোট উৎপাদন ব্যয়: ৳${Math.round(s.grandTotalCost).toLocaleString()}
💵 প্রত্যাশিত বাজারদর: ৳${s.marketRate}/কেজি
📈 প্রত্যাশিত মোট লাভ: ৳${Math.round(s.totalProfit).toLocaleString()} (প্রতি মুরগিতে: ৳${s.profitPerBird.toFixed(1)})
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

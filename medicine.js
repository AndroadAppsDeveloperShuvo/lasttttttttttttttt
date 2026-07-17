/* 💊 MEDICINE & VACCINE MANAGER
   ঔষধ ও ভ্যাকসিন প্রদানের হিসাব এবং গাইডলাইন পেজ।
*/

// ১. পেজের HTML স্ট্রাকচার (যা DOMContentLoaded এ ইনজেক্ট হবে)
const medicinePageHTML = `
<div id="medicine-page" class="page bg-gray-50 dark:bg-gray-900 transition-all duration-300">
    <header class="sticky top-0 z-10 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 flex items-center shadow-sm">
        <button onclick="goBack()" class="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span class="material-symbols-outlined dark:text-white">arrow_back</span>
        </button>
        <div class="flex-grow">
            <h1 class="text-xl font-bold dark:text-white">ঔষধ ও ভ্যাকসিন খাতা</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">প্রয়োগের হিসাব ও টিকা শিডিউল</p>
        </div>
    </header>

    <div class="p-5 pb-28 space-y-4">
        
        <!-- Summary Dashboard Cards -->
        <div class="grid grid-cols-2 gap-3">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <span class="text-2xl">💉</span>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-bold">মোট প্রয়োগকৃত ঔষধ</p>
                <h3 class="text-xl font-bold text-blue-700 dark:text-blue-400" id="total-med-logs">0</h3>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-100 dark:border-teal-800">
                <span class="text-2xl">🐔</span>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-bold">চলতি চালান</p>
                <h3 class="text-sm font-bold text-teal-700 dark:text-teal-400 truncate mt-1" id="active-shipment-name">কোনোটি নয়</h3>
            </div>
        </div>

        <!-- Segment Tab Control -->
        <div class="bg-gray-200 dark:bg-gray-700 p-1 rounded-xl flex shadow-inner">
            <button id="med-logs-tab-button" onclick="switchMedTab('logs')" class="flex-1 py-2 rounded-lg text-sm font-bold transition-all shadow-sm bg-white dark:bg-gray-600 text-gray-800 dark:text-white">
                প্রয়োগের খাতা
            </button>
            <button id="med-guide-tab-button" onclick="switchMedTab('guide')" class="flex-1 py-2 rounded-lg text-sm font-bold transition-all text-gray-500 dark:text-gray-400">
                টিকা নির্দেশিকা
            </button>
        </div>

        <!-- Tab 1: Logs Container -->
        <div id="med-logs-container" class="space-y-4">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-2">চালান অনুযায়ী ফিল্টার করুন</label>
                <select id="med-shipment-filter" onchange="loadMedicineLogs(this.value)" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-bold">
                    <option value="">সব চালান</option>
                </select>
            </div>

            <div id="med-list-view" class="space-y-3">
                <p class="text-center text-gray-400 text-sm py-10">লোড হচ্ছে...</p>
            </div>
        </div>

        <!-- Tab 2: Guide Container -->
        <div id="med-guide-container" class="hidden space-y-4">
            <div id="guide-info-banner" class="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 p-4 rounded-xl">
                <p class="text-xs text-amber-800 dark:text-amber-300 font-bold leading-relaxed">
                    💡 মুরগির বয়স অনুযায়ী নিচে একটি আদর্শ ভ্যাকসিন ও ঔষধের তালিকা দেওয়া হলো। বয়স অনুযায়ী আজ কোনো ভ্যাকসিন দেয়ার ডেট থাকলে সরাসরি "প্রয়োগ করুন" ক্লিক করে তা খাতায় যোগ করতে পারবেন।
                </p>
                <div class="mt-2 text-xs text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1" id="calculated-age-info">
                    <!-- Calculated Age Status -->
                </div>
            </div>

            <div id="schedule-list-view" class="space-y-3">
                <!-- Prepopulated items will be added here -->
            </div>
        </div>
    </div>

    <!-- Floating Action Button for Logging new item -->
    <div id="add-med-btn-container" class="fixed bottom-10 right-6 z-20">
        <button onclick="openMedicineModal()" class="w-14 h-14 rounded-full bg-teal-700 text-white shadow-xl flex items-center justify-center transform transition hover:scale-110 active:scale-95">
            <span class="material-symbols-outlined text-3xl">add</span>
        </button>
    </div>
</div>

<!-- Modal: Add/Edit Medicine/Vaccine Log -->
<div id="med-modal" class="hidden fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 w-full sm:w-96 rounded-t-3xl sm:rounded-3xl p-6 relative animate-[slideUp_0.3s_ease-out]">
        <button onclick="closeMedicineModal()" class="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-red-100 hover:text-red-500 transition">
            <span class="material-symbols-outlined dark:text-gray-300">close</span>
        </button>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6" id="med-modal-title">নতুন ঔষধ/ভ্যাকসিন দিন</h2>
        
        <form id="med-form" onsubmit="saveMedicineLog(event)" class="space-y-4">
            <input type="hidden" id="med-log-id">
            
            <div>
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">কোন চালান?</label>
                <select id="med-form-shipment" required class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-bold mt-1">
                    <option value="">একটি চালান বেছে নিন</option>
                </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">ঔষধ/ভ্যাকসিনের নাম</label>
                    <input id="med-form-name" required placeholder="যেমন: BCRD, গাম্বোরো" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1 font-medium">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">ধরণ / ক্যাটাগরি</label>
                    <select id="med-form-category" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
                        <option value="Vaccine">ভ্যাকসিন (Vaccine)</option>
                        <option value="Antibiotic">অ্যান্টিবায়োটিক</option>
                        <option value="Vitamin">ভিটামিন ও জিংক</option>
                        <option value="Saline">স্যালাইন ও গ্লুকোজ</option>
                        <option value="Calcium">ক্যালসিয়াম</option>
                        <option value="Deworming">কৃমিনাশক</option>
                        <option value="Others">অন্যান্য</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">মাত্রা ও পরিমাণ</label>
                    <input id="med-form-dose" placeholder="যেমন: ১ ফোঁটা, ২ মিলি" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">প্রয়োগের তারিখ</label>
                    <input id="med-form-date" type="date" required class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
                </div>
            </div>

            <div>
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">নোট / বিবরণ (ঐচ্ছিক)</label>
                <textarea id="med-form-note" placeholder="যেমন: সকালের পানিতে দিয়েছি" rows="2" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"></textarea>
            </div>

            <button type="submit" class="w-full p-4 bg-teal-700 text-white font-bold rounded-xl shadow-lg mt-2 transform active:scale-95 transition">সংরক্ষণ করুন</button>
            
            <button type="button" onclick="deleteMedicineLogItem()" id="btn-delete-med" class="w-full p-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl hidden">ডিলিট করুন</button>
        </form>
    </div>
</div>
`;

// ২. আদর্শ পোল্ট্রি টিকা ও ঔষধ গাইডলাইন ডেটা (ফালব্যাক হিসেবে ব্যবহৃত)
const standardSchedule = [
    { day: 1, name: "স্যালাইন ও গ্লুকোজ পানি", category: "Saline", dose: "১ গ্রাম প্রতি লিটার", desc: "মুরগির ধকল বা ক্লান্তি দূর করার জন্য এবং শক্তি যোগাতে পানির সাথে প্রথম দিন দিতে হয়।" },
    { day: 3, name: "ভিটামিন ও অ্যামিনো অ্যাসিড", category: "Vitamin", dose: "১ মিলি প্রতি ২ লিটার", desc: "৩য় থেকে ৫ম দিন পর্যন্ত মুরগির দৈহিক বৃদ্ধির জন্য ও রোগ প্রতিরোধ ক্ষমতা গড়ে তুলতে।" },
    { day: 7, name: "রাণীক্ষেত ও ব্রঙ্কাইটিস (BCRD)", category: "Vaccine", dose: "১ ফোঁটা চোখে", desc: "৭ম দিনে রাণীক্ষেত ও সংক্রামক ব্রঙ্কাইটিস রোগের প্রাথমিক প্রতিরোধে অত্যন্ত গুরুত্বপূর্ণ ভ্যাকসিন।" },
    { day: 12, name: "গাম্বোরো প্রথম ডোজ (Gumboro)", category: "Vaccine", dose: "১ ফোঁটা চোখে", desc: "১২তম দিনে অত্যন্ত সংক্রামক গাম্বোরো রোগের ভ্যাকসিন প্রয়োগ করতে হয়।" },
    { day: 18, name: "গাম্বোরো বুস্টার ডোজ (Gumboro Booster)", category: "Vaccine", dose: "পানিতে মিশিয়ে", desc: "১৮তম দিনে প্রথম গাম্বোরো ভ্যাকসিনের কার্যকারিতা বাড়াতে বুস্টার ডোজ।" },
    { day: 24, name: "রাণীক্ষেত বুস্টার ডোজ (BCRD Booster)", category: "Vaccine", dose: "পানিতে মিশিয়ে", desc: "২৪তম দিনে রাণীক্ষেত রোগের বুস্টার ডোজ দীর্ঘমেয়াদী সুরক্ষার জন্য প্রয়োগ করুন।" },
    { day: 28, name: "কৃমিনাশক ঔষধ (Deworming)", category: "Deworming", dose: "১ গ্রাম প্রতি লিটার", desc: "২৮তম দিনে কৃমি দূর করতে পানিতে মিশিয়ে বা পোল্ট্রি ভেটেরিনারি পরামর্শ অনুযায়ী।" }
];

let adminSchedules = [...standardSchedule];

// ২.২ এডমিন ডাটাবেজ কানেকশন (রিয়েল-টাইম গাইডলাইন সিঙ্ক করার জন্য)
let adminApp;
let adminDb;

try {
    adminApp = firebase.app("adminApp");
} catch (e) {
    adminApp = firebase.initializeApp({
        apiKey: "AIzaSyDkqjA1Io411uidSZBLbYJlYHWGVY36zc8",
        authDomain: "shuvo-all-tools.firebaseapp.com",
        databaseURL: "https://shuvo-all-tools-default-rtdb.firebaseio.com/",
        projectId: "shuvo-all-tools"
    }, "adminApp");
}
adminDb = adminApp.database();

// রিয়েল-টাইম গাইডলাইন আপডেট লিসেনার
adminDb.ref("medicine_schedule").on("value", snapshot => {
    const data = snapshot.val();
    if (data) {
        // টার্গেট দিন অনুযায়ী সাজানো
        adminSchedules = Object.entries(data).map(([id, val]) => ({ id, ...val }))
            .sort((a, b) => a.day - b.day);
    } else {
        adminSchedules = [...standardSchedule];
    }
    
    // যদি গাইড ট্যাব ওপেন থাকে তবে রেন্ডার রিফ্রেশ করুন
    const guideCont = document.getElementById('med-guide-container');
    if (guideCont && !guideCont.classList.contains('hidden')) {
        renderGuideSchedule();
    }
}, error => {
    console.warn("Using fallback standardSchedule due to connection error:", error);
    adminSchedules = [...standardSchedule];
});

// ৩. পেজ ইনজেক্ট করা
document.addEventListener('DOMContentLoaded', () => {
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
        mainApp.insertAdjacentHTML('beforeend', medicinePageHTML);
    }
});

// ৪. মেইন লজিক
let allMedicineLogs = [];
let allShipmentsData = {};
let activeShipmentAgeDays = null;

function openMedicinePage() {
    navigate('medicine-page');
    loadMedicineShipmentDropdowns();
    loadMedicineLogs();
}

// ক্যাটাগরি ডেকোরেশন হেল্পার
const medCategories = {
    'Vaccine': { icon: '💉', label: 'ভ্যাকসিন (Vaccine)', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
    'Antibiotic': { icon: '💊', label: 'অ্যান্টিবায়োটিক', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
    'Vitamin': { icon: '🍏', label: 'ভিটামিন ও জিংক', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
    'Saline': { icon: '🥤', label: 'স্যালাইন ও গ্লুকোজ', color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' },
    'Calcium': { icon: '🦴', label: 'ক্যালসিয়াম', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
    'Deworming': { icon: '🐛', label: 'কৃমিনাশক', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
    'Others': { icon: '📦', label: 'অন্যান্য', color: 'text-gray-600 bg-gray-50 dark:bg-gray-800' }
};

// ট্যাব পরিবর্তন
function switchMedTab(tab) {
    const logsBtn = document.getElementById('med-logs-tab-button');
    const guideBtn = document.getElementById('med-guide-tab-button');
    const logsCont = document.getElementById('med-logs-container');
    const guideCont = document.getElementById('med-guide-container');
    const addFab = document.getElementById('add-med-btn-container');

    if (tab === 'logs') {
        logsBtn.className = "flex-1 py-2 rounded-lg text-sm font-bold transition-all shadow-sm bg-white dark:bg-gray-600 text-gray-800 dark:text-white";
        guideBtn.className = "flex-1 py-2 rounded-lg text-sm font-bold transition-all text-gray-500 dark:text-gray-400";
        logsCont.classList.remove('hidden');
        guideCont.classList.add('hidden');
        addFab.classList.remove('hidden');
    } else {
        guideBtn.className = "flex-1 py-2 rounded-lg text-sm font-bold transition-all shadow-sm bg-white dark:bg-gray-600 text-gray-800 dark:text-white";
        logsBtn.className = "flex-1 py-2 rounded-lg text-sm font-bold transition-all text-gray-500 dark:text-gray-400";
        guideCont.classList.remove('hidden');
        logsCont.classList.add('hidden');
        addFab.classList.add('hidden');
        renderGuideSchedule();
    }
}

// চালান ড্রপডাউন লোড করা
function loadMedicineShipmentDropdowns() {
    if (!currentUser) return;
    const filterSelect = document.getElementById('med-shipment-filter');
    const formSelect = document.getElementById('med-form-shipment');

    db.ref(`users/${currentUser.uid}/shipments`).once('value', snapshot => {
        const data = snapshot.val();
        allShipmentsData = data || {};
        
        filterSelect.innerHTML = '<option value="">সব চালান</option>';
        formSelect.innerHTML = '<option value="">একটি চালান বেছে নিন</option>';

        if (data) {
            Object.entries(data).reverse().forEach(([id, item]) => {
                // ফিল্টার
                const optFilter = document.createElement('option');
                optFilter.value = id;
                optFilter.innerText = `${item.name} (${item.startDate})`;
                filterSelect.appendChild(optFilter);

                // ফর্ম মডাল
                const optForm = document.createElement('option');
                optForm.value = id;
                optForm.innerText = `${item.name}`;
                formSelect.appendChild(optForm);
            });

            // ডিফল্টভাবে একটিভ চালান সেট করুন
            if (currentShipmentId && data[currentShipmentId]) {
                filterSelect.value = currentShipmentId;
                document.getElementById('active-shipment-name').innerText = data[currentShipmentId].name;
                
                // মুরগির বয়স বের করা
                const start = new Date(data[currentShipmentId].startDate);
                const today = new Date();
                const diffTime = today - start;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                activeShipmentAgeDays = diffDays > 0 ? diffDays : 0;
            } else {
                document.getElementById('active-shipment-name').innerText = 'কোনোটি নয়';
                activeShipmentAgeDays = null;
            }
        } else {
            filterSelect.innerHTML = '<option value="">কোনো চালান নেই</option>';
            formSelect.innerHTML = '<option value="">কোনো চালান নেই</option>';
            document.getElementById('active-shipment-name').innerText = 'কোনোটি নয়';
            activeShipmentAgeDays = null;
        }
    });
}

// ঔষধ প্রদানের হিস্টোরি নিয়ে আসা
function loadMedicineLogs(filterShipmentId = '') {
    if (!currentUser) return;
    const listView = document.getElementById('med-list-view');
    listView.innerHTML = '<p class="text-center text-gray-400">লোড হচ্ছে...</p>';

    // নির্দিষ্ট চালান সিলেক্ট করলে সেটির তথ্য দেখাবে
    const selShipmentId = filterShipmentId || document.getElementById('med-shipment-filter').value;

    db.ref(`users/${currentUser.uid}/medicine_logs`).on('value', snapshot => {
        const data = snapshot.val();
        listView.innerHTML = '';
        allMedicineLogs = [];

        if (!data) {
            listView.innerHTML = `<div class="text-center py-10 opacity-50"><span class="material-symbols-outlined text-6xl mb-2">vaccines</span><p>ঔষধের খাতা খালি</p></div>`;
            document.getElementById('total-med-logs').innerText = '0';
            return;
        }

        let totalLogs = 0;
        const sortedLogs = Object.entries(data).sort((a, b) => new Date(b[1].date) - new Date(a[1].date));

        sortedLogs.forEach(([key, item]) => {
            if (selShipmentId && item.shipmentId !== selShipmentId) return;

            allMedicineLogs.push({ id: key, ...item });
            totalLogs++;

            const catInfo = medCategories[item.category] || medCategories['Others'];
            const shipmentName = allShipmentsData[item.shipmentId]?.name || 'অজানা চালান';

            const html = `
            <div onclick="editMedicineLog('${key}')" class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-50 dark:border-gray-700 cursor-pointer hover:shadow-md transition">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <div class="w-10 h-10 rounded-full ${catInfo.color} flex items-center justify-center text-xl flex-shrink-0">
                        ${catInfo.icon}
                    </div>
                    <div class="min-w-0">
                        <h4 class="font-bold text-gray-800 dark:text-gray-200 truncate">${item.name}</h4>
                        <p class="text-xs text-teal-600 dark:text-teal-400 font-bold">${shipmentName}</p>
                        ${item.note ? `<p class="text-xs text-gray-400 truncate mt-0.5">📝 ${item.note}</p>` : ''}
                    </div>
                </div>
                <div class="text-right flex-shrink-0 ml-3">
                    <span class="font-bold text-sm text-gray-800 dark:text-gray-300 block">${item.dose || 'যথাযথ'}</span>
                    <span class="text-[10px] text-gray-400">${item.date}</span>
                </div>
            </div>`;
            listView.innerHTML += html;
        });

        document.getElementById('total-med-logs').innerText = totalLogs;

        if (totalLogs === 0) {
            listView.innerHTML = `<div class="text-center py-10 opacity-50"><span class="material-symbols-outlined text-5xl mb-2">search</span><p>এই চালানের জন্য কোনো রেকর্ড নেই</p></div>`;
        }
    });
}

// গাইড ও শিডিউল রেন্ডার করা
function renderGuideSchedule() {
    const sView = document.getElementById('schedule-list-view');
    const ageInfo = document.getElementById('calculated-age-info');
    sView.innerHTML = '';

    if (activeShipmentAgeDays !== null) {
        ageInfo.innerHTML = `<span>📅</span> আপনার চলতি চালানের বর্তমান বয়স: <b class="text-teal-700 dark:text-teal-400 ml-1">${activeShipmentAgeDays} দিন</b>`;
    } else {
        ageInfo.innerHTML = `<span>⚠️</span> কোনো চলতি চালান সিলেক্ট করা নেই। সেটিংস থেকে একটি চালানে প্রবেশ করুন।`;
    }

    adminSchedules.forEach(item => {
        let ageMatchHtml = '';
        let buttonClass = 'bg-teal-700 text-white';
        let buttonText = 'প্রয়োগ করুন';

        // বয়স অনুযায়ী ম্যাচ করলে হাইলাইট করো
        if (activeShipmentAgeDays !== null && activeShipmentAgeDays === item.day) {
            ageMatchHtml = `<span class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">আজকের করণীয়</span>`;
            buttonClass = 'bg-red-600 text-white animate-bounce';
        } else if (activeShipmentAgeDays !== null && activeShipmentAgeDays < item.day) {
            ageMatchHtml = `<span class="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">সামনে আসবে</span>`;
        } else if (activeShipmentAgeDays !== null && activeShipmentAgeDays > item.day) {
            ageMatchHtml = `<span class="bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full">অতিক্রান্ত</span>`;
        }

        const catInfo = medCategories[item.category] || medCategories['Others'];

        const html = `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">${catInfo.icon}</span>
                    <div>
                        <h4 class="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 flex-wrap">
                            ${item.name} ${ageMatchHtml}
                        </h4>
                        <p class="text-xs text-teal-600 dark:text-teal-400 font-bold">${item.day}ম দিন (মাত্রা: ${item.dose})</p>
                    </div>
                </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">${item.desc}</p>
            <div class="flex justify-end pt-1">
                <button onclick="applyFromGuide('${item.name}', '${item.category}', '${item.dose}')" class="px-4 py-2 ${buttonClass} text-xs font-bold rounded-lg shadow transition transform active:scale-95">
                    ${buttonText}
                </button>
            </div>
        </div>`;
        sView.innerHTML += html;
    });
}

// নির্দেশিকা থেকে সরাসরি প্রয়োগ মডালে নিয়ে যাওয়া
function applyFromGuide(name, category, dose) {
    openMedicineModal();
    document.getElementById('med-form-name').value = name;
    document.getElementById('med-form-category').value = category;
    document.getElementById('med-form-dose').value = dose;
    if (currentShipmentId) {
        document.getElementById('med-form-shipment').value = currentShipmentId;
    }
}

// মডাল কন্ট্রোল
function openMedicineModal() {
    const form = document.getElementById('med-form');
    if (form) form.reset();
    document.getElementById('med-log-id').value = '';
    document.getElementById('med-modal-title').innerText = "নতুন ঔষধ/ভ্যাকসিন প্রদান";
    document.getElementById('btn-delete-med').classList.add('hidden');
    document.getElementById('med-form-date').valueAsDate = new Date();
    
    // মডালে চালান সিলেক্ট
    if (currentShipmentId) {
        document.getElementById('med-form-shipment').value = currentShipmentId;
    }

    document.getElementById('med-modal').classList.remove('hidden');
}

function closeMedicineModal() {
    document.getElementById('med-modal').classList.add('hidden');
}

// সেভ করা
function saveMedicineLog(e) {
    e.preventDefault();
    if (!currentUser) return;

    const id = document.getElementById('med-log-id').value;
    const data = {
        shipmentId: document.getElementById('med-form-shipment').value,
        name: document.getElementById('med-form-name').value,
        category: document.getElementById('med-form-category').value,
        dose: document.getElementById('med-form-dose').value,
        date: document.getElementById('med-form-date').value,
        note: document.getElementById('med-form-note').value,
        timestamp: new Date().toISOString()
    };

    if (!data.shipmentId) {
        alert("দয়া করে একটি চালান সিলেক্ট করুন!");
        return;
    }

    if (id) {
        db.ref(`users/${currentUser.uid}/medicine_logs/${id}`).update(data)
            .then(() => {
                showToast("ঔষধের রেকর্ড আপডেট হয়েছে ✅");
                closeMedicineModal();
            });
    } else {
        db.ref(`users/${currentUser.uid}/medicine_logs`).push(data)
            .then(() => {
                showToast("ঔষধ প্রদানের খাতা সেভ হয়েছে 💉");
                closeMedicineModal();
            });
    }
}

// এডিট করা
function editMedicineLog(id) {
    const item = allMedicineLogs.find(l => l.id === id);
    if (!item) return;

    document.getElementById('med-log-id').value = id;
    document.getElementById('med-form-shipment').value = item.shipmentId;
    document.getElementById('med-form-name').value = item.name;
    document.getElementById('med-form-category').value = item.category;
    document.getElementById('med-form-dose').value = item.dose;
    document.getElementById('med-form-date').value = item.date;
    document.getElementById('med-form-note').value = item.note || '';

    document.getElementById('med-modal-title').innerText = "রেকর্ড এডিট করুন";
    document.getElementById('btn-delete-med').classList.remove('hidden');
    document.getElementById('med-modal').classList.remove('hidden');
}

// ডিলিট করা
function deleteMedicineLogItem() {
    const id = document.getElementById('med-log-id').value;
    if (id && confirm("আপনি কি নিশ্চিত এই রেকর্ডটি ডিলিট করবেন?")) {
        db.ref(`users/${currentUser.uid}/medicine_logs/${id}`).remove()
            .then(() => {
                showToast("রেকর্ড মুছে ফেলা হয়েছে 🗑️");
                closeMedicineModal();
            });
    }
}

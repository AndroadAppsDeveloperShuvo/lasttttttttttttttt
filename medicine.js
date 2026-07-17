/* 💊 MEDICINE & VACCINE MANAGER
   ঔষধ ও ভ্যাকসিন প্রদানের রিয়েল-টাইম গাইডলাইন পেজ।
   এডমিন প্যানেল থেকে নিয়ন্ত্রিত এবং ইউজারদের জন্য রিড-অনলি টাইমলাইন।
*/

// ১. পেজের HTML স্ট্রাকচার (যা DOMContentLoaded এ ইনজেক্ট হবে)
const medicinePageHTML = `
<div id="medicine-page" class="page tab-page bg-gray-50 dark:bg-gray-900 transition-all duration-300">
    <header class="sticky top-0 z-10 p-5 bg-teal-700 text-white flex items-center shadow-md rounded-b-2xl mb-4">
        <div class="flex-grow">
            <h1 class="text-xl font-bold">ঔষধ ও ভ্যাকসিন গাইডলাইন</h1>
            <p class="text-xs text-teal-100 mt-0.5">রিয়েল-টাইম এডমিন নির্দেশিকা ও টিকা শিডিউল</p>
        </div>
    </header>

    <div class="p-5 pb-28 space-y-5">
        <!-- Shipment Selection Dropdown -->
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-2">আপনার কোন চালানের জন্য শিডিউল দেখতে চান?</label>
            <select id="med-shipment-filter" onchange="changeActiveShipment(this.value)" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">সব চালান</option>
            </select>
        </div>

        <!-- Active Shipment Status Card -->
        <div class="bg-gradient-to-r from-teal-600 to-teal-500 text-white p-5 rounded-2xl shadow-md border border-teal-400/20 relative overflow-hidden" id="active-shipment-status-card">
            <!-- decorative background shapes -->
            <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div class="absolute -left-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            
            <div class="relative flex items-center justify-between">
                <div>
                    <span class="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">চলতি চালান বিবরণ</span>
                    <h3 class="text-base font-bold mt-2" id="active-shipment-name">লোড হচ্ছে...</h3>
                    <div class="mt-2 space-y-0.5">
                        <p class="text-xs text-teal-100 flex items-center gap-1">
                            <span class="material-symbols-outlined text-[14px]">calendar_month</span>
                            শুরুর তারিখ: <span id="active-shipment-start-date">-</span>
                        </p>
                        <p class="text-xs text-teal-100 flex items-center gap-1">
                            <span class="material-symbols-outlined text-[14px]">pets</span>
                            মুরগির সংখ্যা: <span id="active-shipment-count">-</span>
                        </p>
                    </div>
                </div>
                <div class="text-center bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-md flex flex-col justify-center items-center min-w-[80px]">
                    <span class="text-2xl block">🐔</span>
                    <span class="text-[9px] text-teal-50 font-bold block mt-1">আজকের বয়স</span>
                    <span class="text-base font-extrabold block" id="active-shipment-age">-</span>
                </div>
            </div>
        </div>

        <!-- Schedule Timeline Title -->
        <div class="flex items-center justify-between pt-2">
            <h2 class="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span class="material-symbols-outlined text-teal-600 dark:text-teal-400">format_list_bulleted</span> 
                ঔষধ ও ভ্যাকসিন শিডিউল
            </h2>
            <span class="text-[10px] bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-bold px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-800" id="total-sched-count">০ টি</span>
        </div>

        <!-- Schedule List -->
        <div id="schedule-list-view" class="space-y-4">
            <!-- Rendered schedules from adminSchedules -->
        </div>
    </div>
</div>
`;

// ২. আদর্শ পোল্ট্রি টিকা ও ঔষধ গাইডলাইন ডেটা (ফালব্যাক হিসেবে ব্যবহৃত)
const standardSchedule = [
    { day: 1, name: "স্যালাইন ও গ্লুকোজ পানি", category: "Saline", dose: "১ গ্রাম প্রতি লিটার", desc: "মুরগির ধকল বা ক্লান্তি দূর করার জন্য এবং শক্তি যোগাতে পানির সাথে প্রথম দিন দিতে হয়।" },
    { day: 3, name: "ভিটামিন ও অ্যামিনো অ্যাসিড", category: "Vitamin", dose: "১ মিলি প্রতি ২ লিটার", desc: "৩য় থেকে ৫ম দিন পর্যন্ত মুরগির দৈহিক বৃদ্ধির জন্য ও রোগ প্রতিরোধ ক্ষমতা গড়ে তুলতে।" },
    { day: 5, name: "বিসিআরডিভি টিকা (BCRDV - প্রথম ডোজ)", category: "Vaccine", dose: "১ ফোঁটা চোখে", desc: "রাণীকক্ষেত রোগ প্রতিরোধে ৩ থেকে ৫ দিনের মাথায় প্রথম চোখের ফোঁটা দিতে হবে।" },
    { day: 12, name: "গাম্বোরো টিকা (Gumboro - প্রথম ডোজ)", category: "Vaccine", dose: "১ ফোঁটা চোখে বা পানিতে", desc: "গাম্বোরো রোগ প্রতিরোধে ১০ থেকে ১২তম দিনে প্রথম ডোজ দিতে হবে।" },
    { day: 28, name: "কৃমিনাশক ঔষধ (Deworming)", category: "Deworming", dose: "১ গ্রাম প্রতি লিটার", desc: "২৮তম দিনে কৃমি দূর করতে পানিতে মিশিয়ে বা পোল্ট্রি ভেটেরিনারি পরামর্শ অনুযায়ী।" }
];

let adminSchedules = [...standardSchedule];

// ২.২ এডমিন ডাটাবেজ কানেকশন (রিয়েল-টাইম গাইডলাইন সিঙ্ক করার জন্য)
let targetDb;
try {
    if (typeof db !== 'undefined') {
        targetDb = db;
    } else if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        targetDb = firebase.database();
    } else {
        const firebaseConfig = {
            apiKey: "AIzaSyBD3Ev8Gg2yValARgfxeRlSwDWrdERmtKE",
            authDomain: "mypoltyfarm.firebaseapp.com",
            databaseURL: "https://mypoltyfarm-default-rtdb.firebaseio.com",
            projectId: "mypoltyfarm",
            storageBucket: "mypoltyfarm.firebasestorage.app",
            messagingSenderId: "620769276564",
            appId: "1:620769276564:web:939c4e1065d8dfb9d6fa81"
        };
        const app = firebase.initializeApp(firebaseConfig);
        targetDb = app.database();
    }
} catch (e) {
    console.error("Database initialization error in medicine.js:", e);
}

if (targetDb) {
    // রিয়েল-টাইম গাইডলাইন আপডেট লিসেনার
    targetDb.ref("medicine_schedule").on("value", snapshot => {
        const data = snapshot.val();
        if (data) {
            // টার্গেট দিন অনুযায়ী সাজানো
            adminSchedules = Object.entries(data).map(([id, val]) => ({ id, ...val }))
                .sort((a, b) => a.day - b.day);
        } else {
            adminSchedules = [...standardSchedule];
        }
        
        // যদি গাইড ট্যাব বা ভিউ ওপেন থাকে তবে রেন্ডার রিফ্রেশ করুন
        const schedListView = document.getElementById('schedule-list-view');
        if (schedListView) {
            renderScheduleTimeline();
        }
    }, error => {
        console.warn("Using fallback standardSchedule due to connection error:", error);
        adminSchedules = [...standardSchedule];
    });
}

// ৩. পেজ ইনজেক্ট করা
document.addEventListener('DOMContentLoaded', () => {
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
        mainApp.insertAdjacentHTML('beforeend', medicinePageHTML);
    }
});

// ৪. মেইন লজিক
let allShipmentsData = {};
let activeShipmentAgeDays = null;
let activeMedShipmentId = '';

const medCategories = {
    'Vaccine': { icon: '💉', label: 'ভ্যাকসিন (Vaccine)', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
    'Antibiotic': { icon: '💊', label: 'অ্যান্টিবায়োটিক', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
    'Vitamin': { icon: '🍏', label: 'ভিটামিন ও জিংক', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
    'Saline': { icon: '🥤', label: 'স্যালাইন ও গ্লুকোজ', color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' },
    'Calcium': { icon: '🦴', label: 'ক্যালসিয়াম', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
    'Deworming': { icon: '🐛', label: 'কৃমিনাশক', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
    'Others': { icon: '📦', label: 'অন্যান্য', color: 'text-gray-600 bg-gray-50 dark:bg-gray-800' }
};

function openMedicinePage() {
    navigateToTab('medicine-page');
}

// চালান ড্রপডাউন লোড করা
function loadMedicineShipmentDropdowns() {
    if (!currentUser) return;
    const filterSelect = document.getElementById('med-shipment-filter');
    if (!filterSelect) return;

    db.ref(`users/${currentUser.uid}/shipments`).once('value', snapshot => {
        const data = snapshot.val();
        allShipmentsData = data || {};
        
        filterSelect.innerHTML = '';

        if (data) {
            const entries = Object.entries(data).reverse();
            entries.forEach(([id, item]) => {
                const optFilter = document.createElement('option');
                optFilter.value = id;
                optFilter.innerText = `${item.name} (${item.startDate})`;
                filterSelect.appendChild(optFilter);
            });

            // ডিফল্টভাবে একটিভ বা সাম্প্রতিক চালান সেট করুন
            let targetId = activeMedShipmentId || currentShipmentId;
            if (!targetId || !data[targetId]) {
                targetId = entries[0][0]; // most recent
            }
            activeMedShipmentId = targetId;
            filterSelect.value = targetId;
            updateActiveShipmentDetails(targetId);
        } else {
            filterSelect.innerHTML = '<option value="">কোনো চালান নেই</option>';
            document.getElementById('active-shipment-name').innerText = 'কোনো চালান নেই';
            document.getElementById('active-shipment-start-date').innerText = '-';
            document.getElementById('active-shipment-count').innerText = '-';
            document.getElementById('active-shipment-age').innerText = '-';
            activeShipmentAgeDays = null;
            renderScheduleTimeline();
        }
    });
}

function changeActiveShipment(shipmentId) {
    activeMedShipmentId = shipmentId;
    updateActiveShipmentDetails(shipmentId);
}

function updateActiveShipmentDetails(shipmentId) {
    const shipment = allShipmentsData[shipmentId];
    if (shipment) {
        document.getElementById('active-shipment-name').innerText = shipment.name;
        document.getElementById('active-shipment-start-date').innerText = new Date(shipment.startDate).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('active-shipment-count').innerText = shipment.chickenCount + ' টি';
        
        // মুরগির বয়স বের করা
        const start = new Date(shipment.startDate);
        const today = new Date();
        const diffTime = today - start;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        activeShipmentAgeDays = diffDays > 0 ? diffDays : 0;
        document.getElementById('active-shipment-age').innerText = activeShipmentAgeDays + ' দিন';
    } else {
        document.getElementById('active-shipment-name').innerText = 'কোনো চলতি চালান নেই';
        document.getElementById('active-shipment-start-date').innerText = '-';
        document.getElementById('active-shipment-count').innerText = '-';
        document.getElementById('active-shipment-age').innerText = '-';
        activeShipmentAgeDays = null;
    }
    renderScheduleTimeline();
}

// গাইড ও শিডিউল রেন্ডার করা
function renderScheduleTimeline() {
    const sView = document.getElementById('schedule-list-view');
    const totalCountEl = document.getElementById('total-sched-count');
    if (!sView) return;
    sView.innerHTML = '';

    if (!adminSchedules || adminSchedules.length === 0) {
        sView.innerHTML = `<div class="text-center py-12 opacity-60"><span class="material-symbols-outlined text-5xl text-gray-400 mb-2">vaccines</span><p class="text-sm">কোনো ঔষধ বা ভ্যাকসিন গাইডলাইন যুক্ত করা নেই।</p></div>`;
        if (totalCountEl) totalCountEl.innerText = '০ টি';
        return;
    }

    if (totalCountEl) {
        totalCountEl.innerText = adminSchedules.length + ' টি';
    }

    adminSchedules.forEach(item => {
        let statusHtml = '';
        let statusClass = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
        let glowClass = '';

        // বয়স অনুযায়ী ম্যাচ করলে হাইলাইট করো
        if (activeShipmentAgeDays !== null) {
            const itemDayNum = parseInt(item.day);
            if (activeShipmentAgeDays === itemDayNum) {
                statusHtml = `<span class="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse shadow-sm flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>🎯 আজকের করণীয়</span>`;
                statusClass = 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20';
                glowClass = 'shadow-md shadow-emerald-500/10 dark:shadow-emerald-500/5';
            } else if (activeShipmentAgeDays > itemDayNum) {
                statusHtml = `<span class="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">✅ অতিক্রান্ত</span>`;
                statusClass = 'border-gray-100 dark:border-gray-800 opacity-75';
            } else {
                statusHtml = `<span class="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-900/50">⏳ আসন্ন দিন</span>`;
                statusClass = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
            }
        } else {
            statusHtml = `<span class="bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-800">${item.day}ম দিন</span>`;
            statusClass = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
        }

        const catInfo = medCategories[item.category] || medCategories['Others'];

        const html = `
        <div class="p-5 rounded-2xl border transition-all duration-300 ${statusClass} ${glowClass} space-y-4">
            <div class="flex justify-between items-start gap-2">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl ${catInfo.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                        ${catInfo.icon}
                    </div>
                    <div>
                        <h4 class="font-extrabold text-gray-800 dark:text-gray-100 text-sm md:text-base">
                            ${item.name}
                        </h4>
                        <p class="text-[11px] text-teal-600 dark:text-teal-400 font-extrabold mt-0.5 uppercase tracking-wide">
                            ${catInfo.label} • ${item.day}ম দিন
                        </p>
                    </div>
                </div>
                <div class="flex-shrink-0">
                    ${statusHtml}
                </div>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100/50 dark:border-gray-700/30">
                <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">
                    <span class="material-symbols-outlined text-sm text-teal-600">colorize</span>
                    প্রয়োগের মাত্রা
                </div>
                <p class="text-xs font-extrabold text-teal-700 dark:text-teal-400">${item.dose || 'যথাযথা মাত্রায়'}</p>
            </div>

            <div class="space-y-1.5">
                <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-bold">
                    <span class="material-symbols-outlined text-sm text-amber-500">info</span>
                    বিস্তারিত নির্দেশিকা
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">${item.desc}</p>
            </div>
        </div>`;
        sView.innerHTML += html;
    });
}

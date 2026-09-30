/* 💊 MEDICINE & VACCINE MANAGER (PREMIUM HIGH-FIDELITY IMPLEMENTATION)
   ঔষধ ও ভ্যাকসিন প্রদানের রিয়েল-টাইম গাইডলাইন পেজ।
   এডমিন প্যানেল পাসওয়ার্ড সুরক্ষিত এবং ইন-অ্যাপ পূর্ণ কন্ট্রোল সাপোর্ট।
*/

// ১. পেজের HTML স্ট্রাকচার (যা DOMContentLoaded এ ইনজেক্ট হবে)
const medicinePageHTML = `
<div id="medicine-page" class="page tab-page bg-gray-50 dark:bg-gray-900 transition-all duration-300 relative">
    <header class="sticky top-0 z-40 p-5 bg-teal-700 text-white flex items-center justify-between shadow-md rounded-b-2xl mb-4">
        <div class="flex items-center gap-3">
            <div class="relative flex items-center">
                <button id="med-menu-trigger" onclick="toggleMedicineMenu(event)" class="p-2 -ml-2 rounded-xl text-white hover:bg-teal-800 transition active:scale-95 flex items-center justify-center relative">
                    <span class="material-symbols-outlined text-2xl">menu</span>
                </button>
                <!-- Dropdown menu (Moved outside of button to prevent event bubbling bugs) -->
                <div id="med-menu-dropdown" class="hidden absolute top-12 left-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-1.5 w-52 z-50 text-left divide-y divide-gray-100 dark:divide-gray-700">
                    <div onclick="clickMedMenu('profile')" class="px-4 py-3 hover:bg-teal-50 dark:hover:bg-gray-700/50 flex items-center gap-3 text-xs font-bold cursor-pointer transition text-gray-700 dark:text-gray-200">
                        <span class="material-symbols-outlined text-teal-600 dark:text-teal-400 text-lg">person</span>
                        <span>প্রোফাইল</span>
                    </div>
                    <div onclick="clickMedMenu('refresh')" class="px-4 py-3 hover:bg-teal-50 dark:hover:bg-gray-700/50 flex items-center gap-3 text-xs font-bold cursor-pointer transition text-gray-700 dark:text-gray-200">
                        <span class="material-symbols-outlined text-teal-600 dark:text-teal-400 text-lg">refresh</span>
                        <span>রিফ্রেশ করুন</span>
                    </div>
                    <div id="med-menu-video-edit-btn" onclick="clickMedMenu('video_edit')" class="hidden px-4 py-3 hover:bg-teal-50 dark:hover:bg-gray-700/50 flex items-center gap-3 text-xs font-bold cursor-pointer transition text-purple-600 dark:text-purple-400">
                        <span class="material-symbols-outlined text-lg">video_settings</span>
                        <span>ভিডিও লিংক পরিবর্তন</span>
                    </div>
                    <div id="med-menu-admin-btn" onclick="clickMedMenu('admin')" class="px-4 py-3 hover:bg-teal-50 dark:hover:bg-gray-700/50 flex items-center gap-3 text-xs font-bold cursor-pointer transition text-red-600 dark:text-red-400">
                        <span class="material-symbols-outlined text-lg">lock</span>
                        <span>এডমিন লগইন</span>
                    </div>
                </div>
            </div>
            <div>
                <h1 class="text-lg md:text-xl font-bold flex items-center gap-1.5">
                    ঔষধের তালিকা
                    <span id="med-admin-badge" class="hidden text-[9px] bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">ADMIN</span>
                </h1>
                <p id="med-scrolling-bar" class="text-[10px] text-teal-100 mt-0.5 max-w-[200px] truncate">রিয়েল-টাইম গাইডলাইন ও টিকা শিডিউল</p>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <!-- Video Edit Button for Admin -->
            <button id="med-video-admin-btn" onclick="openMedVideoEditModal()" class="hidden bg-white/20 hover:bg-white/30 text-white rounded-xl p-2 transition flex items-center justify-center active:scale-95" title="ভিডিও লিংক পরিবর্তন">
                <span class="material-symbols-outlined text-xl">video_settings</span>
            </button>
            <!-- Add Button for Admin -->
            <button id="med-add-btn" onclick="openMedFormModal()" class="hidden bg-white/20 hover:bg-white/30 text-white rounded-xl p-2 transition flex items-center justify-center active:scale-95">
                <span class="material-symbols-outlined text-xl">add</span>
            </button>
            <span class="text-xs bg-white/10 px-2.5 py-1 rounded-full font-bold backdrop-blur-sm shadow-inner" id="med-user-status-badge">ইউজার</span>
        </div>
    </header>

    <div class="p-5 pb-28 space-y-5">
        <!-- 📢 প্রতিদিনের ওষুধ সময়মতো দেওয়ার রিমাইন্ডার নোটিশ -->
        <div class="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-teal-950/20 dark:to-emerald-950/20 border border-teal-500/20 dark:border-teal-800/40 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center text-lg flex-shrink-0">
                    🐔
                </div>
                <p class="text-xs font-bold text-teal-800 dark:text-teal-300 leading-relaxed">
                    প্রতিদিনের ওষুধ সময়মতো দিতে ভুলবেন না 🐔
                </p>
            </div>
            <div class="w-2.5 h-2.5 bg-teal-500 rounded-full animate-ping flex-shrink-0"></div>
        </div>

        <!-- 🐔 Breed Filter Tabs (Exactly like the image) -->
        <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">জাত অনুযায়ী ফিল্টার</label>
            <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar" id="med-breed-tabs-container">
                <button onclick="setBreedFilter('Broiler')" id="tab-breed-Broiler" class="px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border bg-teal-700 text-white border-teal-700 shadow-sm active:scale-95">
                    ব্রয়লার
                </button>
                <button onclick="setBreedFilter('ColorBird')" id="tab-breed-ColorBird" class="px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 active:scale-95">
                    কালার বার্ড
                </button>
                <button onclick="setBreedFilter('Sonali')" id="tab-breed-Sonali" class="px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 active:scale-95">
                    সোনালি
                </button>
                <button onclick="setBreedFilter('Deshi')" id="tab-breed-Deshi" class="px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 active:scale-95">
                    দেশি
                </button>
            </div>
        </div>

        <!-- 🎯 Tracking Status Filter Tabs (High-fidelity design) -->
        <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">ওষুধের ব্যবহার ট্র্যাকিং</label>
            <div class="bg-gray-100 dark:bg-gray-800/80 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
                <button onclick="setTrackingFilter('all')" id="tab-track-all" class="flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-200 bg-white dark:bg-gray-700 text-teal-700 dark:text-teal-400 shadow-sm active:scale-95">
                    সব ওষুধ (<span id="count-track-all">0</span>)
                </button>
                <button onclick="setTrackingFilter('remaining')" id="tab-track-remaining" class="flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 active:scale-95">
                    বাকি আছে (<span id="count-track-remaining">0</span>)
                </button>
                <button onclick="setTrackingFilter('completed')" id="tab-track-completed" class="flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 active:scale-95">
                    ব্যবহৃত হয়েছে (<span id="count-track-completed">0</span>)
                </button>
            </div>
        </div>

        <!-- 🔍 Search Bar (Pristine Visuals with Clear Button) -->
        <div class="relative">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
            <input type="text" id="med-search-input" oninput="searchMedicineGuidelines()" placeholder="ওষুধের নাম, দিন বা সময় দিয়ে খুঁজুন..." class="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm font-bold placeholder:text-gray-400 dark:placeholder:text-gray-500">
            <button id="med-search-clear" onclick="clearMedSearch()" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <span class="material-symbols-outlined text-lg">close</span>
            </button>
        </div>

        <!-- Schedule List Grouped by Day -->
        <div id="schedule-list-view" class="space-y-4">
            <!-- Rendered schedules from adminSchedules -->
        </div>
    </div>

    <!-- 🔐 In-App Admin Gmail OTP Verification Modal -->
    <div id="med-password-modal" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
        <div class="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 text-center space-y-4 relative">
            <button onclick="closeMedPasswordModal()" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div class="w-14 h-14 bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <span class="material-symbols-outlined text-2xl">shield_person</span>
            </div>
            <div>
                <h2 class="text-base font-bold text-gray-800 dark:text-white">এডমিন নিরাপত্তা যাচাইকরণ</h2>
                <p class="text-xs text-gray-400 mt-1">Google Authenticator অথবা জিমেইল ওটিপি দিয়ে প্রবেশ করুন</p>
            </div>

            <!-- Direct 6-Digit Code Entry (Instant access via Authenticator or Email OTP) -->
            <div class="space-y-3 text-left">
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="text-[10px] font-bold text-gray-500 dark:text-gray-400">৬ ডিজিটের কোড লিখুন</label>
                        <span class="text-[9px] text-teal-600 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-full">Authenticator / ইমেইল</span>
                    </div>
                    <input type="text" id="med-admin-otp-input" maxlength="6" inputmode="numeric" placeholder="------" class="w-full p-2.5 text-center border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl font-bold tracking-[0.4em] text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner">
                </div>

                <button id="med-verify-otp-btn" onclick="verifyMedAdminOtp()" class="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold py-2.5 rounded-xl text-xs transition duration-200 shadow-md flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-sm">key</span>
                    <span>কোড যাচাই ও এডমিন মোড চালু করুন</span>
                </button>
            </div>

            <!-- Two Action Buttons -->
            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onclick="toggleMedEmailSection()" class="bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded-xl text-[10.5px] font-bold transition flex items-center justify-center gap-1 active:scale-95">
                    <span class="material-symbols-outlined text-sm text-teal-600 dark:text-teal-400">mail</span>
                    <span>জিমেইল ওটিপি পাঠান</span>
                </button>
                <button type="button" onclick="openMedTotpModal()" class="bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 p-2 rounded-xl text-[10.5px] font-bold transition flex items-center justify-center gap-1 active:scale-95">
                    <span class="material-symbols-outlined text-sm text-teal-600 dark:text-teal-400">qr_code_2</span>
                    <span>Authenticator QR</span>
                </button>
            </div>

            <!-- Collapsible: Send Gmail OTP -->
            <div id="med-email-section" class="hidden space-y-2 text-left bg-gray-50 dark:bg-gray-700/60 p-3 rounded-2xl border border-gray-200 dark:border-gray-600">
                <div class="flex justify-between items-center">
                    <span class="text-[10px] font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                        <span class="material-symbols-outlined text-xs text-teal-600 dark:text-teal-400">send</span> জিমেইলে ওটিপি কোড পাঠান
                    </span>
                    <button type="button" onclick="toggleMedEmailSection()" class="text-gray-400 hover:text-gray-600">
                        <span class="material-symbols-outlined text-xs">close</span>
                    </button>
                </div>
                <div>
                    <label class="text-[9px] font-bold text-gray-500 dark:text-gray-400 block mb-1">এডমিন জিমেইল ঠিকানা</label>
                    <input type="email" id="med-admin-email" placeholder="এডমিন জিমেইল লিখুন..." value="pkmdshuvo48@gmail.com" class="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 dark:text-white rounded-xl font-medium text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">
                </div>
                <button id="med-send-otp-btn" onclick="sendMedAdminOtp()" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5">
                    <span class="material-symbols-outlined text-sm">send</span>
                    <span>জিমেইলে কোড পাঠান</span>
                </button>
                <div id="med-resend-box" class="hidden flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400 pt-1">
                    <button id="med-resend-btn" onclick="sendMedAdminOtp()" class="text-teal-600 dark:text-teal-400 hover:underline font-bold" disabled>পুনরায় পাঠান</button>
                    <span id="med-resend-timer"></span>
                </div>
            </div>

            <p id="med-pass-error" class="text-red-500 font-bold text-xs hidden"></p>
            <p id="med-pass-success" class="text-emerald-600 dark:text-emerald-400 font-bold text-xs hidden"></p>
        </div>
    </div>

    <!-- 📲 Google Authenticator Setup Modal (for Main Medicine Admin) -->
    <div id="med-totp-setup-modal" class="fixed inset-0 bg-black/75 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm hidden">
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 max-w-sm w-full space-y-4 text-center relative">
            <button onclick="closeMedTotpModal()" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1 rounded-full transition">
                <span class="material-symbols-outlined text-xl">close</span>
            </button>
            <div class="w-12 h-12 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <span class="material-symbols-outlined text-2xl">qr_code_scanner</span>
            </div>
            <div>
                <h3 class="text-base font-extrabold text-gray-800 dark:text-white">Google Authenticator সেটআপ</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">iPhone বা যেকোনো ফোনে কোড সেটআপ করার সহজ নিয়ম</p>
            </div>

            <!-- Direct 1-Tap iOS / Mobile Button -->
            <div>
                <a id="med-totp-open-app-btn" href="#" class="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition">
                    <span class="material-symbols-outlined text-base">phone_iphone</span>
                    <span>আইফোনে সরাসরি Authenticator-এ যুক্ত করুন (১-ট্যাপ)</span>
                </a>
                <p class="text-[10px] text-gray-400 mt-1">আইফোনে এই সাইট খোলা থাকলে উপরের বাটনে চাপ দিলেই অ্যাপে অ্যাড হয়ে যাবে</p>
            </div>

            <div class="relative flex py-1 items-center">
                <div class="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                <span class="flex-shrink mx-2 text-[10px] text-gray-400 font-bold uppercase">অথবা কী / QR কোড</span>
                <div class="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            </div>

            <!-- Manual Secret Key for iPhone -->
            <div class="space-y-1 text-left bg-gray-50 dark:bg-gray-700 p-3 rounded-xl border border-gray-200 dark:border-gray-600">
                <div class="flex justify-between items-center">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">ম্যানুয়াল সিক্রেট কী (Setup Key)</span>
                    <span class="text-[9px] text-teal-600 dark:text-teal-400 font-bold">iPhone এর জন্য সবচেয়ে সহজ</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                    <span id="med-totp-secret-text" class="font-mono text-xs font-bold text-teal-800 dark:text-teal-300 tracking-wider select-all break-all">লোড হচ্ছে...</span>
                    <button onclick="copyMedTotpSecret()" class="text-xs bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1 shadow-sm">
                        <span class="material-symbols-outlined text-xs">content_copy</span>
                        <span id="med-copy-btn-text">কপি</span>
                    </button>
                </div>
            </div>

            <!-- QR Code (for scanning from another screen) -->
            <details class="text-left text-xs bg-teal-50/50 dark:bg-teal-950/20 p-2.5 rounded-xl border border-teal-100 dark:border-teal-900 group">
                <summary class="font-bold text-teal-800 dark:text-teal-300 cursor-pointer flex items-center justify-between list-none">
                    <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm">qr_code_2</span> কম্পিউটার থেকে QR কোড স্ক্যান করতে চান?</span>
                    <span class="text-teal-600 dark:text-teal-400 text-xs">ট্যাপ করুন ▾</span>
                </summary>
                <div class="mt-2 pt-2 border-t border-teal-100 dark:border-teal-900 flex flex-col items-center justify-center">
                    <img id="med-totp-qr-img" src="" alt="Google Authenticator QR Code" class="w-40 h-40 rounded-xl border border-teal-200 dark:border-teal-800 p-2 bg-white shadow-sm">
                    <div id="med-totp-qr-loading" class="text-xs text-teal-700 dark:text-teal-400 font-bold flex items-center gap-1 mt-2">
                        <span class="animate-spin">⏳</span> QR কোড লোড হচ্ছে...
                    </div>
                </div>
            </details>

            <div class="text-[11px] text-gray-600 dark:text-gray-300 text-left space-y-1.5 bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-100 dark:border-amber-900/40">
                <p class="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">help</span> iPhone এ কীভাবে করবেন:
                </p>
                <ol class="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300 text-[10.5px] leading-relaxed">
                    <li>উপরে <b>"কপি"</b> বাটনে চাপ দিয়ে সিক্রেট কী-টি কপি করে নিন।</li>
                    <li>আপনার iPhone-এ <b>Google Authenticator</b> অ্যাপে যান (অথবা iPhone Settings > Passwords)।</li>
                    <li>নিচে <b>+</b> আইকনে চাপ দিয়ে <b>"Enter a setup key"</b> দিন।</li>
                    <li>Account-এ লিখুন <b>Amar Khamar</b> এবং Key-এর ঘরে কপি করা কী-টি <b>Paste</b> করে <b>Add</b> বাটনে চাপ দিন। ব্যস কাজ শেষ!</li>
                </ol>
            </div>

            <button onclick="closeMedTotpModal()" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md">
                ঠিক আছে, বুঝতে পেরেছি
            </button>
        </div>
    </div>

    <!-- 📝 Add/Edit Guideline Form Modal (For Authorized Admins) -->
    <div id="med-form-modal" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 my-8 relative">
            <button onclick="closeMedFormModal()" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
                <span class="material-symbols-outlined">close</span>
            </button>
            <h2 id="med-form-title" class="text-base font-extrabold text-teal-700 dark:text-teal-400 flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined">vaccines</span> নতুন গাইডলাইন যোগ করুন
            </h2>
            <form id="med-guideline-form" onsubmit="submitMedGuidelineForm(event)" class="space-y-4">
                <input type="hidden" id="med-form-id">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 block mb-1">ঔষধ/ভ্যাকসিনের নাম</label>
                        <input type="text" id="med-form-name" required placeholder="যেমন: চিনির পানি" class="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 block mb-1">টার্গেট দিন (মুরগির বয়স)</label>
                        <input type="text" id="med-form-day" required placeholder="যেমন: ১-২-৩ বা ৫-৮" class="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 block mb-1">ক্যাটাগরি</label>
                        <select id="med-form-category" required class="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500">
                            <option value="Saline">স্যালাইন ও গ্লুকোজ</option>
                            <option value="Vaccine">ভ্যাকসিন</option>
                            <option value="Antibiotic">অ্যান্টিবায়োটিক</option>
                            <option value="Vitamin">ভিটামিন ও জিংক</option>
                            <option value="Calcium">ক্যালসিয়াম</option>
                            <option value="Deworming">কৃমিনাশক</option>
                            <option value="Others">অন্যান্য</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 block mb-1">মাত্রা ও পরিমাণ</label>
                        <input type="text" id="med-form-dose" required placeholder="যেমন: যত টুকু খেতে পারে" class="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 block mb-1">মুরগির জাত (Breed)</label>
                        <select id="med-form-breed" required class="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500">
                            <option value="Broiler">ব্রয়লার (Broiler)</option>
                            <option value="ColorBird">কালার বার্ড (ColorBird)</option>
                            <option value="Sonali">সোনালি (Sonali)</option>
                            <option value="Deshi">দেশি (Deshi)</option>
                            <option value="All">সব জাতের জন্য</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 block mb-1">প্রয়োগের সময় (Time)</label>
                        <select id="med-form-time" required class="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500">
                            <option value="সকাল">সকাল (Morning)</option>
                            <option value="দুপুর">দুপুর (Noon)</option>
                            <option value="রাত">রাত (Night)</option>
                            <option value="সারাদিন">সারাদিন (All Day)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="text-[10px] font-bold text-gray-400 block mb-1">বিস্তারিত নির্দেশিকা</label>
                    <textarea id="med-form-desc" required placeholder="বি:দ্র: প্রয়োগের পদ্ধতি ও গুরুত্ব লিখুন..." rows="3" class="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"></textarea>
                </div>
                <div class="flex gap-2.5 pt-2">
                    <button type="submit" class="flex-grow bg-teal-600 hover:bg-teal-700 text-white font-bold p-3.5 rounded-xl text-xs transition duration-200 shadow-md active:scale-95">সংরক্ষণ করুন</button>
                    <button type="button" onclick="closeMedFormModal()" class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 font-bold px-4 rounded-xl text-xs transition">বাতিল</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 🎥 Floating Action Button (FAB) for Google Drive Breed Videos -->
    <div id="med-video-fab-container" class="fixed bottom-20 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
        <button onclick="playCurrentBreedVideo()" id="med-video-fab-btn" class="group flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white rounded-full shadow-2xl shadow-red-600/50 transform transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white dark:border-gray-800 focus:outline-none" title="ভিডিও গাইড দেখুন">
            <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span class="material-symbols-outlined text-2xl font-black transition-transform group-hover:scale-110">play_circle</span>
            <span id="med-video-fab-text" class="text-xs font-black tracking-wide pr-1">ব্রয়লার ভিডিও</span>
        </button>
    </div>

    <!-- 🎥 Video Link Editor Modal (For Admin) -->
    <div id="med-video-edit-modal" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
        <div class="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 space-y-4 relative">
            <button onclick="closeMedVideoEditModal()" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div class="flex items-center gap-2.5 text-red-600 dark:text-red-400 font-bold text-base">
                <span class="material-symbols-outlined text-2xl">video_settings</span>
                <h3>জাতভিত্তিক ভিডিও লিংক পরিবর্তন</h3>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">প্রতিটি জাতের জন্য গুগল ড্রাইভ বা ইউটিউব ভিডিওর লিংক সেট করুন।</p>
            <form id="med-video-links-form" onsubmit="saveBreedVideoLinks(event)" class="space-y-3 pt-2">
                <div>
                    <label class="text-[11px] font-bold text-gray-600 dark:text-gray-300 block mb-1">ব্রয়লার (Broiler) ভিডিও লিংক:</label>
                    <input type="text" id="video-link-Broiler" placeholder="https://drive.google.com/file/d/..." class="w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-500">
                </div>
                <div>
                    <label class="text-[11px] font-bold text-gray-600 dark:text-gray-300 block mb-1">কালার বার্ড (ColorBird) ভিডিও লিংক:</label>
                    <input type="text" id="video-link-ColorBird" placeholder="https://drive.google.com/file/d/..." class="w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-500">
                </div>
                <div>
                    <label class="text-[11px] font-bold text-gray-600 dark:text-gray-300 block mb-1">সোনালি (Sonali) ভিডিও লিংক:</label>
                    <input type="text" id="video-link-Sonali" placeholder="https://drive.google.com/file/d/..." class="w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-500">
                </div>
                <div>
                    <label class="text-[11px] font-bold text-gray-600 dark:text-gray-300 block mb-1">দেশি (Deshi) ভিডিও লিংক:</label>
                    <input type="text" id="video-link-Deshi" placeholder="https://drive.google.com/file/d/..." class="w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-500">
                </div>
                <div class="flex gap-2.5 pt-2">
                    <button type="submit" class="flex-grow bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded-xl text-xs transition duration-200 shadow-md active:scale-95">সংরক্ষণ করুন</button>
                    <button type="button" onclick="closeMedVideoEditModal()" class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 font-bold px-4 rounded-xl text-xs transition">বাতিল</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Reusable Beautiful Confirmation Modal for Medicine -->
    <div id="med-confirm-modal" class="hidden fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-700 transform transition scale-100 duration-150">
            <div class="flex items-center gap-3 text-amber-600 mb-3" id="medConfirmIconContainer">
                <span class="material-symbols-outlined text-3xl font-extrabold" id="medConfirmIcon">help</span>
                <h3 class="text-base font-extrabold text-gray-800 dark:text-white" id="medConfirmTitle">নিশ্চিতকরণ</h3>
            </div>
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-6 leading-relaxed" id="medConfirmMessage">আপনি কি এই কাজটি করতে চান?</p>
            <div class="flex gap-3 justify-end">
                <button onclick="closeMedCustomConfirm()" class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-650 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold transition">বাতিল</button>
                <button id="medConfirmYesBtn" class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-md active:scale-95">হ্যাঁ, নিশ্চিত করুন</button>
            </div>
        </div>
    </div>
</div>
`;

// ২. আদর্শ পোল্ট্রি টিকা ও ঔষধ গাইডলাইন ডেটা (সমৃদ্ধ ৪টি ভিন্ন ব্রিডের প্রফেশনাল ডাটা)
const standardSchedule = [
    // --- Broiler (ব্রয়লার) ---
    { day: 1, name: "চিনির পানি বা গ্লুকোজ স্যালাইন", category: "Saline", dose: "১০ গ্রাম প্রতি লিটার পানিতে", desc: "বাচ্চা খামারে আসার পর প্রথম ২-৩ ঘণ্টা খাওয়াতে হবে। এটি ক্লান্তি দূর করে ও এনার্জি দেয়।", breed: "Broiler", time: "সকাল" },
    { day: 1, name: "মাল্টিভিটামিন (ভিটামিন সি)", category: "Vitamin", dose: "১ গ্রাম প্রতি ৩ লিটার পানিতে", desc: "স্যালাইনের পর সারা দিন ও রাতে হালকা মাল্টিভিটামিন পানি দিতে হবে স্ট্রেস কমানোর জন্য।", breed: "Broiler", time: "সারাদিন" },
    { day: 2, name: "এনফ্লোক্স ভেট (অ্যান্টিবায়োটিক)", category: "Antibiotic", dose: "১ মিলি ২ লিটার পানিতে", desc: "ব্যাকটেরিয়াজনিত সংক্রমণ এবং নাভি কাঁচা থাকা রোধ করতে টানা ৩ দিন সকালের পানিতে দিতে হবে।", breed: "Broiler", time: "সকাল" },
    { day: 3, name: "ভিটামিন ও অ্যামিনো অ্যাসিড", category: "Vitamin", dose: "১ মিলি প্রতি ২ লিটার পানিতে", desc: "৩য় দিন থেকে ৫ম দিন পর্যন্ত মুরগির দৈহিক বৃদ্ধি এবং পালক গজানোর জন্য দিতে হবে।", breed: "Broiler", time: "দুপুর" },
    { day: 5, name: "বিসিআরডিভি (BCRDV) রাণীকক্ষেত ১ম টিকা", category: "Vaccine", dose: "১ ফোঁটা প্রতি চোখে", desc: "রাণীকক্ষেত ও ব্রঙ্কাইটিস রোগ প্রতিরোধে ১ম ডোজ চোখের ফোঁটা হিসেবে দিতে হবে। অবশ্যই ঠাণ্ডা আবহাওয়ায় দিবেন।", breed: "Broiler", time: "সকাল" },
    { day: 10, name: "গাম্বোরো টিকা (Gumboro - ১ম ডোজ)", category: "Vaccine", dose: "১ ফোঁটা চোখে বা পানির সাথে", desc: "গাম্বোরো বা আইবিডি রোগ প্রতিরোধে ১ম ডোজ দিতে হবে। পানির পাত্র ভালো করে ধুয়ে ঠাণ্ডা পানি ব্যবহার করুন।", breed: "Broiler", time: "সকাল" },
    { day: 12, name: "ভিটামিন বি কমপ্লেক্স", category: "Vitamin", dose: "১ মিলি প্রতি ১ লিটার পানিতে", desc: "গাম্বোরো টিকার ধকল কাটাতে এবং হজমশক্তি বাড়াতে ২ দিন দুপুর ও রাতে দিন।", breed: "Broiler", time: "দুপুর" },
    { day: 17, name: "গাম্বোরো বুস্টার টিকা (২য় ডোজ)", category: "Vaccine", dose: "পানির সাথে মিশিয়ে", desc: "গাম্বোরো রোগ প্রতিরোধ ক্ষমতা শতভাগ নিশ্চিত করতে ২য় ডোজ বুস্টার টিকা দিন।", breed: "Broiler", time: "সকাল" },
    { day: 20, name: "ক্যালসিয়াম ও ভিটামিন ডি৩", category: "Calcium", dose: "২ মিলি প্রতি লিটার পানিতে", desc: "মুরগির হাড় শক্ত করতে এবং প্যারালাইসিস বা ল্যাংড়া হওয়া রোধ করতে টানা ৫ দিন দিন।", breed: "Broiler", time: "রাত" },
    { day: 24, name: "বিসিআরডিভি বুস্টার টিকা (২য় ডোজ)", category: "Vaccine", dose: "পানির সাথে মিশিয়ে", desc: "রাণীকক্ষেত রোগের দীর্ঘমেয়াদী সুরক্ষার জন্য ২য় ডোজ বুস্টার টিকা পানির সাথে মিশিয়ে খাওয়ান।", breed: "Broiler", time: "সকাল" },
    { day: 28, name: "কৃমিনাশক ঔষধ (Dewormer)", category: "Deworming", dose: "১ গ্রাম প্রতি লিটার পানিতে", desc: "কৃমি দূর করার জন্য সকালে খালি পেটে ৪ ঘণ্টা পানির সাথে খাওয়াতে হবে। পরদিন অবশ্যই লিভার টনিক দিতে হবে।", breed: "Broiler", time: "সকাল" },
    { day: 29, name: "লিভার টনিক (Liver Tonic)", category: "Others", dose: "১ মিলি প্রতি লিটার পানিতে", desc: "কৃমিনাশক ঔষধ ব্যবহারের পর লিভার সুরক্ষায় টানা ৩ দিন দুপুর ও রাতের পানিতে দিন।", breed: "Broiler", time: "সারাদিন" },

    // --- Sonali (সোনালি) ---
    { day: 1, name: "স্যালাইন ও গ্লুকোজ পানি", category: "Saline", dose: "১০ গ্রাম প্রতি লিটার পানিতে", desc: "সোনালি বাচ্চা খামারে আসার পর ক্লান্তি দূরীকরণে প্রথম ৩ ঘণ্টা দিন।", breed: "Sonali", time: "সকাল" },
    { day: 2, name: "অ্যামোক্সিসিলিন অ্যান্টিবায়োটিক", category: "Antibiotic", dose: "১ গ্রাম প্রতি লিটার পানিতে", desc: "বাচ্চার নাভি শুকানো এবং ব্যাকটেরিয়া সংক্রমণ রোধে টানা ৩ দিন দিন।", breed: "Sonali", time: "সকাল" },
    { day: 5, name: "BCRDV রাণীকক্ষেত ১ম টিকা", category: "Vaccine", dose: "১ ফোঁটা বাম চোখে", desc: "সোনালি বাচ্চার ১ম রাণীকক্ষেত টিকা। চোখে সরাসরি ড্রপার দিয়ে ১ ফোঁটা দিন।", breed: "Sonali", time: "সকাল" },
    { day: 11, name: "গাম্বোরো ১ম টিকা", category: "Vaccine", dose: "১ ফোঁটা চোখে বা পানির সাথে", desc: "গাম্বোরো রোগ প্রতিরোধে পানির সাথে অথবা চোখে সরাসরি দিন।", breed: "Sonali", time: "সকাল" },
    { day: 14, name: "গাম্বোরো বুস্টার টিকা", category: "Vaccine", dose: "পানির সাথে মিশিয়ে", desc: "১ম টিকার ৪ দিন পর বুস্টার ডোজ প্রদান করা আবশ্যক।", breed: "Sonali", time: "সকাল" },
    { day: 18, name: "BCRDV রাণীকক্ষেত বুস্টার টিকা", category: "Vaccine", dose: "পানির সাথে মিশিয়ে", desc: "রাণীকক্ষেত রোগের পূর্ণ সুরক্ষায় সোনালি মুরগির ২য় বুস্টার ডোজ পানির সাথে খাওয়ান।", breed: "Sonali", time: "সকাল" },
    { day: 24, name: "ফাউল পক্স টিকা (Fowl Pox)", category: "Vaccine", dose: "ডানার চামড়ার নিচে সুই ফুটিয়ে", desc: "বসন্ত বা পক্স রোগ প্রতিরোধে ডানার নরম চামড়ায় সূঁচ ফুটিয়ে স্পেশাল ব্রাশ দিয়ে প্রয়োগ করুন।", breed: "Sonali", time: "সকাল" },
    { day: 30, name: "কৃমিনাশক ও লিভার সুরক্ষক", category: "Deworming", dose: "১ গ্রাম প্রতি ২ লিটার পানিতে", desc: "৩০তম দিনে সোনালি মুরগিকে কৃমিনাশক দিন। পরবর্তী ৩ দিন লিভার টনিক খাওয়াতে হবে।", breed: "Sonali", time: "সকাল" },
    { day: 35, name: "ক্যালসিয়াম ও জিংক থেরাপি", category: "Calcium", dose: "২ মিলি প্রতি লিটার পানিতে", desc: "হাড় ও পালকের গঠনের জন্য ৫ দিন ক্যালসিয়াম এবং জিংক মিশিয়ে খাওয়ান।", breed: "Sonali", time: "দুপুর" },

    // --- Color Bird (কালার বার্ড) ---
    { day: 1, name: "স্যালাইন ও ভিটামিন সি", category: "Saline", dose: "১ গ্রাম প্রতি লিটার পানিতে", desc: "প্রথম ৩ ঘণ্টা স্যালাইন এবং পরবর্তী সারা দিন ভিটামিন সি মিশ্রিত হালকা পানি দিন।", breed: "ColorBird", time: "সকাল" },
    { day: 2, name: "সিপ্রোফ্লক্সাসিন অ্যান্টিবায়োটিক", category: "Antibiotic", dose: "১ মিলি প্রতি লিটার পানিতে", desc: "বাচ্চা সুস্থ ও নাভি শুকনো রাখতে ব্যাকটেরিয়ানাশক টানা ৩ দিন খাওয়াতে হবে।", breed: "ColorBird", time: "সকাল" },
    { day: 5, name: "BCRDV রাণীকক্ষেত টিকা", category: "Vaccine", dose: "১ ফোঁটা প্রতি চোখে", desc: "ঠাণ্ডা এবং শান্ত পরিবেশে চোখে এক ফোঁটা করে দিয়ে ৫ সেকেন্ড ধরে রাখুন।", breed: "ColorBird", time: "সকাল" },
    { day: 12, name: "গাম্বোরো ১ম টিকা", category: "Vaccine", dose: "পানির সাথে মিশিয়ে", desc: "পানির পাত্র ভালো করে ধুয়ে ব্লিচিং বা সাবান ছাড়া সাধারণ ঠাণ্ডা পানিতে মিশিয়ে খাওয়ান।", breed: "ColorBird", time: "সকাল" },
    { day: 18, name: "গাম্বোরো ২য় বুস্টার টিকা", category: "Vaccine", dose: "পানির সাথে মিশিয়ে", desc: "২য় ডোজ হিসেবে গাম্বোরো বুস্টার পানির সাথে দিন।", breed: "ColorBird", time: "সকাল" },
    { day: 28, name: "ক্যালসিয়াম ও জিংক সিরাপ", category: "Calcium", dose: "১.৫ মিলি প্রতি লিটার পানিতে", desc: "দৈহিক বৃদ্ধি দ্রুত করতে এবং পালক মসৃণ রাখতে সাহায্য করবে।", breed: "ColorBird", time: "দুপুর" },
    { day: 35, name: "কৃমিনাশক কোর্স", category: "Deworming", dose: "১ গ্রাম প্রতি লিটার পানিতে", desc: "সকালে খালি পেটে ৩-৪ ঘণ্টা পানির সাথে খাওয়ান। কোর্স শেষে লিভার টনিক দিতে ভুলবেন না।", breed: "ColorBird", time: "সকাল" },

    // --- Deshi (দেশি) ---
    { day: 1, name: "মধু বা চিনির পানি", category: "Saline", dose: "১ চামচ প্রতি গ্লাস পানিতে", desc: "দেশি মুরগির বাচ্চার প্রথম দিনের খাবার হিসেবে মধু মিশ্রিত পানি অত্যন্ত উপকারী।", breed: "Deshi", time: "সকাল" },
    { day: 2, name: "মাল্টিভিটামিন থেরাপি", category: "Vitamin", dose: "১ মিলি প্রতি ২ লিটার পানিতে", desc: "দেশি বাচ্চার রোগ প্রতিরোধ ক্ষমতা বাড়াতে প্রথম ৩ দিন দুপুর ও রাতের পানিতে দিন।", breed: "Deshi", time: "সারাদিন" },
    { day: 5, name: "বিসিআরডিভি (BCRDV) রাণীকক্ষেত টিকা", category: "Vaccine", dose: "১ ফোঁটা চোখে", desc: "দেশি মুরগির প্রথম এবং প্রধান টিকা। রাণীকক্ষেত থেকে বাঁচতে এটি আবশ্যক।", breed: "Deshi", time: "সকাল" },
    { day: 15, name: "গাম্বোরো টিকা (দেশি মুরগি)", category: "Vaccine", dose: "চোখে বা পানিতে", desc: "দেশি বাচ্চার গাম্বোরো সুরক্ষায় পানির পাত্রে মিশিয়ে দিন।", breed: "Deshi", time: "সকাল" },
    { day: 30, name: "ফাউল পক্স (বসন্তের টিকা)", category: "Vaccine", dose: "ডানার চামড়ায় পাংচার করে", desc: "দেশি মুরগিতে বসন্তের উপদ্বব বেশি হয়। ৩০তম দিনে ডানার চামড়ায় বসন্তের সুই ফুটিয়ে টিকা দিন।", breed: "Deshi", time: "সকাল" },
    { day: 45, name: "কৃমিনাশক কোর্স ও লিভার টনিক", category: "Deworming", dose: "১ গ্রাম প্রতি লিটার পানিতে", desc: "দেশি মুরগিতে ৪৫তম দিনে প্রথম কৃমিনাশক দিন। পরবর্তী ৩ দিন লিভার টনিক দিবেন।", breed: "Deshi", time: "সকাল" }
];

let adminSchedules = [];
try {
    const cachedSched = localStorage.getItem('cached_medicine_schedule');
    if (cachedSched) {
        adminSchedules = JSON.parse(cachedSched);
        if (!Array.isArray(adminSchedules)) adminSchedules = [];
    }
} catch (e) {
    console.warn("Failed to load cached medicine schedules", e);
    adminSchedules = [];
}
let currentBreedFilter = 'Broiler';
let medicineAdminModeEnabled = false;

// Custom Confirmation Dialog helper
let medConfirmCallback = null;
function showMedCustomConfirm(title, message, isDangerous, onConfirm) {
    const titleEl = document.getElementById("medConfirmTitle");
    const msgEl = document.getElementById("medConfirmMessage");
    const icon = document.getElementById("medConfirmIcon");
    const iconContainer = document.getElementById("medConfirmIconContainer");
    const yesBtn = document.getElementById("medConfirmYesBtn");
    const modal = document.getElementById("med-confirm-modal");

    if (titleEl) titleEl.innerText = title;
    if (msgEl) msgEl.innerText = message;
    
    if (isDangerous) {
        if (icon) icon.innerText = "warning";
        if (iconContainer) iconContainer.className = "flex items-center gap-3 text-red-600 mb-3";
        if (yesBtn) yesBtn.className = "px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-md active:scale-95";
    } else {
        if (icon) icon.innerText = "help";
        if (iconContainer) iconContainer.className = "flex items-center gap-3 text-teal-600 mb-3";
        if (yesBtn) yesBtn.className = "px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-md active:scale-95";
    }
    
    medConfirmCallback = onConfirm;
    if (modal) modal.classList.remove("hidden");
}

function closeMedCustomConfirm() {
    const modal = document.getElementById("med-confirm-modal");
    if (modal) modal.classList.add("hidden");
    medConfirmCallback = null;
}

// ২.২ এডমিন ডাটাবেজ কানেকশন
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
            adminSchedules = Object.entries(data).map(([id, val]) => ({ id, ...val }))
                .sort((a, b) => a.day - b.day);
        } else {
            adminSchedules = [];
        }
        
        // লোকাল স্টোরেজে সংরক্ষণ (অফলাইনেও যেন শুধু ইউজার/এডমিনের ডাটা থাকে)
        try {
            localStorage.setItem('cached_medicine_schedule', JSON.stringify(adminSchedules));
        } catch (err) {
            console.warn("Failed to cache medicine schedule", err);
        }
        
        // গাইড ট্যাব বা ভিউ রিফ্রেশ
        const schedListView = document.getElementById('schedule-list-view');
        if (schedListView) {
            renderScheduleTimeline();
        }
    }, error => {
        console.warn("Database connection error, keeping local cache:", error);
        try {
            const cachedSched = localStorage.getItem('cached_medicine_schedule');
            if (cachedSched) {
                adminSchedules = JSON.parse(cachedSched);
                if (!Array.isArray(adminSchedules)) adminSchedules = [];
            }
        } catch (e) {}
        renderScheduleTimeline();
    });

    // স্ক্রলিং টেক্সট ও স্ট্যাটাস লিসেনার
    let medScrollText = "";
    let medScrollStatus = true;

    function updateMedScrollingBar() {
        const scrollingBar = document.getElementById("med-scrolling-bar");
        if (scrollingBar) {
            if (medScrollStatus && medScrollText && medScrollText.trim() !== "") {
                scrollingBar.textContent = medScrollText;
            } else {
                scrollingBar.textContent = "রিয়েল-টাইম গাইডলাইন ও টিকা শিডিউল";
            }
        }
    }

    targetDb.ref("admin_scroll_text").on("value", snapshot => {
        let val = snapshot.val() || "";
        // Clean up any 👻📌 prefix if present
        val = val.replace(/👻📌/g, '');
        if (val.includes("প্রতিদিনের ওষুধ")) {
            val = "প্রতিদিনের ওষুধ সময়মতো দিতে ভুলবেন না 🐔";
        }
        medScrollText = val;
        updateMedScrollingBar();
    });

    targetDb.ref("admin_scroll_status").on("value", snapshot => {
        const val = snapshot.val();
        medScrollStatus = (val !== false);
        updateMedScrollingBar();
    });
}

// ৪. ওষধ ট্র্যাকিং গ্লোবাল স্টেট ও মেথডসমূহ
let completedMedicinesMap = {};
let currentTrackingFilter = 'all';

function setTrackingFilter(filter) {
    currentTrackingFilter = filter;
    
    const filters = ['all', 'remaining', 'completed'];
    filters.forEach(f => {
        const btn = document.getElementById(`tab-track-${f}`);
        if (btn) {
            if (f === filter) {
                btn.className = "flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-200 bg-white dark:bg-gray-700 text-teal-700 dark:text-teal-400 shadow-sm active:scale-95";
            } else {
                btn.className = "flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50 active:scale-95";
            }
        }
    });

    renderScheduleTimeline();
}

function initCompletedMedicinesListener(userId) {
    if (!userId) return;
    
    // লোকাল ক্যাশ লোড করা (অফলাইন সাপোর্ট)
    const cached = localStorage.getItem(`completed_meds_${userId}`);
    if (cached) {
        try {
            completedMedicinesMap = JSON.parse(cached);
        } catch (e) {
            console.warn("Error parsing cached completed medicines", e);
        }
    }
    
    if (targetDb) {
        targetDb.ref(`users/${userId}/completed_medicines`).on('value', snapshot => {
            completedMedicinesMap = snapshot.val() || {};
            localStorage.setItem(`completed_meds_${userId}`, JSON.stringify(completedMedicinesMap));
            renderScheduleTimeline();
        }, error => {
            console.warn("Using offline cached completed medicines:", error);
            renderScheduleTimeline();
        });
    } else {
        renderScheduleTimeline();
    }
}

function showToastMessage(msg) {
    if (typeof showToast === 'function') {
        showToast(msg);
    } else if (typeof window.showToast === 'function') {
        window.showToast(msg);
    } else if (typeof parent.showToast === 'function') {
        parent.showToast(msg);
    } else {
        alert(msg);
    }
}

async function toggleMedicineCompletion(itemKey, isCompleted) {
    const userId = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.uid : null;
    if (!userId) {
        showToastMessage("⚠️ ট্র্যাকিং সুবিধা ব্যবহার করতে প্রথমে সাইন-ইন/লগইন করুন!");
        return;
    }

    if (isCompleted) {
        completedMedicinesMap[itemKey] = {
            timestamp: Date.now(),
            markedAt: new Date().toISOString()
        };
        showToastMessage("✅ ওষুধটি সফলভাবে ব্যবহৃত মার্ক করা হয়েছে");
    } else {
        delete completedMedicinesMap[itemKey];
        showToastMessage("🔄 ওষুধের ট্র্যাকিং পুনরায় সেট করা হয়েছে");
    }
    localStorage.setItem(`completed_meds_${userId}`, JSON.stringify(completedMedicinesMap));
    renderScheduleTimeline();

    if (targetDb) {
        try {
            if (isCompleted) {
                await targetDb.ref(`users/${userId}/completed_medicines/${itemKey}`).set({
                    timestamp: firebase.database.ServerValue.TIMESTAMP || Date.now(),
                    markedAt: new Date().toISOString()
                });
            } else {
                await targetDb.ref(`users/${userId}/completed_medicines/${itemKey}`).remove();
            }
        } catch (error) {
            console.error("Error saving medicine track status:", error);
        }
    }
}

// Auth State Hooks
if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged(user => {
        if (user) {
            initCompletedMedicinesListener(user.uid);
        } else {
            completedMedicinesMap = {};
            renderScheduleTimeline();
        }
    });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    initCompletedMedicinesListener(user.uid);
                } else {
                    completedMedicinesMap = {};
                    renderScheduleTimeline();
                }
            });
        }
    });
}

// ৩. পেজ ইনজেক্ট করা
document.addEventListener('DOMContentLoaded', () => {
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
        mainApp.insertAdjacentHTML('beforeend', medicinePageHTML);
        
        // সেটআপ কাস্টম কনফার্ম বোতামের ইভেন্ট লিসেনার
        const confirmYesBtn = document.getElementById("medConfirmYesBtn");
        if (confirmYesBtn) {
            confirmYesBtn.addEventListener("click", () => {
                if (typeof medConfirmCallback === "function") {
                    medConfirmCallback();
                }
                closeMedCustomConfirm();
            });
        }

        // চেক করুন ব্যাকএন্ড সেশন ভ্যালিড আছে কিনা
        checkMedAdminSession();

        // ভিডিও লিংক ইনিশিয়ালাইজ করুন
        initBreedVideoLinks();
        updateVideoFabLabel();

        // গ্লোবাল ক্লিক লিসেনার ড্রপডাউন বন্ধ করার জন্য (যাতে কোনো clashing না হয়)
        document.addEventListener('click', (event) => {
            const dropdown = document.getElementById("med-menu-dropdown");
            const trigger = document.getElementById("med-menu-trigger");
            if (dropdown && !dropdown.classList.contains('hidden')) {
                if (!dropdown.contains(event.target) && (!trigger || !trigger.contains(event.target))) {
                    dropdown.classList.add('hidden');
                }
            }
        });
    }
});

// ৪. মেইন লজিক
let allShipmentsData = {};
let activeShipmentAgeDays = null;
let activeMedShipmentId = '';

const medCategories = {
    'Saline': { icon: '🥤', label: 'স্যালাইন ও গ্লুকোজ', color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900', cardBg: 'bg-amber-50/20 dark:bg-amber-950/5 border-amber-100 dark:border-amber-900/50' },
    'Vaccine': { icon: '💉', label: 'ভ্যাকসিন', color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900', cardBg: 'bg-blue-50/10 dark:bg-blue-950/5 border-blue-100 dark:border-blue-900/50' },
    'Antibiotic': { icon: '💊', label: 'অ্যান্টিবায়োটিক', color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900', cardBg: 'bg-red-50/10 dark:bg-red-950/5 border-red-100 dark:border-red-900/50' },
    'Vitamin': { icon: '🍏', label: 'ভিটামিন ও জিংক', color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-900', cardBg: 'bg-purple-50/10 dark:bg-purple-950/5 border-purple-100 dark:border-purple-900/50' },
    'Calcium': { icon: '🦴', label: 'ক্যালসিয়াম', color: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900', cardBg: 'bg-orange-50/10 dark:bg-orange-950/5 border-orange-100 dark:border-orange-900/50' },
    'Deworming': { icon: '🐛', label: 'কৃমিনাশক', color: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900', cardBg: 'bg-yellow-50/10 dark:bg-yellow-950/5 border-yellow-100 dark:border-yellow-900/50' },
    'Others': { icon: '📦', label: 'অন্যান্য', color: 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700', cardBg: 'bg-gray-50/50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700' }
};

const medTimeBadges = {
    'সকাল': 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50',
    'দুপুর': 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/50',
    'রাত': 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50',
    'সারাদিন': 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900/50'
};

function openMedicinePage() {
    navigateToTab('medicine-page');
}

// Hamburger menu toggle
function toggleMedicineMenu(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById("med-menu-dropdown");
    if (dropdown) {
        dropdown.classList.toggle("hidden");
    }
}

// Handle Hamburger Menu selections
function clickMedMenu(type) {
    const dropdown = document.getElementById("med-menu-dropdown");
    if (dropdown) dropdown.classList.add("hidden"); // Close dropdown safely
    
    if (type === 'profile') {
        navigateToTab('settings-page');
    } else if (type === 'refresh') {
        loadMedicineShipmentDropdowns();
        renderScheduleTimeline();
        alert("🔄 সফলভাবে রিফ্রেশ করা হয়েছে!");
    } else if (type === 'video_edit') {
        openMedVideoEditModal();
    } else if (type === 'admin') {
        if (medicineAdminModeEnabled) {
            disableAdminMode();
            showToastMessage("🔒 এডমিন মোড নিষ্ক্রিয় করা হয়েছে!");
        } else {
            openMedPasswordModal();
        }
    }
}

let medAdminCurrentEnteredEmail = "";

// 📱 Client-Side Google Authenticator TOTP (RFC 6238) for GitHub Pages & Offline PWA
const DEFAULT_MED_TOTP_SECRET = "OBD7DB7O3NMBUX5EOD6OW47RDF77W7VT";
const DEFAULT_MED_TOTP_FORMATTED = "OBD7 DB7O 3NMB UX5E OD6O W47R DF77 W7VT";
const DEFAULT_MED_OTPAUTH_URL = "otpauth://totp/Amar%20Khamar:pkmdshuvo48%40gmail.com?secret=OBD7DB7O3NMBUX5EOD6OW47RDF77W7VT&issuer=Amar%20Khamar";
const DEFAULT_MED_QR_URL = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=" + encodeURIComponent(DEFAULT_MED_OTPAUTH_URL);

let currentMedTotpSecret = DEFAULT_MED_TOTP_SECRET;

function base32ToBytes(base32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    const clean = (base32 || '').toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
    for (let i = 0; i < clean.length; i++) {
        const val = chars.indexOf(clean[i]);
        if (val === -1) return null;
        bits += val.toString(2).padStart(5, '0');
    }
    const bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.substr(i, 8), 2));
    }
    return new Uint8Array(bytes);
}

async function generateTotpCode(secret, epochSeconds = Math.floor(Date.now() / 1000), timeStep = 30) {
    try {
        if (!window.crypto || !crypto.subtle) return null;
        const keyBytes = base32ToBytes(secret);
        if (!keyBytes) return null;
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyBytes,
            { name: 'HMAC', hash: 'SHA-1' },
            false,
            ['sign']
        );

        const counter = Math.floor(epochSeconds / timeStep);
        const counterBuffer = new ArrayBuffer(8);
        const view = new DataView(counterBuffer);
        view.setUint32(0, Math.floor(counter / 0x100000000));
        view.setUint32(4, counter >>> 0);

        const signature = await crypto.subtle.sign('HMAC', cryptoKey, counterBuffer);
        const sigBytes = new Uint8Array(signature);
        const offset = sigBytes[sigBytes.length - 1] & 0x0f;

        const binary =
            ((sigBytes[offset] & 0x7f) << 24) |
            ((sigBytes[offset + 1] & 0xff) << 16) |
            ((sigBytes[offset + 2] & 0xff) << 8) |
            (sigBytes[offset + 3] & 0xff);

        return (binary % 1000000).toString().padStart(6, '0');
    } catch (e) {
        console.error("Client TOTP generation error:", e);
        return null;
    }
}

async function verifyClientTotp(inputCode, secret = DEFAULT_MED_TOTP_SECRET, tolerance = 1) {
    const cleanCode = (inputCode || '').trim().replace(/\s+/g, '');
    if (cleanCode.length !== 6) return false;
    const currentStep = Math.floor(Date.now() / 1000 / 30);
    for (let i = -tolerance; i <= tolerance; i++) {
        const code = await generateTotpCode(secret, (currentStep + i) * 30);
        if (code === cleanCode) return true;
    }
    return false;
}

function openMedPasswordModal() {
    const modal = document.getElementById("med-password-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    document.getElementById("med-pass-error").classList.add("hidden");
    document.getElementById("med-pass-success").classList.add("hidden");
    const otpInput = document.getElementById("med-admin-otp-input");
    if (otpInput) {
        otpInput.value = "";
        setTimeout(() => otpInput.focus(), 150);
    }
}

function closeMedPasswordModal() {
    const modal = document.getElementById("med-password-modal");
    if (modal) modal.classList.add("hidden");
    document.getElementById("med-pass-error").classList.add("hidden");
    document.getElementById("med-pass-success").classList.add("hidden");
}

function toggleMedEmailSection() {
    const sec = document.getElementById("med-email-section");
    if (sec) {
        sec.classList.toggle("hidden");
        if (!sec.classList.contains("hidden")) {
            const emailInp = document.getElementById("med-admin-email");
            if (emailInp) emailInp.focus();
        }
    }
}

function openMedTotpModal() {
    const modal = document.getElementById("med-totp-setup-modal");
    if (!modal) return;
    modal.classList.remove("hidden");

    currentMedTotpSecret = DEFAULT_MED_TOTP_SECRET;

    const qrImg = document.getElementById("med-totp-qr-img");
    const loading = document.getElementById("med-totp-qr-loading");
    const secretText = document.getElementById("med-totp-secret-text");
    const appBtn = document.getElementById("med-totp-open-app-btn");

    // INSTANTLY render default values so it NEVER gets stuck on "লোড হচ্ছে..."!
    if (secretText) {
        secretText.textContent = DEFAULT_MED_TOTP_FORMATTED;
    }
    if (appBtn) {
        appBtn.href = DEFAULT_MED_OTPAUTH_URL;
    }
    if (qrImg) {
        qrImg.src = DEFAULT_MED_QR_URL;
        qrImg.classList.remove("hidden");
        if (loading) loading.classList.add("hidden");
    }

    // Sync from server if available
    fetch('/api/admin/totp-setup?_t=' + Date.now()).then(r => r.json()).then(data => {
        if (data && data.success) {
            currentMedTotpSecret = data.secret;
            if (secretText) secretText.textContent = data.secretFormatted || data.secret;
            const directBtn = document.getElementById("med-totp-open-app-btn");
            if (directBtn && data.otpauthUrl) {
                directBtn.href = data.otpauthUrl;
            }
            if (qrImg && data.qrCode) {
                qrImg.src = data.qrCode;
                qrImg.classList.remove("hidden");
                if (loading) loading.classList.add("hidden");
            }
        }
    }).catch(e => {
        // Fallback already visible
    });
}

function closeMedTotpModal() {
    const modal = document.getElementById("med-totp-setup-modal");
    if (modal) modal.classList.add("hidden");
}

function copyMedTotpSecret() {
    if (!currentMedTotpSecret) return;
    navigator.clipboard.writeText(currentMedTotpSecret).then(() => {
        const btnText = document.getElementById("med-copy-btn-text");
        if (btnText) {
            btnText.textContent = "✅ কপি হয়েছে!";
            setTimeout(() => {
                btnText.textContent = "কপি";
            }, 2000);
        }
    }).catch(() => {
        alert("সিক্রেট কী: " + currentMedTotpSecret);
    });
}

let medResendTimer = null;
function startMedResendCountdown(seconds = 30) {
    const resendBtn = document.getElementById("med-resend-btn");
    const timerSpan = document.getElementById("med-resend-timer");
    if (!resendBtn || !timerSpan) return;
    
    resendBtn.disabled = true;
    let remaining = seconds;
    if (medResendTimer) clearInterval(medResendTimer);

    timerSpan.textContent = `(${remaining}s)`;
    medResendTimer = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            clearInterval(medResendTimer);
            timerSpan.textContent = "";
            resendBtn.disabled = false;
        } else {
            timerSpan.textContent = `(${remaining}s)`;
        }
    }, 1000);
}

// 🛡️ Helper: Admin Email Verification (SHA-256 Hash & Obfuscated check)
const AUTH_ADMIN_HASH = "09bee536b2d1a9aa7b381a3f572e4c1492db86ff689a9597ba263fbec638cd57";
const getAdminTargetEmail = () => atob("cGttZHNodXZvNDhAZ21haWwuY29t");

async function isAuthorizedAdminEmail(email) {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    try {
        if (window.crypto && crypto.subtle) {
            const buffer = new TextEncoder().encode(clean);
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
            if (hashHex === AUTH_ADMIN_HASH) return true;
        }
    } catch (e) {}
    return clean === getAdminTargetEmail();
}

let medAdminLocalOtp = null;

// 📩 Send OTP to user-entered Admin Gmail
async function sendMedAdminOtp() {
    const errEl = document.getElementById("med-pass-error");
    const succEl = document.getElementById("med-pass-success");
    errEl.classList.add("hidden");
    succEl.classList.add("hidden");

    const emailInput = document.getElementById("med-admin-email");
    const rawEmail = (emailInput ? emailInput.value : "").trim();
    const email = rawEmail.toLowerCase();

    if (!email) {
        errEl.textContent = "❌ অনুগ্রহ করে আপনার এডমিন জিমেইল লিখুন!";
        errEl.classList.remove("hidden");
        return;
    }

    // 🛡️ STRICT WHITELIST: Only registered admin email is allowed!
    const isAuth = await isAuthorizedAdminEmail(email);
    if (!isAuth) {
        errEl.textContent = "❌ অননুমোদিত জিমেইল! শুধুমাত্র নিবন্ধিত এডমিন অ্যাকাউন্ট দিয়ে কোড পাঠানো সম্ভব।";
        errEl.classList.remove("hidden");
        return;
    }

    medAdminCurrentEnteredEmail = email;

    const sendBtn = document.getElementById("med-send-otp-btn");
    const origText = sendBtn.innerHTML;
    sendBtn.disabled = true;
    sendBtn.innerHTML = `<span class="inline-block animate-spin">⏳</span> জিমেইলে ওটিপি পাঠানো হচ্ছে...`;

    // 1. Generate secure 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    medAdminLocalOtp = {
        email: email,
        code: generatedOtp,
        expiresAt: expiresAt
    };

    try {
        sessionStorage.setItem("med_admin_otp_cache", JSON.stringify(medAdminLocalOtp));
        localStorage.setItem("med_admin_otp_cache", JSON.stringify(medAdminLocalOtp));
    } catch (e) {}

    // 2. Sync to Firebase Realtime Database
    if (typeof firebase !== 'undefined' && firebase.database) {
        try {
            firebase.database().ref("admin_config/otp_verification").set({
                email: email,
                otp: generatedOtp,
                expiresAt: expiresAt,
                createdAt: Date.now()
            });
        } catch (fbErr) {
            console.warn("Firebase RTDB OTP sync notice:", fbErr);
        }
    }

    // 3. Dispatch email: Try Server API first (if hosted on server), with FormSubmit fallback for GitHub Pages
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        fetch('/api/admin/send-code?_t=' + Date.now(), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email: email }),
            signal: controller.signal
        }).then(r => clearTimeout(timeoutId)).catch(e => {
            clearTimeout(timeoutId);
        });
    } catch (e) {}

    // 4. Client-side FormSubmit AJAX delivery directly to admin Gmail (works on GitHub Pages)
    try {
        fetch("https://formsubmit.co/ajax/" + getAdminTargetEmail(), {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: "🔐 আমার খামার - এডমিন ওটিপি কোড: " + generatedOtp,
                email: email,
                "ওটিপি_কোড": generatedOtp,
                "মেয়াদ": "১০ মিনিট",
                "বার্তা": "আপনার 'আমার খামার' এডমিন প্যানেলের ৬ ডিজিটের ওটিপি ভেরিফিকেশন কোড হলো: " + generatedOtp + "। কোডটি কারো সাথে শেয়ার করবেন না।"
            })
        }).catch(err => console.warn("FormSubmit notice:", err));
    } catch (e) {}

    // 5. SUCCESS: Focus 6-digit input and show timer
    succEl.textContent = "✅ আপনার এডমিন জিমেইলে ৬ ডিজিটের ওটিপি কোড পাঠানো হয়েছে! ইনবক্স চেক করে ওপরের বক্সে কোডটি লিখুন।";
    succEl.classList.remove("hidden");

    const resendBox = document.getElementById("med-resend-box");
    if (resendBox) resendBox.classList.remove("hidden");

    startMedResendCountdown(15);
    setTimeout(() => {
        const inp = document.getElementById("med-admin-otp-input");
        if (inp) {
            inp.value = "";
            inp.focus();
        }
    }, 100);

    sendBtn.disabled = false;
    sendBtn.innerHTML = origText;
}

// 🔑 Verify OTP & Unlock Admin Mode (Google Authenticator TOTP or Gmail OTP)
async function verifyMedAdminOtp() {
    const errEl = document.getElementById("med-pass-error");
    const succEl = document.getElementById("med-pass-success");
    errEl.classList.add("hidden");
    succEl.classList.add("hidden");

    const input = document.getElementById("med-admin-otp-input");
    const code = (input ? input.value : "").trim();

    if (!code || code.length !== 6) {
        errEl.textContent = "❌ অনুগ্রহ করে ৬ ডিজিটের সম্পূর্ণ কোড লিখুন!";
        errEl.classList.remove("hidden");
        return;
    }

    const verifyBtn = document.getElementById("med-verify-otp-btn");
    const origText = verifyBtn.innerHTML;
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = `<span class="inline-block animate-spin">⏳</span> যাচাই করা হচ্ছে...`;

    let isSuccess = false;
    let token = null;
    let successMessage = "🔓 সফলভাবে এডমিন মোড সক্রিয় হয়েছে!";

    // A. Check server endpoint first (handles Google Authenticator TOTP & active Gmail OTP)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const email = medAdminCurrentEnteredEmail || getAdminTargetEmail();
        const response = await fetch('/api/admin/verify-code?_t=' + Date.now(), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, code }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const data = await response.json();
            if (data && data.success) {
                isSuccess = true;
                token = data.token;
                if (data.message) successMessage = "🔓 " + data.message;
            } else if (data && data.error) {
                errEl.textContent = "❌ " + data.error;
                errEl.classList.remove("hidden");
                verifyBtn.disabled = false;
                verifyBtn.innerHTML = origText;
                return;
            }
        }
    } catch (apiErr) {
        console.warn("Server verify endpoint error:", apiErr);
    }

    // B. Client-side Google Authenticator validation (Works on GitHub Pages & offline PWA)
    if (!isSuccess) {
        try {
            const isClientTotpOk = await verifyClientTotp(code, currentMedTotpSecret || DEFAULT_MED_TOTP_SECRET);
            if (isClientTotpOk) {
                isSuccess = true;
                token = "admin_totp_" + Date.now();
                successMessage = "🔓 Google Authenticator দিয়ে সফলভাবে যাচাই হয়েছে!";
            }
        } catch (totpErr) {
            console.warn("Client TOTP verification notice:", totpErr);
        }
    }

    // C. Check local / session storage OTP cache (matches code sent to authorized Gmail)
    if (!isSuccess) {
        try {
            const raw = sessionStorage.getItem("med_admin_otp_cache") || localStorage.getItem("med_admin_otp_cache");
            if (raw) {
                const stored = JSON.parse(raw);
                if (stored && stored.code === code && Date.now() <= stored.expiresAt) {
                    isSuccess = true;
                    token = "admin_session_token_" + Date.now();
                    successMessage = "🔓 জিমেইল ওটিপি দিয়ে সফলভাবে যাচাই হয়েছে!";
                }
            }
        } catch (e) {}
    }

    // D. Check Firebase Realtime Database
    if (!isSuccess && typeof firebase !== 'undefined' && firebase.database) {
        try {
            const snap = await firebase.database().ref("admin_config/otp_verification").once("value");
            const val = snap.val();
            if (val && val.otp === code && Date.now() <= val.expiresAt) {
                isSuccess = true;
                token = "admin_firebase_token_" + Date.now();
                successMessage = "🔓 ওটিপি দিয়ে সফলভাবে যাচাই হয়েছে!";
            }
        } catch (fbErr) {
            console.warn("Firebase OTP check notice:", fbErr);
        }
    }

    if (!isSuccess) {
        errEl.textContent = "❌ ভুল কোড! আপনার Google Authenticator অ্যাপের চলতি কোড অথবা জিমেইলের ওটিপি কোডটি দিন।";
        errEl.classList.remove("hidden");
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = origText;
        return;
    }

    // SUCCESS: Invalidate stored OTP to prevent replay
    sessionStorage.removeItem("med_admin_otp_cache");
    localStorage.removeItem("med_admin_otp_cache");

    // Enable Admin Mode
    localStorage.setItem("amarhisab_admin_token", token || ("admin_token_" + Date.now()));
    localStorage.setItem("admin_authenticated_shuvo", "true");

    enableAdminMode();
    closeMedPasswordModal();
    showToastMessage(successMessage);

    verifyBtn.disabled = false;
    verifyBtn.innerHTML = origText;
}

async function checkMedAdminSession() {
    const token = localStorage.getItem("amarhisab_admin_token");
    const isAuth = localStorage.getItem("admin_authenticated_shuvo");

    // Invalidate any old unauthorized master session token immediately
    if (token && token.startsWith("admin_master_")) {
        localStorage.removeItem("amarhisab_admin_token");
        localStorage.removeItem("admin_authenticated_shuvo");
        disableAdminMode();
        return;
    }

    if (!token && isAuth !== "true") {
        disableAdminMode();
        return;
    }

    // Keep authenticated state active
    if (isAuth === "true") {
        enableAdminMode();
    }

    if (token && !token.startsWith("admin_local_") && !token.startsWith("admin_totp_")) {
        try {
            const response = await fetch('/api/admin/check-session', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token })
            });
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                const data = await response.json();
                if (data && data.authenticated === false) {
                    disableAdminMode();
                }
            }
        } catch (err) {
            console.warn("Session check notice in medicine.js:", err);
        }
    }
}

function enableAdminMode() {
    medicineAdminModeEnabled = true;
    const badge = document.getElementById("med-admin-badge");
    if (badge) badge.classList.remove("hidden");
    
    const userBadge = document.getElementById("med-user-status-badge");
    if (userBadge) {
        userBadge.innerText = "এডমিন";
        userBadge.className = "text-xs bg-red-600 text-white px-2.5 py-1 rounded-full font-bold shadow-sm";
    }

    const menuBtn = document.getElementById("med-menu-admin-btn");
    if (menuBtn) {
        menuBtn.innerHTML = `<span class="material-symbols-outlined text-lg">lock_open</span><span>এডমিন লগআউট</span>`;
    }

    const videoEditMenuBtn = document.getElementById("med-menu-video-edit-btn");
    if (videoEditMenuBtn) videoEditMenuBtn.classList.remove("hidden");

    const videoAdminBtn = document.getElementById("med-video-admin-btn");
    if (videoAdminBtn) videoAdminBtn.classList.remove("hidden");

    const addBtn = document.getElementById("med-add-btn");
    if (addBtn) addBtn.classList.remove("hidden");

    renderScheduleTimeline();
}

async function disableAdminMode() {
    medicineAdminModeEnabled = false;
    const token = localStorage.getItem("amarhisab_admin_token");
    try {
        if (token) {
            await fetch('/api/admin/logout', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token })
            });
        }
    } catch (e) {}
    localStorage.removeItem("amarhisab_admin_token");
    localStorage.removeItem("admin_authenticated_shuvo");

    const badge = document.getElementById("med-admin-badge");
    if (badge) badge.classList.add("hidden");

    const userBadge = document.getElementById("med-user-status-badge");
    if (userBadge) {
        userBadge.innerText = "ইউজার";
        userBadge.className = "text-xs bg-white/10 px-2.5 py-1 rounded-full font-bold backdrop-blur-sm shadow-inner";
    }

    const menuBtn = document.getElementById("med-menu-admin-btn");
    if (menuBtn) {
        menuBtn.innerHTML = `<span class="material-symbols-outlined text-lg">lock</span><span>এডমিন লগইন</span>`;
    }

    const videoEditMenuBtn = document.getElementById("med-menu-video-edit-btn");
    if (videoEditMenuBtn) videoEditMenuBtn.classList.add("hidden");

    const videoAdminBtn = document.getElementById("med-video-admin-btn");
    if (videoAdminBtn) videoAdminBtn.classList.add("hidden");

    const addBtn = document.getElementById("med-add-btn");
    if (addBtn) addBtn.classList.add("hidden");

    renderScheduleTimeline();
}

// 🎥 Breed Video Guide Links & FAB Logic
let breedVideoLinks = {
    'Broiler': 'https://drive.google.com/file/d/1ErsItnwlAp3miAbUdC-KTNR3OnHQmm5l/preview',
    'ColorBird': 'https://drive.google.com/file/d/1jmpt5J-nsFFLiHfTAglke4UpF_uhBYLe/preview',
    'Sonali': 'https://drive.google.com/file/d/1ErsItnwlAp3miAbUdC-KTNR3OnHQmm5l/preview',
    'Deshi': 'https://drive.google.com/file/d/1ErsItnwlAp3miAbUdC-KTNR3OnHQmm5l/preview'
};

function initBreedVideoLinks() {
    try {
        const cached = localStorage.getItem('cached_breed_video_links');
        if (cached) {
            breedVideoLinks = { ...breedVideoLinks, ...JSON.parse(cached) };
        }
    } catch (e) {}

    if (targetDb) {
        targetDb.ref('breed_video_links').on('value', snapshot => {
            const data = snapshot.val();
            if (data) {
                breedVideoLinks = { ...breedVideoLinks, ...data };
                try {
                    localStorage.setItem('cached_breed_video_links', JSON.stringify(breedVideoLinks));
                } catch (e) {}
            }
            updateVideoFabLabel();
        }, error => {
            console.warn("Breed video links offline fallback:", error);
        });
    }
}

function getBreedVideoUrl(breed) {
    const targetBreed = breed || currentBreedFilter || 'Broiler';
    return breedVideoLinks[targetBreed] || breedVideoLinks['Broiler'] || 'https://drive.google.com/file/d/1ErsItnwlAp3miAbUdC-KTNR3OnHQmm5l/preview';
}

function updateVideoFabLabel() {
    const breedLabels = {
        'Broiler': 'ব্রয়লার ভিডিও',
        'ColorBird': 'কালার বার্ড ভিডিও',
        'Sonali': 'সোনালি ভিডিও',
        'Deshi': 'দেশি ভিডিও'
    };
    const label = document.getElementById('med-video-fab-text');
    if (label) {
        label.innerText = breedLabels[currentBreedFilter] || 'ভিডিও গাইড';
    }
}

function playCurrentBreedVideo() {
    const breed = currentBreedFilter || 'Broiler';
    const url = getBreedVideoUrl(breed);
    if (typeof openVideoModal === 'function') {
        openVideoModal(breed, url);
    } else {
        window.open(url, '_blank');
    }
}

function openMedVideoEditModal() {
    if (!medicineAdminModeEnabled) {
        alert("🔒 ভিডিও লিংক পরিবর্তন করতে এডমিন মোড সক্রিয় থাকতে হবে!");
        return;
    }
    const tabIds = ['Broiler', 'ColorBird', 'Sonali', 'Deshi'];
    tabIds.forEach(breed => {
        const input = document.getElementById(`video-link-${breed}`);
        if (input) {
            input.value = breedVideoLinks[breed] || '';
        }
    });
    const modal = document.getElementById("med-video-edit-modal");
    if (modal) modal.classList.remove("hidden");
}

function closeMedVideoEditModal() {
    const modal = document.getElementById("med-video-edit-modal");
    if (modal) modal.classList.add("hidden");
}

async function saveBreedVideoLinks(e) {
    e.preventDefault();
    if (!medicineAdminModeEnabled) {
        alert("🔒 সংরক্ষণ করতে এডমিন মোড সক্রিয় থাকতে হবে!");
        return;
    }

    const updated = {
        'Broiler': document.getElementById('video-link-Broiler').value.trim() || breedVideoLinks['Broiler'],
        'ColorBird': document.getElementById('video-link-ColorBird').value.trim() || breedVideoLinks['ColorBird'],
        'Sonali': document.getElementById('video-link-Sonali').value.trim() || breedVideoLinks['Sonali'],
        'Deshi': document.getElementById('video-link-Deshi').value.trim() || breedVideoLinks['Deshi']
    };

    breedVideoLinks = updated;
    try {
        localStorage.setItem('cached_breed_video_links', JSON.stringify(updated));
    } catch (err) {}

    if (targetDb) {
        try {
            await targetDb.ref('breed_video_links').set(updated);
            alert("✅ ভিডিও লিংকগুলো সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!");
        } catch (err) {
            console.error(err);
            alert("⚠️ ক্লাউডে সেভ করতে সমস্যা হয়েছে, তবে লোকালি আপডেট হয়েছে!");
        }
    } else {
        alert("✅ ভিডিও লিংক লোকালি সেভ হয়েছে!");
    }
    closeMedVideoEditModal();
    updateVideoFabLabel();
}

// Breed Tab selection logic
function setBreedFilter(breed) {
    currentBreedFilter = breed;
    const tabIds = ['Broiler', 'ColorBird', 'Sonali', 'Deshi'];
    
    tabIds.forEach(id => {
        const btn = document.getElementById(`tab-breed-${id}`);
        if (btn) {
            if (id === breed) {
                btn.className = "px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border bg-teal-700 text-white border-teal-700 shadow-sm active:scale-95";
            } else {
                btn.className = "px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 active:scale-95";
            }
        }
    });

    updateVideoFabLabel();
    renderScheduleTimeline();
}

// Search field filtering logic
let medSearchQuery = '';
function searchMedicineGuidelines() {
    const input = document.getElementById('med-search-input');
    const clearBtn = document.getElementById('med-search-clear');
    if (input) {
        medSearchQuery = input.value.trim().toLowerCase();
        if (clearBtn) {
            if (medSearchQuery) clearBtn.classList.remove('hidden');
            else clearBtn.classList.add('hidden');
        }
        renderScheduleTimeline();
    }
}

function clearMedSearch() {
    const input = document.getElementById('med-search-input');
    const clearBtn = document.getElementById('med-search-clear');
    if (input) {
        input.value = '';
        medSearchQuery = '';
        if (clearBtn) clearBtn.classList.add('hidden');
        renderScheduleTimeline();
    }
}

// Determine the current active shipment's age in the background for day coloring
function loadMedicineShipmentDropdowns() {
    if (!currentUser) {
        activeShipmentAgeDays = null;
        renderScheduleTimeline();
        return;
    }

    db.ref(`users/${currentUser.uid}/shipments`).once('value', snapshot => {
        const data = snapshot.val();
        allShipmentsData = data || {};
        
        if (data) {
            const entries = Object.entries(data);
            if (entries.length > 0) {
                // Sort by startDate to get the latest/most recent active shipment
                entries.sort((a, b) => new Date(b[1].startDate) - new Date(a[1].startDate));
                const latestShipment = entries[0][1];
                
                const start = new Date(latestShipment.startDate);
                const today = new Date();
                const diffTime = today - start;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                activeShipmentAgeDays = diffDays > 0 ? diffDays : 0;
            } else {
                activeShipmentAgeDays = null;
            }
        } else {
            activeShipmentAgeDays = null;
        }
        renderScheduleTimeline();
    });
}

// দিন অনুযায়ী চমৎকার এবং গাঢ় কালার থিম নির্ধারণ করা
function getDayColorTheme(dayNum) {
    const themes = [
        // Theme 0: Emerald/Green
        {
            badgeBg: 'bg-emerald-600 dark:bg-emerald-700',
            badgeBorder: 'border-emerald-500 dark:border-emerald-600',
            textColor: 'text-emerald-700 dark:text-emerald-400',
            cardBg: 'bg-emerald-50/75 dark:bg-emerald-950/15',
            cardBorder: 'border-2 border-emerald-300 dark:border-emerald-800',
            noteBg: 'bg-emerald-50/50 dark:bg-emerald-950/5 border border-emerald-200/50 dark:border-emerald-900/30',
            accent: 'emerald'
        },
        // Theme 1: Blue/Sky
        {
            badgeBg: 'bg-blue-600 dark:bg-blue-700',
            badgeBorder: 'border-blue-500 dark:border-blue-600',
            textColor: 'text-blue-700 dark:text-blue-400',
            cardBg: 'bg-blue-50/75 dark:bg-blue-950/15',
            cardBorder: 'border-2 border-blue-300 dark:border-blue-800',
            noteBg: 'bg-blue-50/50 dark:bg-blue-950/5 border border-blue-200/50 dark:border-blue-900/30',
            accent: 'blue'
        },
        // Theme 2: Gold/Amber
        {
            badgeBg: 'bg-amber-600 dark:bg-amber-700',
            badgeBorder: 'border-amber-500 dark:border-amber-600',
            textColor: 'text-amber-700 dark:text-amber-400',
            cardBg: 'bg-amber-50/75 dark:bg-amber-950/15',
            cardBorder: 'border-2 border-amber-300 dark:border-amber-800',
            noteBg: 'bg-amber-50/50 dark:bg-amber-950/5 border border-amber-200/50 dark:border-amber-900/30',
            accent: 'amber'
        },
        // Theme 3: Rose/Pink
        {
            badgeBg: 'bg-rose-600 dark:bg-rose-700',
            badgeBorder: 'border-rose-500 dark:border-rose-600',
            textColor: 'text-rose-700 dark:text-rose-400',
            cardBg: 'bg-rose-50/75 dark:bg-rose-950/15',
            cardBorder: 'border-2 border-rose-300 dark:border-rose-800',
            noteBg: 'bg-rose-50/50 dark:bg-rose-950/5 border border-rose-200/50 dark:border-rose-900/30',
            accent: 'rose'
        },
        // Theme 4: Purple/Violet
        {
            badgeBg: 'bg-purple-600 dark:bg-purple-700',
            badgeBorder: 'border-purple-500 dark:border-purple-600',
            textColor: 'text-purple-700 dark:text-purple-400',
            cardBg: 'bg-purple-50/75 dark:bg-purple-950/15',
            cardBorder: 'border-2 border-purple-300 dark:border-purple-800',
            noteBg: 'bg-purple-50/50 dark:bg-purple-950/5 border border-purple-200/50 dark:border-purple-900/30',
            accent: 'purple'
        },
        // Theme 5: Violet/Indigo
        {
            badgeBg: 'bg-indigo-600 dark:bg-indigo-700',
            badgeBorder: 'border-indigo-500 dark:border-indigo-600',
            textColor: 'text-indigo-700 dark:text-indigo-400',
            cardBg: 'bg-indigo-50/75 dark:bg-indigo-950/15',
            cardBorder: 'border-2 border-indigo-300 dark:border-indigo-800',
            noteBg: 'bg-indigo-50/50 dark:bg-indigo-950/5 border border-indigo-200/50 dark:border-indigo-900/30',
            accent: 'indigo'
        },
        // Theme 6: Orange
        {
            badgeBg: 'bg-orange-600 dark:bg-orange-700',
            badgeBorder: 'border-orange-500 dark:border-orange-600',
            textColor: 'text-orange-700 dark:text-orange-400',
            cardBg: 'bg-orange-50/75 dark:bg-orange-950/15',
            cardBorder: 'border-2 border-orange-300 dark:border-orange-800',
            noteBg: 'bg-orange-50/50 dark:bg-orange-950/5 border border-orange-200/50 dark:border-orange-900/30',
            accent: 'orange'
        }
    ];
    return themes[(dayNum - 1) % themes.length];
}

// গাইড ও শিডিউল রেন্ডার করা
function renderScheduleTimeline() {
    const sView = document.getElementById('schedule-list-view');
    if (!sView) return;
    sView.innerHTML = '';

    // শুধুমাত্র সংরক্ষিত ডাটাবেজ/ক্যাশের তালিকা ব্যবহার হবে
    let activeSchedulesList = adminSchedules || [];

    // ০. ব্রিড অনুযায়ী নোটিফিকেশন ট্যাবগুলির কাউন্ট আপডেট করা
    const breedSchedules = activeSchedulesList.filter(item => !item.breed || item.breed === 'All' || item.breed === currentBreedFilter);
    let totalMeds = breedSchedules.length;
    let completedMeds = 0;
    
    breedSchedules.forEach(item => {
        const itemKey = item.id || ('std_' + item.day + '_' + item.name.replace(/\s+/g, '_') + '_' + (item.time || ''));
        if (completedMedicinesMap[itemKey]) {
            completedMeds++;
        }
    });
    
    let remainingMeds = totalMeds - completedMeds;

    const countAll = document.getElementById('count-track-all');
    const countRemaining = document.getElementById('count-track-remaining');
    const countCompleted = document.getElementById('count-track-completed');
    if (countAll) countAll.innerText = totalMeds;
    if (countRemaining) countRemaining.innerText = remainingMeds;
    if (countCompleted) countCompleted.innerText = completedMeds;

    // ১. ফিল্টারিং করুন জাত ও সার্চ কুয়েরি এবং ট্র্যাকিং ফিল্টার অনুযায়ী
    let filteredSchedules = activeSchedulesList.filter(item => {
        // ব্রিড ম্যাচিং (All বা সিলেক্টেড ব্রিড)
        const matchesBreed = !item.breed || item.breed === 'All' || item.breed === currentBreedFilter;
        
        // সার্চ কোয়েরি ম্যাচিং (নাম, দিন বা বিবরণ)
        const matchesSearch = !medSearchQuery || 
            (item.name && item.name.toLowerCase().includes(medSearchQuery)) ||
            (item.desc && item.desc.toLowerCase().includes(medSearchQuery)) ||
            (item.day && String(item.day).includes(medSearchQuery)) ||
            (item.time && item.time.toLowerCase().includes(medSearchQuery));

        if (!matchesBreed || !matchesSearch) return false;

        const itemKey = item.id || ('std_' + item.day + '_' + item.name.replace(/\s+/g, '_') + '_' + (item.time || ''));
        const isCompleted = !!completedMedicinesMap[itemKey];

        if (currentTrackingFilter === 'remaining') {
            return !isCompleted;
        } else if (currentTrackingFilter === 'completed') {
            return isCompleted;
        }
        return true;
    });

    if (filteredSchedules.length === 0) {
        let seedButtonHtml = '';
        if (medicineAdminModeEnabled && adminSchedules.length === 0) {
            seedButtonHtml = `
            <div class="mt-4">
                <button onclick="autoSeedSchedules()" class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-md active:scale-95 flex items-center justify-center gap-1.5 mx-auto">
                    <span class="material-symbols-outlined text-sm">auto_awesome</span>
                    ডিফল্ট গাইডলাইন লোড করুন
                </button>
            </div>`;
        }
        
        let emptyMessage = "কোনো ঔষধ বা ভ্যাকসিন গাইডলাইন যুক্ত করা নেই।";
        if (currentTrackingFilter === 'remaining') {
            emptyMessage = "🎉 চমৎকার! আপনার কোনো ঔষধ বাকি নেই।";
        } else if (currentTrackingFilter === 'completed') {
            emptyMessage = "আপনি এখনও কোনো ঔষধ ব্যবহার করা হয়েছে মার্ক করেননি।";
        }

        sView.innerHTML = `
            <div class="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/80 p-6 shadow-sm animate-[fadeIn_0.3s_ease-out]">
                <span class="material-symbols-outlined text-5xl text-teal-600/30 mb-3 animate-pulse">vaccines</span>
                <p class="text-sm font-bold text-gray-500 dark:text-gray-400">${emptyMessage}</p>
                <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-1">জাত: ${currentBreedFilter === 'ColorBird' ? 'কালার বার্ড' : currentBreedFilter === 'Sonali' ? 'সোনালি' : currentBreedFilter === 'Deshi' ? 'দেশি' : 'ব্রয়লার'} এবং সার্চ: "${medSearchQuery || 'সব'}"</p>
                ${seedButtonHtml}
            </div>`;
        return;
    }

    // ২. দিন অনুযায়ী গ্রুপ করা
    const groupedSchedules = {};
    filteredSchedules.forEach(item => {
        const day = item.day || 1;
        if (!groupedSchedules[day]) {
            groupedSchedules[day] = [];
        }
        groupedSchedules[day].push(item);
    });

    // ৩. গ্রুপ অনুযায়ী সাজিয়ে রেন্ডার করা
    const sortedDays = Object.keys(groupedSchedules).sort((a, b) => parseInt(a) - parseInt(b));

    sortedDays.forEach(day => {
        const theme = getDayColorTheme(parseInt(day));

        // দিন বিভাজক হেডার
        let dayStatusHtml = '';
        let dayBadgeClass = `${theme.badgeBg} text-white text-xs font-black px-4.5 py-2 rounded-full shadow-lg border-2 ${theme.badgeBorder}`;
        
        if (activeShipmentAgeDays !== null) {
            const dayNum = parseInt(day);
            if (activeShipmentAgeDays === dayNum) {
                dayStatusHtml = `<span class="bg-emerald-600 text-white border-2 border-emerald-400 text-[10px] sm:text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-pulse scale-105"><span class="w-2 h-2 rounded-full bg-white animate-ping"></span>আজকের বয়স</span>`;
                dayBadgeClass = `${theme.badgeBg} text-white text-xs font-black px-5 py-2.5 rounded-full shadow-xl border-2 ${theme.badgeBorder} ring-4 ring-emerald-500/20 scale-105`;
            } else if (activeShipmentAgeDays > dayNum) {
                dayStatusHtml = `<span class="bg-slate-700 text-slate-200 text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full shadow-sm border border-slate-600">অতিক্রান্ত</span>`;
                dayBadgeClass = 'bg-slate-800 text-slate-300 text-xs font-extrabold px-4 py-1.5 rounded-full shadow-md border border-slate-600 opacity-75';
            } else {
                dayStatusHtml = `<span class="bg-blue-600 text-white text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full shadow-md border border-blue-500">আসন্ন</span>`;
                dayBadgeClass = `${theme.badgeBg} text-white text-xs font-extrabold px-4.5 py-1.5 rounded-full shadow-md border-2 ${theme.badgeBorder}`;
            }
        }

        let dayHeaderHtml = `
        <div class="flex items-center justify-between gap-3 my-6 pt-4">
            <div class="flex items-center gap-3">
                <span class="${dayBadgeClass}">
                    দিন ${day}
                </span>
                ${dayStatusHtml}
            </div>
            <div class="flex-grow border-t-2 border-dashed border-teal-500/30 dark:border-teal-500/20"></div>
        </div>`;
        
        sView.innerHTML += dayHeaderHtml;

        // দিনের সকল কার্ড রেন্ডার করা
        groupedSchedules[day].forEach(item => {
            const catInfo = medCategories[item.category] || medCategories['Others'];
            const timeBadgeClass = medTimeBadges[item.time || 'সকাল'] || medTimeBadges['সকাল'];
            const itemTime = item.time || 'সকাল';

            // হাইলাইট বর্ডার ও ব্যাকগ্রাউন্ড (কালার গাঢ় দেখা যায়)
            let extraBorderClass = `${theme.cardBorder} ${theme.cardBg}`;
            let glowClass = 'shadow-md';
            if (activeShipmentAgeDays !== null) {
                const dayNum = parseInt(day);
                if (activeShipmentAgeDays === dayNum) {
                    extraBorderClass = `${theme.cardBorder.replace('border-2', 'border-[3px]')} ${theme.cardBg} ring-4 ring-emerald-500/20`;
                    glowClass = 'shadow-xl scale-[1.015]';
                } else if (activeShipmentAgeDays > dayNum) {
                    extraBorderClass = `${theme.cardBorder} ${theme.cardBg} opacity-80`;
                    glowClass = 'shadow-sm';
                }
            }

            // এডমিন কন্ট্রোল বাটন
            let adminActionsHtml = '';
            if (medicineAdminModeEnabled && item.id) {
                adminActionsHtml = `
                <div class="flex items-center gap-1 flex-shrink-0">
                    <button onclick="editMedGuideline('${item.id}')" class="p-1.5 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700 transition" title="এডিট করুন">
                        <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onclick="deleteMedGuideline('${item.id}')" class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700 transition" title="ডিলিট করুন">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>`;
            }

            const itemKey = item.id || ('std_' + item.day + '_' + item.name.replace(/\s+/g, '_') + '_' + (item.time || ''));
            const isCompleted = !!completedMedicinesMap[itemKey];

            // Completion state indicators
            let completionBadgeHtml = '';
            let completionActionHtml = '';
            
            if (isCompleted) {
                completionBadgeHtml = `
                <span class="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm animate-[scaleIn_0.2s_ease-out]">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ব্যবহৃত হয়েছে
                </span>`;
                
                completionActionHtml = `
                <div class="flex items-center justify-between w-full bg-emerald-50/50 dark:bg-emerald-950/20 px-4 py-3 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/10 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <span class="material-symbols-outlined text-emerald-500 font-black text-sm">done</span>
                        </div>
                        <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300">ওষুধটি দেওয়া সম্পন্ন হয়েছে</span>
                    </div>
                    <button onclick="toggleMedicineCompletion('${itemKey}', false)" class="text-[10px] font-black text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 flex items-center gap-1 transition-colors py-1 px-2.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-150 dark:border-gray-700 active:scale-95">
                        <span class="material-symbols-outlined text-xs font-bold">undo</span>
                        বাতিল করুন
                    </button>
                </div>`;
            } else {
                completionBadgeHtml = `
                <span class="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-xl border border-amber-200/50 dark:border-amber-900/30 shadow-sm">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    বাকি আছে
                </span>`;
                
                completionActionHtml = `
                <button onclick="toggleMedicineCompletion('${itemKey}', true)" class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-black rounded-2xl text-xs transition-all shadow-md shadow-teal-500/15 hover:shadow-lg active:scale-[0.98] border border-teal-500/20">
                    <span class="material-symbols-outlined text-sm font-black">done_all</span>
                    ব্যবহার করা হয়েছে মার্ক করুন
                </button>`;
            }

            const cardHtml = `
            <div class="p-5 rounded-3xl border-2 transition-all duration-300 ${extraBorderClass} ${glowClass} space-y-4 hover:shadow-lg animate-[fadeIn_0.3s_ease-out] ${isCompleted ? 'bg-emerald-500/5 dark:bg-emerald-950/5 border-emerald-500/30 dark:border-emerald-500/20' : ''}">
                <div class="flex justify-between items-start gap-2">
                    <div class="flex items-center gap-3">
                        <!-- Custom Medicine Bottle Icon Design -->
                        <div class="w-11 h-11 rounded-2xl bg-white dark:bg-gray-800 border-2 ${isCompleted ? 'border-emerald-500' : 'border-emerald-500/30'} flex items-center justify-center flex-shrink-0 shadow-md">
                            <span class="material-symbols-outlined ${isCompleted ? 'text-emerald-500' : 'text-emerald-600/70'} font-black text-2xl">medical_services</span>
                        </div>
                        <div>
                            <h3 class="font-black text-gray-850 dark:text-white text-sm sm:text-base leading-tight ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500 font-bold' : ''}">${item.name}</h3>
                            <div class="flex items-center gap-1.5 mt-1">
                                <span class="text-[9px] uppercase font-black tracking-wider ${theme.textColor} bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                    ${catInfo.label}
                                </span>
                                ${item.breed === 'All' ? '<span class="text-[9px] bg-teal-600 text-white px-2 py-0.5 rounded-lg font-black shadow-sm">সব জাত</span>' : ''}
                                ${completionBadgeHtml}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <span class="text-[10px] font-black px-2.5 py-1 rounded-xl border shadow-sm ${timeBadgeClass}">
                            ${itemTime}
                        </span>
                        ${adminActionsHtml}
                    </div>
                </div>
                
                <!-- Dosage/Amount Section -->
                <div class="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200 font-extrabold bg-white/70 dark:bg-gray-800/70 p-3 rounded-2xl border border-gray-200/50 shadow-sm">
                    <span class="material-symbols-outlined text-[18px] text-teal-600 dark:text-teal-400 font-bold flex-shrink-0">hourglass_empty</span>
                    <span class="truncate">পরিমাণ: <span class="font-black text-teal-700 dark:text-teal-400">${item.dose || 'যথাযথা মাত্রায়'}</span></span>
                </div>

                <!-- Special Note / Desc Section (Highlighted in Red exactly like image) -->
                <div class="flex items-start gap-2 text-xs text-red-700 dark:text-red-400 bg-red-50/70 dark:bg-red-950/20 p-3 rounded-2xl border border-red-200 dark:border-red-900/30 shadow-sm font-bold">
                    <span class="material-symbols-outlined text-sm text-red-500 mt-0.5 flex-shrink-0 font-extrabold">info</span>
                    <span><strong class="text-red-800 dark:text-red-300">বি:দ্র:</strong> ${item.desc}</span>
                </div>

                <!-- Completion Interactive Toggle Bar -->
                <div class="flex gap-2.5 pt-1">
                    ${completionActionHtml}
                </div>
            </div>`;
            
            sView.innerHTML += cardHtml;
        });
    });
}

// Seeding Default Veterinary guidelines automatically
async function autoSeedSchedules() {
    if (!medicineAdminModeEnabled) {
        alert("🔒 এটি করতে এডমিন লগইন করা প্রয়োজন!");
        return;
    }
    if (!targetDb) {
        alert("🔒 ডাটাবেজ সংযোগ বিচ্ছিন্ন!");
        return;
    }
    showMedCustomConfirm(
        "ডিফল্ট গাইডলাইন আপলোড", 
        "আপনি কি নিশ্চিত যে সকল ব্রিডের ডিফল্ট প্রফেশনাল গাইডলাইন ডাটাবেজে আপলোড করতে চান?", 
        false, 
        async () => {
            try {
                await targetDb.ref("medicine_schedule").remove();
                const promises = [];
                for (const item of standardSchedule) {
                    promises.push(targetDb.ref("medicine_schedule").push(item));
                }
                await Promise.all(promises);
                alert("✅ সফলভাবে সকল ব্রিডের জন্য ডিফল্ট গাইডলাইন ডাটাবেজে লোড হয়েছে!");
            } catch (error) {
                console.error("Seeding error:", error);
                alert("❌ লোড করতে সমস্যা হয়েছে! ইন্টারনেট কানেকশন চেক করুন।");
            }
        }
    );
}

// Modal control for adding/editing guidelines
function openMedFormModal() {
    if (!medicineAdminModeEnabled) {
        alert("🔒 গাইডলাইন অ্যাড করতে এডমিন মোড সক্রিয় থাকতে হবে!");
        return;
    }
    document.getElementById("med-guideline-form").reset();
    document.getElementById("med-form-id").value = "";
    document.getElementById("med-form-title").innerHTML = `<span class="material-symbols-outlined">vaccines</span> নতুন গাইডলাইন যোগ করুন`;
    document.getElementById("med-form-modal").classList.remove("hidden");
}

function closeMedFormModal() {
    document.getElementById("med-form-modal").classList.add("hidden");
}

function editMedGuideline(id) {
    if (!medicineAdminModeEnabled) {
        alert("🔒 এডিট করতে এডমিন মোড সক্রিয় থাকতে হবে!");
        return;
    }
    const item = adminSchedules.find(x => x.id === id);
    if (!item) return;

    document.getElementById("med-form-id").value = item.id;
    document.getElementById("med-form-name").value = item.name || '';
    document.getElementById("med-form-day").value = item.day || '';
    document.getElementById("med-form-category").value = item.category || 'Saline';
    document.getElementById("med-form-dose").value = item.dose || '';
    document.getElementById("med-form-breed").value = item.breed || 'Broiler';
    document.getElementById("med-form-time").value = item.time || 'সকাল';
    document.getElementById("med-form-desc").value = item.desc || '';

    document.getElementById("med-form-title").innerHTML = `<span class="material-symbols-outlined">edit</span> গাইডলাইন এডিট করুন`;
    document.getElementById("med-form-modal").classList.remove("hidden");
}

// Delete guideline function
async function deleteMedGuideline(id) {
    if (!medicineAdminModeEnabled) {
        alert("🔒 ডিলিট করতে এডমিন মোড সক্রিয় থাকতে হবে!");
        return;
    }
    if (!targetDb) {
        alert("🔒 ডাটাবেজ সংযোগ বিচ্ছিন্ন!");
        return;
    }
    showMedCustomConfirm(
        "গাইডলাইন মুছে ফেলুন", 
        "আপনি কি নিশ্চিত এই গাইডলাইনটি সম্পূর্ণ মুছে ফেলতে চান? এটি আর ফেরত পাওয়া যাবে না।", 
        true, 
        async () => {
            try {
                await targetDb.ref(`medicine_schedule/${id}`).remove();
                alert("🗑️ গাইডলাইনটি সফলভাবে মুছে ফেলা হয়েছে!");
            } catch (error) {
                console.error("Delete error:", error);
                alert("❌ মুছতে সমস্যা হয়েছে!");
            }
        }
    );
}

// বাংলায় সংখ্যা থেকে ইংরেজী সংখ্যা রূপান্তর
function banglaToEnglishDigits(str) {
    const banglaDigits = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
    return str.replace(/[০-৯]/g, d => banglaDigits[d]);
}

// দিন ইনপুট পার্স করা (যেমন: ১,২,৩ বা ১-২-৩ বা ৫-৮ বা ১/২/৩)
function parseDays(inputStr) {
    let cleaned = banglaToEnglishDigits(inputStr.trim());
    // কমা, স্ল্যাশ, প্লাস বা স্পেস দিয়ে স্প্লিট করা
    const parts = cleaned.split(/[\s,/\+]+/);
    const results = [];
    
    parts.forEach(part => {
        if (!part) return;
        const subparts = part.split('-');
        if (subparts.length === 2) {
            const start = parseInt(subparts[0]);
            const end = parseInt(subparts[1]);
            if (!isNaN(start) && !isNaN(end) && start <= end && (end - start) <= 30) {
                for (let i = start; i <= end; i++) {
                    if (!results.includes(i)) {
                        results.push(i);
                    }
                }
            } else {
                subparts.forEach(s => {
                    const num = parseInt(s);
                    if (!isNaN(num) && !results.includes(num)) {
                        results.push(num);
                    }
                });
            }
        } else {
            subparts.forEach(s => {
                const num = parseInt(s);
                if (!isNaN(num) && !results.includes(num)) {
                    results.push(num);
                }
            });
        }
    });
    
    // ক্রমানুসারে সাজানো (ascending order)
    return results.sort((a, b) => a - b);
}

// Form submit logic
async function submitMedGuidelineForm(e) {
    e.preventDefault();
    if (!medicineAdminModeEnabled) {
        alert("🔒 গাইডলাইন সংরক্ষণ করতে এডমিন মোড সক্রিয় থাকতে হবে!");
        return;
    }
    if (!targetDb) {
        alert("🔒 ডাটাবেজ সংযোগ বিচ্ছিন্ন!");
        return;
    }

    const id = document.getElementById("med-form-id").value;
    const daysStr = document.getElementById("med-form-day").value;
    const days = parseDays(daysStr);

    if (days.length === 0) {
        alert("⚠️ অনুগ্রহ করে সঠিক দিন বা দিনসমূহ প্রদান করুন (যেমন: ১, ২, ৩ অথবা ৫-৮)");
        return;
    }

    const baseData = {
        name: document.getElementById("med-form-name").value.trim(),
        category: document.getElementById("med-form-category").value,
        dose: document.getElementById("med-form-dose").value.trim(),
        breed: document.getElementById("med-form-breed").value,
        time: document.getElementById("med-form-time").value,
        desc: document.getElementById("med-form-desc").value.trim()
    };

    try {
        if (id) {
            // এডিটিং এর ক্ষেত্রে প্রথম দিন আপডেট করুন এবং বাকী দিনগুলোর জন্য নতুন গাইডলাইন যুক্ত করুন
            const firstDayData = { ...baseData, day: days[0] };
            await targetDb.ref(`medicine_schedule/${id}`).update(firstDayData);
            
            if (days.length > 1) {
                const promises = [];
                for (let i = 1; i < days.length; i++) {
                    promises.push(targetDb.ref("medicine_schedule").push({
                        ...baseData,
                        day: days[i]
                    }));
                }
                await Promise.all(promises);
            }
            alert("✅ গাইডলাইনটি সফলভাবে আপডেট হয়েছে!");
        } else {
            // নতুন যুক্ত করার সময় প্রতিটি দিনের জন্য আলাদা গাইডলাইন যুক্ত করুন
            const promises = [];
            for (const d of days) {
                promises.push(targetDb.ref("medicine_schedule").push({
                    ...baseData,
                    day: d
                }));
            }
            await Promise.all(promises);
            alert("✅ নতুন গাইডলাইনটি সফলভাবে যোগ হয়েছে!");
        }
        closeMedFormModal();
    } catch (err) {
        console.error("Save error:", err);
        alert("❌ সংরক্ষণ করতে সমস্যা হয়েছে!");
    }
}

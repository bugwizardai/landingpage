// ========================================
// BugWizard AI — Landing Page JS (Redesign)
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initSmoothScroll();
    initCurrencyToggle();
    initWaitlistForm();
    initTestimonialsCarousel();
    initFAQ();
    initExitPopup();
    initSocialProof();
    initAskAI();
    initOfflineBanner();
    updateWaitlistCount();
});

// ========================================
// Navbar
// ========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// Scroll Reveal
// ========================================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ========================================
// Currency Toggle
// ========================================
function initCurrencyToggle() {
    const btns = document.querySelectorAll('.currency-btn');
    if (!btns.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currency = btn.dataset.currency;
            btns.forEach(b => b.classList.toggle('active', b === btn));

            // Update all data-driven price elements
            document.querySelectorAll('[data-inr][data-usd]').forEach(el => {
                el.textContent = el.dataset[currency];
            });
        });
    });
}

// ========================================
// Waitlist Form (Google Sheets + localStorage)
// ========================================
function initWaitlistForm() {
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzwx5h9fkVDZeB8aGUELW-WfquYqiEHennLYit71xetVNrClqTkGG69VVUi2OQYr0c3/exec';

    // Check if already signed up
    if (localStorage.getItem('bw_waitlist_joined')) {
        const successEl = document.getElementById('waitlist-success');
        if (successEl) successEl.classList.add('active');
    }

    // Main waitlist form
    const form = document.getElementById('waitlist-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('waitlist-email').value.trim();
            if (!email) return;
            submitWaitlist(email, 'waitlist-success');
        });
    }

    // Exit popup form
    const exitForm = document.getElementById('exit-popup-form');
    if (exitForm) {
        exitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('exit-email').value.trim();
            if (!email) return;
            submitWaitlist(email, null);
            closeExitPopup();
        });
    }

    function submitWaitlist(email, successId) {
        // Send to Google Sheets
        const formData = new FormData();
        formData.append('email', email);
        formData.append('source', 'landing-page');
        formData.append('timestamp', new Date().toISOString());

        fetch(GOOGLE_SHEET_URL, { method: 'POST', body: formData, mode: 'no-cors' })
            .catch(() => { /* Silent fail for no-cors */ });

        // Show success
        localStorage.setItem('bw_waitlist_joined', 'true');
        localStorage.setItem('bw_waitlist_email', email);

        if (successId) {
            const el = document.getElementById(successId);
            if (el) el.classList.add('active');
        }

        // Increment counter
        const counter = document.getElementById('waitlist-count');
        if (counter) {
            counter.textContent = parseInt(counter.textContent, 10) + 1;
        }
        const counterLarge = document.getElementById('waitlist-count-large');
        if (counterLarge) {
            counterLarge.textContent = parseInt(counterLarge.textContent, 10) + 1;
        }
    }
}

function updateWaitlistCount() {
    // Simulate counter growth
    const counter = document.getElementById('waitlist-count');
    const counterLarge = document.getElementById('waitlist-count-large');
    const baseHero = 6214;
    const baseSection = 7500;
    const daysFromLaunch = Math.floor((new Date() - new Date('2026-01-01')) / (1000 * 60 * 60 * 24));
    const growth = Math.max(0, daysFromLaunch * 3);
    if (counter) counter.textContent = (baseHero + growth).toLocaleString();
    if (counterLarge) counterLarge.textContent = (baseSection + growth).toLocaleString();
}

// ========================================
// Testimonials Carousel
// ========================================
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialDots');
    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.t-card');
    const total = cards.length;
    const gap = 24;
    let perView = getPerView();
    let current = 0;
    const totalSlides = Math.ceil(total / perView);

    // Set card widths
    function setCardWidths() {
        perView = getPerView();
        const containerWidth = track.parentElement.clientWidth;
        const cardWidth = (containerWidth - (perView - 1) * gap) / perView;
        cards.forEach((card, index) => {
            card.style.width = cardWidth + 'px';
            card.style.margin = '0';
            card.style.marginRight = index === cards.length - 1 ? '0px' : gap + 'px';
        });
    }

    function getPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    function goTo(index) {
        const max = Math.ceil(total / perView) - 1;
        current = Math.max(0, Math.min(index, max));
        const containerWidth = track.parentElement.clientWidth;
        const offset = current * (containerWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
    }

    function updateDots() {
        if (!dotsContainer) return;
        const max = Math.ceil(total / perView);
        dotsContainer.innerHTML = '';
        for (let i = 0; i < max; i++) {
            const dot = document.createElement('div');
            dot.className = 't-dot' + (i === current ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    setCardWidths();
    updateDots();

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    window.addEventListener('resize', () => {
        setCardWidths();
        goTo(current);
    });

    // Auto-advance every 6 seconds
    setInterval(() => {
        const max = Math.ceil(total / perView) - 1;
        goTo(current >= max ? 0 : current + 1);
    }, 6000);
}

// ========================================
// FAQ Accordion
// ========================================
function initFAQ() {
    document.querySelectorAll('.faq-q').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const isOpen = item.classList.contains('open');
            // Close all
            document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
            // Toggle current
            if (!isOpen) item.classList.add('open');
        });
    });
}

// ========================================
// Exit Intent Popup
// ========================================
function initExitPopup() {
    let shown = false;
    if (localStorage.getItem('bw_exit_popup_shown') || localStorage.getItem('bw_waitlist_joined')) return;

    document.addEventListener('mouseout', (e) => {
        if (shown) return;
        if (e.clientY <= 0) {
            showExitPopup();
            shown = true;
        }
    });
}

function showExitPopup() {
    const popup = document.getElementById('exit-popup');
    if (popup) popup.classList.add('active');
}

function closeExitPopup() {
    const popup = document.getElementById('exit-popup');
    if (popup) popup.classList.remove('active');
    localStorage.setItem('bw_exit_popup_shown', 'true');
}
// Make closeExitPopup globally accessible for onclick
window.closeExitPopup = closeExitPopup;

// ========================================
// Social Proof Notifier
// ========================================
function initSocialProof() {
    const countries = [
        '🇮🇳 India', '🇺🇸 United States', '🇬🇧 United Kingdom', '🇩🇪 Germany',
        '🇨🇦 Canada', '🇦🇺 Australia', '🇫🇷 France', '🇧🇷 Brazil',
        '🇯🇵 Japan', '🇳🇱 Netherlands', '🇸🇬 Singapore', '🇦🇪 UAE',
        '🇰🇷 South Korea', '🇸🇪 Sweden', '🇪🇸 Spain',
        '🇵🇱 Poland', '🇮🇩 Indonesia', '🇳🇬 Nigeria', '🇿🇦 South Africa',
        '🇲🇽 Mexico', '🇮🇹 Italy', '🇵🇭 Philippines', '🇻🇳 Vietnam',
        '🇹🇷 Turkey', '🇹🇭 Thailand', '🇵🇰 Pakistan', '🇧🇩 Bangladesh',
        '🇨🇴 Colombia', '🇦🇷 Argentina'
    ];
    const timeLabels = ['Just now', '1 minute ago', '2 minutes ago', '3 minutes ago', '5 minutes ago', '8 minutes ago', '12 minutes ago'];

    const notifier = document.getElementById('sp-notifier');
    const msgEl = document.getElementById('sp-notifier-msg');
    const timeEl = document.getElementById('sp-notifier-time');
    const closeBtn = document.getElementById('sp-notifier-close');
    if (!notifier || !msgEl || !timeEl || !closeBtn) return;

    let hideTimeout;
    let usedIndices = [];

    function getRandomCountry() {
        if (usedIndices.length >= countries.length) usedIndices = [];
        let idx;
        do { idx = Math.floor(Math.random() * countries.length); }
        while (usedIndices.includes(idx));
        usedIndices.push(idx);
        return countries[idx];
    }

    function showNotification() {
        const country = getRandomCountry();
        const time = timeLabels[Math.floor(Math.random() * timeLabels.length)];
        msgEl.innerHTML = 'Someone from <strong>' + country + '</strong> requested for trial license';
        timeEl.textContent = time;
        notifier.classList.add('sp-show');

        // Increment counter
        const counterEl = document.getElementById('waitlist-count');
        if (counterEl) {
            counterEl.textContent = parseInt(counterEl.textContent.replace(/,/g, ''), 10) + 1;
        }

        hideTimeout = setTimeout(() => notifier.classList.remove('sp-show'), 6000);
        scheduleNext();
    }

    function scheduleNext() {
        const delay = 180000 + Math.floor(Math.random() * 120000);
        setTimeout(showNotification, delay);
    }

    closeBtn.addEventListener('click', () => {
        clearTimeout(hideTimeout);
        notifier.classList.remove('sp-show');
    });

    // First notification after 8-15 seconds
    setTimeout(showNotification, 8000 + Math.floor(Math.random() * 7000));
}

// ========================================
// Ask AI Chatbot
// ========================================
function initAskAI() {
    const fab = document.getElementById('askAIBtn');
    const panel = document.getElementById('askAIChatPanel');
    const closeBtn = document.getElementById('askAIChatClose');
    const clearBtn = document.getElementById('askAIChatClear');
    const input = document.getElementById('askAIChatInput');
    const sendBtn = document.getElementById('askAIChatSend');
    const messages = document.getElementById('askAIChatMessages');
    const suggestions = document.getElementById('askAIChatSuggestions');
    if (!fab || !panel) return;

    fab.addEventListener('click', () => {
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden') && input) input.focus();
    });

    if (closeBtn) closeBtn.addEventListener('click', () => panel.classList.add('hidden'));

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (messages) {
                messages.innerHTML = `<div class="ask-ai-msg bot"><div class="ask-ai-msg-avatar">🧙‍♂️</div><div class="ask-ai-msg-bubble">Hi! I'm the BugWizard Guide. Ask me anything about BugWizard — features, pricing, device farm, setup, and more!</div></div>`;
            }
        });
    }

    function addMessage(text, isUser) {
        if (!messages) return;
        const div = document.createElement('div');
        div.className = 'ask-ai-msg ' + (isUser ? 'user' : 'bot');
        div.innerHTML = isUser
            ? `<div class="ask-ai-msg-bubble">${escapeHTML(text)}</div>`
            : `<div class="ask-ai-msg-avatar">🧙‍♂️</div><div class="ask-ai-msg-bubble">${text}</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function getAnswer(q) {
        const ql = q.toLowerCase();
        if (ql.includes('what is bugwizard') || ql.includes('about bugwizard')) {
            return 'BugWizard AI is an AI-powered QA Operating System for Azure DevOps & JIRA. It automates bug creation, retesting, provides a cloud device farm (Ozzy Device Farm), AI assistant (Ozzy AI), API testing, duplicate detection, and 16+ QA tools — all in one platform.';
        }
        if (ql.includes('feature') || ql.includes('what can')) {
            return 'BugWizard includes: 🐛 AI Bug Creator, 🔄 AI Retest Automator, 📱 Ozzy Device Farm (50+ cloud devices), 🤖 Ozzy AI Assistant (10+ AI providers), 🔌 API Flow Tester, 🎬 Video Compressor, 🔍 Duplicate Detector, 🧠 Test Case Optimizer, 📝 Test Case Generator, 🧩 Plugin Store, 🤖 Agentron Store, 📊 Activity Dashboard, 💻 Built-in Terminal, and more!';
        }
        if (ql.includes('device farm') || ql.includes('ozzy device')) {
            return 'Ozzy Device Farm is a cloud device lab built into BugWizard. Test on 50+ real Android & iOS devices — Pixel 9, iPhone 16, Galaxy S24, iPad Pro and more. Features include screenshot capture, screen rotation, DevTools (Console, Network, ADB), APK/IPA upload, session timer, and evidence drawer. No physical devices needed!';
        }
        if (ql.includes('pric') || ql.includes('cost') || ql.includes('plan')) {
            return 'Pricing plans: 🎁 Free Trial (7 days, full access, ₹0/$0), ⚡ Monthly (₹849/$9.99/mo, 1 license), 💎 Yearly (₹8,499/$99.99/yr, 10 licenses, save 17%), 👑 Unlimited (₹1,20,000/$1,299.99 one-time, unlimited licenses), 🏢 Enterprise (custom). All plans include full feature access.';
        }
        if (ql.includes('ozzy ai') || ql.includes('ai assistant') || ql.includes('ai provider')) {
            return 'Ozzy AI is your QA co-pilot with 10+ AI providers: Groq (Llama 3.3), OpenRouter (Mistral 7B), Gemini 2.0, OpenAI GPT-4o, Claude 3.5, Grok, Azure OpenAI, DeepSeek, Qwen, and GLM-4. It generates bug reports, suggests edge cases, answers QA questions, and supports voice-to-text input. All API keys are stored locally.';
        }
        if (ql.includes('security') || ql.includes('safe') || ql.includes('pat') || ql.includes('token')) {
            return 'Your data is 100% secure. BugWizard stores everything in your browser\'s localStorage — PAT tokens, API keys, and bug data never leave your machine. API calls go directly to Azure DevOps/JIRA. No backend, no cloud storage, SHA-256 hashing, GDPR compliant.';
        }
        if (ql.includes('api') || ql.includes('postman')) {
            return 'The API Flow Tester replaces Postman for quick tests. It supports all HTTP methods (GET, POST, PUT, PATCH, DELETE), custom headers, auth tokens, JSON/Form body builder, syntax-highlighted responses, latency tracking, collections, and request history — all built into BugWizard.';
        }
        if (ql.includes('integrat') || ql.includes('azure') || ql.includes('jira')) {
            return 'BugWizard deeply integrates with both Azure DevOps and Atlassian JIRA via REST APIs. It can create work items, submit comments, update bug states, upload attachments, fetch duplicates, and build dashboards. No plugins or extensions needed — switch platforms anytime.';
        }
        if (ql.includes('launch') || ql.includes('when') || ql.includes('release')) {
            return 'BugWizard AI is launching on May 1, 2026 at 12:00 PM! Join the waitlist to get early access. We\'re currently in the final polishing phase.';
        }
        return 'Great question! BugWizard AI is a complete QA OS with 16+ tools including AI bug creation, retesting, Ozzy Device Farm (50+ cloud devices), Ozzy AI (10+ providers), API testing, and more. Check out our <a href="#features" style="color:var(--gold)">features section</a> for details, or ask me about pricing, security, or specific tools!';
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;
        addMessage(text, true);
        input.value = '';
        setTimeout(() => addMessage(getAnswer(text), false), 400 + Math.random() * 300);
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    if (suggestions) {
        suggestions.querySelectorAll('.ask-ai-suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                const q = btn.dataset.q;
                addMessage(q, true);
                setTimeout(() => addMessage(getAnswer(q), false), 400 + Math.random() * 300);
            });
        });
    }
}

// ========================================
// Share Waitlist
// ========================================
function shareWaitlist() {
    const url = window.location.href.split('#')[0] + '#waitlist';
    const text = 'Check out BugWizard AI — an AI-powered QA OS for Azure DevOps & JIRA with 50+ cloud devices, 10+ AI providers, and 16+ QA tools!';

    if (navigator.share) {
        navigator.share({ title: 'BugWizard AI', text: text, url: url }).catch(() => {});
    } else {
        navigator.clipboard.writeText(url).then(() => {
            alert('Waitlist link copied to clipboard!');
        }).catch(() => {
            window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + ' ' + url), '_blank');
        });
    }
}
window.shareWaitlist = shareWaitlist;

// ========================================
// Offline Banner
// ========================================
function initOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (!banner) return;

    function update() {
        banner.style.display = navigator.onLine ? 'none' : 'block';
    }
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
}

// ========================================
// BugWizard AI Landing Page JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initParticles();
    init3DScene();
    initScrollAnimations();
    initSmoothScroll();
});

// ========================================
// Navbar Scroll Effect
// ========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when scrolling down
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// Mobile Menu Toggle
// ========================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// ========================================
// Particle Animation
// ========================================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';

    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    // Random animation delay
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 15) + 's';

    // Random opacity
    particle.style.opacity = Math.random() * 0.5 + 0.2;

    container.appendChild(particle);
}

// ========================================
// 3D Scene with Mouse Parallax
// ========================================
function init3DScene() {
    const scene = document.getElementById('scene3d');
    if (!scene) return;
    
    const shapes = scene.querySelectorAll('.shape-3d');
    let mouseX = 0;
    let mouseY = 0;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - windowWidth / 2) / windowWidth;
        mouseY = (e.clientY - windowHeight / 2) / windowHeight;
    });
    
    // Update window dimensions on resize
    window.addEventListener('resize', () => {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    });
    
    // Parallax animation loop
    function animateParallax() {
        shapes.forEach(shape => {
            const speed = parseFloat(shape.dataset.speed) || 0.02;
            const rotateX = mouseY * 30 * speed * 10;
            const rotateY = mouseX * 30 * speed * 10;
            const translateX = mouseX * 50 * speed * 10;
            const translateY = mouseY * 50 * speed * 10;
            
            // Get current transform and add parallax
            const currentTransform = getComputedStyle(shape).transform;
            
            // Apply additional parallax transform
            shape.style.setProperty('--parallax-x', `${translateX}px`);
            shape.style.setProperty('--parallax-y', `${translateY}px`);
            shape.style.setProperty('--parallax-rotate-x', `${rotateX}deg`);
            shape.style.setProperty('--parallax-rotate-y', `${rotateY}deg`);
        });
        
        requestAnimationFrame(animateParallax);
    }
    
    // Start parallax animation
    animateParallax();
    
    // Add depth effect on scroll
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
        const scrollProgress = scrollY / (document.body.scrollHeight - windowHeight);
        
        shapes.forEach((shape, index) => {
            const depth = (index % 3) + 1;
            const translateZ = scrollProgress * 100 * depth;
            const opacity = Math.max(0.3, 1 - scrollProgress * 1.5);
            
            shape.style.opacity = opacity;
        });
    });
    
    // Add floating animation variation
    shapes.forEach((shape, index) => {
        // Add slight random delay to create more organic movement
        const delay = (index * 0.5) % 5;
        shape.style.animationDelay = `${delay}s`;
    });
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
    // Add animate-on-scroll class to elements
    const animatedElements = document.querySelectorAll(
        '.problem-card, .step, .feature-card, .role-card, .security-card, .comparison-card, .df-feature-card, .device-farm-hero'
    );

    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Staggered animations for grids
    const grids = document.querySelectorAll(
        '.problem-grid, .features-grid, .roles-grid, .security-grid, .providers-grid, .device-farm-features-grid, .device-farm-stats'
    );

    grids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = (index * 0.1) + 's';
        });
    });
}

// ========================================
// Smooth Scrolling
// ========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// Typing Animation (Optional)
// ========================================
function initTypingAnimation() {
    const typingElements = document.querySelectorAll('[data-typing]');

    typingElements.forEach(el => {
        const text = el.getAttribute('data-typing');
        el.textContent = '';
        let i = 0;

        function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }

        // Start typing when element is in view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                type();
                observer.disconnect();
            }
        });

        observer.observe(el);
    });
}

// ========================================
// Counter Animation
// ========================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = element.getAttribute('data-suffix') || '';

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    }

    updateCounter();
}

// ========================================
// Tooltip System (Optional)
// ========================================
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(el => {
        const tooltipText = el.getAttribute('data-tooltip');

        el.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);

            const rect = el.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

            el._tooltip = tooltip;
        });

        el.addEventListener('mouseleave', () => {
            if (el._tooltip) {
                el._tooltip.remove();
                el._tooltip = null;
            }
        });
    });
}

// ========================================
// Copy to Clipboard (Utility)
// ========================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy', 'error');
    });
}

// ========================================
// Notification System (Utility)
// ========================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to head
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ========================================
// Performance: Debounce & Throttle
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// Preloader (Optional)
// ========================================
function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

// Hide preloader when page is loaded
window.addEventListener('load', hidePreloader);

// ========================================
// Analytics Event Tracking (Placeholder)
// ========================================
function trackEvent(category, action, label) {
    // Implement your analytics tracking here
    console.log(`Analytics: ${category} - ${action} - ${label}`);
}

// Track CTA clicks
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('CTA', 'click', btn.textContent.trim());
    });
});

// ========================================
// Currency Toggle
// ========================================
function initCurrencyToggle() {
    const currencyBtns = document.querySelectorAll('.currency-btn');
    const priceElements = document.querySelectorAll('.price-amount[data-inr], .free-trial-price[data-inr]');
    const monthlyEquivElements = document.querySelectorAll('.pricing-monthly-equiv[data-inr]');

    currencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            currencyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update prices
            const currency = btn.dataset.currency;
            priceElements.forEach(el => {
                el.textContent = el.dataset[currency];
            });

            // Update monthly equivalent labels
            monthlyEquivElements.forEach(el => {
                el.textContent = el.dataset[currency];
            });

            trackEvent('Pricing', 'currency_change', currency);
        });
    });
}

// ========================================
// Waitlist Form — Saves to Google Sheets
// ========================================

// ⚠️ IMPORTANT: Replace this URL with your deployed Google Apps Script Web App URL
const GOOGLE_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzwx5h9fkVDZeB8aGUELW-WfquYqiEHennLYit71xetVNrClqTkGG69VVUi2OQYr0c3/exec';

/**
 * Sends waitlist email to Google Sheets via Apps Script Web App.
 * Falls back gracefully — shows success to user even if sheet save fails.
 */
async function saveEmailToGoogleSheet(email, source = 'waitlist') {
    try {
        const response = await fetch(GOOGLE_SHEET_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors', // Apps Script doesn't support CORS preflight
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                source: source,
                timestamp: new Date().toISOString(),
                page: window.location.href,
                userAgent: navigator.userAgent
            })
        });
        console.log('✅ Email saved to Google Sheet:', email);
        return true;
    } catch (error) {
        console.warn('⚠️ Google Sheet save failed (email still stored locally):', error);
        return false;
    }
}

function initWaitlistForm() {
    const form = document.getElementById('waitlist-form');
    const exitForm = document.getElementById('exit-popup-form');

    const handleSubmit = (formElement, successElement, source = 'waitlist') => {
        formElement?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = formElement.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            if (!email) return;

            // Disable button to prevent double submit
            const submitBtn = formElement.querySelector('button[type="submit"]');
            const originalBtnHTML = submitBtn?.innerHTML;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Saving...';
            }

            // 1. Save to Google Sheet
            await saveEmailToGoogleSheet(email, source);

            // 2. Also keep in localStorage as backup / for counter
            const waitlist = JSON.parse(localStorage.getItem('bugwizard_waitlist') || '[]');
            if (!waitlist.includes(email)) {
                waitlist.push(email);
                localStorage.setItem('bugwizard_waitlist', JSON.stringify(waitlist));
                updateWaitlistCount(waitlist.length);
            }

            // 3. Show success message
            if (successElement) {
                successElement.classList.add('active');
                formElement.querySelector('.form-group').style.display = 'none';
                formElement.querySelector('.form-note')?.remove();
            }

            // Re-enable button (for exit popup which doesn't hide form)
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }

            showNotification('You\'re on the waitlist! 🎉', 'success');
            trackEvent('Waitlist', 'signup', email);

            // Close exit popup if open
            closeExitPopup();
        });
    };

    handleSubmit(form, document.getElementById('waitlist-success'), 'main-waitlist');
    handleSubmit(exitForm, null, 'exit-popup');
}

function updateWaitlistCount(additionalCount = 0) {
    const baseCount = 1270;

    document.querySelectorAll('#waitlist-count, #waitlist-count-large').forEach(el => {
        if (el) el.textContent = baseCount;
    });
}

// ========================================
// Exit Intent Popup
// ========================================
let exitPopupShown = false;

// Testimonials Auto-Sliding Carousel
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonialsTrack');
    const carousel = document.getElementById('testimonialsCarousel');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialDots');
    if (!track || !prevBtn || !nextBtn || !dotsContainer || !carousel) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    let currentIndex = 0;
    let autoSlideInterval;
    let cardsPerView = getCardsPerView();

    function getCardsPerView() {
        if (window.innerWidth <= 640) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function setCardWidths() {
        const containerWidth = carousel.offsetWidth;
        const cardMargin = window.innerWidth <= 768 ? 16 : 24; // margin: 0 12px = 24px total, 0 8px = 16px
        const cardWidth = (containerWidth / cardsPerView) - cardMargin;
        cards.forEach(function(card) {
            card.style.width = cardWidth + 'px';
            card.style.minWidth = cardWidth + 'px';
        });
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        var pages = Math.ceil(totalCards / cardsPerView);
        for (var i = 0; i < pages; i++) {
            var dot = document.createElement('button');
            dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            (function(idx) {
                dot.addEventListener('click', function() { goToSlide(idx); });
            })(i);
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        var dots = dotsContainer.querySelectorAll('.testimonial-dot');
        var pageIndex = Math.floor(currentIndex / cardsPerView);
        dots.forEach(function(d, i) {
            d.classList.toggle('active', i === pageIndex);
        });
    }

    function goToSlide(pageIndex) {
        var maxIndex = totalCards - cardsPerView;
        currentIndex = Math.min(pageIndex * cardsPerView, maxIndex);
        if (currentIndex < 0) currentIndex = 0;
        updatePosition();
        updateDots();
        resetAutoSlide();
    }

    function updatePosition() {
        if (!cards[0]) return;
        var card = cards[0];
        var style = window.getComputedStyle(card);
        var marginLeft = parseFloat(style.marginLeft) || 0;
        var marginRight = parseFloat(style.marginRight) || 0;
        var cardFullWidth = card.offsetWidth + marginLeft + marginRight;
        track.style.transform = 'translateX(-' + (currentIndex * cardFullWidth) + 'px)';
    }

    function next() {
        var maxIndex = totalCards - cardsPerView;
        if (currentIndex >= maxIndex) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updatePosition();
        updateDots();
    }

    function prev() {
        var maxIndex = totalCards - cardsPerView;
        if (currentIndex <= 0) {
            currentIndex = maxIndex;
        } else {
            currentIndex--;
        }
        updatePosition();
        updateDots();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(next, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    nextBtn.addEventListener('click', function() { next(); resetAutoSlide(); });
    prevBtn.addEventListener('click', function() { prev(); resetAutoSlide(); });

    // Pause on hover
    carousel.addEventListener('mouseenter', function() { clearInterval(autoSlideInterval); });
    carousel.addEventListener('mouseleave', function() { startAutoSlide(); });

    // Touch/swipe support
    var touchStartX = 0;
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlideInterval);
    }, { passive: true });
    track.addEventListener('touchend', function(e) {
        var touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) next(); else prev();
        }
        startAutoSlide();
    }, { passive: true });

    // Handle resize
    var resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            var newPerView = getCardsPerView();
            cardsPerView = newPerView;
            currentIndex = 0;
            setCardWidths();
            buildDots();
            updatePosition();
        }, 150);
    });

    setCardWidths();
    buildDots();
    startAutoSlide();
}

function initExitPopup() {
    // Check if already shown in this session
    if (sessionStorage.getItem('exitPopupShown')) return;

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 10 && !exitPopupShown) {
            showExitPopup();
        }
    });

    // Mobile: show on scroll up near top
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', throttle(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY < 100 && lastScrollY > currentScrollY && !exitPopupShown) {
            // User scrolling up near top - don't show popup on mobile, too aggressive
        }
        lastScrollY = currentScrollY;
    }, 200));
}

function showExitPopup() {
    const popup = document.getElementById('exit-popup');
    if (popup && !exitPopupShown) {
        popup.classList.add('active');
        exitPopupShown = true;
        sessionStorage.setItem('exitPopupShown', 'true');
        trackEvent('ExitPopup', 'shown', '');
    }
}

function closeExitPopup() {
    const popup = document.getElementById('exit-popup');
    if (popup) {
        popup.classList.remove('active');
    }
}

// Close popup on outside click
document.addEventListener('click', (e) => {
    const popup = document.getElementById('exit-popup');
    if (popup && popup.classList.contains('active')) {
        if (e.target === popup) {
            closeExitPopup();
        }
    }
});

// Close popup on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeExitPopup();
    }
});

// ========================================
// Share Waitlist Function
// ========================================
function shareWaitlist() {
    const shareData = {
        title: 'BugWizard AI - AI-Driven Bug Creation & Retest Automation',
        text: 'Check out BugWizard AI - it automates bug creation and retesting for Azure DevOps & JIRA. Join the waitlist!',
        url: window.location.href + '#waitlist'
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                trackEvent('Share', 'native_share', 'waitlist');
            })
            .catch(console.error);
    } else {
        // Fallback: copy link to clipboard
        copyToClipboard(shareData.url);
        showNotification('Link copied! Share it with your QA friends 🚀', 'success');
        trackEvent('Share', 'copy_link', 'waitlist');
    }
}

// Make shareWaitlist available globally
window.shareWaitlist = shareWaitlist;
window.closeExitPopup = closeExitPopup;

// ========================================
// Initialize New Features
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initCurrencyToggle();
    initWaitlistForm();
    initExitPopup();
    updateWaitlistCount();
    initTestimonialsCarousel();
    
    // Add more elements to scroll animations
    const additionalAnimElements = document.querySelectorAll(
        '.testimonial-card, .faq-item, .demo-step, .founder-content, .device-farm-bottom-cta, .device-farm-preview'
    );
    additionalAnimElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    // Re-observe new elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
});

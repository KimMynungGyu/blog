// Configuration URLs
const URLS = {
    welfare: 'https://spa.totalwellnessarena.com/custom-welfare-bokjiro-guide/',
    insurance: 'https://spa.totalwellnessarena.com/korea-insurance-claim-guide/'
};

// Storage utility functions
const storage = {
    set: (key, val) => {
        try { sessionStorage.setItem(key, val); } 
        catch { window[key] = val; }
    },
    get: (key) => {
        try { return sessionStorage.getItem(key); } 
        catch { return window[key]; }
    }
};

// Popup management
const popup = {
    isClosed: () => storage.get('pos_popup_closed') === 'true',
    
    show() {
        if (this.isClosed()) return;
        const el = document.getElementById('posPopupOverlay');
        if (el) {
            el.classList.add('pos-show');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
    },
    
    close() {
        const el = document.getElementById('posPopupOverlay');
        if (el) {
            el.classList.remove('pos-show');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            storage.set('pos_popup_closed', 'true');
        }
    },
    
    action(url) {
        window.open(url, '_blank');
        const el = document.getElementById('posPopupOverlay');
        if (el) {
            el.classList.remove('pos-show');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            storage.set('pos_popup_closed', 'true');
        }
    }
};

// Banner management
const banner = {
    isClosed: () => storage.get('pos_banner_closed') === 'true',
    
    show() {
        if (this.isClosed()) return;
        const el = document.getElementById('posFloatingBanner');
        if (el) {
            el.classList.remove('pos-hidden');
            el.classList.add('pos-show');
        }
    },
    
    close() {
        const el = document.getElementById('posFloatingBanner');
        if (el) {
            el.classList.add('pos-hidden');
            storage.set('pos_banner_closed', 'true');
        }
    },
    
    click() {
        window.open(URLS.welfare, '_blank');
        const el = document.getElementById('posFloatingBanner');
        if (el) {
            el.classList.add('pos-hidden');
            storage.set('pos_banner_closed', 'true');
        }
    }
};

// Global action handlers
function handleMainAction() { popup.action(URLS.welfare); }
function handleDirectAction() { popup.action(URLS.insurance); }
function closePopup() { popup.close(); }
function closeBanner() { banner.close(); }
function handleBannerClick() { banner.click(); }

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Auto show popup after 3s
    setTimeout(() => popup.show(), 3000);
    
    // Auto show banner after 1s
    setTimeout(() => banner.show(), 1000);
    
    // ESC key handler
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') popup.close();
    });
    
    // Overlay click handler
    const overlay = document.getElementById('posPopupOverlay');
    if (overlay) {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) popup.close();
        });
    }
    
    // Banner click handler
    const bannerEl = document.getElementById('posFloatingBanner');
    if (bannerEl) {
        bannerEl.addEventListener('click', e => {
            if (!e.target.closest('.pos-close-btn') && !e.target.closest('.pos-banner-button')) {
                banner.click();
            }
        });
    }
});

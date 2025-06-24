// 제외할 페이지 URL 패턴들
const EXCLUDED_PAGES = [
    '/admin/',           // 관리자 페이지
    '/login',           // 로그인 페이지
    // 인코딩된 한글 URL도 함께 추가 (안전장치)
    '/%EA%B4%80%EB%A6%AC%EC%9E%90/',  // '관리자' 인코딩된 버전
    // 필요에 따라 추가
];

// 현재 페이지가 제외 대상인지 확인
function shouldExcludePage() {
    const currentPath = window.location.pathname;
    const currentUrl = window.location.href;
    
    // URL 디코딩 처리 (한글 URL 지원)
    let decodedPath = '';
    let decodedUrl = '';
    
    try {
        decodedPath = decodeURIComponent(currentPath);
        decodedUrl = decodeURIComponent(currentUrl);
    } catch (e) {
        // 디코딩 실패 시 원본 사용
        decodedPath = currentPath;
        decodedUrl = currentUrl;
    }
    
    return EXCLUDED_PAGES.some(pattern => {
        // 원본 URL과 디코딩된 URL 모두 체크
        const pathsToCheck = [currentPath, decodedPath];
        const urlsToCheck = [currentUrl, decodedUrl];
        
        // 경로 매칭 체크
        for (const path of pathsToCheck) {
            if (path === pattern) return true;
            if (path.includes(pattern)) return true;
        }
        
        // 전체 URL 매칭 체크
        for (const url of urlsToCheck) {
            if (url.includes(pattern)) return true;
        }
        
        return false;
    });
}

// 제외 페이지에서는 스크립트 종료
if (shouldExcludePage()) {
    console.log('This page is excluded from popup/banner functionality');
    // 스크립트 실행 중단
} else {
    // 기존 스크립트 실행
    
    // Configuration URLs - 각각 여러 개의 URL을 배열로 관리
    const URLS = {
        welfare: [
            'https://health.neullida.kr/정부지원금/#section1',
            'https://spa.totalwellnessarena.com/custom-welfare-bokjiro-guide/'
        ],
        insurance: [
            'https://info.neullida.kr/정부지원금/#section2',
            'https://spa.totalwellnessarena.com/korea-insurance-claim-guide/'
        ],
        banner: [
            'https://level.neullida.kr/정부지원금/#section3',
            'https://spa.totalwellnessarena.com/korea-insurance-claim-guide/'
        ],
        // 팝업이 뜨지 않을 페이지들 (URLS에 포함된 모든 URL)
        excludePopup: []
    };

    // URLS 배열들을 평면화해서 excludePopup에 추가
    Object.keys(URLS).forEach(key => {
        if (key !== 'excludePopup' && Array.isArray(URLS[key])) {
            URLS.excludePopup.push(...URLS[key]);
        }
    });

    // 랜덤 URL 선택 함수
    function getRandomUrl(urlArray) {
        const randomIndex = Math.floor(Math.random() * urlArray.length);
        return urlArray[randomIndex];
    }

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
            window.open(getRandomUrl(URLS.banner), '_blank');
            const el = document.getElementById('posFloatingBanner');
            if (el) {
                el.classList.add('pos-hidden');
                storage.set('pos_banner_closed', 'true');
            }
        }
    };

    // Global action handlers
    function handleMainAction() { popup.action(getRandomUrl(URLS.welfare)); }
    function handleDirectAction() { popup.action(getRandomUrl(URLS.insurance)); }
    function handleBannerClick() { banner.click(); }
    function closePopup() { popup.close(); }
    function closeBanner() { banner.close(); }

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
}

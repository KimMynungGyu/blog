// Configuration URLs - 리퍼러에 따라 다른 URL 사용
const URLS = {
    welfare: {
        neullida: 'https://health.neullida.kr/정부지원금/#section1',
        totalwellness: 'https://trip.totalwellnessarena.com/정부지원금/#section1',
        default: 'https://trip.totalwellnessarena.com/정부지원금/#section1'
    },
    insurance: {
        neullida: 'https://info.neullida.kr/정부지원금/#section2',
        totalwellness: 'https://food.totalwellnessarena.com/정부지원금/#section2',
        default: 'https://food.totalwellnessarena.com/정부지원금/#section2'
    },
    banner: {
        neullida: 'https://level.neullida.kr/정부지원금/#section3',
        totalwellness: 'https://hobby.totalwellnessarena.com/정부지원금/#section3',
        default: 'https://hobby.totalwellnessarena.com/정부지원금/#section3'
    },
    // 팝업이 뜨지 않을 페이지들 - Set으로 최적화
    excludePopup: new Set([
        'https://health.neullida.kr/정부지원금/',
        'https://info.neullida.kr/정부지원금/',
        'https://level.neullida.kr/정부지원금/',
        'https://trip.totalwellnessarena.com/정부지원금/',
        'https://food.totalwellnessarena.com/정부지원금/',
        'https://hobby.totalwellnessarena.com/정부지원금/',
        'https://neullida.kr/결혼장려금/',
        'https://neullida.kr/경기도청년기본소득/',
        'https://neullida.kr/국민내일배움카드/',
        'https://neullida.kr/국민취업지원제도/',
        'https://neullida.kr/근로장려금/',
        'https://neullida.kr/기초생활보장생계급여/',
        'https://neullida.kr/기초연금/',
        'https://neullida.kr/긴급복지지원제도/',
        'https://neullida.kr/소상공인정책자금/',
        'https://neullida.kr/소상공인특화자금/',
        'https://neullida.kr/아동수당/',
        'https://neullida.kr/에너지바우처/',
        'https://neullida.kr/예비창업패키지/',
        'https://neullida.kr/의료비지원/',
        'https://neullida.kr/자격증지원금/',
        'https://neullida.kr/자녀장려금/',
        'https://neullida.kr/종합소득세/',
        'https://neullida.kr/청년내일채움공제/',
        'https://neullida.kr/청년도약계좌/',
        'https://neullida.kr/청년면접수당/',
        'https://neullida.kr/청년월세지원/',
        'https://neullida.kr/청년취업지원금/',
        'https://neullida.kr/청년희망적금/',
        'https://neullida.kr/초기창업패키지/',
        'https://neullida.kr/출산축하적금/',
        'https://neullida.kr/한부모가족지원금/',
        'https://totalwellnessarena.com/결혼장려금/',
        'https://totalwellnessarena.com/경기도청년기본소득/',
        'https://totalwellnessarena.com/국민내일배움카드/',
        'https://totalwellnessarena.com/국민취업지원제도/',
        'https://totalwellnessarena.com/근로장려금/',
        'https://totalwellnessarena.com/기초생활보장생계급여/',
        'https://totalwellnessarena.com/기초연금/',
        'https://totalwellnessarena.com/긴급복지지원제도/',
        'https://totalwellnessarena.com/소상공인정책자금/',
        'https://totalwellnessarena.com/소상공인특화자금/',
        'https://totalwellnessarena.com/아동수당/',
        'https://totalwellnessarena.com/에너지바우처/',
        'https://totalwellnessarena.com/예비창업패키지/',
        'https://totalwellnessarena.com/의료비지원/',
        'https://totalwellnessarena.com/자격증지원금/',
        'https://totalwellnessarena.com/자녀장려금/',
        'https://totalwellnessarena.com/종합소득세/',
        'https://totalwellnessarena.com/청년내일채움공제/',
        'https://totalwellnessarena.com/청년도약계좌/',
        'https://totalwellnessarena.com/청년면접수당/',
        'https://totalwellnessarena.com/청년월세지원/',
        'https://totalwellnessarena.com/청년취업지원금/',
        'https://totalwellnessarena.com/청년희망적금/',
        'https://totalwellnessarena.com/초기창업패키지/',
        'https://totalwellnessarena.com/출산축하적금/',
        'https://totalwellnessarena.com/한부모가족지원금/'
    ])
};

// 캐시된 값들 - 성능 최적화
let cachedReferrerType = null;
let cachedDomElements = {};

// 모바일 기기 감지
function isMobileDevice() {
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return isSmallScreen || isMobileUA || isTouchDevice;
}

// 리퍼러에 따라 적절한 URL 선택 (캐싱 적용)
function getUrlByReferrer(urlGroup) {
    if (cachedReferrerType !== null) {
        return urlGroup[cachedReferrerType];
    }
    
    const referrer = document.referrer;
    console.log('리퍼러:', referrer);
    
    if (referrer.includes('neullida.kr')) {
        console.log('neullida.kr에서 방문');
        cachedReferrerType = 'neullida';
        return urlGroup.neullida;
    } else if (referrer.includes('totalwellnessarena.com')) {
        console.log('totalwellnessarena.com에서 방문');
        cachedReferrerType = 'totalwellness';
        return urlGroup.totalwellness;
    } else {
        console.log('기타 사이트에서 방문, 기본 URL 사용');
        cachedReferrerType = 'default';
        return urlGroup.default;
    }
}

// DOM 요소 캐싱
function getElement(id) {
    if (!cachedDomElements[id]) {
        cachedDomElements[id] = document.getElementById(id);
    }
    return cachedDomElements[id];
}

// 현재 페이지가 제외 대상인지 확인 (Set 사용으로 최적화)
function shouldExcludePage() {
    const currentPath = window.location.pathname;
    const currentUrl = window.location.href;
    
    console.log('현재 페이지 체크:', currentPath, currentUrl);
    
    // URL 디코딩 처리 (한글 URL 지원)
    let decodedPath = '';
    let decodedUrl = '';
    
    try {
        decodedPath = decodeURIComponent(currentPath);
        decodedUrl = decodeURIComponent(currentUrl);
    } catch (e) {
        decodedPath = currentPath;
        decodedUrl = currentUrl;
    }
    
    console.log('디코딩된 URL:', decodedPath, decodedUrl);
    
    // # 해시 제거한 URL도 준비
    const currentUrlWithoutHash = currentUrl.split('#')[0];
    const decodedUrlWithoutHash = decodedUrl.split('#')[0];
    
    // Set을 사용한 O(1) 검색으로 최적화
    const urlsToCheck = [currentUrl, decodedUrl, currentUrlWithoutHash, decodedUrlWithoutHash];
    
    for (const url of urlsToCheck) {
        if (URLS.excludePopup.has(url)) {
            console.log('페이지 제외됨:', url);
            return true;
        }
    }
    
    // 패턴 매칭도 체크 (기존 로직 유지)
    for (const pattern of URLS.excludePopup) {
        const patternWithoutHash = pattern.split('#')[0];
        
        if (currentPath.includes(pattern) || currentPath.includes(patternWithoutHash) ||
            decodedPath.includes(pattern) || decodedPath.includes(patternWithoutHash)) {
            console.log('경로 패턴 매칭됨:', pattern);
            return true;
        }
        
        if (currentUrl.includes(pattern) || decodedUrl.includes(pattern)) {
            console.log('URL 패턴 매칭됨:', pattern);
            return true;
        }
    }
    
    console.log('페이지 포함됨');
    return false;
}

// 제외 페이지에서는 스크립트 종료
if (shouldExcludePage()) {
    console.log('This page is excluded from popup/banner functionality');
} else {
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
            
            // 모바일에서는 팝업 표시하지 않음
            if (isMobileDevice()) {
                console.log('모바일 기기에서는 팝업을 표시하지 않습니다');
                return;
            }
            
            const el = getElement('posPopupOverlay');
            if (el) {
                el.classList.add('pos-show');
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
            }
        },
        
        close() {
            const el = getElement('posPopupOverlay');
            if (el) {
                el.classList.remove('pos-show');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                storage.set('pos_popup_closed', 'true');
            }
        },
        
        action(url) {
            window.open(url, '_blank');
            const el = getElement('posPopupOverlay');
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
            const el = getElement('posFloatingBanner');
            if (el) {
                el.classList.remove('pos-hidden');
                el.classList.add('pos-show');
            }
        },
        
        close() {
            const el = getElement('posFloatingBanner');
            if (el) {
                el.classList.add('pos-hidden');
                storage.set('pos_banner_closed', 'true');
            }
        },
        
        click() {
            window.open(getUrlByReferrer(URLS.banner), '_blank');
            const el = getElement('posFloatingBanner');
            if (el) {
                el.classList.add('pos-hidden');
                storage.set('pos_banner_closed', 'true');
            }
        }
    };

    // Global action handlers - 원래 구조 유지하되 전역에서 접근 가능하도록
    function handleMainAction() { popup.action(getUrlByReferrer(URLS.welfare)); }
    function handleDirectAction() { popup.action(getUrlByReferrer(URLS.insurance)); }
    function handleBannerClick() { banner.click(); }
    function closePopup() { popup.close(); }
    function closeBanner() { banner.close(); }

    // 전역 스코프에 함수들 등록
    window.handleMainAction = handleMainAction;
    window.handleDirectAction = handleDirectAction;
    window.handleBannerClick = handleBannerClick;
    window.closePopup = closePopup;
    window.closeBanner = closeBanner;

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
        const overlay = getElement('posPopupOverlay');
        if (overlay) {
            overlay.addEventListener('click', e => {
                if (e.target === overlay) popup.close();
            });
        }
        
        // Banner click handler
        const bannerEl = getElement('posFloatingBanner');
        if (bannerEl) {
            bannerEl.addEventListener('click', e => {
                if (!e.target.closest('.pos-close-btn') && !e.target.closest('.pos-banner-button')) {
                    banner.click();
                }
            });
        }
    });
}

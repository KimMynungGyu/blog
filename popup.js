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
    // 팝업이 뜨지 않을 페이지들 - Set으로 변환하여 O(1) 검색
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

// 캐시된 값들
let cachedReferrerType = null;
let cachedDomElements = {};
const isProduction = typeof console === 'undefined' || !console.log;

// 개발 모드에서만 로그 출력
const log = isProduction ? () => {} : console.log.bind(console);

// 리퍼러 타입 캐싱 (한 번만 계산)
function getReferrerType() {
    if (cachedReferrerType !== null) return cachedReferrerType;
    
    const referrer = document.referrer;
    if (referrer.includes('neullida.kr')) {
        cachedReferrerType = 'neullida';
    } else if (referrer.includes('totalwellnessarena.com')) {
        cachedReferrerType = 'totalwellness';
    } else {
        cachedReferrerType = 'default';
    }
    
    log('리퍼러 타입:', cachedReferrerType);
    return cachedReferrerType;
}

// 리퍼러에 따라 적절한 URL 선택 (캐시된 타입 사용)
const getUrlByReferrer = (urlGroup) => urlGroup[getReferrerType()];

// 최적화된 페이지 제외 검사
function shouldExcludePage() {
    const currentUrl = window.location.href;
    const currentUrlWithoutHash = currentUrl.split('#')[0];
    
    // 직접 Set 검색 (O(1))
    if (URLS.excludePopup.has(currentUrl) || URLS.excludePopup.has(currentUrlWithoutHash)) {
        log('페이지 제외됨 (직접 매칭)');
        return true;
    }
    
    // URL 디코딩이 필요한 경우만 처리
    if (currentUrl.includes('%')) {
        try {
            const decodedUrl = decodeURIComponent(currentUrl);
            const decodedUrlWithoutHash = decodedUrl.split('#')[0];
            
            if (URLS.excludePopup.has(decodedUrl) || URLS.excludePopup.has(decodedUrlWithoutHash)) {
                log('페이지 제외됨 (디코딩 후 매칭)');
                return true;
            }
        } catch (e) {
            // 디코딩 실패 시 무시
        }
    }
    
    log('페이지 포함됨');
    return false;
}

// DOM 요소 캐싱
function getElement(id) {
    if (!cachedDomElements[id]) {
        cachedDomElements[id] = document.getElementById(id);
    }
    return cachedDomElements[id];
}

// 효율적인 Storage utility
const storage = (() => {
    let useSessionStorage = true;
    
    // 세션 스토리지 사용 가능 여부 확인
    try {
        sessionStorage.setItem('test', 'test');
        sessionStorage.removeItem('test');
    } catch {
        useSessionStorage = false;
    }
    
    return {
        set: (key, val) => {
            if (useSessionStorage) {
                sessionStorage.setItem(key, val);
            } else {
                window[key] = val;
            }
        },
        get: (key) => {
            return useSessionStorage ? sessionStorage.getItem(key) : window[key];
        }
    };
})();

// Popup management (최적화됨)
const popup = {
    isClosed: () => storage.get('pos_popup_closed') === 'true',
    
    show() {
        if (this.isClosed()) return;
        const el = getElement('posPopupOverlay');
        if (el) {
            el.classList.add('pos-show');
            // 스타일 변경을 한 번에 처리
            const style = document.documentElement.style;
            style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        }
    },
    
    close() {
        const el = getElement('posPopupOverlay');
        if (el) {
            el.classList.remove('pos-show');
            // 스타일 복원을 한 번에 처리
            const style = document.documentElement.style;
            style.overflow = '';
            document.body.style.overflow = '';
            storage.set('pos_popup_closed', 'true');
        }
    },
    
    action(url) {
        window.open(url, '_blank');
        this.close();
    }
};

// Banner management (최적화됨)
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
        this.close();
    }
};

// 제외 페이지에서는 스크립트 종료
if (shouldExcludePage()) {
    log('This page is excluded from popup/banner functionality');
} else {
    // Global action handlers (arrow functions로 최적화)
    const handleMainAction = () => popup.action(getUrlByReferrer(URLS.welfare));
    const handleDirectAction = () => popup.action(getUrlByReferrer(URLS.insurance));
    const handleBannerClick = () => banner.click();
    const closePopup = () => popup.close();
    const closeBanner = () => banner.close();

    // 이벤트 핸들러들을 미리 정의 (재생성 방지)
    const keydownHandler = (e) => {
        if (e.key === 'Escape') popup.close();
    };
    
    const overlayClickHandler = (e) => {
        if (e.target === getElement('posPopupOverlay')) popup.close();
    };
    
    const bannerClickHandler = (e) => {
        if (!e.target.closest('.pos-close-btn') && !e.target.closest('.pos-banner-button')) {
            banner.click();
        }
    };

    // Initialize (최적화된 버전)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeComponents);
    } else {
        // 이미 로드된 경우 즉시 실행
        initializeComponents();
    }
    
    function initializeComponents() {
        // 타이머들을 한 번에 설정
        setTimeout(() => banner.show(), 1000);
        setTimeout(() => popup.show(), 3000);
        
        // 이벤트 리스너들을 효율적으로 등록
        document.addEventListener('keydown', keydownHandler);
        
        // DOM 요소들이 존재할 때만 이벤트 리스너 등록
        const overlay = getElement('posPopupOverlay');
        if (overlay) {
            overlay.addEventListener('click', overlayClickHandler);
        }
        
        const bannerEl = getElement('posFloatingBanner');
        if (bannerEl) {
            bannerEl.addEventListener('click', bannerClickHandler);
        }
    }
}

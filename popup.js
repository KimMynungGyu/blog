// Configuration URLs - 리퍼러에 따라 다른 URL 사용
const URLS = {
    welfare: {
        neullida: 'https://health.neullida.kr/정부지원금/#section1',
        totalwellness: 'https://spa.totalwellnessarena.com/custom-welfare-bokjiro-guide/',
        default: 'https://health.neullida.kr/정부지원금/#section1'
    },
    insurance: {
        neullida: 'https://info.neullida.kr/정부지원금/#section2',
        totalwellness: 'https://spa.totalwellnessarena.com/korea-insurance-claim-guide/',
        default: 'https://info.neullida.kr/정부지원금/#section2'
    },
    banner: {
        neullida: 'https://level.neullida.kr/정부지원금/#section3',
        totalwellness: 'https://spa.totalwellnessarena.com/korea-insurance-claim-guide/',
        default: 'https://level.neullida.kr/정부지원금/#section3'
    },
    // 팝업이 뜨지 않을 페이지들
    excludePopup: [
        'https://health.neullida.kr/정부지원금/',
        'https://info.neullida.kr/정부지원금/',
        'https://level.neullida.kr/정부지원금/',
        'https://spa.totalwellnessarena.com/custom-welfare-bokjiro-guide/',
        'https://spa.totalwellnessarena.com/korea-insurance-claim-guide/',
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
        'https://neullida.kr/한부모가족지원금/'
    ]
};

// 리퍼러에 따라 적절한 URL 선택
function getUrlByReferrer(urlGroup) {
    const referrer = document.referrer;
    console.log('리퍼러:', referrer); // 디버깅용
    
    if (referrer.includes('neullida.kr')) {
        console.log('neullida.kr에서 방문');
        return urlGroup.neullida;
    } else if (referrer.includes('totalwellnessarena.com')) {
        console.log('totalwellnessarena.com에서 방문');
        return urlGroup.totalwellness;
    } else {
        console.log('기타 사이트에서 방문, 기본 URL 사용');
        return urlGroup.default;
    }
}

// 현재 페이지가 제외 대상인지 확인
function shouldExcludePage() {
    const currentPath = window.location.pathname;
    const currentUrl = window.location.href;
    
    console.log('현재 페이지 체크:', currentPath, currentUrl); // 디버깅용
    
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
    
    console.log('디코딩된 URL:', decodedPath, decodedUrl); // 디버깅용
    
    // # 해시 제거한 URL도 준비
    const currentUrlWithoutHash = currentUrl.split('#')[0];
    const decodedUrlWithoutHash = decodedUrl.split('#')[0];
    
    // URLS.excludePopup만 체크
    const allExcludedPages = URLS.excludePopup;
    
    console.log('제외 페이지 목록:', allExcludedPages); // 디버깅용
    
    const isExcluded = allExcludedPages.some(pattern => {
        // 원본 URL과 디코딩된 URL 모두 체크
        const pathsToCheck = [currentPath, decodedPath];
        const urlsToCheck = [
            currentUrl, 
            decodedUrl, 
            currentUrlWithoutHash, 
            decodedUrlWithoutHash
        ];
        
        // 패턴도 # 제거한 버전 준비
        const patternWithoutHash = pattern.split('#')[0];
        const patternsToCheck = [pattern, patternWithoutHash];
        
        // 경로 매칭 체크
        for (const path of pathsToCheck) {
            for (const pat of patternsToCheck) {
                if (path === pat) {
                    console.log('경로 매칭됨:', path, '===', pat);
                    return true;
                }
                if (path.includes(pat)) {
                    console.log('경로 포함됨:', path, 'includes', pat);
                    return true;
                }
            }
        }
        
        // 전체 URL 매칭 체크
        for (const url of urlsToCheck) {
            for (const pat of patternsToCheck) {
                if (url.includes(pat)) {
                    console.log('URL 포함됨:', url, 'includes', pat);
                    return true;
                }
                // 정확한 URL 매칭 (도메인 포함)
                if (url === pat) {
                    console.log('URL 매칭됨:', url, '===', pat);
                    return true;
                }
            }
        }
        
        return false;
    });
    
    console.log('페이지 제외 여부:', isExcluded); // 디버깅용
    return isExcluded;
}

// 제외 페이지에서는 스크립트 종료
if (shouldExcludePage()) {
    console.log('This page is excluded from popup/banner functionality');
    // 스크립트 실행 중단
} else {
    // 기존 스크립트 실행
    
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
            window.open(getUrlByReferrer(URLS.banner), '_blank');
            const el = document.getElementById('posFloatingBanner');
            if (el) {
                el.classList.add('pos-hidden');
                storage.set('pos_banner_closed', 'true');
            }
        }
    };

    // Global action handlers
    function handleMainAction() { popup.action(getUrlByReferrer(URLS.welfare)); }
    function handleDirectAction() { popup.action(getUrlByReferrer(URLS.insurance)); }
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

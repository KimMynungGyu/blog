<script>
setTimeout(function () {
	const dragSensitivity = 0.55; // 드래그 민감도
	const clickTolerance = 0;   // 클릭 간주 기준 (px), 0: 클릭 시 이동 안함. 클릭 시 이동하려면 1~3값 설정 고려.
	const dragRatioThreshold = 0.55; // 배너 너비 대비 드래그 비율, 배너 드래그 후 드롭 시.
	const newWindow = 1; // 1: 새 창, 0: 현재 창

	const bannerConfigs = [
		{
			selector: '.sliding-banner-300',
			width: 300,
			height: 300,
			id: '801591',
			trackingCode: 'AF1728660', // 본인의 추적 코드로 대체
			subId: '',
			tsource: '',
			background: 'https://cdn.jsdelivr.net/gh/KimMynungGyu/blog@main/600x600-back2.webp',
			cover: 'https://cdn.jsdelivr.net/gh/KimMynungGyu/blog@main/WOW-30Ox25O-cover-left.webp',
			arrowIcon: 'https://cdn.jsdelivr.net/gh/KimMynungGyu/blog@main/arrowbtn.webp',
			dragDirection: 'left'
		},
		{
			selector: '.sliding-banner-150',
			width: 320,
			height: 150,
			id: '884870',
			trackingCode: 'AF1728660', // 본인의 추적 코드로 대체
			subId: '',
			tsource: '',
			background: 'https://cdn.jsdelivr.net/gh/KimMynungGyu/blog@main/640x300-back2.webp',
			cover: 'https://cdn.jsdelivr.net/gh/KimMynungGyu/blog@main/WOW-32Ox15O-cover-left.webp',
			arrowIcon: 'https://cdn.jsdelivr.net/gh/KimMynungGyu/blog@main/arrowbtn.webp',
			dragDirection: 'left'
		},
		{
			selector: '.sliding-banner-250',
			width: 300,
			height: 250,
			id: '884871',
			trackingCode: 'AF1728660', // 본인의 추적 코드로 대체
			subId: '',
			tsource: '',
			background: 'https://cdn.jsdelivr.net/gh/KimMynungGyu/blog@main/600x500-back2.webp',
			cover: 'https://cdn.jsdelivr.net/gh/KimMynungGyu/blog@main/WOW-30Ox25O-cover-left.webp',
			arrowIcon: 'https://cdn.jsdelivr.net/gh/KimMynungGyu/blog@main/arrowbtn.webp',
			dragDirection: 'left'
		},
		{
			selector: '.sliding-banner-280',
			width: 336,
			height: 280,
			id: '884871',
			trackingCode: 'AF1728660', // 본인의 추적 코드로 대체
			subId: '',
			tsource: '',
			background: 'https://cdn.jsdelivr.net/gh/KimMynungGyu/blog@main/600x500-back3.webp',
			cover: 'https://cdn.jsdelivr.net/gh/KimMynungGyu/blog@main/WOW-30Ox25O-cover-right.webp',
			arrowIcon: 'https://cdn.jsdelivr.net/gh/KimMynungGyu/blog@main/arrow-right.webp',
			dragDirection: 'right'
		}
	];

	const coupangLink = 'https://link.coupang.com/a/cI2Nxn'; // 본인의 간편 링크로 대체 📍

	function openLink(link) {
		if (newWindow) {
			window.open(link, '_blank');
		} else {
			history.replaceState(null, null, window.location.href);
			window.location.href = link;
		}
	}

	function generateIframeURL(config) {
		return `https://ads-partners.coupang.com/widgets.html?id=${config.id}&template=carousel&trackingCode=${config.trackingCode}&subId=${encodeURIComponent(config.subId || '')}&width=${config.width}&height=${config.height}&tsource=${encodeURIComponent(config.tsource || '')}`;
	}

	function createBanner(config) {
		const iframeURL = generateIframeURL(config);
		const wrapper = document.createElement('div');
		wrapper.innerHTML = `
			<div class="customBannerArea" style="width: ${config.width}px; height: ${config.height}px;">
				<div class="customBox" style="width: ${config.width}px; height: ${config.height}px; position: relative; cursor: grab;" draggable="false">
					<img src="${config.background}" class="backward" draggable="false">
					<iframe src="${iframeURL}" width="${config.width}" height="${config.height}" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics style="pointer-events: none;"></iframe>
					<div class="customBanner active" style="z-index: 3; ${config.dragDirection === 'right' ? 'right: -80px; left: auto;' : 'left: -40px;'}">
						<img src="${config.cover}" class="cover" style="pointer-events: none;" draggable="false">
						<p class="banner-bubble" style="line-height: 1.2rem!important; font-size: 12px !important; pointer-events: none; ${config.dragDirection === 'right' ? 'left: -40px; right: auto;' : 'right: -40px;'}">당겨주세요!</p>
						<div class="arrow" style="pointer-events: none; ${config.dragDirection === 'right' ? 'left: -10px; right: auto;' : 'right: -10px;'}">
							<img src="${config.arrowIcon}">
						</div>
					</div>
				</div>
			</div>
		`;
		return wrapper;
	}

// trigger event update

function setupDragEvents(dragTarget, animatedBanner, threshold, link, direction) {
	let startX = 0, diffX = 0, triggered = false, isDragging = false;

	function getClientX(e) {
		return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
	}

	function triggerOnce() {
		if (triggered) return;
		triggered = true;
		animatedBanner.style.transform = 'translateX(0)';
		animatedBanner.classList.add('active');
		openLink(link);
	}

	function startDrag(e) {
		if (e.type.startsWith('mouse') && e.button !== 0) return;
		isDragging = true;
		startX = getClientX(e);
		diffX = 0;
		triggered = false;
		animatedBanner.classList.remove('active');
		e.preventDefault();
	}

	function onDrag(e) {
		if (!isDragging) return;
		const currentX = getClientX(e);
		diffX = currentX - startX;

		if ((direction === 'left' && diffX < 0) || (direction === 'right' && diffX > 0)) {
			animatedBanner.style.transform = `translateX(${diffX}px)`;
			if (Math.abs(diffX) > threshold) {
				triggerOnce();
			}
			e.preventDefault();
		}
	}

	function endDrag() {
		if (!isDragging) return;
		isDragging = false;
		const dragRatio = Math.abs(diffX) / dragTarget.offsetWidth;

		if (Math.abs(diffX) < clickTolerance || (
			dragRatio >= dragRatioThreshold &&
			((direction === 'left' && diffX < 0) || (direction === 'right' && diffX > 0))
		)) {
			triggerOnce();
		} else {
			animatedBanner.style.transform = 'translateX(0)';
			animatedBanner.classList.add('active');
		}
		diffX = 0;
	}

	dragTarget.addEventListener('mousedown', startDrag);
	dragTarget.addEventListener('mousemove', onDrag);
	dragTarget.addEventListener('mouseup', endDrag);
	dragTarget.addEventListener('mouseleave', endDrag);
	dragTarget.addEventListener('touchstart', startDrag, { passive: false });
	dragTarget.addEventListener('touchmove', onDrag, { passive: false });
	dragTarget.addEventListener('touchend', endDrag);
}

// end

	bannerConfigs.forEach(config => {
		const targets = document.querySelectorAll(config.selector);
		if (targets.length === 0) return;
		targets.forEach(target => {
			target.innerHTML = '';
			const banner = createBanner(config);
			target.appendChild(banner);
			const customBox = banner.querySelector('.customBox');
			const animatedBanner = banner.querySelector('.customBanner');
			const threshold = config.width * dragSensitivity;
			setupDragEvents(customBox, animatedBanner, threshold, coupangLink, config.dragDirection);
		});
	});
}, 100);
</script>

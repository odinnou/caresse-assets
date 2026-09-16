(function () {
    var userAgent = navigator.userAgent || navigator.vendor || '';
    var isAndroid = /Android/i.test(userAgent);
    var isIOS = /iPhone|iPad|iPod/i.test(userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var language = (document.documentElement.lang || 'fr').toLowerCase().split('-')[0];
    var unavailableCopy = {
        fr: {
            label: 'Temporairement indisponible',
            title: 'Application Android temporairement indisponible',
            message: 'Caresse a été retirée du Play Store. Nous faisons le nécessaire pour qu’elle revienne au plus vite.'
        },
        en: {
            label: 'Temporarily unavailable',
            title: 'Android app temporarily unavailable',
            message: 'Caresse has been removed from Google Play. We are working to bring it back as soon as possible.'
        },
        es: {
            label: 'No disponible temporalmente',
            title: 'Aplicación Android no disponible temporalmente',
            message: 'Caresse ha sido retirada de Google Play. Estamos trabajando para que vuelva lo antes posible.'
        }
    };
    var copy = unavailableCopy[language] || unavailableCopy.en;

    var availabilityStyle = document.createElement('style');
    availabilityStyle.textContent = [
        '.android-store-unavailable{cursor:not-allowed!important;opacity:.45!important;filter:grayscale(1);pointer-events:none!important;transform:none!important}',
        '.store-badge.gplay.android-store-unavailable{position:relative}',
        '.store-badge.gplay.android-store-unavailable::after{content:attr(data-store-unavailable-label);position:absolute;inset:50% auto auto 50%;transform:translate(-50%,-50%);padding:5px 9px;border-radius:999px;background:rgba(26,26,46,.9);color:#fff;font:700 12px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;white-space:nowrap;filter:none}',
        'body.android-unavailable-notice-visible{padding-bottom:calc(126px + env(safe-area-inset-bottom))!important}',
        '.android-unavailable-notice{position:fixed;z-index:2147483647;left:50%;bottom:calc(12px + env(safe-area-inset-bottom));transform:translateX(-50%);width:min(calc(100% - 24px),680px);display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border:1px solid rgba(147,97,253,.3);border-radius:16px;background:#fff;color:#1a1a2e;box-shadow:0 12px 40px rgba(63,35,90,.24);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-align:left}',
        '.android-unavailable-notice-icon{flex:0 0 auto;font-size:1.25rem;line-height:1.35}',
        '.android-unavailable-notice-copy{min-width:0}',
        '.android-unavailable-notice-title{display:block;margin:0 0 2px;color:#5d3d8c;font-size:.95rem;line-height:1.35;font-weight:800}',
        '.android-unavailable-notice-message{display:block;margin:0;color:#4f4f69;font-size:.88rem;line-height:1.45}',
        '@media(max-width:480px){.android-unavailable-notice{padding:12px 14px}.android-unavailable-notice-title{font-size:.9rem}.android-unavailable-notice-message{font-size:.82rem}}'
    ].join('');
    document.head.appendChild(availabilityStyle);

    function isCaressePlayStoreLink(link) {
        var href = link && link.getAttribute && link.getAttribute('href');
        return !!href && /play\.google\.com\/store\/apps\/details/i.test(href) &&
            /(?:[?&]id=|%3Fid%3D)com\.flareai\.caresse/i.test(href);
    }

    function disablePlayStoreLinks() {
        Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (link) {
            if (!isCaressePlayStoreLink(link)) return;
            link.classList.add('android-store-unavailable');
            link.setAttribute('aria-disabled', 'true');
            link.setAttribute('data-store-unavailable-label', copy.label);
            link.setAttribute('title', copy.label);
            link.removeAttribute('href');
            link.removeAttribute('target');
            link.removeAttribute('rel');
        });

        var downloadPageLink = document.getElementById('android-link');
        if (downloadPageLink) downloadPageLink.textContent = copy.title;
    }

    disablePlayStoreLinks();
    document.addEventListener('click', function (event) {
        var link = event.target.closest && event.target.closest('a');
        if (link && (link.classList.contains('android-store-unavailable') || isCaressePlayStoreLink(link))) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);

    if (isAndroid) {
        var notice = document.createElement('aside');
        notice.className = 'android-unavailable-notice';
        notice.setAttribute('role', 'status');
        notice.setAttribute('aria-live', 'polite');

        var noticeIcon = document.createElement('span');
        noticeIcon.className = 'android-unavailable-notice-icon';
        noticeIcon.setAttribute('aria-hidden', 'true');
        noticeIcon.textContent = '⚠️';

        var noticeCopy = document.createElement('span');
        noticeCopy.className = 'android-unavailable-notice-copy';

        var noticeTitle = document.createElement('strong');
        noticeTitle.className = 'android-unavailable-notice-title';
        noticeTitle.textContent = copy.title;

        var noticeMessage = document.createElement('span');
        noticeMessage.className = 'android-unavailable-notice-message';
        noticeMessage.textContent = copy.message;

        noticeCopy.appendChild(noticeTitle);
        noticeCopy.appendChild(noticeMessage);
        notice.appendChild(noticeIcon);
        notice.appendChild(noticeCopy);
        document.body.appendChild(notice);
        document.body.classList.add('android-unavailable-notice-visible');
        return;
    }

    var source = document.querySelector('#hero-cta, #hero-store-cta, #demo-store-cta, #post-listen-store-cta');
    if (!source) return;

    var autoStoreLinks = document.querySelectorAll('a[data-store-auto]');
    if (autoStoreLinks.length) {
        if (isIOS) {
            document.documentElement.classList.add('store-platform-known');
        } else if (source.hasAttribute('data-store-auto')) {
            return;
        }
    }

    var style = document.createElement('style');
    style.textContent = [
        '.mobile-store-cta{display:none}',
        '@media(max-width:768px){',
        'body{padding-bottom:calc(84px + env(safe-area-inset-bottom))}',
        '.mobile-store-cta{position:fixed;z-index:1000;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));display:flex;justify-content:center;pointer-events:none;opacity:0;transform:translateY(18px);transition:opacity .2s ease,transform .2s ease}',
        '.mobile-store-cta.is-visible{opacity:1;transform:translateY(0)}',
        '.mobile-store-cta a{width:min(100%,460px);padding:15px 22px;border-radius:16px;background:var(--grad-pink);color:#fff;box-shadow:0 10px 30px rgba(63,35,90,.3);font-weight:700;text-align:center;text-decoration:none;pointer-events:none}',
        '.mobile-store-cta.is-visible a{pointer-events:auto}',
        '}',
        '@media(prefers-reduced-motion:reduce){.mobile-store-cta{transition:none}}'
    ].join('');
    document.head.appendChild(style);

    var sticky = document.createElement('div');
    sticky.className = 'mobile-store-cta';
    sticky.setAttribute('aria-hidden', 'true');

    var link = document.createElement('a');
    link.href = source.href;
    link.target = source.target || '_blank';
    link.rel = 'noopener';
    link.textContent = source.textContent.trim().replace(/\s+/g, ' ');
    link.addEventListener('click', function () {
        link.href = source.href;
    });
    sticky.appendChild(link);
    document.body.appendChild(sticky);

    var sourceVisible = true;
    var footerVisible = false;
    var visibleInlineLinks = [];
    function updateSticky() {
        var visible = !sourceVisible && !footerVisible && visibleInlineLinks.length === 0;
        sticky.classList.toggle('is-visible', visible);
        sticky.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }

    new IntersectionObserver(function (entries) {
        sourceVisible = entries[0].isIntersecting;
        updateSticky();
    }).observe(source);

    Array.prototype.forEach.call(document.querySelectorAll('a[data-cta-position="inline"]'), function (inlineLink) {
        new IntersectionObserver(function (entries) {
            var index = visibleInlineLinks.indexOf(inlineLink);
            if (entries[0].isIntersecting && index === -1) {
                visibleInlineLinks.push(inlineLink);
            } else if (!entries[0].isIntersecting && index !== -1) {
                visibleInlineLinks.splice(index, 1);
            }
            updateSticky();
        }).observe(inlineLink);
    });

    var footer = document.querySelector('footer');
    if (footer) {
        new IntersectionObserver(function (entries) {
            footerVisible = entries[0].isIntersecting;
            updateSticky();
        }).observe(footer);
    }
})();

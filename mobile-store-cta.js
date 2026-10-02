(function () {
    var source = document.querySelector('#hero-cta, #hero-store-cta, #demo-store-cta, #post-listen-store-cta');
    if (!source) return;

    var autoStoreLinks = document.querySelectorAll('a[data-store-auto]');
    if (autoStoreLinks.length) {
        var userAgent = navigator.userAgent || navigator.vendor || '';
        var isAndroid = /Android/i.test(userAgent);
        var isIOS = /iPhone|iPad|iPod/i.test(userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        if (isAndroid) {
            Array.prototype.forEach.call(autoStoreLinks, function (link) {
                link.href = 'https://play.google.com/store/apps/details?id=studio.mokuton.caresse';
            });
        }

        if (isAndroid || isIOS) {
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

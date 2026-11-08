(function () {
    // Local previews must never create production conversion events.
    if (window.location.hostname !== 'caresse.app') return;

    var now = Date.now();
    var visitStartedAt = now;
    var lastSeenAt = now;
    var firstLinkClicked = false;
    var firstStoreClicked = false;
    var landingPage = window.location.pathname;
    var visitTimeoutMs = 30 * 60 * 1000;
    var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    var campaign = getCampaign();
    var testParameter = new URLSearchParams(window.location.search).get('analytics_test');
    var isTest = testParameter === '1';
    var acquisitionReferrer = getRedirectReferrer();
    var acquisitionSource = getAcquisitionSource();

    function normalizeCampaign(values) {
        var result = {};
        if (!values || typeof values !== 'object') return result;
        utmKeys.forEach(function (key) {
            var value = values[key];
            if (typeof value === 'string' && value.trim()) {
                result[key] = value.trim().slice(0, key === 'utm_source' ? 64 : 128);
            }
        });
        return result;
    }

    function getCampaign() {
        var params = new URLSearchParams(window.location.search);
        var values = {};
        utmKeys.forEach(function (key) { values[key] = params.get(key); });
        return normalizeCampaign(values);
    }

    function getRedirectReferrer() {
        // An old demo URL must not turn an external acquisition into "direct".
        try {
            var raw = sessionStorage.getItem('caresse_redirect_context');
            if (raw) {
                sessionStorage.removeItem('caresse_redirect_context');
                var context = JSON.parse(raw);
                var age = now - context.created_at;
                if (context.target_path === window.location.pathname &&
                    age >= 0 && age <= 30000 && typeof context.referrer === 'string') {
                    return context.referrer;
                }
            }
        } catch (_) {}
        return document.referrer;
    }

    function getAcquisitionSource() {
        var source = campaign.utm_source;
        var referrerHost = '';
        try {
            if (acquisitionReferrer) referrerHost = new URL(acquisitionReferrer).hostname;
        } catch (_) {}
        if (source === 'chatgpt.com' || source === 'openai') return 'chatgpt';
        if (source) return source;
        if (referrerHost === 'chatgpt.com') return 'chatgpt';
        if (/(^|\.)corp\.google\.com$/.test(referrerHost)) return referrerHost;
        if (referrerHost === 'google.com' || /(^|\.)google\.[a-z.]+$/.test(referrerHost) ||
            referrerHost === 'com.google.android.googlequicksearchbox') return 'google';
        if (referrerHost && referrerHost !== window.location.hostname) return referrerHost;
        return 'direct_or_unknown';
    }

    function saveVisit() {
        try {
            sessionStorage.setItem('caresse_visit_started_at', String(visitStartedAt));
            sessionStorage.setItem('caresse_last_seen_at', String(lastSeenAt));
            sessionStorage.setItem('caresse_landing_page', landingPage);
            sessionStorage.setItem('caresse_acquisition_source', acquisitionSource);
            sessionStorage.setItem('caresse_utm', JSON.stringify(campaign));
            sessionStorage.setItem('caresse_analytics_test', isTest ? '1' : '0');
            sessionStorage.setItem('caresse_link_clicked', firstLinkClicked ? '1' : '0');
            sessionStorage.setItem('caresse_store_clicked', firstStoreClicked ? '1' : '0');
        } catch (_) {
            // Session storage is optional; store navigation never depends on it.
        }
    }

    try {
        var storedVisitStartedAt = Number(sessionStorage.getItem('caresse_visit_started_at'));
        var storedLastSeenAt = Number(sessionStorage.getItem('caresse_last_seen_at'));
        var continuesVisit = storedVisitStartedAt > 0 && storedVisitStartedAt <= now &&
            storedLastSeenAt > 0 && storedLastSeenAt <= now && now - storedLastSeenAt <= visitTimeoutMs;

        var storedCampaign = normalizeCampaign(JSON.parse(sessionStorage.getItem('caresse_utm') || '{}'));
        // A different tagged arrival starts a new attribution context. Reloading
        // the same campaign or following an untagged internal link keeps it.
        var newCampaign = Object.keys(campaign).length > 0 && utmKeys.some(function (key) {
            return campaign[key] !== storedCampaign[key];
        });

        if (continuesVisit && !newCampaign) {
            visitStartedAt = storedVisitStartedAt;
            firstLinkClicked = sessionStorage.getItem('caresse_link_clicked') === '1';
            firstStoreClicked = sessionStorage.getItem('caresse_store_clicked') === '1';
            landingPage = sessionStorage.getItem('caresse_landing_page') || landingPage;
            acquisitionSource = sessionStorage.getItem('caresse_acquisition_source') || acquisitionSource;
            campaign = storedCampaign;
            if (testParameter === null) isTest = sessionStorage.getItem('caresse_analytics_test') === '1';
        }
    } catch (_) {
        // Session storage is optional; tracking still works when it is unavailable.
    }
    saveVisit();

    function getStore(url) {
        // Competitor store links are editorial sources, not Caresse conversions.
        if (url.protocol !== 'https:') return null;
        if (url.hostname === 'apps.apple.com' && /\/id6758887086\/?$/.test(url.pathname)) {
            return 'app_store';
        }
        if (url.hostname === 'play.google.com' && url.pathname === '/store/apps/details' &&
            url.searchParams.get('id') === 'studio.mokuton.caresse') {
            return 'google_play';
        }
        return null;
    }

    function getPosition(link) {
        if (link.dataset.ctaPosition) return link.dataset.ctaPosition;
        if (link.closest('.mobile-store-cta')) return 'sticky';
        if (link.id === 'post-listen-store-cta') return 'post_listen';
        if (link.closest('.hero') || /^hero-/.test(link.id)) return 'hero';
        if (link.closest('footer')) return 'footer';
        if (link.classList.contains('store-badge')) return 'store_badge';
        return 'inline';
    }

    document.addEventListener('click', function (event) {
        var link = event.target.closest && event.target.closest('a[href]');
        if (!link) return;

        var clickedAt = Date.now();
        if (clickedAt - lastSeenAt > visitTimeoutMs) {
            visitStartedAt = clickedAt;
            landingPage = window.location.pathname;
            campaign = getCampaign();
            acquisitionSource = getAcquisitionSource();
            firstLinkClicked = false;
            firstStoreClicked = false;
        }
        lastSeenAt = clickedAt;
        var isFirstLinkClick = !firstLinkClicked;
        firstLinkClicked = true;
        saveVisit();

        try {
            var destination = new URL(link.href, window.location.href);
            var store = getStore(destination);
            if (!store) return;
            var isFirstStoreClick = !firstStoreClicked;
            firstStoreClicked = true;
            saveVisit();
            if (!window.umami || typeof window.umami.track !== 'function') return;

            var data = {
                store: store,
                landing_page: landingPage,
                cta_position: getPosition(link),
                locale: document.documentElement.lang || 'unknown',
                elapsed_ms: Math.max(0, Date.now() - visitStartedAt),
                first_link_click: isFirstLinkClick,
                first_store_click: isFirstStoreClick,
                acquisition_source: acquisitionSource,
                client_visit_started_at: new Date(visitStartedAt).toISOString(),
                visit_definition: 'client-30min-v3',
                store_click_definition: 'caresse-only-v1',
                variant: document.documentElement.dataset.analyticsVariant || 'store-first-v1',
                test: isTest
            };
            utmKeys.forEach(function (key) {
                if (campaign[key]) data[key] = campaign[key];
            });
            window.umami.track('store_click', data);
        } catch (_) {
            // Analytics must never interfere with the store navigation.
        }
    });
})();

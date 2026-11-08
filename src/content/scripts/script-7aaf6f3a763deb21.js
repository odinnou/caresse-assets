
        (function () {
            var targetPath = "/es/demo/pareja-dos-hombres/";
            var target = 'https://caresse.app' + targetPath + window.location.search + window.location.hash;
            try {
                sessionStorage.setItem('caresse_redirect_context', JSON.stringify({
                    target_path: targetPath, referrer: document.referrer, created_at: Date.now()
                }));
            } catch (_) {}
            document.querySelector('meta[http-equiv="refresh"]').setAttribute('content', '0; url=' + target);
            window.location.replace(target);
        })();
    
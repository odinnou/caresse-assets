
        // One player at a time
        document.addEventListener('play', function (e) {
            document.querySelectorAll('audio').forEach(function (a) {
                if (a !== e.target) a.pause();
            });
        }, true);

        // YouTube facade, loaded on click
        document.querySelectorAll('.video-facade').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.dataset.videoId;
                var iframe = document.createElement('iframe');
                iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
                iframe.title = btn.dataset.videoTitle || 'Caresse video';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                iframe.allowFullscreen = true;
                btn.replaceWith(iframe);
            });
        });
    
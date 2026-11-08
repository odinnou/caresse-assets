
        // Fachada de YouTube, cargada al hacer clic
        document.querySelectorAll('.video-facade').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.dataset.videoId;
                var iframe = document.createElement('iframe');
                iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
                iframe.title = btn.dataset.videoTitle || 'Vídeo Caresse';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                iframe.allowFullscreen = true;
                btn.replaceWith(iframe);
            });
        });
    
(function () {
    var userAgent = navigator.userAgent || navigator.vendor || '';
    // A smartphone crawler may identify as Android. Keep the fallback page visible.
    var bot = /bot|crawl|spider|slurp|bingpreview|google-inspectiontool|duckduckbot|baiduspider|yandex|facebookexternalhit|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkshare|w3c_validator|whatsapp|telegrambot|twitterbot|applebot|petalbot|ahrefsbot|semrushbot|mj12bot|dotbot|headlesschrome|lighthouse/i;
    if (bot.test(userAgent)) return;

    var isAndroid = /Android/i.test(userAgent);
    var isIOS = /iPhone|iPad|iPod/i.test(userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!isAndroid && !isIOS) return;

    var iosLink = document.getElementById('ios-link');
    var androidLink = document.getElementById('android-link');
    if (!iosLink || !androidLink) return;

    var primary = isAndroid ? androidLink : iosLink;
    var secondary = isAndroid ? iosLink : androidLink;
    primary.classList.remove('secondary');
    secondary.classList.add('secondary');
    primary.parentNode.insertBefore(primary, secondary);

    // Set the fallback first so it remains useful if the store does not open.
    window.location.replace(primary.href);
})();

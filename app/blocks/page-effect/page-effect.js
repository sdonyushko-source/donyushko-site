$(document).ready(function() {
    $(".page-effect").css("opacity", "1");

    $('a').click(function(e){
        var link = $(this);
        var redirect = link.attr('href');

        // leave external links, new-tab links, mail/phone links and anchors alone
        if (!redirect
            || redirect.charAt(0) === '#'
            || /^(mailto:|tel:)/i.test(redirect)
            || /^https?:\/\//i.test(redirect)
            || link.attr('target') === '_blank'
            || e.metaKey || e.ctrlKey || e.shiftKey) {
            return;
        }

        e.preventDefault();
        $('.page-effect').css("opacity", "0");

        setTimeout(function() {
            document.location.href = redirect
        }, 300);
    });
});

// coming back with the browser's back button must not leave a blank page
$(window).on('pageshow', function() {
    $('.page-effect').css('opacity', '1');
});

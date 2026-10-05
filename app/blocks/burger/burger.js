$(document).ready(function() {

    var menu = $('.mobile-menu');
    var burger = $('.burger');

    function openMenu() {
        menu.addClass('mobile-menu_open');
        burger.attr('aria-expanded', 'true');
        $('body').addClass('no-scroll');
    }

    function closeMenu() {
        menu.removeClass('mobile-menu_open');
        burger.attr('aria-expanded', 'false');
        $('body').removeClass('no-scroll');
    }

    burger.click(openMenu);
    $('.mobile-menu__close').click(closeMenu);

    $(document).keyup(function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

});

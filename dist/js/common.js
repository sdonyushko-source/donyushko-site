$(function() {

    // var form = $('form');
    // form.addEventListener('invalid', function(e) {
    //     e.preventDefault();
    // }, true);

    var inputs = $('.contact-input__input-field_required');
    var labels = $('.contact-input__text_required');
    var dots = $('.contact-input__dot_required');

    var buttonSend = $('.button_send');

    buttonSend.each(function() {
        $(this).click(function() {
            inputs.each(function () {
                $(this).addClass('contact-input__input-field_invalid')
            });
            labels.each(function () {
                $(this).addClass('contact-input__text_invalid')
            });
            dots.each(function () {
                $(this).addClass('contact-input__dot_invalid')
            });
        });
    });

    var serviceTags = $('.service-tag');
    var serviceInput = $('.section-contacts__services-input');

    serviceTags.each(function() {
        $(this).click(function() {
            if($(this).hasClass('service-tag_active')) {
                $(this).removeClass('service-tag_active');
            } else {
                $(this).addClass('service-tag_active');
            }

            var serviceTagsActive = $('.service-tag_active');
            var services = '';

            serviceTagsActive.each(function() {
                services += $(this).text() + ', ';
            });
            services = services.slice(0, -2);

            serviceInput.val(services);
        });
    });

});
$(function() {

    var projectsWeb = $('.section-projects__project_web');
    var projectsMobile = $('.section-projects__project_mobile');
    var projectsProto = $('.section-projects__project_proto');

    var buttonAll = $('.section-projects__type_all');
    var buttonWeb = $('.section-projects__type_web');
    var buttonMobile = $('.section-projects__type_mobile');
    var buttonProto = $('.section-projects__type_proto');

    buttonWeb.click(function() {
        $(this).addClass('section-projects__type_active');
        buttonAll.removeClass('section-projects__type_active');
        buttonMobile.removeClass('section-projects__type_active');
        buttonProto.removeClass('section-projects__type_active');

        projectsWeb.each(function() { $(this).removeClass('section-projects__project_hidden') });
        projectsMobile.each(function() { $(this).addClass('section-projects__project_hidden') });
        projectsProto.each(function() { $(this).addClass('section-projects__project_hidden') });
    });

    buttonMobile.click(function() {
        $(this).addClass('section-projects__type_active');
        buttonAll.removeClass('section-projects__type_active');
        buttonWeb.removeClass('section-projects__type_active');
        buttonProto.removeClass('section-projects__type_active');

        projectsMobile.each(function() { $(this).removeClass('section-projects__project_hidden') });
        projectsWeb.each(function() { $(this).addClass('section-projects__project_hidden') });
        projectsProto.each(function() { $(this).addClass('section-projects__project_hidden') });
    });

    buttonProto.click(function() {
        $(this).addClass('section-projects__type_active');
        buttonAll.removeClass('section-projects__type_active');
        buttonWeb.removeClass('section-projects__type_active');
        buttonMobile.removeClass('section-projects__type_active');

        projectsProto.each(function() { $(this).removeClass('section-projects__project_hidden') });
        projectsWeb.each(function() { $(this).addClass('section-projects__project_hidden') });
        projectsMobile.each(function() { $(this).addClass('section-projects__project_hidden') });
    });

    buttonAll.click(function() {
        $(this).addClass('section-projects__type_active');
        buttonWeb.removeClass('section-projects__type_active');
        buttonMobile.removeClass('section-projects__type_active');
        buttonProto.removeClass('section-projects__type_active');

        projectsWeb.each(function() { $(this).removeClass('section-projects__project_hidden') });
        projectsMobile.each(function() { $(this).removeClass('section-projects__project_hidden') });
        projectsProto.each(function() { $(this).removeClass('section-projects__project_hidden') });
    });
});
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

$(document).ready(function() {

    var buttonLang = $('.button_lang');

    buttonLang.each(function() {
        $(this).click(function() {
            setLang(getLang());
        });
    });

});

var lang = $.cookie("lang") ? $.cookie("lang") : "ru";
setLang(lang);

function getLang() {

    var body = $('body');
    return body.hasClass('ru') ? "en" : "ru";

}

function setLang(lang) {

    var body = $('body');
    if(lang === 'ru') {
        body.removeClass('en');
    } else {
        body.removeClass('ru');
    }
    body.addClass(lang);
    document.documentElement.setAttribute('lang', lang);

    $.cookie('lang', lang);

}

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

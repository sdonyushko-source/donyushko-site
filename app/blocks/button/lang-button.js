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

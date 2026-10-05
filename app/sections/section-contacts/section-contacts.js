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
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
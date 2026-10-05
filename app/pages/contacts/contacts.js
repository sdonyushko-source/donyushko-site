$(function() {

    var query = window.location.search;

    if (query.indexOf('sent=1') !== -1) {
        $('.form-note_sent').prop('hidden', false);
    } else if (query.indexOf('error=1') !== -1) {
        $('.form-note_error').prop('hidden', false);
    }

    // drop the flag from the address bar so a refresh does not repeat the message
    if (query && window.history && history.replaceState) {
        history.replaceState(null, '', window.location.pathname);
    }

});

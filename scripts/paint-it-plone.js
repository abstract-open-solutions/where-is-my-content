(function($) {
    $.extend(true, $.deck.defaults, {
        countNested: false
    });

    $(document).bind("deck.init", function() {
        prettyPrint();
    });

    $(document).presenter({
        totalTime: 35*60
    });

    $.deck('.slide');
})(jQuery);

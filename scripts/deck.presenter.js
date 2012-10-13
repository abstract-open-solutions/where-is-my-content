(function($) {

    $.fn.presenter = function(options) {
        opts = {
            totalTime: 60*60,
            interval: 60,
            hurryUpTime: 8*60,
            wrapUpTime: 2*60
        };
        var presenter = /presenter:(on|off)/.exec(document.location.href);
        var slide = /slide:([0-9]+)/.exec(document.location.href);
        if(slide) slide = parseInt(slide[1], 10);
        else slide = 0;
        if(presenter) presenter = presenter[1];
        else presenter = 'off';
        $.extend(opts, options);
        var socket = io.connect('http://localhost:8000');
        switch(presenter) {
            case "on": {
                $('.deck-presenter').show();
                var timer = opts.totalTime;
                var showTimer = function() {
                    var class_ = 'normal';
                    if(timer <= opts.wrapUpTime) class_='wrapup';
                    else if(timer <= opts.hurryUpTime) class_='hurryup';
                    $('.deck-presenter dd.deck-presenter-remaining').empty().
                        append(
                            $('<span>').text(
                                Math.floor(timer/60)+"m").attr('class', class_));
                };
                showTimer();
                var interval = null;
                var start = function() {
                    interval = window.setInterval(
                        function() {
                            timer = timer - opts.interval;
                            showTimer();
                        },
                        opts.interval*1000);
                };
                var stop = function() {
                    if(interval)
                        window.clearInterval(interval);
                    timer = opts.totalTime;
                    showTimer();
                };
                $('.deck-presenter a.deck-presenter-button').click(
                    function(e) {
                        e.preventDefault();
                        if(!interval) {
                            start();
                            $(this).text("Stop");
                            $(this).toggleClass("start stop");
                        }
                        else {
                            stop();
                            $(this).text("Start");
                            $(this).toggleClass("start stop");
                        }
                    }
                );
                var goTo = function(to, emit) {
                    var slide = $.deck('getSlide', to);
                    var notes = $('.presenter-notes', slide).html();
                    if(!notes)
                        notes = '<p>No notes</p>';
                    $('.deck-presenter dd.deck-presenter-notes').html(notes);
                    if(emit) {
                        socket.emit("presenter-source", {
                            changeTo: to
                        });
                    }
                };
                $(document).bind('deck.init', function() {
                    $.deck('go', slide);
                    goTo(slide, true);
                });
                socket.on('connect', function () {
                    $(document).bind('deck.change', function(event, from, to) {
                        goTo(to, true);
                    });
                });
                break;
            }
            case "off": {
                $('.deck-status').hide();
                $('.deck-prev-link, .deck-next-link').hide();
                socket.on('presenter-sink', function(data) {
                    var current = $.deck('getSlide');
                    var to = data.changeTo;
                    if(current != to)
                        $.deck('go', to);
                });
                break;
            }
            default:
                throw "Couldn't determine presenter mode";
                break;
        }
    };
})(jQuery);

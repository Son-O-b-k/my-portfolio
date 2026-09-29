/*!
 * Success .O.N — portfolio interactions
 * Scaffolded from the "JohnDoe" template (c) 2019 DevCRUD — MIT, see LICENSE.txt
 */
(function ($) {
    'use strict';

    var $win = $(window);
    var $nav = $('#siteNav');
    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* -- current year ---------------------------------------------------- */
    $('#year').text(new Date().getFullYear());

    /* -- condense nav + back-to-top on scroll ---------------------------- */
    function onScroll() {
        var y = $win.scrollTop();
        $nav.toggleClass('is-stuck', y > 24);
        $('#toTop').toggleClass('is-visible', y > 600);
    }
    $win.on('scroll', onScroll);
    onScroll();

    /* -- smooth scroll with fixed-nav offset ----------------------------- */
    $(document).on('click', 'a[href^="#"]:not([href="#"]):not([data-toggle])', function (e) {
        var $target = $(this.hash);
        if (!$target.length) { return; }
        e.preventDefault();

        var top = $target.offset().top - ($nav.outerHeight() || 0) - 12;

        $('html, body').animate({ scrollTop: top }, reduceMotion ? 0 : 650, function () {
            if (history.replaceState) {
                history.replaceState(null, '', window.location.pathname + this.hash);
            }
        }.bind(this));

        // close the mobile menu after navigating
        $('#navMenu').collapse('hide');
    });

    /* -- scrollspy: highlight the section you're in ---------------------- */
    var $links = $('.site-nav .nav-link[href^="#"]');
    var sections = $links.map(function () {
        var el = document.querySelector(this.getAttribute('href'));
        return el ? { id: this.getAttribute('href'), el: el } : null;
    }).get();

    function spy() {
        var pos = $win.scrollTop() + ($nav.outerHeight() || 0) + 80;
        var current = null;
        sections.forEach(function (s) {
            if (s.el.offsetTop <= pos) { current = s.id; }
        });
        $links.removeClass('active')
              .filter('[href="' + current + '"]').addClass('active');
    }
    $win.on('scroll', spy);
    spy();

    /* -- reveal on scroll ------------------------------------------------ */
    var $reveals = $('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        $reveals.addClass('is-visible');
    } else {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        $reveals.each(function () { io.observe(this); });
    }

    /* -- portfolio filtering (Isotope) ----------------------------------- */
    $win.on('load', function () {
        var $grid = $('.portfolio-container');
        if (!$grid.length || typeof $grid.isotope !== 'function') { return; }

        $grid.isotope({
            itemSelector: '.portfolio-cell',
            layoutMode: 'fitRows',
            transitionDuration: reduceMotion ? 0 : '0.45s'
        });

        $('.filters a').on('click', function (e) {
            e.preventDefault();
            var filter = $(this).attr('data-filter');
            $('.filters a').removeClass('active');
            $(this).addClass('active');
            $grid.isotope({ filter: filter });
        });

        // images finish decoding after layout — re-lay out once they land
        $grid.find('img').each(function () {
            if (this.complete) { return; }
            $(this).on('load', function () { $grid.isotope('layout'); });
        });
    });

})(jQuery);

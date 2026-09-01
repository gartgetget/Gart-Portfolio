(function() {
    var openBtn = document.getElementById('mobile-open-button');
    var closeBtn = document.getElementById('mobile-close-button');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileBackdrop = document.getElementById('mobile-menu-backdrop');

    function openMenu() {
        mobileMenu.classList.remove('hidden');
        mobileBackdrop.classList.remove('hidden');
        // Force reflow then add visible classes for transitions
        void mobileMenu.offsetWidth;
        mobileMenu.classList.add('visible');
        mobileBackdrop.classList.add('visible');
        openBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('visible');
        mobileBackdrop.classList.remove('visible');
        openBtn.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(function() {
            mobileMenu.classList.add('hidden');
            mobileBackdrop.classList.add('hidden');
        }, 400);
    }

    if (openBtn) {
        openBtn.addEventListener('click', function() {
            if (mobileMenu.classList.contains('visible')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', closeMenu);
    }

    // Close menu when a nav link is clicked
    var mobileLinks = document.querySelectorAll('.mobile-slide-link, #mobile-menu-logo, .mobile-hire-btn');
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });
})();

(function() {
    var floatingId = document.getElementById('floating-id');
    var idCard = document.getElementById('id-card');
    var idTitle = document.getElementById('id-title');
    var header = document.getElementById('site-header');

    if (!floatingId) return;

    // Per-section config: which corner the ID should float to
    var positions = {
        home:     { corner: 'top-right',    title: 'Frontend Developer' },
        about:    { corner: 'top-left',     title: 'CS Student' },
        timeline: { corner: 'bottom-right', title: 'CS Student' },
        skills:   { corner: 'top-left',     title: 'Tech Skills' },
        projects: { corner: 'bottom-left',  title: 'Developer' },
        contacts: { corner: 'bottom-center',title: 'Freelance' }
    };

    var currentTitle = positions.home.title;
    var currentSection = 'home';

    function computePosition(corner, cardW, cardH) {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var margin = 24;
        var topMargin = 130;
        switch (corner) {
            case 'top-right':   return { left: vw - cardW - margin, top: topMargin };
            case 'top-left':    return { left: margin, top: topMargin };
            case 'bottom-right':return { left: vw - cardW - margin, top: vh - cardH - margin };
            case 'bottom-left': return { left: margin, top: vh - cardH - margin };
            case 'bottom-center':return { left: (vw - cardW) / 2, top: vh - cardH - margin };
            default:            return { left: vw - cardW - margin, top: topMargin };
        }
    }

    function triggerRotation() {
        if (!idCard) return;
        // Remove then re-add to restart the animation
        idCard.classList.remove('rotating');
        void idCard.offsetWidth; // force reflow to restart animation
        idCard.classList.add('rotating');
        setTimeout(function() {
            idCard.classList.remove('rotating');
        }, 800);
    }

    function moveTo(corner, title) {
        var rect = floatingId.getBoundingClientRect();
        var cardW = rect.width || 300;
        var cardH = rect.height || 170;
        var target = computePosition(corner, cardW, cardH);
        floatingId.style.left = target.left + 'px';
        floatingId.style.top = target.top + 'px';
        if (title !== currentTitle) {
            idTitle.textContent = title;
            currentTitle = title;
        }
    }

    function onScroll() {
        if (header) {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        var sections = document.querySelectorAll('body > section[id]');
        var scrollPos = window.scrollY + window.innerHeight * 0.35;
        var active = 'home';

        sections.forEach(function(sec) {
            if (sec.offsetTop <= scrollPos) {
                active = sec.id;
            }
        });

        var config = positions[active];
        if (config) {
            moveTo(config.corner, config.title);
            if (active !== currentSection) {
                currentSection = active;
                triggerRotation();
            }
        }
    }

    // Position for the first paint
    setTimeout(function() {
        moveTo(positions.home.corner, currentTitle);
    }, 0);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function() {
        moveTo(positions[currentSection].corner, currentTitle);
    }, { passive: true });

    // Reveal-on-scroll animation
    var reveals = document.querySelectorAll('.reveal');
    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });
    reveals.forEach(function(el) {
        revealObserver.observe(el);
    });
    // Make the hero visible immediately
    document.querySelectorAll('#home .reveal').forEach(function(el) {
        el.classList.add('visible');
    });
})();

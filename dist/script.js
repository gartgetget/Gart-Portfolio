(function() {
    // ================= LOADING SCREEN =================
    var loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
            }, 1400);
        });
        // Fallback: hide after 3s even if load event is slow
        setTimeout(function() {
            loadingScreen.classList.add('hidden');
        }, 3000);
    }

    // ================= SCROLL PROGRESS BAR =================
    var scrollProgress = document.getElementById('scroll-progress');
    function updateScrollProgress() {
        if (!scrollProgress) return;
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ================= FOOTER YEAR =================
    var footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // ================= TYPING EFFECT =================
    var typedEl = document.getElementById('typed-text');
    if (typedEl) {
        var roles = ['Frontend Developer', 'UI/UX Designer', 'Graphic Designer', 'Web Developer'];
        var roleIndex = 0;
        var charIndex = 0;
        var isDeleting = false;
        var typingSpeed = 100;

        function typeEffect() {
            var currentRole = roles[roleIndex];
            if (isDeleting) {
                typedEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typedEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 400; // Pause before typing next
            }

            setTimeout(typeEffect, typingSpeed);
        }

        setTimeout(typeEffect, 800); // Start after loading screen
    }

    // ================= BACK TO TOP =================
    var backToTop = document.getElementById('back-to-top');
    function handleBackToTop() {
        if (!backToTop) return;
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', handleBackToTop, { passive: true });
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ================= MOBILE MENU =================
    var openBtn = document.getElementById('mobile-open-button');
    var closeBtn = document.getElementById('mobile-close-button');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileBackdrop = document.getElementById('mobile-menu-backdrop');

    function openMenu() {
        mobileMenu.classList.remove('hidden');
        mobileBackdrop.classList.remove('hidden');
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
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMenu);

    var mobileLinks = document.querySelectorAll('.mobile-slide-link, #mobile-menu-logo, .mobile-hire-btn');
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });

    // ================= FLOATING ID CARD =================
    var floatingId = document.getElementById('floating-id');
    var idCard = document.getElementById('id-card');
    var idTitle = document.getElementById('id-title');
    var header = document.getElementById('site-header');

    if (floatingId) {
        var positions = {
            home:       { corner: 'top-right',      title: 'Frontend Developer', tilt: -3 },
            about:      { corner: 'bottom-left',    title: 'CS Student',         tilt: 3 },
            timeline:   { corner: 'top-left',       title: 'CS Student',         tilt: 2 },
            experience: { corner: 'bottom-right',   title: 'Developer',          tilt: -2 },
            skills:     { corner: 'top-left',       title: 'Tech Skills',        tilt: 3 },
            projects:   { corner: 'bottom-left',    title: 'Developer',          tilt: 4 },
            contacts:   { corner: 'top-right',      title: 'Freelance',          tilt: -2 }
        };

        var currentTitle = positions.home.title;
        var currentSection = 'home';

        function computePosition(corner, cardW, cardH) {
            var vw = window.innerWidth;
            var vh = window.innerHeight;
            var margin = 28;
            var topMargin = 130;
            switch (corner) {
                case 'top-right':    return { left: vw - cardW - margin, top: topMargin };
                case 'top-left':     return { left: margin, top: topMargin };
                case 'bottom-right': return { left: vw - cardW - margin, top: vh - cardH - margin };
                case 'bottom-left':  return { left: margin, top: vh - cardH - margin };
                default:             return { left: vw - cardW - margin, top: topMargin };
            }
        }

        function triggerRotation() {
            if (!idCard) return;
            idCard.classList.remove('rotating');
            void idCard.offsetWidth;
            idCard.classList.add('rotating');
            setTimeout(function() {
                idCard.classList.remove('rotating');
            }, 1000);
        }

        function setTilt(deg) {
            floatingId.style.setProperty('--id-tilt', deg + 'deg');
            floatingId.style.transform = 'rotate(' + deg + 'deg)';
        }

        function moveTo(corner, title, tilt) {
            floatingId.classList.add('transitioning');
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
            setTilt(tilt);
            setTimeout(function() {
                floatingId.classList.remove('transitioning');
            }, 1300);
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
            var scrollPos = window.scrollY + window.innerHeight * 0.45;
            var active = 'home';

            sections.forEach(function(sec) {
                if (sec.offsetTop <= scrollPos) {
                    active = sec.id;
                }
            });

            var config = positions[active];
            if (config) {
                moveTo(config.corner, config.title, config.tilt);
                if (active !== currentSection) {
                    currentSection = active;
                    triggerRotation();
                }
            }
        }

        setTimeout(function() {
            moveTo(positions.home.corner, currentTitle, positions.home.tilt);
        }, 0);

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', function() {
            if (positions[currentSection]) {
                var cfg = positions[currentSection];
                moveTo(cfg.corner, currentTitle, cfg.tilt);
            }
        }, { passive: true });
    }

    // ================= REVEAL ON SCROLL =================
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
    document.querySelectorAll('#home .reveal').forEach(function(el) {
        el.classList.add('visible');
    });


})();

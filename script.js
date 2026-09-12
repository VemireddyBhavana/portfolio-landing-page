/**
 * ==========================================================================
 * Vemireddy Bhavana - Premium Developer Portfolio Logic
 * Features:
 * 1. Dual Independent Continuous Typewriter Engines (Hero & Status Badge)
 * 2. Standalone 3D Mathematical Orbit (Dynamic sin/cos calculation)
 * 3. Smooth Mouse-Follow 3D Tilt & Parallax Physics with Lerp Easing
 * 4. Fixed Navbar with Intersection Observer Active Link Highlighting
 * 5. Mobile Menu Drawer Toggle
 * 6. Responsive Orbit Geometry Calculations
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. TYPEWRITER ENGINE CLASS
       ========================================================================== */
    class Typewriter {
        constructor(element, words, options = {}) {
            this.element = element;
            this.words = words;
            this.typeSpeed = options.typeSpeed || 90;
            this.deleteSpeed = options.deleteSpeed || 45;
            this.pauseDelay = options.pauseDelay || 1600;
            this.startDelay = options.startDelay || 400;

            this.wordIndex = 0;
            this.charIndex = 0;
            this.isDeleting = false;
            this.timer = null;

            if (this.element && this.words.length > 0) {
                setTimeout(() => this.tick(), this.startDelay);
            }
        }

        tick() {
            const currentWord = this.words[this.wordIndex];

            if (this.isDeleting) {
                this.charIndex--;
            } else {
                this.charIndex++;
            }

            this.element.textContent = currentWord.substring(0, this.charIndex);

            let timeout = this.typeSpeed;

            if (this.isDeleting) {
                timeout = this.deleteSpeed;
            }

            if (!this.isDeleting && this.charIndex === currentWord.length) {
                // Finished typing word, pause before deleting
                timeout = this.pauseDelay;
                this.isDeleting = true;
            } else if (this.isDeleting && this.charIndex === 0) {
                // Finished deleting, move to next word
                this.isDeleting = false;
                this.wordIndex = (this.wordIndex + 1) % this.words.length;
                timeout = 400; // brief pause before typing next word
            }

            this.timer = setTimeout(() => this.tick(), timeout);
        }
    }

    // Initialize About Section "I am a" Typewriter (line 1)
    const aboutTypingEl = document.getElementById('about-typing');
    const aboutRoles = [
        "Web Developer",
        "Frontend Developer",
        "Problem Solver",
        "Computer Science Student",
        "UI Designer"
    ];
    if (aboutTypingEl) {
        new Typewriter(aboutTypingEl, aboutRoles, {
            typeSpeed: 80,
            deleteSpeed: 42,
            pauseDelay: 1800,
            startDelay: 400
        });
    }

    // Initialize About Section "Currently Working On" Typewriter (line 2)
    const aboutStatusTypingEl = document.getElementById('about-status-typing');
    const aboutFocus = [
        "Portfolio 2026",
        "React Mastery",
        "DSA Practice",
        "Clean Code",
        "AI Exploration"
    ];
    if (aboutStatusTypingEl) {
        new Typewriter(aboutStatusTypingEl, aboutFocus, {
            typeSpeed: 65,
            deleteSpeed: 32,
            pauseDelay: 2200,
            startDelay: 1000
        });
    }


    /* ==========================================================================
       2. FIXED NAVBAR SCROLL & ACTIVE LINK OBSERVER
       ========================================================================== */
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');

    // Header background blur intensification on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // Active link highlighting via Intersection Observer
    // Collect unique actual target elements referenced by nav links
    const observedTargets = [];
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target && !observedTargets.includes(target)) {
                observedTargets.push(target);
            }
        }
    });

    if ('IntersectionObserver' in window && observedTargets.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                    // Automatically update browser address bar ("upside route") on scroll
                    if (history.replaceState && window.location.hash !== `#${id}`) {
                        history.replaceState(null, null, `#${id}`);
                    }
                }
            });
        }, observerOptions);

        observedTargets.forEach(el => sectionObserver.observe(el));
    }


    /* ==========================================================================
       3. MOBILE MENU DRAWER TOGGLE
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close menu when clicking any navigation link
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && navLinksContainer.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    }


    /* =======================================================================
       4. SERVICE INQUIRY MODAL
       ======================================================================= */
    const inquiryModal = document.getElementById('inquiry-modal');
    const inquiryForm = document.getElementById('inquiry-form');
    const inquiryService = document.getElementById('inquiry-service');
    const inquirySuccess = document.getElementById('inquiry-success');
    const inquiryButtons = document.querySelectorAll('.service-inquiry');
    const talkButtons = document.querySelectorAll('.talk-btn');

    if (inquiryModal && inquiryForm && inquiryService) {
        let lastInquiryTrigger = null;

        const closeInquiryModal = () => {
            lastInquiryTrigger?.focus();
            inquiryModal.classList.remove('is-open');
            inquiryModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
        };

        const openInquiryModal = (service, trigger) => {
            lastInquiryTrigger = trigger;
            inquiryService.value = service;
            inquirySuccess.classList.remove('is-visible');
            inquiryModal.setAttribute('aria-hidden', 'false');
            inquiryModal.classList.add('is-open');
            document.body.classList.add('modal-open');
            window.setTimeout(() => inquiryForm.elements.name.focus(), 150);
        };

        inquiryButtons.forEach(button => {
            button.addEventListener('click', () => {
                openInquiryModal(button.dataset.service || '', button);
            });
        });

        talkButtons.forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopImmediatePropagation();
                openInquiryModal('Hire Me (Full-Time)', button);
            });
        });

        inquiryModal.querySelectorAll('[data-modal-close]').forEach(control => {
            control.addEventListener('click', closeInquiryModal);
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && inquiryModal.classList.contains('is-open')) {
                closeInquiryModal();
            }
        });

        inquiryForm.addEventListener('submit', event => {
            event.preventDefault();
            inquirySuccess.textContent = 'Thanks! Your inquiry has been received. I will get back to you soon.';
            inquirySuccess.classList.add('is-visible');
            inquiryForm.reset();
        });
    }


    /* ==========================================================================
       5. SMOOTH SCROLLING & ADDRESS BAR ROUTE UPDATE
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Update the browser URL address bar ("upside route")
                if (history.pushState) {
                    history.pushState(null, null, href);
                } else {
                    window.location.hash = href;
                }
            }
        });
    });

    // Support initial hash navigation if user enters with a direct route (e.g. #experience)
    if (window.location.hash) {
        const initialTarget = document.querySelector(window.location.hash);
        if (initialTarget) {
            setTimeout(() => {
                initialTarget.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        }
    }

});
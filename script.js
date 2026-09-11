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

    // Initialize Hero Profession Typewriter
    const heroTypingEl = document.getElementById('hero-typing');
    const heroProfessions = [
        "Frontend Developer",
        "Problem Solver",
        "Web Developer",
        "Computer Science Student",
        "UI Designer",
        "Java Programmer"
    ];
    new Typewriter(heroTypingEl, heroProfessions, {
        typeSpeed: 85,
        deleteSpeed: 45,
        pauseDelay: 1700
    });

    // Initialize Status Badge Typewriter
    const statusTypingEl = document.getElementById('status-typing');
    const statusTasks = [
        "Building My Portfolio",
        "Learning React",
        "DSA Practice",
        "Open Source",
        "AI Projects",
        "Web Development"
    ];
    new Typewriter(statusTypingEl, statusTasks, {
        typeSpeed: 70,
        deleteSpeed: 35,
        pauseDelay: 2000,
        startDelay: 800
    });


    /* ==========================================================================
       2. DYNAMIC MATHEMATICAL 3D TECH ORBIT (PURE JS SIN / COS)
       ========================================================================== */
    const orbitStage = document.getElementById('orbit-stage');
    const orbitTrack = document.getElementById('orbit-track');
    const techIcons = Array.from(document.querySelectorAll('.tech-icon'));
    const visualRings = Array.from(document.querySelectorAll('.orbit-ring-visual'));

    if (orbitStage && orbitTrack && techIcons.length > 0) {
        const totalIcons = techIcons.length; // 11 icons
        let baseAngle = 0;
        let isHovered = false;
        let rotationSpeed = 0.0035; // smooth orbital angular velocity in radians
        let currentRotationSpeed = rotationSpeed;

        // Mouse Physics Variables (Lerp)
        let targetTiltX = 0;
        let targetTiltY = 0;
        let currentTiltX = 0;
        let currentTiltY = 0;
        let targetShiftX = 0;
        let targetShiftY = 0;
        let currentShiftX = 0;
        let currentShiftY = 0;

        // Calculate Orbit Radius dynamically based on container size
        function getOrbitRadius() {
            const width = orbitStage.clientWidth;
            if (width <= 360) return 135;
            if (width <= 480) return 155;
            if (width <= 768) return 185;
            if (width <= 1024) return 210;
            return 235; // Default desktop radius
        }

        let radius = getOrbitRadius();

        // Responsive resize recalculation
        window.addEventListener('resize', () => {
            radius = getOrbitRadius();
        }, { passive: true });

        // Track Mouse Movement over the window or orbit container
        window.addEventListener('mousemove', (e) => {
            const stageRect = orbitStage.getBoundingClientRect();
            const stageCenterX = stageRect.left + stageRect.width / 2;
            const stageCenterY = stageRect.top + stageRect.height / 2;

            // Normalize mouse coordinates relative to orbit stage center (-1 to 1)
            const deltaX = (e.clientX - stageCenterX) / (window.innerWidth / 2);
            const deltaY = (e.clientY - stageCenterY) / (window.innerHeight / 2);

            // Clamp tilt values for smooth elegance
            const clampedX = Math.max(-1, Math.min(1, deltaX));
            const clampedY = Math.max(-1, Math.min(1, deltaY));

            // Orbit tilts towards the mouse cursor (3D perspective)
            targetTiltX = clampedY * -16; // Pitch (deg)
            targetTiltY = clampedX * 16;  // Yaw (deg)

            // Subtle translation shift towards cursor
            targetShiftX = clampedX * 18;
            targetShiftY = clampedY * 18;
        }, { passive: true });

        // Reset tilt gently when mouse leaves window
        document.addEventListener('mouseleave', () => {
            targetTiltX = 0;
            targetTiltY = 0;
            targetShiftX = 0;
            targetShiftY = 0;
        });

        // Icon Hover Listeners: Slow down orbit and highlight icon
        techIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                isHovered = true;
            });
            icon.addEventListener('mouseleave', () => {
                isHovered = false;
            });
        });

        /**
         * Core Animation Loop:
         * 1. Interpolates tilt angles & shifts using Lerp (Linear Interpolation)
         * 2. Calculates dynamic trigonometric positions (sin / cos) for each icon
         * 3. Renders 3D perspective transforms strictly keeping icons on circular orbit
         */
        function animateOrbit() {
            // Smooth speed dampening on hover
            const targetSpeed = isHovered ? 0.0008 : rotationSpeed;
            currentRotationSpeed += (targetSpeed - currentRotationSpeed) * 0.08;
            baseAngle += currentRotationSpeed;

            // Lerp easing for mouse tilt
            currentTiltX += (targetTiltX - currentTiltX) * 0.06;
            currentTiltY += (targetTiltY - currentTiltY) * 0.06;
            currentShiftX += (targetShiftX - currentShiftX) * 0.06;
            currentShiftY += (targetShiftY - currentShiftY) * 0.06;

            // Apply 3D perspective tilt & shift to orbit track
            orbitTrack.style.transform = `
                translate3d(${currentShiftX}px, ${currentShiftY}px, 0)
                rotateX(${currentTiltX}deg)
                rotateY(${currentTiltY}deg)
            `;

            // Tilt background rings synchronously to maintain visual alignment
            visualRings.forEach(ring => {
                ring.style.transform = `
                    translate3d(${currentShiftX * 0.4}px, ${currentShiftY * 0.4}px, 0)
                    rotateX(${currentTiltX * 0.7}deg)
                    rotateY(${currentTiltY * 0.7}deg)
                `;
            });

            // Calculate exact (x, y) coordinates using Math.sin and Math.cos
            const angleStep = (2 * Math.PI) / totalIcons;

            techIcons.forEach((icon, i) => {
                const angle = baseAngle + (i * angleStep);
                // Math Trigonometry
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                // Counter-tilt icons slightly so they remain upright and visually clear in 3D
                icon.style.transform = `
                    translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0)
                    rotateY(${-currentTiltY * 0.5}deg)
                    rotateX(${-currentTiltX * 0.5}deg)
                `;
            });

            requestAnimationFrame(animateOrbit);
        }

        // Start continuous animation loop
        requestAnimationFrame(animateOrbit);
    }


    /* ==========================================================================
       3. FIXED NAVBAR SCROLL & ACTIVE LINK OBSERVER
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
    // Collect actual target elements referenced by nav links (robust to any tag type)
    const observedTargets = [];
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) observedTargets.push(target);
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
                }
            });
        }, observerOptions);

        observedTargets.forEach(el => sectionObserver.observe(el));
    }


    /* ==========================================================================
       4. MOBILE MENU DRAWER TOGGLE
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


    /* ==========================================================================
       5. SMOOTH SCROLLING ENHANCEMENT
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
            }
        });
    });

});
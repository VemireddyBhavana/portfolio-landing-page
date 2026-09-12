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
    const talkButtons = document.querySelectorAll('.talk-btn, .start-conversation-btn');

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


    /* =======================================================================
       5. PORTFOLIO CHATBOT
       ======================================================================= */
    const chatWidget = document.getElementById('chat-widget');
    const chatLauncher = document.querySelector('.chat-launcher');
    const chatPanel = document.getElementById('chat-panel');
    const chatClose = document.querySelector('.chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    if (chatWidget && chatLauncher && chatPanel && chatMessages && chatForm && chatInput) {
        const addChatMessage = (message, type) => {
            const messageElement = document.createElement('div');
            messageElement.className = `chat-message chat-message-${type}`;
            messageElement.textContent = message;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const getChatReply = message => {
            const normalizedMessage = message.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
            const matchesAny = keywords => keywords.some(keyword => normalizedMessage.includes(keyword));

            if (matchesAny(['hello', 'hi ', 'hey', 'good morning', 'good afternoon'])) {
                return 'Hi! I can answer questions about Bhavana\'s services, projects, skills, education, availability, and contact details. What would you like to know?';
            }

            if (matchesAny(['thank', 'thanks', 'great', 'perfect'])) {
                return 'You\'re welcome! I\'m here if you want to explore a service or start a conversation with Bhavana.';
            }

            if (matchesAny(['service', 'offer', 'what can you do', 'help me'])) {
                return 'Bhavana offers Web Development, UI/UX and Figma Design, Event Management, Content and Reels Script Writing, Creative Design and Branding, and Product Strategy and Consulting.';
            }

            if (matchesAny(['price', 'pricing', 'cost', 'budget', 'rate', 'how much'])) {
                return 'Pricing depends on the project scope, timeline, and deliverables. Send an inquiry with your requirements and Bhavana can discuss a suitable plan.';
            }

            if (matchesAny(['project', 'portfolio', 'build', 'website'])) {
                return 'Featured work includes a 3D Orbit Developer Portfolio, an Interactive Task and Flow Workspace, and an Algorithmic Visualizer and DSA Suite. Use the Projects section to explore them.';
            }

            if (matchesAny(['technology', 'technologies', 'tech stack', 'tools', 'programming', 'code', 'language'])) {
                return 'Bhavana works with HTML, CSS, JavaScript, React, Java, Python, Git, GitHub, Node.js, UI/UX tools, and modern AI workflows.';
            }

            if (matchesAny(['experience', 'skill', 'expertise', 'work history'])) {
                return 'Bhavana focuses on frontend development, responsive UI, JavaScript, React, data structures, algorithms, Git workflows, and collaborative web projects.';
            }

            if (matchesAny(['education', 'study', 'college', 'degree', 'university'])) {
                return 'Bhavana is studying Computer Science with a focus on Data Science and Artificial Intelligence through NIAT, alongside a BSc in Computer Science at BITS Pilani, Hyderabad Campus.';
            }

            if (matchesAny(['available', 'availability', 'freelance', 'internship', 'intern', 'full time', 'start'])) {
                return 'Bhavana is open to frontend development opportunities, internships, freelance projects, and thoughtful collaborations. Click Let\'s Talk to share your details.';
            }

            if (matchesAny(['resume', 'cv', 'qualification'])) {
                return 'You can review Bhavana\'s experience, education, skills, projects, and achievements throughout this portfolio. Use Let\'s Talk for a direct conversation.';
            }

            if (matchesAny(['contact', 'hire', 'email', 'linkedin', 'github', 'reach'])) {
                return 'Click Let\'s Talk or Start a Conversation to send an inquiry. The footer also links to Bhavana\'s LinkedIn, GitHub, and Gmail compose page.';
            }

            if (matchesAny(['who are you', 'who is bhavana', 'about'])) {
                return 'Bhavana is a Computer Science student and frontend developer who enjoys building polished interfaces, solving problems, and creating useful digital experiences.';
            }

            return 'I can answer questions about services, projects, technologies, experience, education, availability, pricing, resume details, or contact options. Try asking about one of those topics.';
        };

        const submitChatMessage = message => {
            const trimmedMessage = message.trim();
            if (!trimmedMessage) return;

            addChatMessage(trimmedMessage, 'user');
            chatInput.value = '';
            window.setTimeout(() => addChatMessage(getChatReply(trimmedMessage), 'bot'), 220);
        };

        const setChatOpen = isOpen => {
            chatWidget.classList.toggle('is-open', isOpen);
            chatPanel.setAttribute('aria-hidden', String(!isOpen));
            chatLauncher.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) window.setTimeout(() => chatInput.focus(), 150);
        };

        chatLauncher.addEventListener('click', () => {
            setChatOpen(!chatWidget.classList.contains('is-open'));
        });

        chatClose.addEventListener('click', () => setChatOpen(false));

        chatForm.addEventListener('submit', event => {
            event.preventDefault();
            submitChatMessage(chatInput.value);
        });

        chatPanel.querySelectorAll('[data-chat-prompt]').forEach(prompt => {
            prompt.addEventListener('click', () => submitChatMessage(prompt.dataset.chatPrompt));
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && chatWidget.classList.contains('is-open')) {
                setChatOpen(false);
            }
        });
    }


    /* ==========================================================================
       6. SMOOTH SCROLLING & ADDRESS BAR ROUTE UPDATE
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
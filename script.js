document.addEventListener('DOMContentLoaded', () => {

    // Mobile Hamburger Menu Logic
    const hamburger = document.getElementById('hamburger');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobLinks = document.querySelectorAll('.mob-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        };

        closeMenuBtn.addEventListener('click', closeMenu);
        mobLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Header parallax effect - Simplified
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = (scrolled * 0.3) + 'px';
        }
    });
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .fade-in-up').forEach(el => {
        revealObserver.observe(el);
    });

    // Smooth navigation scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dynamic WhatsApp for Menu Dishes
    const consultBtns = document.querySelectorAll('.btn-consultar');
    consultBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.menu-card');
            const dishName = card.getAttribute('data-dish');
            const message = `Hola! Quiero consultar por el plato: ${dishName} de Sabor Resuelto.`;
            const waUrl = `https://wa.me/5492615070320?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');
        });
    });

    // FAQ Accordion Logic
    const faqHeaders = document.querySelectorAll('.faq-acc-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close other items
            document.querySelectorAll('.faq-acc-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-acc-header').setAttribute('aria-expanded', 'false');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Contact/Order form handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Honeypot check
            const honeypot = this.querySelector('input[name="b_honeypot"]').value;
            if (honeypot) {
                console.warn('Bot detected via honeypot');
                return;
            }

            const btn = this.querySelector('.btn-primary');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 10px;"></i> Enviando...';

            setTimeout(() => {
                const nombre = document.getElementById('nombre').value;
                const telefono = document.getElementById('telefono').value;
                const packEl = document.getElementById('pack');
                const zonaEl = document.getElementById('zona');
                const mensajeEl = document.getElementById('mensaje');
                
                const pack = packEl && packEl.value ? packEl.value : 'un pack';
                const zona = zonaEl && zonaEl.value ? zonaEl.value : 'Mi zona';
                const mensaje = mensajeEl && mensajeEl.value ? `\nNota: ${mensajeEl.value}` : '';
                
                const whatsappMessage = `Hola! Soy ${nombre}.\nQuiero pedir: ${pack}\nZona de entrega: ${zona}\nMi teléfono: ${telefono}${mensaje}`;
                window.open(`https://wa.me/5492615070320?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
                btn.innerHTML = '<i class="fas fa-check" style="margin-right: 10px;"></i> ¡Pedido enviado!';
                contactForm.reset();
                setTimeout(() => btn.innerHTML = originalText, 3000);
            }, 800);
        });
    }

    // Dynamic year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Animated counters for stats
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number[data-target]');

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString('es-AR');
                }
            };

            updateCounter();
        });
    };

    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // Carousel functionality
    let currentSlideIndex = 0;

    window.moveCarousel = function (direction) {
        const items = document.querySelectorAll('.carousel-item');
        const dots = document.querySelectorAll('.dot');

        // Remove active class
        items[currentSlideIndex].classList.remove('active');
        dots[currentSlideIndex].classList.remove('active');

        // Update index
        currentSlideIndex += direction;

        // Loop around
        if (currentSlideIndex >= items.length) {
            currentSlideIndex = 0;
        } else if (currentSlideIndex < 0) {
            currentSlideIndex = items.length - 1;
        }

        // Add active class
        items[currentSlideIndex].classList.add('active');
        dots[currentSlideIndex].classList.add('active');
    };

    window.currentSlide = function (index) {
        const items = document.querySelectorAll('.carousel-item');
        const dots = document.querySelectorAll('.dot');

        // Remove active class
        items[currentSlideIndex].classList.remove('active');
        dots[currentSlideIndex].classList.remove('active');

        // Update index
        currentSlideIndex = index;

        // Add active class
        items[currentSlideIndex].classList.add('active');
        dots[currentSlideIndex].classList.add('active');
    };

    // Auto-play carousel
    let carouselInterval = setInterval(() => moveCarousel(1), 5000);

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
        carouselContainer.addEventListener('mouseleave', () => {
            clearInterval(carouselInterval);
            carouselInterval = setInterval(() => moveCarousel(1), 5000);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') moveCarousel(-1);
        if (e.key === 'ArrowRight') moveCarousel(1);
    });

    // Touch / Swipe Navigation for Mobile
    if (carouselContainer) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        carouselContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) moveCarousel(1); // Swipe left
            if (touchEndX > touchStartX + 50) moveCarousel(-1); // Swipe right
        }
    }

    // Form Validation Feedback
    if (contactForm) {
        // Enforce validation styles when form is submitted
        contactForm.addEventListener('submit', () => {
             contactForm.classList.add('was-validated');
        });
        
        contactForm.querySelectorAll('input, select, textarea').forEach(el => {
            el.addEventListener('blur', () => {
                contactForm.classList.add('was-validated');
            });
        });
    }

    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Cookie Consent Logic
    const cookieConsent = document.getElementById('cookieConsent');
    const btnAcceptCookies = document.getElementById('btnAcceptCookies');
    const btnCloseCookies = document.getElementById('btnCloseCookies');
    
    if (cookieConsent && btnAcceptCookies) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieConsent.classList.add('show');
            }, 2000);
        }

        btnAcceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieConsent.classList.remove('show');
        });

        if (btnCloseCookies) {
            btnCloseCookies.addEventListener('click', () => {
                cookieConsent.classList.remove('show');
            });
        }
    }

    // Premium Safe Floating Veggies
    function createPremiumVeggies() {
        const bg = document.getElementById('floating-bg');
        if (!bg) return;
        
        const veggies = [
            // Basil Leaf
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B8C5D" class="veg-svg"><path d="M17 8C8 10 5.8 16 5.8 16a9.5 9.5 0 0 1 2.3-6.4C10 7.3 17 8 17 8z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-4.05 3.05-7.43 7-7.93v15.86zm2 0V4.07c3.95.49 7 3.85 7 7.93 0 4.08-3.05 7.44-7 7.93z"/></svg>`,
            // Tomato
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D92D2D" class="veg-svg"><circle cx="12" cy="14" r="8"/><path fill="#2B5944" d="M12 9c-1 0-2-1-2-1h4s-1 1-2 1z"/><path fill="#2B5944" d="M12 2v3M9 4l2 1M15 4l-2 1"/></svg>`,
            // Lemon Slice / Decorative Ring
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="veg-svg"><circle cx="12" cy="12" r="10" fill="none" stroke="#F4A261" stroke-width="2"/><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" stroke="#E63946" stroke-width="1"/></svg>`,
            // Carrot
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F26419" class="veg-svg"><path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12z"/></svg>`
        ];

        // Sparse for elegance, scaling with screen size
        const numVeggies = window.innerWidth > 768 ? 14 : 7; 

        for (let i = 0; i < numVeggies; i++) {
            const svgString = veggies[Math.floor(Math.random() * veggies.length)];
            bg.insertAdjacentHTML('beforeend', svgString);
            const svg = bg.lastElementChild;
            
            const size = Math.random() * 50 + 60; // Huge: 60px to 110px so they are undeniable
            svg.style.width = size + 'px';
            svg.style.height = size + 'px';
            svg.style.left = Math.random() * 90 + '%'; // Horizontally spread
            
            // Animation config: very slow and floating
            const duration = Math.random() * 20 + 25; // 25s to 45s loops
            const delay = Math.random() * -45; // Negative delay forces them to start on screen heavily
            
            svg.style.animation = `premium-float ${duration}s linear ${delay}s infinite`;
        }
    }
    
    // Initialize immediately without timeouts for seamless load
    createPremiumVeggies();

    // --- Savings Calculator Logic ---
    const calcOrders = document.getElementById('calc-orders');
    const calcCost = document.getElementById('calc-cost');
    const ordersValue = document.getElementById('orders-value');
    const costValue = document.getElementById('cost-value');
    const currentSpendEl = document.getElementById('current-spend');
    const totalSavingsEl = document.getElementById('total-savings');

    function updateCalculator() {
        if (!calcOrders) return;
        
        const orders = parseInt(calcOrders.value);
        const cost = parseInt(calcCost.value);
        
        // Update labels
        ordersValue.textContent = orders;
        costValue.textContent = cost.toLocaleString('es-AR');
        
        // Calculate costs (Monthly = weekly * 4)
        const weeklySpend = orders * cost;
        const monthlySpend = weeklySpend * 4;
        
        // Sabor Resuelto Pack Individual monthly cost (150,000 * 4)
        const srMonthly = 150000 * 4;
        
        // Savings
        const savings = monthlySpend - srMonthly;
        
        // Update DOM
        currentSpendEl.textContent = '$' + monthlySpend.toLocaleString('es-AR');
        
        if (savings > 0) {
            totalSavingsEl.textContent = '$' + savings.toLocaleString('es-AR');
            totalSavingsEl.parentElement.innerHTML = `¡Ahorrás <strong id="total-savings">$${savings.toLocaleString('es-AR')}</strong> y comés más sano!`;
            totalSavingsEl.parentElement.style.background = 'var(--appetizing-red)';
        } else {
            totalSavingsEl.parentElement.innerHTML = `¡Comés mucho más sano y casero por un valor similar!`;
            totalSavingsEl.parentElement.style.background = 'var(--primary-green)';
        }
    }

    if (calcOrders && calcCost) {
        calcOrders.addEventListener('input', updateCalculator);
        calcCost.addEventListener('input', updateCalculator);
        updateCalculator(); // init
    }

    // --- Pack Recommender Quiz Logic ---
    let quizAnswers = { persons: '', objective: '' };

    window.nextQuizStep = function(answer) {
        quizAnswers.persons = answer;
        if (answer === 'familia') {
            // Shortcut for family
            finishQuiz('familiar_direct');
            return;
        }
        document.getElementById('quiz-step-1').classList.remove('active');
        document.getElementById('quiz-step-2').classList.add('active');
    };

    window.finishQuiz = function(answer) {
        quizAnswers.objective = answer;
        
        document.getElementById('quiz-step-1').classList.remove('active');
        document.getElementById('quiz-step-2').classList.remove('active');
        
        // Logic to select pack
        let recommendedPack = "Pack Individual";
        let packDesc = "Ideal para resolver tus almuerzos y cenas de la semana sin esfuerzo.";
        let wppMsg = "Hola! Hice el test en la web y me recomendó el Pack Individual. Quiero encargarlo.";

        if (quizAnswers.persons === 'familia' || answer === 'familiar_direct') {
            recommendedPack = "Pack Familiar";
            packDesc = "Viandas abundantes para resolver las comidas de toda la familia de lunes a viernes.";
            wppMsg = "Hola! Hice el test en la web y me recomendó el Pack Familiar. Quiero encargarlo.";
        } else if (answer === 'bajar' || answer === 'entreno') {
            recommendedPack = answer === 'bajar' ? "Pack Nutrición" : "Pack Fit";
            packDesc = answer === 'bajar' ? "Planes personalizados para cuidar tu peso con comida rica y sana." : "Alto en proteínas, ideal para acompañar tu entrenamiento.";
            wppMsg = `Hola! Hice el test en la web y me recomendó el ${recommendedPack}. Quiero encargarlo.`;
        } else if (quizAnswers.persons === 'pareja') {
            recommendedPack = "Pack Pareja (Individual x2)";
            packDesc = "Perfecto para dos personas. 14 viandas semanales para que los dos coman increíble.";
            wppMsg = "Hola! Hice el test en la web y me recomendó pedir viandas para mi pareja y yo. Quiero consultar los combos.";
        }

        document.getElementById('recommended-pack-name').textContent = recommendedPack;
        document.getElementById('recommended-pack-desc').textContent = packDesc;
        
        const wppBtn = document.getElementById('btn-quiz-wpp');
        wppBtn.href = `https://wa.me/5492615070320?text=${encodeURIComponent(wppMsg)}`;
        
        document.getElementById('quiz-result').classList.add('active');
    };

    window.resetQuiz = function() {
        document.getElementById('quiz-result').classList.remove('active');
        document.getElementById('quiz-step-2').classList.remove('active');
        document.getElementById('quiz-step-1').classList.add('active');
        quizAnswers = { persons: '', objective: '' };
    };

    // --- Live Counter Logic ---
    const liveCounterEl = document.getElementById('live-families-counter');
    if (liveCounterEl) {
        let currentCount = 47;
        setInterval(() => {
            // 30% chance to increment by 1 every 8 seconds, simulating live activity
            if (Math.random() > 0.7 && currentCount < 150) {
                currentCount++;
                liveCounterEl.textContent = currentCount;
                liveCounterEl.style.color = '#FFD700'; // Flash gold
                setTimeout(() => liveCounterEl.style.color = 'inherit', 500);
            }
        }, 8000);
    }

    console.log('✨ Sabor Resuelto Modernized');
});

document.addEventListener('DOMContentLoaded', () => {

    // --- Selectors & Initial Checks ---
    const hamburger = document.getElementById('hamburger');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobLinks = document.querySelectorAll('.mob-link');
    const navbar = document.getElementById('navbar');
    const orderForm = document.getElementById('orderForm'); // Fixed ID: was contactForm
    const yearSpan = document.getElementById('current-year');
    const statsSection = document.querySelector('.stats-section');
    const carouselContainer = document.querySelector('.carousel-container');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const cookieConsent = document.getElementById('cookieConsent');
    const btnAcceptCookies = document.getElementById('btnAcceptCookies');
    const btnCloseCookies = document.getElementById('btnCloseCookies');

    // --- Mobile Hamburger Menu Logic ---
    if (hamburger && mobileMenu && closeMenuBtn) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active'); // Match CSS class naming
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        };

        closeMenuBtn.addEventListener('click', closeMenu);
        mobLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // --- Navbar & Hero Effects ---
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = (scrolled * 0.3) + 'px';
        }
    });

    // --- Reveal Animations ---
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

    // --- Smooth Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Menu & WhatsApp Handlers ---
    document.querySelectorAll('.btn-consultar').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.menu-card');
            if (card) {
                const dishName = card.getAttribute('data-dish') || 'un plato';
                const message = `Hola! Quiero consultar por el plato: ${dishName} de Sabor Resuelto.`;
                const waUrl = `https://wa.me/5492615070320?text=${encodeURIComponent(message)}`;
                window.open(waUrl, '_blank');
            }
        });
    });

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-acc-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            if (!item) return;
            const isActive = item.classList.contains('active');
            
            document.querySelectorAll('.faq-acc-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-acc-header')?.setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- Order Form Logic ---
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const honeypot = this.querySelector('input[name="b_honeypot"]')?.value;
            if (honeypot) return;

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn?.innerHTML;
            if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 10px;"></i> Enviando...';

            setTimeout(() => {
                const nombre = document.getElementById('nombre')?.value || '';
                const telefono = document.getElementById('telefono')?.value || '';
                const pack = document.getElementById('pack')?.value || 'un pack';
                const zona = document.getElementById('zona')?.value || 'Mi zona';
                const mensaje = document.getElementById('mensaje')?.value ? `\nNota: ${document.getElementById('mensaje').value}` : '';
                
                const whatsappMessage = `Hola! Soy ${nombre}.\nQuiero pedir: ${pack}\nZona de entrega: ${zona}\nMi teléfono: ${telefono}${mensaje}`;
                window.open(`https://wa.me/5492615070320?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
                
                if (btn) {
                    btn.innerHTML = '<i class="fas fa-check" style="margin-right: 10px;"></i> ¡Pedido enviado!';
                    setTimeout(() => btn.innerHTML = originalText, 3000);
                }
                orderForm.reset();
            }, 800);
        });

        orderForm.querySelectorAll('input, select, textarea').forEach(el => {
            el.addEventListener('blur', () => orderForm.classList.add('was-validated'));
        });
    }

    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- Stats Counter ---
    const animateCounters = () => {
        document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);
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

    // --- Carousel ---
    let currentSlideIndex = 0;
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');

    window.moveCarousel = (direction) => {
        if (items.length === 0) return;
        items[currentSlideIndex]?.classList.remove('active');
        dots[currentSlideIndex]?.classList.remove('active');
        currentSlideIndex = (currentSlideIndex + direction + items.length) % items.length;
        items[currentSlideIndex]?.classList.add('active');
        dots[currentSlideIndex]?.classList.add('active');
    };

    window.currentSlide = (index) => {
        if (items.length === 0) return;
        items[currentSlideIndex]?.classList.remove('active');
        dots[currentSlideIndex]?.classList.remove('active');
        currentSlideIndex = index;
        items[currentSlideIndex]?.classList.add('active');
        dots[currentSlideIndex]?.classList.add('active');
    };

    let carouselInterval = setInterval(() => moveCarousel(1), 5000);
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
        carouselContainer.addEventListener('mouseleave', () => {
            clearInterval(carouselInterval);
            carouselInterval = setInterval(() => moveCarousel(1), 5000);
        });

        let touchStartX = 0;
        carouselContainer.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, {passive: true});
        carouselContainer.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) moveCarousel(1);
            if (touchEndX > touchStartX + 50) moveCarousel(-1);
        }, {passive: true});
    }

    // --- Scroll Top ---
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) scrollToTopBtn.classList.add('visible');
            else scrollToTopBtn.classList.remove('visible');
        });
        scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- Cookies ---
    if (cookieConsent && btnAcceptCookies) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => cookieConsent.classList.add('show'), 2000);
        }
        btnAcceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieConsent.classList.remove('show');
        });
        btnCloseCookies?.addEventListener('click', () => cookieConsent.classList.remove('show'));
    }

    // --- Savings Calculator ---
    const calcOrders = document.getElementById('calc-orders');
    const calcCost = document.getElementById('calc-cost');
    const ordersValue = document.getElementById('orders-value');
    const costValue = document.getElementById('cost-value');
    const currentSpendEl = document.getElementById('current-spend');
    const totalSavingsValue = document.getElementById('total-savings');
    const savingsTag = document.querySelector('.savings-tag');

    function updateCalculator() {
        if (!calcOrders || !calcCost) return;
        const orders = parseInt(calcOrders.value);
        const cost = parseInt(calcCost.value);
        if (ordersValue) ordersValue.textContent = orders;
        if (costValue) costValue.textContent = cost.toLocaleString('es-AR');
        
        const monthlySpend = orders * cost * 4;
        const srMonthly = 150000 * 4;
        const savings = monthlySpend - srMonthly;

        if (currentSpendEl) currentSpendEl.textContent = '$' + monthlySpend.toLocaleString('es-AR');
        
        if (savingsTag) {
            if (savings > 0) {
                savingsTag.innerHTML = `¡Ahorrás <strong id="total-savings">$${savings.toLocaleString('es-AR')}</strong> y comés más sano!`;
                savingsTag.style.background = 'var(--appetizing-red)';
            } else {
                savingsTag.innerHTML = `¡Comés mucho más sano y casero por un valor similar!`;
                savingsTag.style.background = 'var(--primary-green)';
            }
        }
    }

    if (calcOrders && calcCost) {
        calcOrders.addEventListener('input', updateCalculator);
        calcCost.addEventListener('input', updateCalculator);
        updateCalculator();
    }

    // --- Pack Recommender Quiz ---
    let quizAnswers = { persons: '', objective: '' };

    // New: Wire up quiz buttons using data attributes (modern way)
    document.querySelectorAll('.quiz-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.getAttribute('data-answer');
            const step = btn.closest('.quiz-step');
            if (!step || !answer) return;

            if (step.id === 'quiz-step-1') {
                nextQuizStep(answer);
            } else if (step.id === 'quiz-step-2') {
                finishQuiz(answer);
            }
        });
    });

    const resetBtn = document.getElementById('reset-quiz-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => resetQuiz());
    }

    window.nextQuizStep = function(answer) {
        quizAnswers.persons = answer;
        if (answer === 'familia') {
            finishQuiz('familiar_direct');
            return;
        }
        document.getElementById('quiz-step-1')?.classList.remove('active');
        document.getElementById('quiz-step-2')?.classList.add('active');
    };

    window.finishQuiz = function(answer) {
        quizAnswers.objective = answer;
        document.getElementById('quiz-step-1')?.classList.remove('active');
        document.getElementById('quiz-step-2')?.classList.remove('active');
        
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

        const nameEl = document.getElementById('recommended-pack-name');
        const descEl = document.getElementById('recommended-pack-desc');
        const wppBtn = document.getElementById('btn-quiz-wpp');

        if (nameEl) nameEl.textContent = recommendedPack;
        if (descEl) descEl.textContent = packDesc;
        if (wppBtn) wppBtn.href = `https://wa.me/5492615070320?text=${encodeURIComponent(wppMsg)}`;
        
        document.getElementById('quiz-result')?.classList.add('active');
    };

    window.resetQuiz = function() {
        document.getElementById('quiz-result')?.classList.remove('active');
        document.getElementById('quiz-step-2')?.classList.remove('active');
        document.getElementById('quiz-step-1')?.classList.add('active');
        quizAnswers = { persons: '', objective: '' };
    };

    // --- Live Counter ---
    const liveCounterEl = document.getElementById('live-families-counter');
    if (liveCounterEl) {
        let currentCount = parseInt(liveCounterEl.textContent) || 47;
        setInterval(() => {
            if (Math.random() > 0.7 && currentCount < 150) {
                currentCount++;
                liveCounterEl.textContent = currentCount;
                liveCounterEl.style.color = '#FFD700';
                setTimeout(() => liveCounterEl.style.color = 'inherit', 500);
            }
        }, 8000);
    }

    console.log('✨ Sabor Resuelto Core Ready');
});

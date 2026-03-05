/* ============================== */
/* SHARK STAGING — JAVASCRIPT     */
/* ============================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== NAV SCROLL =====
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ===== BURGER MENU (Mobile) =====
    const burger = document.getElementById('burger');
    const navLinks = document.querySelector('.nav-links');
    if (burger) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            burger.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                burger.classList.remove('active');
            });
        });
    }

    // ===== SCROLL ANIMATIONS =====
    const animElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
                let delay = 0;
                siblings.forEach((el, i) => {
                    if (el === entry.target) delay = i * 100;
                });
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animElements.forEach(el => observer.observe(el));

    // ===== ANIMATED COUNTERS =====
    const statValues = document.querySelectorAll('.stat-value');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ===== PORTFOLIO LOGIC =====
    const portfolioData = [
        {
            // 0: Вторичка (Очистка)
            sliderBase: 'images/Вторичка Авито.jpg',
            sliderAfter: 'images/Вторичка чистая.jpg',
            afterLabel: 'ОЧИСТКА',
            gallery: []
        },
        {
            // 1: Вторичка (Стейджинг)
            sliderBase: 'images/Вторичка Авито.jpg',
            sliderAfter: 'images/Вторичка ремонт.jpg',
            afterLabel: 'РЕМОНТ',
            gallery: []
        },
        {
            // 2: Новостройки МКД
            sliderBase: 'images/S2.jpg',
            sliderAfter: 'images/S2.1.png',
            afterLabel: 'ПОСЛЕ',
            gallery: [
                { before: 'images/S1.jpg', after: 'images/S1.1.jpg' },
                { before: 'images/Z4.png', after: 'images/F1.jpg' },
                { before: 'images/Q1.png', after: 'images/Z5.1.png' }
            ]
        },
        {
            // 3: Коттеджи
            sliderBase: 'images/Дачная ул. СК Гостинная 1.png',
            sliderAfter: 'images/Дачная ул. СК Гостинная 1.1!.png',
            afterLabel: 'ПОСЛЕ',
            gallery: [
                { before: 'images/Дачная ул. СК Гостинная 2.png', after: 'images/Дачная ул. СК Гостинная 1.2!.png' }
            ]
        },
        {
            // 4: Коммерция
            sliderBase: 'images/Kom1.jpg',
            sliderAfter: 'images/Kom1.1.jpg',
            afterLabel: 'ПОСЛЕ',
            gallery: [
                { before: 'images/Kom2.jpg', after: 'images/Kom2.3.jpg' },
                { before: 'images/Kom2.jpg', after: 'images/Kom2.2.jpg' },
                { before: 'images/Витраж 1.jpeg', after: 'images/Витраж 2.png' },
                { before: 'images/Цех 1.jpeg', after: 'images/Цех 2.png' }
            ]
        }
    ];

    const baSlider = document.getElementById('baSlider');
    const baHandle = document.getElementById('baHandle');
    const baAfterWrap = document.getElementById('baAfterWrap');
    const baBeforeImg = document.getElementById('baBeforeImg');
    const baAfterImg = document.getElementById('baAfterImg');
    const baLabelAfter = document.querySelector('.ba-label-after');
    const portfolioGallery = document.getElementById('portfolioGallery');
    const tabBtns = document.querySelectorAll('.tab-btn');

    let currentTab = 0;

    // Interactive Slider Logic
    if (baSlider && baHandle && baAfterWrap) {
        let isDragging = false;

        function setSliderPosition(x) {
            const rect = baSlider.getBoundingClientRect();
            let pos = ((x - rect.left) / rect.width) * 100;
            pos = Math.max(0, Math.min(100, pos));

            baHandle.style.left = pos + '%';
            baAfterWrap.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
        }

        baSlider.addEventListener('mousedown', (e) => {
            isDragging = true;
            setSliderPosition(e.clientX);
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) setSliderPosition(e.clientX);
        });
        document.addEventListener('mouseup', () => isDragging = false);

        baSlider.addEventListener('touchstart', (e) => {
            isDragging = true;
            setSliderPosition(e.touches[0].clientX);
        }, { passive: true });
        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
                setSliderPosition(e.touches[0].clientX);
            }
        }, { passive: false });
        document.addEventListener('touchend', () => isDragging = false);
    }

    // Render Tab Content
    function renderTab(idx) {
        currentTab = idx;
        const data = portfolioData[idx];

        baBeforeImg.src = data.sliderBase;
        baAfterImg.src = data.sliderAfter;
        if (baLabelAfter) baLabelAfter.textContent = data.afterLabel || 'ПОСЛЕ';

        // Reset slider to center smoothly
        setTimeout(() => {
            if (baHandle) baHandle.style.left = '50%';
            if (baAfterWrap) baAfterWrap.style.clipPath = 'inset(0 50% 0 0)';
        }, 50);

        // Render Gallery
        if (portfolioGallery) {
            portfolioGallery.innerHTML = '';
            if (data.gallery && data.gallery.length > 0) {
                data.gallery.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'gallery-card animate-on-scroll visible';
                    card.innerHTML = `
                        <img src="${item.after}" alt="После" class="gallery-img-after">
                        <img src="${item.before}" alt="До" class="gallery-img-before">
                        <div class="gallery-label">Наведи чтобы увидеть ДО</div>
                    `;
                    portfolioGallery.appendChild(card);
                });
            }
        }
    }

    // Tab Listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTab(parseInt(btn.dataset.tab));
        });
    });

    if (tabBtns.length > 0) {
        renderTab(0);
    }

    // ===== FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('formName').value;
            const phone = document.getElementById('formPhone').value;
            const email = document.getElementById('formEmail').value;
            const message = document.getElementById('formMessage').value;

            // Removed window.open redirect to Telegram as requested
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Заявка принята, с вами свяжутся';
            btn.style.background = '#16a34a';
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Отправить заявку';
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== AUDIT INTERACTIVE =====
    const auditWraps = document.querySelectorAll('.audit-interactive-wrap');
    auditWraps.forEach(wrap => {
        wrap.addEventListener('click', () => {
            const afterImg = wrap.querySelector('.audit-img-after');
            const hint = wrap.querySelector('.click-hint');
            if (afterImg.style.opacity === '1') {
                afterImg.style.opacity = '0';
                if (hint) hint.textContent = 'Нажмите';
            } else {
                afterImg.style.opacity = '1';
                if (hint) hint.textContent = 'ДО';
            }
        });
    });
});

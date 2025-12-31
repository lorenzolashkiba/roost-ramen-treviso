/* =========================================
   ROOST RAMEN - Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initBowlScrollEffect();
    initScrollAnimations();
    initLightbox();
    initSmoothScroll();
    initParallaxDecorations();
});

/* =========================================
   NAVIGATION
   ========================================= */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    let lastScrollY = window.scrollY;
    let ticking = false;

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Hide/show navbar on scroll
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.classList.add('hidden');
                } else {
                    navbar.classList.remove('hidden');
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });
}

/* =========================================
   BOWL 3D SCROLL EFFECT
   ========================================= */
function initBowlScrollEffect() {
    const bowlContainer = document.querySelector('.bowl-container');
    const heroText = document.querySelector('.hero-text');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const hero = document.querySelector('.hero');

    if (!bowlContainer || !hero) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroHeight = hero.offsetHeight;
                const maxScroll = heroHeight * 0.8;

                // Calculate rotation (0 to 70 degrees)
                const progress = Math.min(scrollY / maxScroll, 1);
                const rotation = progress * 70;

                // Apply 3D rotation to bowl
                bowlContainer.style.transform = `
                    perspective(1000px)
                    rotateX(${rotation}deg)
                    scale(${1 + progress * 0.1})
                `;

                // Fade out hero text
                if (heroText) {
                    const textOpacity = Math.max(1 - progress * 2, 0);
                    const textTranslate = progress * -50;
                    heroText.style.opacity = textOpacity;
                    heroText.style.transform = `translateY(${textTranslate}px)`;
                }

                // Fade out scroll indicator
                if (scrollIndicator) {
                    scrollIndicator.style.opacity = Math.max(1 - progress * 3, 0);
                }

                ticking = false;
            });
            ticking = true;
        }
    });

    // Add subtle floating animation when not scrolling
    let isScrolling;

    window.addEventListener('scroll', () => {
        bowlContainer.style.animation = 'none';
        clearTimeout(isScrolling);

        isScrolling = setTimeout(() => {
            if (window.scrollY < 50) {
                bowlContainer.style.animation = 'bowlFloat 3s ease-in-out infinite';
            }
        }, 150);
    });

    // Add floating animation CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bowlFloat {
            0%, 100% { transform: perspective(1000px) translateY(0); }
            50% { transform: perspective(1000px) translateY(-15px); }
        }
    `;
    document.head.appendChild(style);

    // Initial floating animation
    if (window.scrollY < 50) {
        bowlContainer.style.animation = 'bowlFloat 3s ease-in-out infinite';
    }
}

/* =========================================
   SCROLL ANIMATIONS (AOS-like)
   ========================================= */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay for grid items
                const parent = entry.target.parentElement;
                if (parent && parent.classList.contains('menu-grid') ||
                    parent && parent.classList.contains('gallery-grid')) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }

                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/* =========================================
   LIGHTBOX
   ========================================= */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation
    function updateLightboxImage() {
        lightboxImage.src = images[currentIndex];
        lightboxImage.alt = `Immagine ${currentIndex + 1} di ${images.length}`;
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                showNext();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNext();
            } else {
                showPrev();
            }
        }
    }
}

/* =========================================
   SMOOTH SCROLL
   ========================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =========================================
   PARALLAX DECORATIONS
   ========================================= */
function initParallaxDecorations() {
    const speedLines = document.querySelectorAll('.speed-line');
    const stars = document.querySelectorAll('.star');

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Parallax for speed lines
                speedLines.forEach((line, index) => {
                    const speed = 0.1 + (index * 0.05);
                    line.style.transform = `translateX(${scrollY * speed}px) rotate(${-15 + (index * 5)}deg)`;
                });

                // Parallax for stars
                stars.forEach((star, index) => {
                    const speed = 0.2 + (index * 0.1);
                    const rotation = scrollY * (0.1 + index * 0.05);
                    star.style.transform = `translateY(${scrollY * speed}px) rotate(${rotation}deg)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });
}

/* =========================================
   MENU CARD WIGGLE EFFECT
   ========================================= */
document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.animation = 'cardWiggle 0.5s ease';
    });

    card.addEventListener('animationend', function() {
        this.style.animation = '';
    });
});

// Add wiggle animation
const wiggleStyle = document.createElement('style');
wiggleStyle.textContent = `
    @keyframes cardWiggle {
        0%, 100% { transform: translateY(-8px) rotate(1deg); }
        25% { transform: translateY(-8px) rotate(-1deg); }
        50% { transform: translateY(-8px) rotate(1deg); }
        75% { transform: translateY(-8px) rotate(-0.5deg); }
    }
`;
document.head.appendChild(wiggleStyle);

/* =========================================
   STEAM INTENSITY BASED ON SCROLL
   ========================================= */
const steamParticles = document.querySelectorAll('.steam-particle');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const intensity = Math.max(1 - scrollY / 500, 0.3);

    steamParticles.forEach(particle => {
        particle.style.opacity = intensity;
    });
});

/* =========================================
   TYPING EFFECT FOR TAGLINE (Optional)
   ========================================= */
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Uncomment to enable typing effect
// const tagline = document.querySelector('.hero-tagline');
// if (tagline) {
//     const text = tagline.textContent;
//     setTimeout(() => typeWriter(tagline, text, 80), 1500);
// }

/* =========================================
   CURSOR TRAIL EFFECT (Optional - for added flair)
   ========================================= */
// Uncomment to enable cursor trail
/*
function initCursorTrail() {
    const trail = [];
    const trailLength = 10;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: ${10 - i}px;
            height: ${10 - i}px;
            background: var(--rosso);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - (i / trailLength)};
            transition: transform 0.1s;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        let x = mouseX;
        let y = mouseY;

        trail.forEach((dot, index) => {
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';

            const nextDot = trail[index + 1] || trail[0];
            x += (parseFloat(nextDot.style.left) - x) * 0.3;
            y += (parseFloat(nextDot.style.top) - y) * 0.3;
        });

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
}
*/

console.log('🍜 Roost Ramen - Website loaded successfully!');

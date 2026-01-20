// Force scroll to top on every page load/refresh/navigation
(function() {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Scroll to top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Scroll to top when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        });
    } else {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
    
    // Scroll to top on page load
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });
    
    // Scroll to top on page show (for back/forward navigation)
    window.addEventListener('pageshow', (event) => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });
    
    // Scroll to top before page unload (when navigating away)
    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });
})();

// Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Header scroll effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.stat-item, .benefit-card, .step-card, .testimonial-card, .product-card, .faq-item');
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// Counter animation for stats
const animateCounter = (element, target, unit = '', isDecimal = false, hasThousandSeparators = false, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const formatNumber = (num) => {
        if (isDecimal) {
            return num.toFixed(1) + unit;
        } else if (hasThousandSeparators) {
            // Format with thousand separators (dots)
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + unit;
        } else {
            return Math.floor(num) + unit;
        }
    };
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = formatNumber(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = formatNumber(target);
        }
    };
    
    updateCounter();
};

// Function to parse stat number and extract value, unit, and decimal flag
const parseStatValue = (text) => {
    // Check for decimal numbers (like 4.5MW)
    const decimalMatch = text.match(/(\d+\.\d+)([A-Za-z%+]*)/);
    if (decimalMatch) {
        return {
            value: parseFloat(decimalMatch[1]),
            unit: decimalMatch[2] || '',
            isDecimal: true,
            hasThousandSeparators: false
        };
    }
    
    // Check for numbers with thousand separators (like 2.862.000kg)
    const thousandMatch = text.match(/([\d.]+)([A-Za-z%+]*)/);
    if (thousandMatch) {
        const numberPart = thousandMatch[1];
        // Check if it has multiple dots (thousand separators)
        if (numberPart.split('.').length > 2) {
            // Remove dots and parse as integer
            const cleanNumber = numberPart.replace(/\./g, '');
            return {
                value: parseInt(cleanNumber),
                unit: thousandMatch[2] || '',
                isDecimal: false,
                hasThousandSeparators: true
            };
        }
    }
    
    // Check for integer numbers
    const intMatch = text.match(/(\d+)([A-Za-z%+]*)/);
    if (intMatch) {
        return {
            value: parseInt(intMatch[1]),
            unit: intMatch[2] || '',
            isDecimal: false,
            hasThousandSeparators: false
        };
    }
    
    return null;
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statNumber = entry.target.querySelector('.stat-number, .about-stat-number, .number-value');
            if (statNumber) {
                const originalText = statNumber.textContent.trim();
                const parsed = parseStatValue(originalText);
                if (parsed) {
                    // Reset to 0
                    if (parsed.isDecimal) {
                        statNumber.textContent = '0.0' + parsed.unit;
                    } else if (parsed.hasThousandSeparators) {
                        statNumber.textContent = '0' + parsed.unit;
                    } else {
                        statNumber.textContent = '0' + parsed.unit;
                    }
                    setTimeout(() => {
                        animateCounter(statNumber, parsed.value, parsed.unit, parsed.isDecimal, parsed.hasThousandSeparators, 2000);
                    }, 100);
                }
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    // Observe .stat-item, .about-stat, and .number-card
    const statItems = document.querySelectorAll('.stat-item, .about-stat, .number-card');
    statItems.forEach(item => {
        statsObserver.observe(item);
    });
    
});

// Add hover effects to buttons
document.querySelectorAll('.btn-primary, .btn-hero, .btn-secondary').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Product card hover effects
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements on load
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-features, .btn-hero');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Form validation (if you add forms later)
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
};

// Add click tracking (optional, for analytics)
document.querySelectorAll('a[href^="#calcola"]').forEach(link => {
    link.addEventListener('click', () => {
        // Track CTA clicks
        console.log('CTA clicked');
    });
});

// Lazy load images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add smooth reveal animation for sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        // Skip the first section after hero (index 1) - make it visible immediately
        // Also skip page-hero sections
        if (section.classList.contains('page-hero') || section.classList.contains('hero')) {
            return; // Don't animate hero sections
        }
        
        // For products-detail page, show first section immediately
        if (section.classList.contains('products-detail') && index === 1) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            return;
        }
        
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
});

// Lightbox for expandable photos
function initLightbox() {
    // Create lightbox HTML
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <div class="lightbox-content">
            <img src="" alt="">
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Open lightbox on photo click
    document.querySelectorAll('.expandable-photo').forEach(photo => {
        photo.addEventListener('click', function(e) {
            e.preventDefault();
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt || '';
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
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Initialize lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', initLightbox);


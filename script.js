/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId);

    if(toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show-menu');
        });
    }
}
showMenu('nav-toggle','nav-menu');

/*===== MENU HIDDEN =====*/
const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*===== SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            const activeLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']');
            if(activeLink) activeLink.classList.add('active-link');
        } else {
            const activeLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']');
            if(activeLink) activeLink.classList.remove('active-link');
        }
    });
}
window.addEventListener('scroll', scrollActive);

/*===== CHANGE BACKGROUND HEADER =====*/ 
function scrollHeader() {
    const nav = document.getElementById('header');
    // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); 
    else nav.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);

/*===== SHOW SCROLL UP =====*/ 
function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); 
    else scrollUp.classList.remove('show-scroll');
}
window.addEventListener('scroll', scrollUp);

/*===== SKILLS ACCORDION =====*/
const skillsContent = document.getElementsByClassName('skills__content'),
      skillsHeader = document.querySelectorAll('.skills__header');

function toggleSkills() {
    let itemClass = this.parentNode.className;

    for(i = 0; i < skillsContent.length; i++) {
        skillsContent[i].className = 'skills__content skills__close';
    }
    if(itemClass === 'skills__content skills__close') {
        this.parentNode.className = 'skills__content skills__open';
    }
}

skillsHeader.forEach((el) => {
    el.addEventListener('click', toggleSkills);
});

/*===== PORTFOLIO MODAL =====*/
const modalViews = document.querySelectorAll('.services__modal'),
      modalBtns = document.querySelectorAll('.services__button'),
      modalCloses = document.querySelectorAll('.services__modal-close');

let modal = function(modalClick) {
    modalViews[modalClick].classList.add('active-modal');
}

modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener('click', () => {
        modal(i);
    });
});

modalCloses.forEach((modalClose) => {
    modalClose.addEventListener('click', () => {
        modalViews.forEach((modalView) => {
            modalView.classList.remove('active-modal');
        });
    });
});

/*===== SMOOTH SCROLLING =====*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/*===== CONTACT FORM =====*/
const contactForm = document.querySelector('.contact__form');
const contactInputs = document.querySelectorAll('.contact__input');

// Add focus and blur event listeners to inputs for better UX
contactInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentNode.classList.add('focus');
    });
    
    input.addEventListener('blur', function() {
        if (this.value === '') {
            this.parentNode.classList.remove('focus');
        }
    });
});

// Handle form submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name') || document.getElementById('name').value;
        const email = formData.get('email') || document.getElementById('email').value;
        const subject = formData.get('subject') || document.getElementById('subject').value;
        const message = formData.get('message') || document.getElementById('message').value;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Simulate form submission (in a real application, you would send this to a server)
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
        
        // Remove focus class from all inputs
        contactInputs.forEach(input => {
            input.parentNode.classList.remove('focus');
        });
    });
}

/*===== TYPING ANIMATION =====*/
const typingText = document.querySelector('.home__subtitle');
if (typingText) {
    const text = typingText.textContent;
    const roles = ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Web Designer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            setTimeout(() => {
                isDeleting = true;
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
        
        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(typeWriter, typingSpeed);
    }
    
    // Start typing animation after page load
    setTimeout(typeWriter, 1000);
}

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = {
    reveal: function(selector, options = {}) {
        const elements = document.querySelectorAll(selector);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
};

// Apply scroll reveal to elements
document.addEventListener('DOMContentLoaded', function() {
    sr.reveal('.home__data');
    sr.reveal('.home__social', {delay: 400});
    sr.reveal('.about__data');
    sr.reveal('.skills__content', {interval: 200});
    sr.reveal('.portfolio__content', {interval: 200});
    sr.reveal('.contact__information', {interval: 200});
    sr.reveal('.contact__form');
});

/*===== THEME TOGGLE =====*/
const themeButton = document.getElementById('theme-button');

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains('dark-theme') ? 'dark' : 'light';
const getCurrentIcon = () => themeButton && themeButton.classList.contains('fa-moon') ? 'fa-sun' : 'fa-moon';

// We validate if the user previously chose a topic
if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark mode
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove']('dark-theme');
    
    if (themeButton) {
        themeButton.classList[selectedIcon === 'fa-moon' ? 'add' : 'remove']('fa-moon');
    }
}

// Activate / deactivate the theme manually with the button
if (themeButton) {
    themeButton.addEventListener('click', () => {
        // Add or remove the dark / icon theme
        document.body.classList.toggle('dark-theme');
        themeButton.classList.toggle('fa-moon');
        themeButton.classList.toggle('fa-sun');
        
        // We save the theme and the current icon that the user chose
        localStorage.setItem('selected-theme', getCurrentTheme());
        localStorage.setItem('selected-icon', getCurrentIcon());
    });
}

/*===== PORTFOLIO FILTERING =====*/
const portfolioFilters = document.querySelectorAll('.portfolio__filter');
const portfolioItems = document.querySelectorAll('.portfolio__content');

if (portfolioFilters.length > 0) {
    portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            portfolioFilters.forEach(f => f.classList.remove('active-filter'));
            // Add active class to clicked filter
            this.classList.add('active-filter');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/*===== SIMPLE USER INTERFACE SETUP =====*/
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and setup UI accordingly
    const localSession = localStorage.getItem('portfolioSession');
    const sessionSession = sessionStorage.getItem('portfolioSession');
    
    if (localSession || sessionSession) {
        const sessionData = JSON.parse(localSession || sessionSession);
        
        // Display user info in navigation
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');
        
        if (userInfo && userName && sessionData) {
            userName.textContent = sessionData.username;
            userInfo.style.display = 'flex';
        }
        

        
        // Setup logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to logout?')) {
                    // Log the logout action
                    const logEntry = {
                        timestamp: new Date().toISOString(),
                        username: sessionData.username,
                        status: 'LOGOUT',
                        details: 'User logged out',
                        ipAddress: 'Local',
                        userAgent: navigator.userAgent
                    };
                    
                    // Save to access log
                    const accessLog = JSON.parse(localStorage.getItem('portfolioAccessLog') || '[]');
                    accessLog.push(logEntry);
                    if (accessLog.length > 100) {
                        accessLog.splice(0, accessLog.length - 100);
                    }
                    localStorage.setItem('portfolioAccessLog', JSON.stringify(accessLog));
                    console.log('Access Log Entry:', logEntry);
                    
                    // Clear session and redirect
                    localStorage.removeItem('portfolioSession');
                    sessionStorage.removeItem('portfolioSession');
                    window.location.href = 'login.html';
                }
            });
        }
    } else {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
    }
});

/*===== PRELOADER =====*/
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

/*===== LAZY LOADING IMAGES =====*/
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

/*===== PERFORMANCE OPTIMIZATION =====*/
// Debounce function for scroll events
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(scrollActive));
window.addEventListener('scroll', debounce(scrollHeader));
window.addEventListener('scroll', debounce(scrollUp));

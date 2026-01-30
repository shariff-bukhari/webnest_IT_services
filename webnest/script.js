        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Update active nav link based on scroll position
            updateActiveNavLink();
        });
        
        // Update active navigation link based on scroll position
        function updateActiveNavLink() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
        
        // Portfolio Slider
        const portfolioSlider = document.getElementById('portfolio-slider');
        const prevSlideBtn = document.getElementById('prev-slide');
        const nextSlideBtn = document.getElementById('next-slide');
        const sliderDots = document.getElementById('slider-dots').children;
        
        let currentSlide = 0;
        const totalSlides = document.querySelectorAll('.portfolio-slide').length;
        
        // Initialize slider dots
        for (let i = 0; i < totalSlides; i++) {
            if (i === 0) {
                sliderDots[i].classList.add('active');
            } else {
                sliderDots[i].classList.remove('active');
            }
        }
        
        // Update slider position
        function updateSlider() {
            const slideWidth = document.querySelector('.portfolio-slide').offsetWidth;
            portfolioSlider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            
            // Update active dot
            for (let i = 0; i < totalSlides; i++) {
                sliderDots[i].classList.remove('active');
            }
            sliderDots[currentSlide].classList.add('active');
        }
        
        // Next slide
        nextSlideBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });
        
        // Previous slide
        prevSlideBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
        
        // Dot navigation
        for (let i = 0; i < totalSlides; i++) {
            sliderDots[i].addEventListener('click', () => {
                currentSlide = i;
                updateSlider();
            });
        }
        
// Contact form submission with actual EmailJS functionality
const contactForm = document.getElementById('contactForm');

// Initialize EmailJS with Public Key (you'll get this in next step)
document.addEventListener('DOMContentLoaded', function() {
    // Replace 'YOUR_PUBLIC_KEY_HERE' with your actual EmailJS Public Key
    emailjs.init('65DzyeFuqQ3xluQ90');
    console.log('EmailJS initialized for Webnest IT Services');
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Basic validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Prepare email parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_name: 'Webnest IT Services',
            reply_to: email,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        
        // Send email using EmailJS - USE YOUR SERVICE ID HERE
        const response = await emailjs.send(
            'service_z9h6t3k',    // ← Your Service ID (from your screenshot)
            'template_qldrbe8',   // ← You need to create a Template and get this ID
            templateParams
        );
        
        if (response.status === 200 || response.status === 201) {
            showNotification('✅ Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
            
            // Also send confirmation to the user
            sendConfirmationToUser(email, name);
            
            // Reset form
            contactForm.reset();
        } else {
            throw new Error('Failed to send message');
        }
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        
        // User-friendly error messages
        if (error.text && error.text.includes('Invalid template')) {
            showNotification('⚠️ Please set up your email template in EmailJS dashboard.', 'warning');
        } else if (error.text && error.text.includes('Public Key')) {
            showNotification('🔑 Please add your EmailJS Public Key to the code.', 'warning');
        } else {
            showNotification('❌ Failed to send message. Please email us directly at info@webnestitservices.com', 'error');
        }
    } finally {
        // Reset button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Send confirmation email to user
async function sendConfirmationToUser(userEmail, userName) {
    try {
        const confirmationParams = {
            to_name: userName,
            to_email: userEmail,
            from_name: 'Webnest IT Services',
            date: new Date().toLocaleDateString()
        };
        
        // You can create a separate template for confirmations
        await emailjs.send(
            'service_z9h6t3k',
            'template_confirmation', // Create this template in EmailJS
            confirmationParams
        );
        console.log('Confirmation email sent to:', userEmail);
    } catch (error) {
        console.log('Confirmation email not sent (optional):', error);
    }
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system (keep this as it is)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add form input validation
const formInputs = document.querySelectorAll('.form-control');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            if (this.id === 'email' && !isValidEmail(this.value.trim())) {
                this.style.borderColor = 'var(--flag-red)';
                this.style.boxShadow = '0 0 0 3px rgba(192, 57, 43, 0.1)';
            } else {
                this.style.borderColor = '#27ae60';
                this.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.1)';
            }
        } else {
            this.style.borderColor = '#e0e0e0';
            this.style.boxShadow = 'none';
        }
    });
});
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Initialize animations on page load
        window.addEventListener('load', () => {
            // Animate hero content
            const heroContent = document.querySelector('.hero-content');
            heroContent.style.animation = 'fadeInUp 1s ease-out forwards';
            
            // Animate sections on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            // Observe all sections for animation
            document.querySelectorAll('.section-title, .service-card, .portfolio-item, .contact-form, .about-text, .about-image').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(el);
            });
        })
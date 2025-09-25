// Personal Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function () {
  // Initialize all functionality
  initNavbar();
  initSmoothScrolling();
  initScrollAnimations();
  initContactForm();
  initTypingEffect();
  initProgressBars();
  initParticleEffect();
  initScrollToTop();
  initDownloadCV();
});

// Navbar functionality
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  // Navbar scroll effect
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active nav link highlighting
  window.addEventListener('scroll', function () {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    '.portfolio-item, .skill-item, .contact-info'
  );
  animatedElements.forEach((el) => {
    el.classList.add('loading');
    observer.observe(el);
  });
}

// Contact form functionality
function initContactForm() {
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !phone || !subject || !message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    if (!isValidPhone(phone)) {
      showNotification('Please enter a valid phone number', 'error');
      return;
    }

    // Send form data
    sendFormData(name, email, phone, subject, message);
  });
}

// Send form data via multiple methods
async function sendFormData(name, email, phone, subject, message) {
  const submitBtn = document.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
  submitBtn.disabled = true;

  try {
    // Method 1: Send via EmailJS (if configured)
    await sendViaEmailJS(name, email, phone, subject, message);
    
    // Method 2: Send via WhatsApp API
    await sendViaWhatsAppAPI(name, email, phone, subject, message);
    
    // Method 3: Send via custom API endpoint
    await sendViaAPI(name, email, phone, subject, message);
    
    showNotification('Message sent successfully!', 'success');
    document.getElementById('contactForm').reset();
    
  } catch (error) {
    console.error('Error sending message:', error);
    showNotification('Failed to send message. Please try again.', 'error');
  } finally {
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// Send via EmailJS
async function sendViaEmailJS(name, email, phone, subject, message) {
  // EmailJS configuration (you need to set this up)
  const serviceID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
  const templateID = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS template ID
  const publicKey = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key

  if (serviceID === 'YOUR_SERVICE_ID') {
    throw new Error('EmailJS not configured');
  }

  const templateParams = {
    from_name: name,
    from_email: email,
    phone: phone,
    subject: subject,
    message: message,
    to_email: 'supplaunch@gmail.com'
  };

  // Load EmailJS library if not already loaded
  if (typeof emailjs === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    document.head.appendChild(script);
    
    await new Promise((resolve) => {
      script.onload = resolve;
    });
  }

  emailjs.init(publicKey);
  await emailjs.send(serviceID, templateID, templateParams);
}

// Send via WhatsApp API
async function sendViaWhatsAppAPI(name, email, phone, subject, message) {
  const whatsappMessage = `
*New Contact Form Submission*

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Subject:* ${subject}

*Message:*
${message}

---
Sent from Launch Supp Portfolio
  `;

  // Using WhatsApp Business API (you need to set this up)
  const whatsappAPI = 'YOUR_WHATSAPP_API_ENDPOINT'; // Replace with your WhatsApp API endpoint
  
  if (whatsappAPI === 'YOUR_WHATSAPP_API_ENDPOINT') {
    // Fallback to direct WhatsApp link
    const whatsappLink = `https://wa.me/966504877945?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappLink, '_blank');
    return;
  }

  const response = await fetch(whatsappAPI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: '966504877945',
      message: whatsappMessage
    })
  });

  if (!response.ok) {
    throw new Error('WhatsApp API failed');
  }
}

// Send via custom API endpoint
async function sendViaAPI(name, email, phone, subject, message) {
  const apiEndpoint = 'contact-handler.php'; // Your PHP endpoint
  
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      email: email,
      phone: phone,
      subject: subject,
      message: message,
      timestamp: new Date().toISOString()
    })
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'API request failed');
  }
}

// Phone validation
function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Show submission options
function showSubmissionOptions(name, email, phone, subject, message) {
  // Create modal for submission options
  const modalHtml = `
    <div class="modal fade" id="submissionModal" tabindex="-1" aria-labelledby="submissionModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="submissionModalLabel">Choose Submission Method</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="mb-3">How would you like to send your message?</p>
            <div class="d-grid gap-2">
              <button class="btn btn-primary" onclick="sendViaEmail('${name}', '${email}', '${phone}', '${subject}', '${message}')">
                <i class="fas fa-envelope me-2"></i>Send via Email
              </button>
              <button class="btn btn-success" onclick="sendViaWhatsApp('${name}', '${email}', '${phone}', '${subject}', '${message}')">
                <i class="fab fa-whatsapp me-2"></i>Send via WhatsApp
              </button>
              <button class="btn btn-info" onclick="copyToClipboard('${name}', '${email}', '${phone}', '${subject}', '${message}')">
                <i class="fas fa-copy me-2"></i>Copy Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remove existing modal if any
  const existingModal = document.getElementById('submissionModal');
  if (existingModal) {
    existingModal.remove();
  }

  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('submissionModal'));
  modal.show();
}

// Send via Email
function sendViaEmail(name, email, phone, subject, message) {
  const emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}
  `;

  const emailLink = `mailto:supplaunch@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(emailBody)}`;

  // Close modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById('submissionModal')
  );
  modal.hide();

  // Open email client
  window.open(emailLink);

  showNotification('Email client opened with your message!', 'success');
}

// Send via WhatsApp
function sendViaWhatsApp(name, email, phone, subject, message) {
  const whatsappMessage = `
*New Contact Form Submission*

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Subject:* ${subject}

*Message:*
${message}

---
Sent from Launch Supp Portfolio
  `;

  const whatsappLink = `https://wa.me/966504877945?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // Close modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById('submissionModal')
  );
  modal.hide();

  // Open WhatsApp
  window.open(whatsappLink, '_blank');

  showNotification('WhatsApp opened with your message!', 'success');
}

// Copy to Clipboard
function copyToClipboard(name, email, phone, subject, message) {
  const messageText = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}
  `;

  navigator.clipboard
    .writeText(messageText)
    .then(() => {
      // Close modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById('submissionModal')
      );
      modal.hide();

      showNotification('Message copied to clipboard!', 'success');
    })
    .catch(() => {
      showNotification('Failed to copy to clipboard', 'error');
    });
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification alert alert-${
    type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'
  } alert-dismissible fade show`;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// Typing effect for hero section
function initTypingEffect() {
  const heroTitle = document.querySelector('.hero-content h1');
  if (!heroTitle) return;

  const originalText = heroTitle.textContent;
  const words = originalText.split(' ');
  let currentWordIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;

  function typeWriter() {
    const currentWord = words[currentWordIndex];

    if (isDeleting) {
      heroTitle.textContent = currentWord.substring(0, currentCharIndex - 1);
      currentCharIndex--;
    } else {
      heroTitle.textContent = currentWord.substring(0, currentCharIndex + 1);
      currentCharIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && currentCharIndex === currentWord.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentWordIndex = (currentWordIndex + 1) % words.length;
    }

    setTimeout(typeWriter, typeSpeed);
  }

  // Start typing effect after a delay
  setTimeout(typeWriter, 1000);
}

// Animate progress bars
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const width = progressBar.style.width;
          progressBar.style.width = '0%';

          setTimeout(() => {
            progressBar.style.width = width;
          }, 200);
        }
      });
    },
    { threshold: 0.5 }
  );

  progressBars.forEach((bar) => {
    observer.observe(bar);
  });
}

// Particle effect for hero section
function initParticleEffect() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  // Create particle container
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particle-container';
  particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
    `;

  heroSection.appendChild(particleContainer);

  // Create particles
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: float 6s infinite linear;
        `;

    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = Math.random() * 3 + 3 + 's';

    particleContainer.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, 6000);
  }

  // Create particles periodically
  setInterval(createParticle, 300);

  // Add CSS animation for particles
  const style = document.createElement('style');
  style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
}

// Scroll to top functionality
function initScrollToTop() {
  // Create scroll to top button
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        z-index: 1000;
    `;

  document.body.appendChild(scrollToTopBtn);

  // Show/hide button based on scroll position
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      scrollToTopBtn.style.display = 'flex';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  });

  // Scroll to top functionality
  scrollToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // Hover effects
  scrollToTopBtn.addEventListener('mouseenter', function () {
    this.style.transform = 'scale(1.1)';
    this.style.background = '#0056b3';
  });

  scrollToTopBtn.addEventListener('mouseleave', function () {
    this.style.transform = 'scale(1)';
    this.style.background = 'var(--primary-color)';
  });
}

// Portfolio filter functionality (if needed)
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.portfolio-filter');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter portfolio items
      portfolioItems.forEach((item) => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.style.display = 'block';
          item.style.animation = 'fadeInUp 0.5s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Mobile menu close on link click
function initMobileMenu() {
  const navLinks = document.querySelectorAll('.nav-link');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  navLinks.forEach((link) => {
    link.addEventListener('click', function () {
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });
}

// Initialize mobile menu functionality
initMobileMenu();

// Add loading animation to page
window.addEventListener('load', function () {
  document.body.classList.add('loaded');
});

// Add parallax effect to hero section
window.addEventListener('scroll', function () {
  const scrolled = window.pageYOffset;
  const heroSection = document.querySelector('.hero-section');

  if (heroSection) {
    const rate = scrolled * -0.5;
    heroSection.style.transform = `translateY(${rate}px)`;
  }
});

// Add counter animation for statistics
function animateCounters() {
  const counters = document.querySelectorAll('.counter');

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      counter.textContent = Math.floor(current);

      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  });
}

// Initialize counter animation when in view
const counterObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  counterObserver.observe(statsSection);
}

// Add smooth reveal animation to sections
function revealSections() {
  const sections = document.querySelectorAll('section');

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionVisible = 150;

    if (sectionTop < window.innerHeight - sectionVisible) {
      section.classList.add('reveal');
    }
  });
}

window.addEventListener('scroll', revealSections);

// Add CSS for reveal animation
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    section {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.6s ease;
    }
    
    section.reveal {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(revealStyle);

// Initialize reveal on load
revealSections();

// Download CV functionality
function initDownloadCV() {
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const downloadDocBtn = document.getElementById('downloadDocBtn');

  // PDF Download functionality
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', function (e) {
      e.preventDefault();

      // Show loading state
      const originalText = this.innerHTML;
      this.innerHTML =
        '<i class="fas fa-spinner fa-spin me-2"></i>Preparing PDF...';
      this.disabled = true;

      // Simulate download process
      setTimeout(() => {
        // Download your actual PDF resume file
        const link = document.createElement('a');
        link.href = 'Mahjoub_Osman_Resumev.pdf';
        link.download = 'Mahjoub_Osman_Resume.pdf';
        link.click();

        // Reset button
        this.innerHTML = originalText;
        this.disabled = false;

        showNotification('PDF downloaded successfully!', 'success');
      }, 2000);
    });
  }

  // Word Document Download functionality
  if (downloadDocBtn) {
    downloadDocBtn.addEventListener('click', function (e) {
      e.preventDefault();

      // Show loading state
      const originalText = this.innerHTML;
      this.innerHTML =
        '<i class="fas fa-spinner fa-spin me-2"></i>Preparing Word...';
      this.disabled = true;

      // Simulate download process
      setTimeout(() => {
        // Create a sample Word document download (in real implementation, this would be your actual Word file)
        const link = document.createElement('a');
        link.href = 'Mahjoub_Osman_Resume.docx';
        link.download = 'Mahjoub_Osman_Resume.docx';
        link.click();

        // Reset button
        this.innerHTML = originalText;
        this.disabled = false;

        showNotification('Word document downloaded successfully!', 'success');
      }, 2000);
    });
  }
}

// Personal Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM Content Loaded - Initializing portfolio...');

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
  initCodeCopy();
  initSyntaxHighlighting();
  initWhatsAppFloat();

  console.log('All portfolio functions initialized');
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
    to_email: 'supplaunch@gmail.com',
  };

  // Load EmailJS library if not already loaded
  if (typeof emailjs === 'undefined') {
    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
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
    const whatsappLink = `https://wa.me/966504877945?text=${encodeURIComponent(
      whatsappMessage
    )}`;
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
      message: whatsappMessage,
    }),
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
      timestamp: new Date().toISOString(),
    }),
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
  console.log('Download CV function called');

  // Wait a bit to ensure DOM is fully loaded
  setTimeout(() => {
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const downloadDocBtn = document.getElementById('downloadDocBtn');

    console.log('Download CV initialized');
    console.log('PDF Button:', downloadPdfBtn);
    console.log('Word Button:', downloadDocBtn);

    // PDF Download functionality
    if (downloadPdfBtn) {
      console.log('Adding PDF click listener');
      downloadPdfBtn.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('PDF button clicked!');
        alert('PDF button clicked!'); // Temporary test

        // Show loading state
        const originalText = this.innerHTML;
        this.innerHTML =
          '<i class="fas fa-spinner fa-spin me-2"></i>Preparing PDF...';
        this.disabled = true;

        // Simulate download process
        setTimeout(() => {
          // Download your actual PDF resume file
          const link = document.createElement('a');
          link.href =
            'https://storage.googleapis.com/my-lanuch-data/Lanuch_Supp_Resumev.pdf';
          link.download = 'Launch_Supp_Resume.pdf';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';

          // Add to DOM temporarily
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Reset button
          this.innerHTML = originalText;
          this.disabled = false;

          showNotification('PDF downloaded successfully!', 'success');
        }, 2000);
      });
    }

    // Word Document Download functionality
    if (downloadDocBtn) {
      console.log('Adding Word click listener');
      downloadDocBtn.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Word button clicked!');
        alert('Word button clicked!'); // Temporary test

        // Show loading state
        const originalText = this.innerHTML;
        this.innerHTML =
          '<i class="fas fa-spinner fa-spin me-2"></i>Preparing Word...';
        this.disabled = true;

        // Simulate download process
        setTimeout(() => {
          // Create a sample Word document download (in real implementation, this would be your actual Word file)
          const link = document.createElement('a');
          link.href =
            'https://storage.googleapis.com/my-lanuch-data/Lanuch_Supp_Resumev.docx';
          link.download = 'Launch_Supp_Resume.docx';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';

          // Add to DOM temporarily
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Reset button
          this.innerHTML = originalText;
          this.disabled = false;

          showNotification('Word document downloaded successfully!', 'success');
        }, 2000);
      });
    }
  }, 100); // Close setTimeout
}

// Typing animation for ASP.NET code
function startTypingAnimation() {
  const codeElement = document.getElementById('aspnet-code');
  const typingBtn = document.getElementById('typingBtn');
  const codeSnippet = document.querySelector('.code-snippet');

  if (!codeElement || codeSnippet.classList.contains('typing-active')) {
    return; // Animation already running or element not found
  }

  // Mark as active
  codeSnippet.classList.add('typing-active');
  typingBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Typing...';
  typingBtn.disabled = true;

  // Store original content
  const originalContent = codeElement.innerHTML;

  // Clear content
  codeElement.innerHTML = '';

  // Add typing cursor
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  codeElement.appendChild(cursor);

  // Split content into lines
  const lines = originalContent.split('\n');
  let currentLine = 0;
  let currentChar = 0;
  let isTyping = true;

  function typeNextChar() {
    if (!isTyping) return;

    if (currentLine < lines.length) {
      const line = lines[currentLine];

      if (currentChar < line.length) {
        // Add character
        const char = line[currentChar];
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.opacity = '0';
        charSpan.style.animation = 'fadeInChar 0.1s ease-in forwards';

        // Insert before cursor
        codeElement.insertBefore(charSpan, cursor);
        currentChar++;

        // Random delay for realistic typing
        const delay = Math.random() * 50 + 20; // 20-70ms
        setTimeout(typeNextChar, delay);
      } else {
        // Move to next line
        const lineBreak = document.createElement('br');
        codeElement.insertBefore(lineBreak, cursor);
        currentLine++;
        currentChar = 0;

        // Line break delay
        setTimeout(typeNextChar, 100);
      }
    } else {
      // Animation complete
      isTyping = false;
      cursor.remove();
      codeSnippet.classList.remove('typing-active');
      codeSnippet.classList.add('typing-complete');

      // Reset button
      typingBtn.innerHTML = '<i class="fas fa-redo me-2"></i>Replay';
      typingBtn.disabled = false;

      // Add completion effect
      codeElement.style.animation = 'codeComplete 0.5s ease-out';
    }
  }

  // Start typing
  setTimeout(typeNextChar, 500);
}

// Add CSS for character fade-in animation
const typingStyles = document.createElement('style');
typingStyles.textContent = `
  @keyframes fadeInChar {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes codeComplete {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
    100% {
      transform: scale(1);
    }
  }
  
  .typing-active .code-content {
    background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  }
  
  .typing-complete .code-content {
    background: #1e1e1e;
    box-shadow: 0 0 20px rgba(37, 211, 102, 0.3);
  }
`;
document.head.appendChild(typingStyles);

// Simple download functions
function downloadPDF() {
  console.log('PDF download clicked!');
  alert('PDF download clicked!');

  try {
    const link = document.createElement('a');
    link.href =
      'https://storage.googleapis.com/my-lanuch-data/Lanuch_Supp_Resumev.pdf';
    link.download = 'Launch_Supp_Resume.pdf';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('PDF download started');
  } catch (error) {
    console.error('PDF download error:', error);
    window.open(
      'https://storage.googleapis.com/my-lanuch-data/Lanuch_Supp_Resumev.pdf',
      '_blank'
    );
  }
}

function downloadWord() {
  console.log('Word download clicked!');
  alert('Word download clicked!');

  try {
    const link = document.createElement('a');
    link.href =
      'https://storage.googleapis.com/my-lanuch-data/Lanuch_Supp_Resumev.docx';
    link.download = 'Launch_Supp_Resume.docx';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('Word download started');
  } catch (error) {
    console.error('Word download error:', error);
    window.open(
      'https://storage.googleapis.com/my-lanuch-data/Lanuch_Supp_Resumev.docx',
      '_blank'
    );
  }
}

// Code copy functionality
function initCodeCopy() {
  // Add copy functionality to code snippets
  window.copyCode = function (codeId) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;

    const codeText = codeElement.textContent;

    // Copy to clipboard
    navigator.clipboard
      .writeText(codeText)
      .then(() => {
        // Show success notification
        showNotification('Code copied to clipboard!', 'success');

        // Add visual feedback to the copy button
        const copyBtn = event.target.closest('button');
        if (copyBtn) {
          const originalIcon = copyBtn.innerHTML;
          copyBtn.innerHTML = '<i class="fas fa-check"></i>';
          copyBtn.classList.add('btn-success');
          copyBtn.classList.remove('btn-outline-light');

          // Reset after 2 seconds
          setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
            copyBtn.classList.remove('btn-success');
            copyBtn.classList.add('btn-outline-light');
          }, 2000);
        }
      })
      .catch(() => {
        showNotification('Failed to copy code', 'error');
      });
  };
}

// Initialize syntax highlighting
function initSyntaxHighlighting() {
  // Wait for Prism.js to load
  if (typeof Prism !== 'undefined') {
    // Highlight all code blocks
    Prism.highlightAll();

    // Re-highlight when new content is added
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === 1) {
              // Element node
              const codeBlocks = node.querySelectorAll
                ? node.querySelectorAll('pre code')
                : [];
              codeBlocks.forEach((block) => {
                if (block.className.includes('language-')) {
                  Prism.highlightElement(block);
                }
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  } else {
    // Retry after a short delay if Prism isn't loaded yet
    setTimeout(initSyntaxHighlighting, 100);
  }
}

// Initialize floating WhatsApp button
function initWhatsAppFloat() {
  const whatsappFloat = document.getElementById('whatsappFloat');
  const whatsappLink = document.querySelector('.whatsapp-link');

  if (!whatsappFloat || !whatsappLink) return;

  // Show/hide button based on scroll position
  let isVisible = true;
  let lastScrollY = window.scrollY;

  function handleScroll() {
    const currentScrollY = window.scrollY;

    // Show button when scrolling up or at top
    if (currentScrollY < lastScrollY || currentScrollY < 100) {
      if (!isVisible) {
        whatsappFloat.style.opacity = '1';
        whatsappFloat.style.transform = 'translateY(0)';
        isVisible = true;
      }
    }
    // Hide button when scrolling down (except at top)
    else if (currentScrollY > lastScrollY && currentScrollY > 200) {
      if (isVisible) {
        whatsappFloat.style.opacity = '0.7';
        whatsappFloat.style.transform = 'translateY(10px)';
        isVisible = false;
      }
    }

    lastScrollY = currentScrollY;
  }

  // Add scroll listener
  window.addEventListener('scroll', handleScroll);

  // Add click tracking
  whatsappLink.addEventListener('click', function () {
    // Track WhatsApp click (you can add analytics here)
    console.log('WhatsApp button clicked');

    // Add click animation
    whatsappFloat.style.transform = 'scale(0.9)';
    setTimeout(() => {
      whatsappFloat.style.transform = 'scale(1)';
    }, 150);
  });

  // Add hover effects
  whatsappFloat.addEventListener('mouseenter', function () {
    this.style.transform = 'scale(1.1)';
  });

  whatsappFloat.addEventListener('mouseleave', function () {
    this.style.transform = 'scale(1)';
  });

  // Add keyboard accessibility
  whatsappLink.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  });

  // Add focus styles for accessibility
  whatsappLink.addEventListener('focus', function () {
    whatsappFloat.style.outline = '2px solid #25d366';
    whatsappFloat.style.outlineOffset = '2px';
  });

  whatsappLink.addEventListener('blur', function () {
    whatsappFloat.style.outline = 'none';
  });

  // Auto-hide after 5 seconds of inactivity (optional)
  let inactivityTimer;
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      if (window.scrollY > 500) {
        whatsappFloat.style.opacity = '0.5';
      }
    }, 5000);
  }

  // Reset timer on user interaction
  ['scroll', 'mousemove', 'click', 'keydown'].forEach((event) => {
    document.addEventListener(event, resetInactivityTimer);
  });

  // Initial setup
  resetInactivityTimer();
}

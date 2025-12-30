// main.js - Core functionality for HSE Calculator

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('HSE Calculator - Main JS Initialized');
    
    // Check if navigation is already loaded
    if (!document.getElementById('navLinks')) {
        console.log('Using inline navigation, initializing mobile menu...');
        initMobileMenu();
    }
    
    // Initialize components based on page
    initPageSpecificFeatures();
    
    // Initialize Font Awesome if not loaded
    loadFontAwesome();
});

// Initialize mobile menu (for inline navigation)
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navLinks.classList.toggle('active');
            
            // Toggle hamburger icon
            const icon = this.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.replace('fa-bars', 'fa-times');
                } else {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !mobileToggle.contains(event.target)) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });

        // Close menu when clicking a link (mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    const icon = mobileToggle.querySelector('i');
                    if (icon) {
                        icon.classList.replace('fa-times', 'fa-bars');
                    }
                }
            });
        });
    }
}

// Initialize features based on current page
function initPageSpecificFeatures() {
    const path = window.location.pathname;
    
    // Initialize calculators if on calculator page
    if (document.querySelector('.calculator-form')) {
        initCalculatorFeatures();
    }
    
    // Initialize product filters if on products page
    if (document.getElementById('category-filter')) {
        initProductFilters();
    }
    
    // Initialize blog features if on blog page
    if (document.querySelector('.blog-page')) {
        initBlogFeatures();
    }
    
    // Initialize contact form if on contact page
    if (document.getElementById('contact-form')) {
        initContactForm();
    }
}

// Calculator page features
function initCalculatorFeatures() {
    console.log('Initializing calculator features...');
    
    // Add calculate button listeners for all calculators
    const calculateButtons = document.querySelectorAll('[id^="calculate-"]');
    calculateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const calculatorType = this.id.replace('calculate-', '');
            runCalculator(calculatorType);
        });
    });
    
    // Add reset button functionality
    const resetButtons = document.querySelectorAll('.reset-btn');
    resetButtons.forEach(button => {
        button.addEventListener('click', resetCalculator);
    });
    
    // Initialize print buttons
    const printButtons = document.querySelectorAll('.print-btn');
    printButtons.forEach(button => {
        button.addEventListener('click', handlePrint);
    });
    
    // Initialize social sharing buttons
    initSocialSharing();
}

// Run specific calculator
function runCalculator(type) {
    const form = document.getElementById(`${type}-form`) || document.querySelector('.calculator-form');
    
    if (!form) {
        console.error('Calculator form not found');
        return;
    }
    
    // Validate all inputs
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Calculate based on calculator type
    let result;
    switch(type) {
        case 'risk':
            result = calculateRisk(data);
            break;
        case 'noise':
            result = calculateNoiseExposure(data);
            break;
        case 'chemical':
            result = calculateChemicalExposure(data);
            break;
        case 'incident':
            result = calculateIncidentRate(data);
            break;
        default:
            console.warn(`Calculator type "${type}" not implemented`);
            return;
    }
    
    // Display result
    displayResult(result, type);
    
    // Show success notification
    showNotification('Calculation completed successfully!', 'success');
}

// Reset calculator form
function resetCalculator() {
    const form = document.querySelector('.calculator-form');
    if (form) {
        form.reset();
        
        // Hide result box
        const resultBox = document.querySelector('.result-box.active');
        if (resultBox) {
            resultBox.classList.remove('active');
        }
        
        // Clear any error styles
        form.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        
        showNotification('Form has been reset.', 'info');
    }
}

// Calculator functions (implement these in respective calculator files)
function calculateRisk(data) {
    // Implementation in risk-assessment.js
    console.log('Risk calculation:', data);
    return { value: 'N/A', interpretation: 'Not implemented' };
}

function calculateNoiseExposure(data) {
    // Implementation in noise-exposure.js
    console.log('Noise calculation:', data);
    return { value: 'N/A', interpretation: 'Not implemented' };
}

function calculateChemicalExposure(data) {
    // Implementation in chemical-exposure.js
    console.log('Chemical calculation:', data);
    return { value: 'N/A', interpretation: 'Not implemented' };
}

function calculateIncidentRate(data) {
    // Implementation in incident-rate.js
    console.log('Incident calculation:', data);
    return { value: 'N/A', interpretation: 'Not implemented' };
}

// Display calculation result
function displayResult(result, type) {
    const resultBox = document.getElementById(`${type}-result`) || document.querySelector('.result-box');
    
    if (resultBox) {
        const valueElement = resultBox.querySelector('.result-value');
        const interpretationElement = resultBox.querySelector('.result-interpretation');
        
        if (valueElement) {
            valueElement.textContent = result.value;
        }
        
        if (interpretationElement) {
            interpretationElement.textContent = result.interpretation;
        }
        
        resultBox.classList.add('active');
        
        // Scroll to result
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Product filter functionality
function initProductFilters() {
    const filterSelect = document.getElementById('category-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', filterProducts);
    }
    
    // Initialize filter on load
    filterProducts();
}

function filterProducts() {
    const category = document.getElementById('category-filter')?.value || 'all';
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const cardCategory = card.dataset.category || card.querySelector('.product-category')?.textContent || '';
        
        if (category === 'all' || cardCategory.toLowerCase().includes(category.toLowerCase())) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Blog features
function initBlogFeatures() {
    // Filter tags
    const filterTags = document.querySelectorAll('.tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tags
            filterTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            this.classList.add('active');
            
            // Filter blog posts
            const category = this.dataset.category || 'all';
            filterBlogPosts(category);
        });
    });
    
    // Pagination
    initPagination();
}

function filterBlogPosts(category) {
    const posts = document.querySelectorAll('.blog-card');
    
    posts.forEach(post => {
        const postCategory = post.dataset.category || '';
        
        if (category === 'all' || postCategory === category) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

function initPagination() {
    const pageLinks = document.querySelectorAll('.page-link:not(.disabled)');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.href || this.href === '#') {
                e.preventDefault();
                showNotification('Pagination not implemented yet.', 'info');
            }
        });
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm(this)) {
                // Simulate form submission
                showNotification('Thank you for your message! We will respond soon.', 'success');
                this.reset();
            }
        });
    }
}

function validateContactForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
        
        // Email validation
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                field.classList.add('error');
                showNotification('Please enter a valid email address.', 'error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Social sharing functionality
function initSocialSharing() {
    const shareButtons = document.querySelectorAll('[data-share]');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.dataset.share;
            shareOnPlatform(platform);
        });
    });
}

function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const text = encodeURIComponent('Check out this professional HSE calculator!');
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${text} ${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=${text} ${url}`;
            break;
        default:
            console.warn('Unknown share platform:', platform);
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Print/PDF functionality
function handlePrint() {
    if (typeof html2pdf === 'undefined') {
        // Load html2pdf if not available
        loadHtml2Pdf().then(() => {
            generatePDF();
        }).catch(() => {
            // Fallback to browser print
            window.print();
        });
    } else {
        generatePDF();
    }
}

function generatePDF() {
    const element = document.querySelector('.calculator-form') || 
                    document.querySelector('.result-box.active') || 
                    document.querySelector('.container');
    
    if (!element) {
        showNotification('No content available to print.', 'error');
        return;
    }
    
    const opt = {
        margin: 0.5,
        filename: `hse-calculator-${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false
        },
        jsPDF: { 
            unit: 'in', 
            format: 'letter', 
            orientation: 'portrait' 
        }
    };
    
    html2pdf().set(opt).from(element).save();
}

// Load external dependencies
function loadHtml2Pdf() {
    return new Promise((resolve, reject) => {
        if (typeof html2pdf !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.integrity = 'sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==';
        script.crossOrigin = 'anonymous';
        
        script.onload = resolve;
        script.onerror = reject;
        
        document.head.appendChild(script);
    });
}

function loadFontAwesome() {
    // Only load if not already present
    if (!document.querySelector('link[href*="font-awesome"]') && 
        !document.querySelector('link[href*="fontawesome"]')) {
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        link.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';
        link.crossOrigin = 'anonymous';
        
        document.head.appendChild(link);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Add show class after a moment
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-remove after 5 seconds
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeNotification(notification);
        });
    }
    
    // Click anywhere to close
    notification.addEventListener('click', (e) => {
        if (e.target === notification) {
            clearTimeout(autoRemove);
            removeNotification(notification);
        }
    });
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS for notifications
const notificationCSS = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        min-width: 300px;
        max-width: 400px;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        background: linear-gradient(135deg, #28a745, #1e7e34);
        border-left: 4px solid #155724;
    }
    
    .notification-error {
        background: linear-gradient(135deg, #dc3545, #bd2130);
        border-left: 4px solid #721c24;
    }
    
    .notification-warning {
        background: linear-gradient(135deg, #ffc107, #e0a800);
        color: #333;
        border-left: 4px solid #856404;
    }
    
    .notification-info {
        background: linear-gradient(135deg, #17a2b8, #117a8b);
        border-left: 4px solid #0c5460;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    @media (max-width: 768px) {
        .notification {
            min-width: auto;
            max-width: calc(100vw - 40px);
            left: 20px;
            right: 20px;
            transform: translateY(-150%);
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;

// Inject notification CSS
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = notificationCSS;
    document.head.appendChild(style);
}

// Make main functions available globally
window.HSE = window.HSE || {};
window.HSE.main = {
    initMobileMenu,
    runCalculator,
    resetCalculator,
    showNotification,
    shareOnPlatform,
    generatePDF
};

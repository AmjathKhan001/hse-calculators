// main.js - Main JavaScript for HSE Calculator

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && mobileToggle) {
            if (!navLinks.contains(event.target) && !mobileToggle.contains(event.target)) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize calculators if on calculator page
    if (document.querySelector('.calculator-form')) {
        initializeCalculators();
    }
    
    // Initialize products page if on products page
    if (document.querySelector('.products-filter')) {
        initializeProductsFilter();
    }
});

// Tooltips initialization
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
                this.tooltipElement = null;
            }
        });
    });
}

// Initialize all calculators
function initializeCalculators() {
    // Risk Assessment Calculator
    if (document.getElementById('calculate-risk')) {
        document.getElementById('calculate-risk').addEventListener('click', calculateRisk);
    }
    
    // Noise Exposure Calculator
    if (document.getElementById('calculate-noise')) {
        document.getElementById('calculate-noise').addEventListener('click', calculateNoise);
    }
    
    // Chemical Exposure Calculator
    if (document.getElementById('calculate-chemical')) {
        document.getElementById('calculate-chemical').addEventListener('click', calculateChemical);
    }
    
    // Incident Rate Calculator
    if (document.getElementById('calculate-incident')) {
        document.getElementById('calculate-incident').addEventListener('click', calculateIncident);
    }
    
    // Print/Save as PDF functionality
    const printButtons = document.querySelectorAll('.print-btn');
    printButtons.forEach(button => {
        button.addEventListener('click', generatePDF);
    });
}

// Risk Assessment Calculator
function calculateRisk() {
    const probability = parseInt(document.getElementById('probability').value);
    const severity = parseInt(document.getElementById('severity').value);
    
    if (isNaN(probability) || isNaN(severity) || probability < 1 || probability > 5 || severity < 1 || severity > 5) {
        alert('Please enter valid values between 1 and 5 for both probability and severity.');
        return;
    }
    
    const risk = probability * severity;
    let interpretation = '';
    let riskLevel = '';
    
    if (risk <= 5) {
        interpretation = 'Low risk - Routine monitoring required.';
        riskLevel = 'Low';
    } else if (risk <= 10) {
        interpretation = 'Moderate risk - Additional controls may be needed.';
        riskLevel = 'Moderate';
    } else if (risk <= 15) {
        interpretation = 'High risk - Immediate action required.';
        riskLevel = 'High';
    } else {
        interpretation = 'Very high risk - Stop activity and implement controls immediately.';
        riskLevel = 'Very High';
    }
    
    document.getElementById('risk-value').textContent = `${risk} (${riskLevel})`;
    document.getElementById('risk-interpretation').textContent = interpretation;
    document.getElementById('risk-result').classList.add('active');
}

// Noise Exposure Calculator
function calculateNoise() {
    const noiseLevel = parseFloat(document.getElementById('noise-level').value);
    const exposureTime = parseFloat(document.getElementById('exposure-time').value);
    
    if (isNaN(noiseLevel) || isNaN(exposureTime) || noiseLevel < 50 || noiseLevel > 120 || exposureTime <= 0 || exposureTime > 24) {
        alert('Please enter valid values for noise level (50-120 dB) and exposure time (0.1-24 hours).');
        return;
    }
    
    const permissibleExposure = Math.pow(2, (85 - noiseLevel) / 3) * 8;
    let interpretation = '';
    
    if (exposureTime <= permissibleExposure) {
        interpretation = 'Exposure is within permissible limits.';
    } else {
        interpretation = 'Exposure exceeds permissible limits. Implement hearing protection and engineering controls.';
    }
    
    document.getElementById('noise-value').textContent = `${permissibleExposure.toFixed(2)} hours permissible`;
    document.getElementById('noise-interpretation').textContent = interpretation;
    document.getElementById('noise-result').classList.add('active');
}

// Chemical Exposure Calculator
function calculateChemical() {
    const concentration = parseFloat(document.getElementById('chemical-concentration').value);
    const oel = parseFloat(document.getElementById('oel').value);
    
    if (isNaN(concentration) || isNaN(oel) || concentration < 0 || oel <= 0) {
        alert('Please enter valid positive values for concentration and OEL.');
        return;
    }
    
    const ratio = concentration / oel;
    let interpretation = '';
    
    if (ratio < 0.1) {
        interpretation = 'Well below OEL - Minimal risk.';
    } else if (ratio < 0.5) {
        interpretation = 'Below OEL - Acceptable with routine monitoring.';
    } else if (ratio < 1) {
        interpretation = 'Approaching OEL - Increase monitoring frequency.';
    } else {
        interpretation = 'Exceeds OEL - Implement immediate controls and review procedures.';
    }
    
    document.getElementById('chemical-value').textContent = ratio.toFixed(2);
    document.getElementById('chemical-interpretation').textContent = interpretation;
    document.getElementById('chemical-result').classList.add('active');
}

// Incident Rate Calculator
function calculateIncident() {
    const incidents = parseInt(document.getElementById('recordable-incidents').value);
    const hours = parseInt(document.getElementById('total-hours').value);
    
    if (isNaN(incidents) || isNaN(hours) || incidents < 0 || hours <= 0) {
        alert('Please enter valid positive values for incidents and hours worked.');
        return;
    }
    
    const trir = (incidents * 200000) / hours;
    let interpretation = '';
    
    if (trir < 1) {
        interpretation = 'Excellent safety performance.';
    } else if (trir < 3) {
        interpretation = 'Good safety performance.';
    } else if (trir < 5) {
        interpretation = 'Average safety performance - Review safety programs.';
    } else {
        interpretation = 'Below average safety performance - Implement immediate improvements.';
    }
    
    document.getElementById('incident-value').textContent = trir.toFixed(2);
    document.getElementById('incident-interpretation').textContent = interpretation;
    document.getElementById('incident-result').classList.add('active');
}

// Generate PDF function
function generatePDF() {
    const element = document.querySelector('.calculator-form');
    const resultBox = document.querySelector('.result-box.active');
    
    if (!element) {
        alert('No content to print.');
        return;
    }
    
    // Create a print version
    const printElement = element.cloneNode(true);
    
    // Add timestamp
    const timestamp = document.createElement('div');
    timestamp.className = 'print-timestamp';
    timestamp.innerHTML = `<p>Generated on: ${new Date().toLocaleString()}</p>
                          <p>Source: HSE Calculator (https://www.hsecalculator.com)</p>`;
    printElement.appendChild(timestamp);
    
    // Configure PDF options
    const opt = {
        margin: 1,
        filename: `hse-calculator-${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Generate and save PDF
    html2pdf().set(opt).from(printElement).save();
}

// Products filter functionality
function initializeProductsFilter() {
    const filterSelect = document.getElementById('category-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', filterProducts);
    }
}

function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const cardCategory = card.querySelector('.product-category').textContent;
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Social sharing functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out these professional HSE calculators and safety tools!");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Professional HSE Calculators: " + window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

// Contact form validation
function validateContactForm() {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    
    if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    return true;
}

// Add CSS for tooltips
const tooltipCSS = `
    .tooltip {
        position: fixed;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 10000;
        pointer-events: none;
        max-width: 200px;
        text-align: center;
    }
    
    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
    }
`;

// Inject tooltip CSS
const style = document.createElement('style');
style.textContent = tooltipCSS;
document.head.appendChild(style);
// calculators.js - Common functionality for all calculator pages

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize all calculators
    initCalculators();
});

// Tooltip initialization
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltipText = e.target.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = tooltipText;
    tooltip.style.position = 'absolute';
    tooltip.style.background = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    tooltip.style.maxWidth = '200px';
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
    
    e.target.dataset.tooltipId = tooltip;
}

function hideTooltip(e) {
    const tooltip = e.target.dataset.tooltipId;
    if (tooltip && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
        delete e.target.dataset.tooltipId;
    }
}

// Initialize specific calculators based on page
function initCalculators() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    switch(page) {
        case 'noise-exposure.html':
            initNoiseExposureCalculator();
            break;
        case 'chemical-exposure.html':
            initChemicalExposureCalculator();
            break;
        case 'incident-rate.html':
            initIncidentRateCalculator();
            break;
        case 'fall-protection.html':
            initFallProtectionCalculator();
            break;
        case 'heat-stress.html':
            initHeatStressCalculator();
            break;
        case 'ventilation.html':
            initVentilationCalculator();
            break;
        case 'ppe-selection.html':
            initPPESelectionCalculator();
            break;
        case 'lifting-safety.html':
            initLiftingSafetyCalculator();
            break;
        case 'environmental-impact.html':
            initEnvironmentalImpactCalculator();
            break;
        case 'safety-training.html':
            initSafetyTraining();
            break;
    }
}

// Common calculator functions
function validateNumberInput(input, min, max) {
    const value = parseFloat(input.value);
    if (isNaN(value) || value < min || value > max) {
        input.style.borderColor = '#dc3545';
        return null;
    }
    input.style.borderColor = '';
    return value;
}

function showResult(element, message, type = 'info') {
    element.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    element.classList.add('active');
}

// PDF Generation for all calculators
function generatePDF(elementId, filename) {
    const element = document.getElementById(elementId);
    
    if (!element) {
        console.error('Element not found for PDF generation');
        return;
    }
    
    const opt = {
        margin: 1,
        filename: `${filename}-${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
}

// Social Sharing Functions (reusable)
function shareCalculator(title) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${title} - Professional HSE Tool`);
    
    return {
        facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank'),
        twitter: () => window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank'),
        linkedin: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank'),
        whatsapp: () => window.open(`https://api.whatsapp.com/send?text=${text}: ${url}`, '_blank')
    };
}

// Initialize specific calculator functions (to be implemented in respective pages)
function initNoiseExposureCalculator() {}
function initChemicalExposureCalculator() {}
function initIncidentRateCalculator() {}
function initFallProtectionCalculator() {}
function initHeatStressCalculator() {}
function initVentilationCalculator() {}
function initPPESelectionCalculator() {}
function initLiftingSafetyCalculator() {}
function initEnvironmentalImpactCalculator() {}
function initSafetyTraining() {}

const fs = require('fs');
const path = require('path');

// Navigation templates
const navTemplates = {
    root: `<!-- Header -->
<header class="header">
    <div class="container">
        <nav class="navbar">
            <a href="index.html" class="logo">
                <img src="assets/logo.png" alt="HSE Calculator Logo" class="logo-img">
                <span>HSE Calculator</span>
            </a>
            
            <div class="nav-links" id="navLinks">
                <a href="index.html" class="nav-link"><i class="fas fa-home"></i> Home</a>
                <a href="calculators/risk-assessment.html" class="nav-link"><i class="fas fa-calculator"></i> Calculators</a>
                <a href="pages/products.html" class="nav-link"><i class="fas fa-shopping-bag"></i> Safety Products</a>
                <a href="pages/tools.html" class="nav-link"><i class="fas fa-tools"></i> Tools</a>
                <a href="pages/blog.html" class="nav-link"><i class="fas fa-blog"></i> Blog</a>
                <a href="pages/contact.html" class="nav-link"><i class="fas fa-envelope"></i> Contact</a>
            </div>
            
            <div class="mobile-toggle" id="mobileToggle">
                <i class="fas fa-bars"></i>
            </div>
        </nav>
    </div>
</header>`,

    calculators: `<!-- Header -->
<header class="header">
    <div class="container">
        <nav class="navbar">
            <a href="../index.html" class="logo">
                <img src="../assets/logo.png" alt="HSE Calculator Logo" class="logo-img">
                <span>HSE Calculator</span>
            </a>
            
            <div class="nav-links" id="navLinks">
                <a href="../index.html" class="nav-link"><i class="fas fa-home"></i> Home</a>
                <a href="risk-assessment.html" class="nav-link"><i class="fas fa-calculator"></i> Calculators</a>
                <a href="../pages/products.html" class="nav-link"><i class="fas fa-shopping-bag"></i> Safety Products</a>
                <a href="../pages/tools.html" class="nav-link"><i class="fas fa-tools"></i> Tools</a>
                <a href="../pages/blog.html" class="nav-link"><i class="fas fa-blog"></i> Blog</a>
                <a href="../pages/contact.html" class="nav-link"><i class="fas fa-envelope"></i> Contact</a>
            </div>
            
            <div class="mobile-toggle" id="mobileToggle">
                <i class="fas fa-bars"></i>
            </div>
        </nav>
    </div>
</header>`,

    pages: `<!-- Header -->
<header class="header">
    <div class="container">
        <nav class="navbar">
            <a href="../index.html" class="logo">
                <img src="../assets/logo.png" alt="HSE Calculator Logo" class="logo-img">
                <span>HSE Calculator</span>
            </a>
            
            <div class="nav-links" id="navLinks">
                <a href="../index.html" class="nav-link"><i class="fas fa-home"></i> Home</a>
                <a href="../calculators/risk-assessment.html" class="nav-link"><i class="fas fa-calculator"></i> Calculators</a>
                <a href="products.html" class="nav-link"><i class="fas fa-shopping-bag"></i> Safety Products</a>
                <a href="tools.html" class="nav-link"><i class="fas fa-tools"></i> Tools</a>
                <a href="blog.html" class="nav-link"><i class="fas fa-blog"></i> Blog</a>
                <a href="contact.html" class="nav-link"><i class="fas fa-envelope"></i> Contact</a>
            </div>
            
            <div class="mobile-toggle" id="mobileToggle">
                <i class="fas fa-bars"></i>
            </div>
        </nav>
    </div>
</header>`
};

function updateFile(filePath, template) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the navigation section
    const navRegex = /<!-- Header -->[\s\S]*?<\/header>/;
    content = content.replace(navRegex, template);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
}

// Update all HTML files
function updateAllFiles() {
    // Update index.html
    updateFile('index.html', navTemplates.root);
    
    // Update calculator files
    const calculatorFiles = fs.readdirSync('calculators');
    calculatorFiles.forEach(file => {
        if (file.endsWith('.html')) {
            updateFile(path.join('calculators', file), navTemplates.calculators);
        }
    });
    
    // Update page files
    const pageFiles = fs.readdirSync('pages');
    pageFiles.forEach(file => {
        if (file.endsWith('.html')) {
            updateFile(path.join('pages', file), navTemplates.pages);
        }
    });
    
    console.log('All navigation updated successfully!');
}

updateAllFiles();

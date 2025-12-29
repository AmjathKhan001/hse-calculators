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
                <a href="pages/all-calculators.html" class="nav-link"><i class="fas fa-calculator"></i> All Calculators</a>
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
                <a href="../pages/all-calculators.html" class="nav-link active"><i class="fas fa-calculator"></i> All Calculators</a>
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

    pages: (pageName) => {
        const isCurrentPage = (linkName) => linkName === pageName ? 'active' : '';
        
        return `<!-- Header -->
<header class="header">
    <div class="container">
        <nav class="navbar">
            <a href="../index.html" class="logo">
                <img src="../assets/logo.png" alt="HSE Calculator Logo" class="logo-img">
                <span>HSE Calculator</span>
            </a>
            
            <div class="nav-links" id="navLinks">
                <a href="../index.html" class="nav-link ${isCurrentPage('index')}"><i class="fas fa-home"></i> Home</a>
                <a href="all-calculators.html" class="nav-link ${isCurrentPage('all-calculators')}"><i class="fas fa-calculator"></i> All Calculators</a>
                <a href="products.html" class="nav-link ${isCurrentPage('products')}"><i class="fas fa-shopping-bag"></i> Safety Products</a>
                <a href="tools.html" class="nav-link ${isCurrentPage('tools')}"><i class="fas fa-tools"></i> Tools</a>
                <a href="blog.html" class="nav-link ${isCurrentPage('blog')}"><i class="fas fa-blog"></i> Blog</a>
                <a href="contact.html" class="nav-link ${isCurrentPage('contact')}"><i class="fas fa-envelope"></i> Contact</a>
            </div>
            
            <div class="mobile-toggle" id="mobileToggle">
                <i class="fas fa-bars"></i>
            </div>
        </nav>
    </div>
</header>`;
    }
};

// Update a single HTML file
function updateFile(filePath, template) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find and replace the navigation section
        const navRegex = /<!-- Header -->[\s\S]*?<\/header>/;
        
        if (navRegex.test(content)) {
            content = content.replace(navRegex, template);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated: ${filePath}`);
            return true;
        } else {
            console.log(`❌ No header found in: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error updating ${filePath}:`, error.message);
        return false;
    }
}

// Update all files
function updateAllFiles() {
    console.log('🚀 Starting navigation update for all HTML files...\n');
    
    // 1. Update index.html (root)
    updateFile('index.html', navTemplates.root);
    
    // 2. Update all calculator files
    const calculatorFiles = [
        'risk-assessment.html',
        'noise-exposure.html',
        'chemical-exposure.html',
        'incident-rate.html',
        'fall-protection.html',
        'heat-stress.html',
        'ventilation.html',
        'ppe-selection.html',
        'lifting-safety.html',
        'environmental-impact.html',
        'safety-training.html'
    ];
    
    calculatorFiles.forEach(file => {
        const filePath = path.join('calculators', file);
        if (fs.existsSync(filePath)) {
            updateFile(filePath, navTemplates.calculators);
        }
    });
    
    // 3. Update page files
    const pageFiles = [
        { name: 'all-calculators.html', active: 'all-calculators' },
        { name: 'products.html', active: 'products' },
        { name: 'tools.html', active: 'tools' },
        { name: 'blog.html', active: 'blog' },
        { name: 'contact.html', active: 'contact' },
        { name: 'privacy.html', active: '' },
        { name: 'terms.html', active: '' },
        { name: 'affiliate-disclosure.html', active: '' },
        { name: 'sitemap.html', active: '' }
    ];
    
    pageFiles.forEach(page => {
        const filePath = path.join('pages', page.name);
        if (fs.existsSync(filePath)) {
            updateFile(filePath, navTemplates.pages(page.active));
        }
    });
    
    console.log('\n✅ Navigation update completed!');
    console.log('📁 Updated files:');
    console.log('   - index.html (root)');
    console.log('   - 11 calculator files in /calculators/');
    console.log('   - 9 page files in /pages/');
    console.log('\n🔗 Total: 21 HTML files updated');
}

// Run the update
updateAllFiles();

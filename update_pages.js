const fs = require('fs');
const path = require('path');

// List of pages to update
const pages = [
    'pages/schedule.html',
    'pages/payment.html',
    'pages/tracking.html',
    'pages/stations.html',
    'pages/login.html',
    'pages/signup.html',
    'pages/dashboard.html',
    'index.html'
];

// Function to update a page with responsive navigation
function updatePage(pagePath) {
    let content = fs.readFileSync(pagePath, 'utf8');
    const isIndexPage = pagePath === 'index.html';
    const pathPrefix = isIndexPage ? '' : '../';
    
    // Add responsive.css link
    content = content.replace(
        `<link rel="stylesheet" href="${pathPrefix}css/style.css">`,
        `<link rel="stylesheet" href="${pathPrefix}css/style.css">\n    <link rel="stylesheet" href="${pathPrefix}css/responsive.css">`
    );
    
    // Update navigation toggle button
    content = content.replace(
        /<div class="menu-toggle">/g,
        '<button class="menu-toggle" aria-label="Toggle navigation menu" type="button">'
    );
    content = content.replace(
        /<\/div>(\s*)<ul class="nav-links">/g,
        '</button>$1<ul class="nav-links">'
    );

    // Add close button to navigation
    content = content.replace(
        /<ul class="nav-links">/g,
        '<ul class="nav-links">\n            <button class="nav-close" aria-label="Close navigation menu" type="button"></button>'
    );
    
    // Add auth.js and navigation.js scripts
    if (!content.includes('auth.js')) {
        content = content.replace(
            '</body>',
            `    <script src="${pathPrefix}js/auth.js"></script>\n    <script src="${pathPrefix}js/navigation.js"></script>\n</body>`
        );
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(pagePath, content);
    console.log(`Updated ${pagePath}`);
}

// Update all pages
pages.forEach(page => {
    try {
        updatePage(page);
    } catch (error) {
        console.error(`Error updating ${page}:`, error);
    }
}); 
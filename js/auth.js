// Authentication utility functions

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('recyco_isLoggedIn') === 'true';
}

// Protect routes from unauthorized access
function protectRoute() {
    if (!isLoggedIn()) {
        // Store the attempted URL to redirect back after login
        const currentPath = window.location.pathname;
        localStorage.setItem('recyco_redirect', currentPath);
        
        // Redirect to login page
        window.location.href = '/pages/login.html';
        return false;
    }
    return true;
}

// Update navigation based on auth status
function updateNavigation() {
    const isAuthenticated = isLoggedIn();
    const protectedLinks = document.querySelectorAll('.protected-link');
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    const dashboardLink = document.querySelector('.dashboard-link');

    if (isAuthenticated) {
        // Show protected links and logout button
        protectedLinks.forEach(link => link.style.display = 'block');
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (dashboardLink) dashboardLink.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
    } else {
        // Hide protected links and show login/signup buttons
        protectedLinks.forEach(link => link.style.display = 'none');
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
    }
}

// Handle logout
function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('recyco_isLoggedIn');
    localStorage.removeItem('recyco_username');
    window.location.href = '/index.html';
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if current page is protected
    const protectedPages = [
        '/pages/schedule.html',
        '/pages/payment.html',
        '/pages/tracking.html',
        '/pages/stations.html',
        '/pages/dashboard.html'
    ];

    const currentPath = window.location.pathname;
    if (protectedPages.some(page => currentPath.endsWith(page))) {
        protectRoute();
    }

    // Update navigation visibility
    updateNavigation();
}); 
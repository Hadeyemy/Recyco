// Navigation Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navWrapper = document.querySelector('.nav-wrapper');
    const navClose = document.querySelector('.nav-close');

    if (!menuToggle || !navWrapper) {
        console.error('Navigation elements not found');
        return;
    }

    // Function to close the menu
    const closeMenu = () => {
        navWrapper.classList.remove('active');
        menuToggle.classList.remove('active');
        // Enable scrolling when menu is closed
        document.body.style.overflow = '';
    };

    // Function to open the menu
    const openMenu = () => {
        navWrapper.classList.add('active');
        menuToggle.classList.add('active');
        // Disable scrolling when menu is open
        document.body.style.overflow = 'hidden';
    };

    // Toggle menu on button click
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Menu toggle clicked'); // Debug log
        if (navWrapper.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking the close button
    if (navClose) {
        navClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navWrapper.classList.contains('active') &&
            !e.target.closest('.nav-wrapper') && 
            !e.target.closest('.menu-toggle')) {
            closeMenu();
        }
    });

    // Close menu when window is resized above mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // Prevent clicks inside the menu from closing it
    navWrapper.addEventListener('click', (e) => {
        const isLink = e.target.tagName.toLowerCase() === 'a';
        if (!isLink) {
            e.stopPropagation();
        }
    });

    // Close menu when clicking on a link
    const navLinks = navWrapper.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });
}); 
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    
    // Show home section by default
    showSection('home-section');
    
    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            showSection(targetId.substring(1)); // Remove the '#'
            
            // Update active state
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            
            // Update URL
            history.pushState(null, '', targetId);
            
            // Smooth scroll to section
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Show specific section and hide others
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#home-section';
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            showSection(targetSection.id);
            updateActiveNav(hash);
        }
    });
    
    // Update active navigation link
    function updateActiveNav(hash) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Initialize active nav based on URL
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            showSection(targetSection.id);
            updateActiveNav(window.location.hash);
        }
    } else {
        // Default to home if no hash
        showSection('home-section');
        updateActiveNav('#home-section');
    }
}); 
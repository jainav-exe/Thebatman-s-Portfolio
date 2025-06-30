// Main JavaScript for Batman Portfolio
document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling for Navigation Links ---
    // Exclude plain '#' links (Book a Call) to avoid invalid selector errors
    const navLinks = document.querySelectorAll('#main-nav a[href^="#"]:not([href="#"])');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Navigation Active Link Logic ---
    const sections = document.querySelectorAll('section[id]');

    const onScroll = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Adjusted offset
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', onScroll);

    // --- Back to Top Button Logic ---
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Custom Cursor Logic ---
    const customCursor = document.querySelector('.custom-cursor');

    if(customCursor) {
        document.addEventListener('mousemove', e => {
            customCursor.setAttribute("style", "top: " + (e.pageY - 10) + "px; left: " + (e.pageX - 10) + "px;");
        });
    
        document.addEventListener('click', () => {
            customCursor.classList.add('expand');
            setTimeout(() => {
                customCursor.classList.remove('expand');
            }, 500);
        });
    }

    // --- Scroll Reveal Animation Logic ---
    const revealSections = document.querySelectorAll('.section');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% of the section is visible
    });

    revealSections.forEach(section => {
        revealObserver.observe(section);
    });

    // --- Daily Cache Bust for GitHub Activity Graph ---
    const githubGraphImg = document.getElementById('github-activity-graph');
    if (githubGraphImg) {
        const today = new Date();
        const ymd = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
        const baseSrc = githubGraphImg.src.split('?')[0];
        const params = githubGraphImg.src.split('?')[1];
        githubGraphImg.src = baseSrc + '?' + params + `&cache_bust=${ymd}`;
    }

    // --- Bat-Signal Spotlight Logic ---
    const batSignal = document.getElementById('bat-signal-spotlight');
    let isNight = false;

    if (batSignal) {
        /* Disabled movement of bat-signal to fix click issues
        // Move spotlight with mouse (desktop)
        // document.addEventListener('mousemove', (e) => {
        //     batSignal.style.left = `${e.clientX}px`;
        //     batSignal.style.top = `${e.clientY}px`;
        // });

        // Center on mouse leave (optional, can be removed for global)
        // document.addEventListener('mouseleave', () => {
        //     batSignal.style.left = '50%';
        //     batSignal.style.top = '20%';
        // });

        // Tap to show on mobile
        // document.addEventListener('touchstart', (e) => {
        //     const touch = e.touches[0];
        //     batSignal.style.left = `${touch.clientX}px`;
        //     batSignal.style.top = `${touch.clientY}px`;
        // });

        */
        // Toggle night mode on click
        batSignal.addEventListener('click', (e) => {
            // Only toggle if clicking directly on the bat-signal, not on child elements
            if (e.target === batSignal || e.target.closest('.bat-signal-svg')) {
                isNight = !isNight;
                document.body.classList.toggle('night-mode', isNight);
                // Spawn bats for night mode effect
                // spawnBats(4); // Disabled bat animation on click
            }
        });
    }

    // --- Bat-Signal Spotlight follows cursor ---
    const batSpotlight = document.getElementById('bat-signal-spotlight');
    if (batSpotlight) {
        document.addEventListener('mousemove', (e) => {
            batSpotlight.style.left = `${e.clientX}px`;
            batSpotlight.style.top = `${e.clientY}px`;
        });
    }

    // --- Flying Bats Animation ---
    function spawnBat() {
        const batsContainer = document.getElementById('flying-bats-container');
        if (!batsContainer) return;
        const bat = document.createElement('div');
        bat.className = 'bat';
        // Randomize vertical position and speed
        const top = Math.random() * 60 + 10; // 10% to 70% of viewport height
        const duration = Math.random() * 2 + 2.5; // 2.5s to 4.5s
        bat.style.top = `${top}vh`;
        bat.style.left = '-60px';
        bat.style.animationDuration = `${duration}s`;
        // Bat SVG
        bat.innerHTML = `
            <svg viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 22 Q8 10 16 18 Q24 2 32 18 Q40 10 46 22 Q36 16 24 22 Q12 16 2 22 Z" fill="#222" stroke="#ffd700" stroke-width="1.5"/>
                <ellipse cx="16" cy="18" rx="2" ry="1.2" fill="#ffd700"/>
                <ellipse cx="32" cy="18" rx="2" ry="1.2" fill="#ffd700"/>
            </svg>
        `;
        batsContainer.appendChild(bat);
        setTimeout(() => bat.remove(), duration * 1000);
    }

    function spawnBats(count = 3) {
        for (let i = 0; i < count; i++) {
            setTimeout(spawnBat, i * 400 + Math.random() * 300);
        }
    }

    // Spawn bats on page load only
    // spawnBats(3); // Disabled initial bat animation on page load

    // --- Gotham Skyline Clouds (static except on event) ---
    function spawnCloud(slow = false) {
        const clouds = document.getElementById('skyline-clouds');
        if (!clouds) return;
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.bottom = `${Math.random() * 20}px`;
        cloud.style.opacity = (Math.random() * 0.2 + 0.12).toFixed(2);
        // Slow clouds: 18-28s, else 12-18s
        cloud.style.transition = 'transform 0.2s';
        cloud.style.animation = `cloud-move ${slow ? (Math.random()*10+18) : (Math.random()*6+12)}s linear forwards`;
        clouds.appendChild(cloud);
        setTimeout(() => cloud.remove(), slow ? 29000 : 19000);
    }
    // Only spawn clouds on page load and night mode toggle
    function eventClouds(count = 2, slow = false) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => spawnCloud(slow), i * 1200 + Math.random() * 800);
        }
    }
    eventClouds(2, true); // On page load
    // Also spawn clouds on night mode toggle
    if (batSignal) {
        batSignal.addEventListener('click', () => {
            eventClouds(3, true);
        });
    }

    // --- Book a Call Modal Logic ---
    const bookCallBtn = document.getElementById('book-call-btn');
    const bookCallModal = document.getElementById('book-call-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const bookCallForm = document.getElementById('book-call-form');
    const modalSuccess = document.getElementById('modal-success');

    // Open modal
    if (bookCallBtn && bookCallModal) {
        bookCallBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bookCallModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    // Close modal
    if (modalCloseBtn && bookCallModal) {
        modalCloseBtn.addEventListener('click', () => {
            bookCallModal.classList.remove('active');
            document.body.style.overflow = '';
            // Reset form and success
            if (bookCallForm) bookCallForm.reset();
            if (modalSuccess) modalSuccess.classList.remove('active');
        });
    }
    // Close modal on overlay click
    if (bookCallModal) {
        bookCallModal.addEventListener('click', (e) => {
            if (e.target === bookCallModal) {
                bookCallModal.classList.remove('active');
                document.body.style.overflow = '';
                if (bookCallForm) bookCallForm.reset();
                if (modalSuccess) modalSuccess.classList.remove('active');
            }
        });
    }
                            

    // --- EmailJS form submission ---
    if (bookCallForm) {
        bookCallForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const serviceID = 'service_10kmggc'; // EmailJS service ID
            const templateID = 'template_rb28p3x'; // EmailJS template ID
            const publicKey = 'eWissHEOfpWszHn9Q'; // EmailJS public key

            /*
             * NOTE: make sure the current domain (e.g. http://127.0.0.1:5501 or your production URL)
             * is added to EmailJS → Account → Allowed origins, otherwise requests will be rejected.
             */
            console.log('📨 Sending EmailJS form...');
            emailjs.sendForm(serviceID, templateID, this, publicKey)
                .then(() => {
                    if (modalSuccess) {
                        modalSuccess.classList.add('active');
                        setTimeout(() => {
                            modalSuccess.classList.remove('active');
                            bookCallModal.classList.remove('active');
                            document.body.style.overflow = '';
                            this.reset();
                        }, 1800);
                    }
                }, (err) => {
                    console.error('EmailJS error', err?.status || '', err?.text || err);
                    alert('Failed to send message. Please try again.');
                });
        });
    }

    // --- Ensure all external links work properly ---
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Allow default behavior for external links
            // This ensures GitHub, Twitter, and project links work
        });
    });

    // --- Mobile touch improvements ---
    if ('ontouchstart' in window) {
        // Improve touch response on mobile
        document.body.classList.add('touch-device');
        
        // Add touch feedback for buttons
        const touchElements = document.querySelectorAll('a, button, .project-card, .github-btn');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            });
            element.addEventListener('touchend', () => {
                element.style.transform = '';
            });
        });
    }

    // --- Debug: Test all interactive elements ---
    console.log('🎯 Testing interactive elements...');
    
    // Test navigation links
    const debugNavLinks = document.querySelectorAll('#main-nav a');
    console.log(`✅ Found ${debugNavLinks.length} navigation links`);
    
    // Test project links
    const projectLinks = document.querySelectorAll('.project-link');
    console.log(`✅ Found ${projectLinks.length} project links`);
    
    // Test social links
    const socialLinks = document.querySelectorAll('.x-link, .github-link');
    console.log(`✅ Found ${socialLinks.length} social links`);
    
    // Test GitHub button
    const githubBtn = document.querySelector('.github-btn');
    console.log(`✅ Found GitHub button: ${githubBtn ? 'Yes' : 'No'}`);
    
    // Test Book a Call button
    const debugBookCallBtn = document.getElementById('book-call-btn');
    console.log(`✅ Found Book a Call button: ${debugBookCallBtn ? 'Yes' : 'No'}`);
    
    // Test back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    console.log(`✅ Found Back to Top button: ${backToTopBtn ? 'Yes' : 'No'}`);
    
    // Add click event listeners for debugging
    debugNavLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
            console.log(`🎯 Navigation link ${index + 1} clicked: ${link.textContent}`);
        });
    });
    
    projectLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
            console.log(`🎯 Project link ${index + 1} clicked: ${link.textContent}`);
        });
    });
    
    socialLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
            console.log(`🎯 Social link ${index + 1} clicked: ${link.textContent}`);
        });
    });
    
    if (githubBtn) {
        githubBtn.addEventListener('click', () => {
            console.log('🎯 GitHub button clicked');
        });
    }
    
    if (debugBookCallBtn) {
        debugBookCallBtn.addEventListener('click', () => {
            console.log('🎯 Book a Call button clicked');
        });
    }
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            console.log('🎯 Back to Top button clicked');
        });
    }
    
    console.log('🎯 All interactive elements tested and ready!');
});

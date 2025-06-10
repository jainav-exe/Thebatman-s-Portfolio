document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Show home section by default
    showSection('home-section');
    
    // Show loading spinner with a slight delay to prevent flash on initial load
    setTimeout(() => {
        loadingSpinner.classList.remove('active');
    }, 500);
    
    // Back to Top Button
    window.addEventListener('scroll', toggleBackToTop);
    backToTopBtn.addEventListener('click', scrollToTop);
    
    // Navigation functionality with smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            // If it's an external link (like the movie booking site)
            if (link.closest('.project-card')) {
                showPageTransition(link.href);
                return;
            }
            
            // For internal navigation
            showSection(targetId.substring(1)); // Remove the '#'
            
            // Update active state
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            
            // Update URL
            history.pushState(null, '', targetId);
            
            // Smooth scroll to section
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                smoothScrollTo(targetSection);
            }
        });
    });
    
    // Smooth scroll to element
    function smoothScrollTo(element) {
        window.scrollTo({
            top: element.offsetTop,
            behavior: 'smooth'
        });
    }
    
    // Show page transition and redirect
    function showPageTransition(url) {
        loadingSpinner.classList.add('active');
        setTimeout(() => {
            window.location.href = url;
        }, 800);
    }
    
    // Toggle back to top button
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Scroll to top function
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
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
            // Smooth scroll to section after a short delay to ensure the section is visible
            setTimeout(() => {
                smoothScrollTo(targetSection);
            }, 100);
        }
    } else {
        // Default to home if no hash
        showSection('home-section');
        updateActiveNav('#home-section');
    }
    
    // Initial check for back to top button
    toggleBackToTop();
    
    // Load GitHub contributions
    loadGitHubContributions();
});

// GitHub Contributions
async function loadGitHubContributions() {
    const username = 'jainav-exe';
    const container = document.querySelector('.github-contributions');
    
    // Create the main container if it doesn't exist
    if (!container) return;
    
    // Create the calendar element structure
    container.innerHTML = `
        <div class="calendar-header">
            <h3 class="calendar-title">GitHub Contributions</h3>
            <div class="calendar-stats">
                <span id="total-commits">0</span> contributions in the last year
            </div>
        </div>
        <div class="calendar-graph">
            <div class="calendar-months"></div>
            <div class="calendar-body">
                <div class="calendar-days">
                    <div>Mon</div>
                    <div></div>
                    <div>Wed</div>
                    <div></div>
                    <div>Fri</div>
                    <div></div>
                    <div></div>
                </div>
                <div class="calendar-grid" id="github-calendar"></div>
            </div>
            <div class="calendar-legend">
                <span class="legend-text">Less</span>
                <div class="legend-items">
                    <div class="legend-item" data-level="0"></div>
                    <div class="legend-item" data-level="1"></div>
                    <div class="legend-item" data-level="2"></div>
                    <div class="legend-item" data-level="3"></div>
                    <div class="legend-item" data-level="4"></div>
                </div>
                <span class="legend-text">More</span>
            </div>
        </div>
        <div class="github-tooltip"></div>
    `;
    
    const calendar = document.getElementById('github-calendar');
    const totalCommitsEl = document.getElementById('total-commits');
    const currentStreakEl = document.getElementById('current-streak');
    const tooltip = document.querySelector('.github-tooltip');
    
    // Show loading state
    calendar.innerHTML = '<div class="loading-text">Loading GitHub contributions...</div>';
    
    try {
        // Generate a full year of mock data
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        // Generate mock contributions data for the past year
        const mockData = {
            contributions: {}
        };
        
        // Generate data for each day of the past year
        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            // Randomly generate some contributions (0-20 per day)
            mockData.contributions[dateStr] = Math.floor(Math.random() * 21);
        }
        
        // Update UI with mock data
        updateGitHubUI(mockData, username, calendar, totalCommitsEl, currentStreakEl);
        
        // Add event listeners for tooltips
        setupTooltips(tooltip);
        
        // Try to load real data in the background
        loadRealGitHubData(username, calendar, totalCommitsEl, currentStreakEl, tooltip);
        
    } catch (error) {
        console.error('Error initializing GitHub contributions:', error);
        showGitHubError(container, username);
    }
}

async function loadRealGitHubData(username, calendar, totalCommitsEl, currentStreakEl, repositoriesEl) {
    try {
        // Try to use GitHub's GraphQL API which has better CORS support
        const query = `
            query {
                user(login: "${username}") {
                    contributionsCollection {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    date
                                    contributionCount
                                }
                            }
                        }
                    }
                    repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
                        totalCount
                    }
                }
            }
        `;
        
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query })
        });
        
        if (!response.ok) throw new Error('GitHub API request failed');
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        const userData = result.data.user;
        const weeks = userData.contributionsCollection.contributionCalendar.weeks;
        
        // Process contributions data
        const contributions = {};
        let totalContributions = 0;
        
        weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                contributions[day.date] = day.contributionCount;
                totalContributions += day.contributionCount;
            });
        });
        
        // Update UI with real data
        if (totalCommitsEl) {
            totalCommitsEl.textContent = totalContributions.toLocaleString();
        }
        
        if (currentStreakEl) {
            // Simple streak calculation (can be improved)
            const today = new Date();
            let streak = 0;
            let currentDate = new Date(today);
            
            while (true) {
                const dateStr = currentDate.toISOString().split('T')[0];
                if (contributions[dateStr] > 0) {
                    streak++;
                    currentDate.setDate(currentDate.getDate() - 1);
                } else {
                    break;
                }
            }
            
            currentStreakEl.textContent = streak > 0 ? streak.toString() : '0';
        }
        
        if (repositoriesEl) {
            repositoriesEl.textContent = userData.repositories.totalCount.toLocaleString();
        }
        
        // Generate calendar with real data
        generateGitHubCalendar({ contributions });
        
    } catch (error) {
        console.warn('Could not load real GitHub data, using mock data instead:', error);
        // We'll just keep the mock data that was already loaded
    }
}

function showGitHubError(calendar, username) {
    calendar.innerHTML = `
        <div class="error-text">
            <p>Failed to load GitHub contributions. The data might be temporarily unavailable.</p>
            <p>
                <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" 
                   style="color: #ffd700; text-decoration: underline;">
                    View my GitHub profile directly
                </a>
            </p>
        </div>
    `;
}

// Update the GitHub UI with contribution data
function updateGitHubUI(data, username, calendar, totalCommitsEl, currentStreakEl) {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Clear loading state
    calendar.innerHTML = '';
    
    // Generate all dates for the past year
    const allDates = [];
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        allDates.push(new Date(d));
    }
    
    // Group by weeks (starting from Sunday)
    const weeksData = [];
    let currentWeek = [];
    
    // Add empty cells for days before the first Sunday
    const firstDay = allDates[0].getDay(); // 0 = Sunday, 1 = Monday, etc.
    for (let i = 0; i < firstDay; i++) {
        currentWeek.push(null);
    }
    
    // Add all dates to weeks
    allDates.forEach((date, index) => {
        if (currentWeek.length === 7) {
            weeksData.push([...currentWeek]);
            currentWeek = [];
        }
        currentWeek.push(date);
    });
    
    // Add remaining days to complete the last week
    while (currentWeek.length < 7) {
        currentWeek.push(null);
    }
    weeksData.push(currentWeek);
    
    // Calculate total contributions and streak
    let totalContributions = 0;
    let currentStreak = 0;
    let currentDate = new Date(today);
    
    // Calculate total contributions and current streak
    while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = data.contributions[dateStr] || 0;
        totalContributions += count;
        
        if (count > 0) {
            currentStreak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    // Update stats
    if (totalCommitsEl) {
        totalCommitsEl.textContent = totalContributions.toLocaleString();
    }
    
    if (currentStreakEl) {
        currentStreakEl.textContent = currentStreak.toString();
    }
    
    // Generate calendar grid
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let currentMonth = -1;
    let monthSpans = [];
    
    // Generate month labels
    const monthLabels = [];
    weeksData.forEach((week, weekIndex) => {
        const weekDate = week.find(day => day !== null);
        if (weekDate) {
            const month = weekDate.getMonth();
            if (month !== currentMonth) {
                monthLabels.push({
                    month: months[month],
                    index: weekIndex
                });
                currentMonth = month;
            }
        }
    });
    
    // Update month labels
    const monthsContainer = document.querySelector('.calendar-months');
    if (monthsContainer) {
        monthsContainer.innerHTML = monthLabels.map(m => 
            `<span style="width: ${(m.index / weeksData.length * 100)}%;">${m.month}</span>`
        ).join('');
    }
    
    // Generate calendar grid with staggered animations
    const totalWeeks = weeksData.length;
    const totalDays = totalWeeks * 7;
    
    // First pass: Create all elements without animation
    weeksData.forEach((week, weekIndex) => {
        const weekEl = document.createElement('div');
        weekEl.className = 'calendar-week';
        
        week.forEach((date, dayIndex) => {
            const dayEl = document.createElement('div');
            
            if (!date) {
                dayEl.className = 'calendar-day empty';
                weekEl.appendChild(dayEl);
                return;
            }
            
            const dateStr = date.toISOString().split('T')[0];
            const count = data.contributions[dateStr] || 0;
            
            // Calculate contribution level (0-4)
            let level = 0;
            if (count > 0) {
                if (count <= 3) level = 1;
                else if (count <= 6) level = 2;
                else if (count <= 9) level = 3;
                else level = 4;
            }
            
            dayEl.className = 'calendar-day';
            dayEl.setAttribute('data-level', level);
            dayEl.setAttribute('data-count', count);
            dayEl.setAttribute('data-date', date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }));
            
            weekEl.appendChild(dayEl);
        });
        
        calendar.appendChild(weekEl);
    });
    
    // Get all day elements and convert to array
    const days = Array.from(calendar.querySelectorAll('.calendar-day:not(.empty)'));
    
    // Function to animate a single day
    const animateDay = (day) => {
        return new Promise(resolve => {
            // Force reflow to ensure styles are applied
            void day.offsetWidth;
            
            // Add class to start the animation
            day.classList.add('animate-enter');
            
            // Resolve after animation completes
            setTimeout(() => {
                resolve();
            }, 300);
        });
    };
    
    // Animate all days with staggered delay
    const animateAllDays = () => {
        // First make all days invisible
        days.forEach(day => {
            day.style.opacity = '0';
            day.style.transform = 'translateY(10px) scale(0.9)';
        });
        
        // Wait for initial render
        requestAnimationFrame(() => {
            // Animate each day with a small delay
            days.forEach((day, i) => {
                const row = Math.floor(i / 7);
                const col = i % 7;
                const delay = (col * 20) + (row * 20); // Stagger in milliseconds
                
                setTimeout(() => {
                    animateDay(day);
                }, delay);
            });
        });
    };
    
    // Start the animation after a small delay to ensure everything is ready
    setTimeout(animateAllDays, 100);
}

// Set up tooltips for the calendar
document.addEventListener('DOMContentLoaded', function() {
    const tooltip = document.querySelector('.github-tooltip');
    if (tooltip) {
        setupTooltips(tooltip);
    }
});

function setupTooltips(tooltip) {
    if (!tooltip) return;
    
    let hoverTimeout;
    let isTooltipVisible = false;
    let currentDay = null;
    
    const showTooltip = (day) => {
        if (isTooltipVisible && currentDay === day) return;
        
        clearTimeout(hoverTimeout);
        currentDay = day;
        
        const count = parseInt(day.getAttribute('data-count') || '0');
        const date = day.getAttribute('data-date') || '';
        
        tooltip.innerHTML = `
            <strong>${count} ${count === 1 ? 'contribution' : 'contributions'}</strong>
            <span class="tooltip-date">${date}</span>
        `;
        
        // Position tooltip
        updateTooltipPosition(day);
        
        // Show tooltip with animation
        tooltip.classList.add('visible');
        isTooltipVisible = true;
        
        // Add active class for animation
        day.classList.add('active');
    };
    
    const hideTooltip = () => {
        if (!isTooltipVisible) return;
        
        tooltip.classList.remove('visible');
        isTooltipVisible = false;
        
        if (currentDay) {
            currentDay.classList.remove('active');
            currentDay = null;
        }
    };
    
    const updateTooltipPosition = (day) => {
        if (!day) return;
        
        const rect = day.getBoundingClientRect();
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        
        const dayCenter = rect.left + (rect.width / 2);
        const tooltipWidth = tooltip.offsetWidth;
        
        // Calculate position with boundary checks
        let left = dayCenter + scrollX;
        const maxLeft = window.innerWidth - (tooltipWidth / 2) - 10;
        const minLeft = (tooltipWidth / 2) + 10;
        
        left = Math.max(minLeft, Math.min(left, maxLeft));
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${rect.top + scrollY - 10}px`;
    };
    
    // Handle hover with slight delay for smoother experience
    document.addEventListener('mouseover', (e) => {
        const day = e.target.closest('.calendar-day:not(.empty)');
        if (!day) {
            hoverTimeout = setTimeout(hideTooltip, 100);
            return;
        }
        
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => showTooltip(day), 60);
    });
    
    document.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget || !e.relatedTarget.closest('.calendar-day')) {
            hoverTimeout = setTimeout(hideTooltip, 100);
        }
    });
    
    // Update tooltip position on scroll/resize
    let isUpdating = false;
    const throttledUpdate = () => {
        if (isUpdating) return;
        isUpdating = true;
        
        requestAnimationFrame(() => {
            if (currentDay && isTooltipVisible) {
                updateTooltipPosition(currentDay);
            }
            isUpdating = false;
        });
    };
    
    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate);
}

// Load real GitHub data
async function loadRealGitHubData(username, calendar, totalCommitsEl, currentStreakEl, tooltip) {
    try {
        // First try the GitHub GraphQL API
        const query = `
            query($userName:String!) {
                user(login: $userName) {
                    contributionsCollection {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    contributionCount
                                    date
                                }
                            }
                        }
                    }
                }
            }
        `;
        
        const variables = {
            "userName": username
        };
        
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        });
        
        if (!response.ok) throw new Error('GitHub API request failed');
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        const contributionsData = {
            contributions: {}
        };
        
        // Process the GraphQL response
        const weeks = result.data.user.contributionsCollection.contributionCalendar.weeks;
        weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                contributionsData.contributions[day.date] = day.contributionCount;
            });
        });
        
        // Update the UI with real data
        updateGitHubUI(contributionsData, username, calendar, totalCommitsEl, currentStreakEl);
        setupTooltips(tooltip);
        
    } catch (error) {
        console.error('Error loading GitHub data:', error);
        // If GraphQL fails, try the REST API as fallback
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            if (!response.ok) throw new Error('GitHub API request failed');
            const repos = await response.json();
            
            // Update repository count if needed
            const repositoriesEl = document.getElementById('repositories');
            if (repositoriesEl) {
                repositoriesEl.textContent = repos.length.toString();
            }
            
        } catch (fallbackError) {
            console.error('Fallback GitHub API request failed:', fallbackError);
            // We'll just keep the mock data if all else fails
        }
    }
}

// Show error message if GitHub data can't be loaded
function showGitHubError(container, username) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="github-error">
            <p>Couldn't load GitHub contributions. <a href="https://github.com/${username}" target="_blank" rel="noopener">View on GitHub</a></p>
        </div>
    `;
}

// Initialize the GitHub contributions graph
function initGitHubContributions() {
    loadGitHubContributions();
}

// Call the initialization function when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGitHubContributions);
} else {
    initGitHubContributions();
}

// Initialize the GitHub contributions graph when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGitHubContributions);
} else {
    initGitHubContributions();
}

let tooltip = null;

function showTooltip(e) {
    // Remove any existing tooltips
    if (tooltip) {
        tooltip.remove();
    }
    
    const day = e.target;
    const count = day.dataset.count;
    const date = day.dataset.date;
    const rect = day.getBoundingClientRect();
    
    // Create tooltip
    tooltip = document.createElement('div');
    tooltip.className = 'github-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-arrow"></div>
        <div class="tooltip-content">
            <strong>${count === '0' ? 'No contributions' : count + ' ' + (count === '1' ? 'contribution' : 'contributions')}</strong><br>
            <span>${date}</span>
        </div>
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const tooltipRect = tooltip.getBoundingClientRect();
    const top = rect.top - tooltipRect.height - 10;
    const left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    
    // Adjust if tooltip goes off screen
    const adjustedLeft = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${adjustedLeft}px`;
    tooltip.style.opacity = '1';
}

function hideTooltip() {
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        }, 200);
    }
}
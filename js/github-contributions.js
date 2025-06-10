document.addEventListener('DOMContentLoaded', function() {
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;

    // Generate the calendar grid (53 weeks x 7 days)
    function generateCalendar() {
        const today = new Date();
        const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
        const currentDate = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Clear any existing content
        calendarGrid.innerHTML = '';
        
        // Create 53 weeks (columns)
        for (let week = 0; week < 53; week++) {
            const weekEl = document.createElement('div');
            weekEl.className = 'calendar-week';
            
            // Create 7 days (rows) for each week
            for (let day = 0; day < 7; day++) {
                const dayEl = document.createElement('div');
                dayEl.className = 'calendar-day';
                
                // Calculate the date for this cell
                const daysAgo = (52 - week) * 7 + (6 - day) - currentDay;
                const date = new Date(currentYear, currentMonth, currentDate - daysAgo);
                
                // Only show cells for the past year
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                
                if (date > oneYearAgo && date <= today) {
                    // Random contribution data (replace with real data)
                    const randomLevel = Math.floor(Math.random() * 5);
                    dayEl.setAttribute('data-level', randomLevel);
                    dayEl.setAttribute('data-date', date.toISOString().split('T')[0]);
                    dayEl.setAttribute('data-count', Math.floor(Math.random() * 10));
                } else {
                    dayEl.classList.add('empty');
                }
                
                weekEl.appendChild(dayEl);
            }
            
            calendarGrid.appendChild(weekEl);
        }
        
        // Set up tooltips after generating the calendar
        setupTooltips();
        
        // Set random streaks (replace with actual data)
        document.querySelector('.github-streak').innerHTML = `
            <span>Current streak: <strong>${Math.floor(Math.random() * 30) + 1}</strong> days</span>
            <span>Longest streak: <strong>${Math.floor(Math.random() * 100) + 30}</strong> days</span>
        `;
    }
    
    // Set up tooltips for the calendar
    function setupTooltips() {
        const tooltip = document.createElement('div');
        tooltip.className = 'github-tooltip';
        document.body.appendChild(tooltip);
        
        const days = document.querySelectorAll('.calendar-day:not(.empty)');
        
        days.forEach(day => {
            day.addEventListener('mouseenter', (e) => {
                const count = day.getAttribute('data-count') || '0';
                const dateStr = day.getAttribute('data-date');
                const date = new Date(dateStr);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = date.toLocaleDateString('en-US', options);
                
                tooltip.innerHTML = `
                    <strong>${count} ${count === '1' ? 'contribution' : 'contributions'}</strong>
                    <span>${formattedDate}</span>
                `;
                
                // Position the tooltip
                const rect = day.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX + 5}px`;
                tooltip.style.top = `${rect.top + window.scrollY - 40}px`;
                tooltip.classList.add('visible');
            });
            
            day.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
        });
        
        // Update tooltip position on scroll
        window.addEventListener('scroll', () => {
            if (tooltip.classList.contains('visible')) {
                const activeDay = document.querySelector('.calendar-day:hover');
                if (activeDay) {
                    const rect = activeDay.getBoundingClientRect();
                    tooltip.style.left = `${rect.left + window.scrollX + 5}px`;
                    tooltip.style.top = `${rect.top + window.scrollY - 40}px`;
                }
            }
        });
    }
    
    // Initialize the calendar
    generateCalendar();
});

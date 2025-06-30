// GitHub Contributions - Real Data Display
class GitHubContributions {
    constructor() {
        this.username = 'jainav-exe';
        this.reposCountEl = document.getElementById('repos-count');
        
        if (this.reposCountEl) {
            this.init();
        }
    }

    async init() {
        try {
            const userData = await this.fetchUserData();
            if (userData && userData.public_repos !== undefined) {
                this.reposCountEl.textContent = userData.public_repos;
            } else {
                this.reposCountEl.textContent = '14'; // A reasonable fallback
            }
        } catch (error) {
            console.error('Error fetching GitHub repo count:', error);
            this.reposCountEl.textContent = '14'; // Fallback on error
        }
    }

    async fetchUserData() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.username}`);
            if (!response.ok) {
                throw new Error(`GitHub API request failed: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch user data from GitHub API:', error);
            return null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GitHubContributions();
}); 
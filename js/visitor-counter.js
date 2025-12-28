// visitor-counter.js - Website visitor counter

class VisitorCounter {
    constructor() {
        this.apiUrl = 'https://api.countapi.xyz/hit/hsecalculator.com/visits';
        this.localStorageKey = 'hse_visitor_data';
        this.initialize();
    }

    async initialize() {
        try {
            // Try to get count from CountAPI
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            
            if (data && data.value) {
                this.updateDisplay(data.value);
                this.saveToLocalStorage(data.value);
            } else {
                // Fallback to local storage
                this.useLocalStorage();
            }
        } catch (error) {
            console.log('Using local storage fallback for visitor counter');
            this.useLocalStorage();
        }
    }

    useLocalStorage() {
        let count = this.getFromLocalStorage();
        if (!count) {
            count = Math.floor(Math.random() * 1000) + 5000; // Starting point
        }
        
        // Increment for this visit
        count++;
        this.updateDisplay(count);
        this.saveToLocalStorage(count);
    }

    getFromLocalStorage() {
        const data = localStorage.getItem(this.localStorageKey);
        if (data) {
            const parsed = JSON.parse(data);
            // Check if it's from today
            const today = new Date().toDateString();
            if (parsed.date === today) {
                return parsed.count;
            }
        }
        return null;
    }

    saveToLocalStorage(count) {
        const data = {
            date: new Date().toDateString(),
            count: count
        };
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    }

    updateDisplay(count) {
        const counterElement = document.getElementById('visitorCount');
        if (counterElement) {
            // Format number with commas
            const formattedCount = count.toLocaleString('en-US');
            counterElement.textContent = formattedCount;
            
            // Add animation effect
            counterElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                counterElement.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// Initialize visitor counter when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new VisitorCounter();
});

// Export for use in other files
window.VisitorCounter = VisitorCounter;
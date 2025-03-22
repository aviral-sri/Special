// Countdown Module
const Countdown = {
    // Initialize countdown
    init() {
        // Start countdown timer
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    },

    // Update countdown timer
    updateCountdown() {
        const startDate = new Date('2020-08-02T15:00:00');
        const now = new Date();
        const diff = now - startDate;

        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Update countdown display
        document.getElementById('years').textContent = years;
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;

        // Check for anniversary
        this.checkAnniversary();
    },

    // Check for anniversary
    checkAnniversary() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        
        if (month === 8 && day === 2) {
            this.showAnniversaryMessage();
        }
    },

    // Show anniversary message
    showAnniversaryMessage() {
        const message = document.getElementById('anniversaryMessage');
        message.style.display = 'block';
        
        // Hide message after 24 hours
        setTimeout(() => {
            message.style.display = 'none';
        }, 24 * 60 * 60 * 1000);
    }
};

// Export Countdown module
window.Countdown = Countdown;

// Initialize Countdown module
document.addEventListener('DOMContentLoaded', () => {
    Countdown.init();
}); 
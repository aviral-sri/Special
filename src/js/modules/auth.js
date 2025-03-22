// Authentication Module
const Auth = {
    // Password protection
    checkPassword() {
        const password = document.getElementById('passwordInput').value;
        if (password === 'KRISHNA') {
            document.getElementById('passwordScreen').style.display = 'none';
            this.showHeartShower();
            this.showBirthdayMessage();
            
            // Show main content after delay
            setTimeout(() => {
                document.querySelectorAll('.tabs, .tab-content').forEach(el => {
                    el.style.display = '';
                });
                // Initial renders
                window.Countdown.updateCountdown();
                window.Timeline.checkAnniversary();
                window.Timeline.renderTimeline();
                window.Photos.renderPhotos();
                window.Notes.renderNotes();
            }, 2000);
        } else {
            alert('Incorrect password!');
        }
    },

    // Heart shower animation
    showHeartShower() {
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.innerHTML = '❤️';
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
                document.body.appendChild(heart);
                
                setTimeout(() => heart.remove(), 5000);
            }, i * 50);
        }
    },

    // Birthday message
    showBirthdayMessage() {
        const message = document.getElementById('birthdayMessage');
        message.style.display = 'flex';
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.style.display = 'none', 1000);
        }, 2000);
    },

    // Secret codes for notes
    secretCodes: {
        aviral: "0987",
        shaili: "1234"
    },

    // Current note author
    currentNoteAuthor: null,

    // Show code input modal
    showCodeModal() {
        document.getElementById('codeModal').style.display = 'flex';
        document.getElementById('codeInput').value = '';
        document.getElementById('codeInput').focus();
    },

    // Verify secret code
    verifyCode() {
        const code = document.getElementById('codeInput').value;
        
        if (code === this.secretCodes.aviral) {
            this.currentNoteAuthor = 'aviral';
            document.getElementById('codeModal').style.display = 'none';
            window.Notes.saveNote();
        } else if (code === this.secretCodes.shaili) {
            this.currentNoteAuthor = 'shaili';
            document.getElementById('codeModal').style.display = 'none';
            window.Notes.saveNote();
        } else if (code === '0000') {
            this.showChangeCodeModal();
        } else {
            alert('Incorrect code!');
        }
    },

    // Show change code modal
    showChangeCodeModal() {
        const oldCode = prompt('Enter old code to change:');
        if (oldCode === this.secretCodes.aviral) {
            const newCode = prompt('Enter new 4-digit code for Aviral:');
            if (newCode && newCode.length === 4) {
                this.secretCodes.aviral = newCode;
                localStorage.setItem('secretCodes', JSON.stringify(this.secretCodes));
                alert('Aviral\'s code updated successfully!');
            }
        } else if (oldCode === this.secretCodes.shaili) {
            const newCode = prompt('Enter new 4-digit code for Shaili:');
            if (newCode && newCode.length === 4) {
                this.secretCodes.shaili = newCode;
                localStorage.setItem('secretCodes', JSON.stringify(this.secretCodes));
                alert('Shaili\'s code updated successfully!');
            }
        } else {
            alert('Incorrect old code!');
        }
        document.getElementById('codeModal').style.display = 'none';
    },

    // Initialize event listeners
    init() {
        // Password input enter key
        document.getElementById('passwordInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.checkPassword();
            }
        });

        // Code input enter key
        document.getElementById('codeInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.verifyCode();
            }
        });

        // Close code modal when clicking outside
        document.getElementById('codeModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('codeModal')) {
                document.getElementById('codeModal').style.display = 'none';
            }
        });

        // Load saved secret codes
        const savedCodes = localStorage.getItem('secretCodes');
        if (savedCodes) {
            this.secretCodes = JSON.parse(savedCodes);
        }
    }
};

// Export Auth module
window.Auth = Auth;

// Initialize Auth module
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
}); 
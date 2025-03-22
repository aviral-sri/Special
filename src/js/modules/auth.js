// Authentication Module
const Auth = {
    // Initialize authentication
    init() {
        // Add enter key handler for password input
        document.getElementById('passwordInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.checkPassword();
            }
        });

        // Hide main content initially
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('birthdayMessage').style.display = 'none';
    },

    // Check password
    checkPassword() {
        const password = document.getElementById('passwordInput').value;
        if (password === 'KRISHNA') {
            // Get all elements
            const passwordScreen = document.getElementById('passwordScreen');
            const mainContent = document.getElementById('mainContent');
            const birthdayMessage = document.getElementById('birthdayMessage');
            
            // Prepare main content but keep it hidden
            mainContent.style.display = 'block';
            mainContent.style.opacity = '0';
            
            // Start fade out of password screen
            passwordScreen.style.opacity = '0';
            
            setTimeout(() => {
                passwordScreen.style.display = 'none';
                
                // Show heart shower
                this.showHeartShower();
                
                // Show birthday message after a short delay
                setTimeout(() => {
                    birthdayMessage.style.display = 'flex';
                    birthdayMessage.style.opacity = '1';
                    
                    // Hide birthday message after 2 seconds
                    setTimeout(() => {
                        birthdayMessage.style.opacity = '0';
                        
                        // Show main content after birthday message fades
                        setTimeout(() => {
                            birthdayMessage.style.display = 'none';
                            mainContent.style.opacity = '1';
                            
                            // Initialize modules
                            if (typeof Timeline !== 'undefined') Timeline.init();
                            if (typeof Notes !== 'undefined') Notes.init();
                            if (typeof Photos !== 'undefined') Photos.init();
                            if (typeof Countdown !== 'undefined') Countdown.init();
                        }, 1000);
                    }, 2000);
                }, 500);
            }, 500);
        } else {
            alert('Incorrect password!');
            document.getElementById('passwordInput').value = '';
        }
    },

    // Show heart shower animation
    showHeartShower() {
        const symbols = ['❤️', '💖', '💕', '💗', '💝'];
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '1999';
        document.body.appendChild(container);
        
        // Create multiple hearts with different delays
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
                heart.style.fontSize = (Math.random() * 20 + 25) + 'px';
                
                container.appendChild(heart);
                
                // Remove heart after animation
                setTimeout(() => {
                    heart.remove();
                    if (container.children.length === 0) {
                        container.remove();
                    }
                }, 4000);
            }, i * 50);
        }
    },

    // Secret codes for notes
    secretCodes: {
        aviral: "0987",
        shaili: "1234"
    },

    // Show code input modal
    showCodeModal() {
        document.getElementById('codeModal').style.display = 'flex';
        const codeInput = document.getElementById('codeInput');
        codeInput.value = '';
        codeInput.focus();
    },

    // Verify secret code
    verifyCode() {
        const code = document.getElementById('codeInput').value;
        const codeModal = document.getElementById('codeModal');
        
        if (code === this.secretCodes.aviral) {
            codeModal.style.display = 'none';
            return 'aviral';
        } else if (code === this.secretCodes.shaili) {
            codeModal.style.display = 'none';
            return 'shaili';
        } else if (code === '0000') {
            this.showChangeCodeModal();
            return null;
        } else {
            alert('Incorrect code!');
            return null;
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
    }
};

// Export Auth module
window.Auth = Auth;

// Initialize Auth module
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
}); 
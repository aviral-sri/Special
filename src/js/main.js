// Main Application File
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Auth.init();
    Timeline.init();
    Notes.init();
    Photos.init();
    Countdown.init();

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            Timeline.renderTimeline();
        }, 250);
    });

    // Handle tab switching
    document.querySelectorAll('.tab-link').forEach(button => {
        button.addEventListener('click', () => {
            // Update active tab
            document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');

            // Re-render timeline if needed
            if (button.dataset.tab === 'timelineTab') {
                Timeline.renderTimeline();
            }
        });
    });

    // Handle modal close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = "none";
                }, 300);
            }
        });
    });

    // Handle modal background clicks
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
            setTimeout(() => {
                event.target.style.display = "none";
            }, 300);
        }
    });

    // Handle keyboard events
    document.addEventListener('keydown', (event) => {
        // Close modals with Escape key
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = "none";
                }, 300);
            });
        }
    });

    // Handle form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Handle different form submissions
            if (form.id === 'eventForm') {
                Timeline.saveEvent();
            } else if (form.id === 'noteForm') {
                Notes.saveNote();
            }
        });
    });

    // Handle file input changes
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    event.target.value = '';
                    return;
                }

                // Check file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select an image file');
                    event.target.value = '';
                    return;
                }
            }
        });
    });
}); 
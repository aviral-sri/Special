// Timeline Module
const Timeline = {
    // Store events
    events: {},

    // Initialize timeline
    init() {
        // Load events from Firestore
        this.loadEvents();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initial render
        this.renderTimeline();
    },

    // Load events from Firestore
    async loadEvents() {
        try {
            const snapshot = await db.collection('events').get();
            this.events = {};
            snapshot.forEach(doc => {
                this.events[doc.id] = doc.data();
            });
            this.renderTimeline();
        } catch (error) {
            console.error('Error loading events:', error);
        }
    },

    // Add event listeners
    addEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-link').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(button.dataset.tab).classList.add('active');
            });
        });

        // Modal close buttons
        document.getElementById('modalClose').addEventListener('click', () => {
            document.getElementById('eventModal').style.display = "none";
        });

        // Close modal when clicking outside
        window.addEventListener('click', event => {
            if (event.target === document.getElementById('eventModal')) {
                document.getElementById('eventModal').style.display = "none";
            }
        });

        // Save event button
        document.getElementById('saveEventBtn').addEventListener('click', () => this.saveEvent());
    },

    // Calculate event position
    calculateEventPosition(index, total) {
        const padding = window.innerWidth <= 768 ? 40 : 60;
        const width = document.getElementById('timeline').clientWidth - (padding * 2);
        const dotSpacing = width * (window.innerWidth <= 768 ? 0.3 : 0.4);
        const rowHeight = window.innerWidth <= 768 ? 100 : 120;
        
        const row = Math.floor(index / 2);
        const isLeft = index % 2 === 0;
        
        const x = padding + (isLeft ? dotSpacing : width - dotSpacing);
        const y = padding + (row * rowHeight);
        
        return { x, y, isLeft };
    },

    // Create SVG path
    createPath(points) {
        let path = '';
        points.forEach((point, i) => {
            if (i === 0) {
                path += `M ${point.x},${point.y}`;
            } else {
                const prevPoint = points[i - 1];
                const midY = (prevPoint.y + point.y) / 2;
                path += ` C ${prevPoint.x},${midY} ${point.x},${midY} ${point.x},${point.y}`;
            }
        });
        return path;
    },

    // Show event details
    showEventDetails(dot, event) {
        // Remove any existing details
        const existingDetails = document.querySelectorAll('.event-details');
        existingDetails.forEach(el => el.remove());

        const details = document.createElement('div');
        details.className = 'event-details';
        
        details.innerHTML = `
            <div class="date">${new Date(event.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</div>
            <div class="description">${event.description}</div>
            ${event.photo ? `<img src="${event.photo}" alt="Event memory">` : ''}
            <button class="delete-btn">🗑️ Delete</button>
            <button class="edit-btn">✎ Edit</button>
        `;

        document.body.appendChild(details);
        
        // Force reflow to trigger animation
        details.offsetHeight;
        details.classList.add('visible');

        // Add event handlers
        this.addEventDetailHandlers(details, dot, event);
    },

    // Add event detail handlers
    addEventDetailHandlers(details, dot, event) {
        // Edit button handler
        details.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            details.classList.remove('visible');
            setTimeout(() => {
                details.remove();
                document.querySelectorAll('.event').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                document.getElementById('eventDate').value = event.date || '';
                document.getElementById('eventDescription').value = event.description || '';
                document.getElementById('eventModal').style.display = "flex";
                setTimeout(() => document.getElementById('eventModal').classList.add('show'), 10);
            }, 300);
        });

        // Delete button handler
        details.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (confirm('Are you sure you want to delete this event?')) {
                const eventId = dot.getAttribute('data-event');
                this.deleteEvent(eventId, details);
            }
        });

        // Close on background tap/click
        const closeHandler = (e) => {
            if (!details.contains(e.target) && !dot.contains(e.target)) {
                details.classList.remove('visible');
                setTimeout(() => details.remove(), 300);
                document.removeEventListener('click', closeHandler);
                document.removeEventListener('touchend', closeHandler);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeHandler);
            document.addEventListener('touchend', closeHandler);
        }, 100);
    },

    // Delete event
    async deleteEvent(eventId, details) {
        try {
            // Delete from Firestore
            await db.collection('events').doc(eventId).delete();
            
            // Delete from local storage
            delete this.events[eventId];
            
            // Close details and re-render timeline
            details.classList.remove('visible');
            setTimeout(() => {
                details.remove();
                this.renderTimeline();
            }, 300);
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event. Please try again.');
        }
    },

    // Save event
    async saveEvent() {
        const currentEvent = document.querySelector('.event.active');
        const eventDate = document.getElementById('eventDate').value;
        const eventDescription = document.getElementById('eventDescription').value;
        const photoInput = document.getElementById('eventPhoto');
        
        try {
            let photoUrl = null;
            
            // Handle photo upload if present
            if (photoInput.files && photoInput.files[0]) {
                const file = photoInput.files[0];
                const storageRef = storage.ref(`events/${Date.now()}_${file.name}`);
                await storageRef.put(file);
                photoUrl = await storageRef.getDownloadURL();
            }

            const eventData = {
                date: eventDate,
                description: eventDescription,
                photo: photoUrl,
                title: eventDescription.split('.')[0]
            };

            if (currentEvent) {
                // Update existing event
                const eventId = currentEvent.getAttribute('data-event');
                await db.collection('events').doc(eventId).update(eventData);
                this.events[eventId] = eventData;
            } else {
                // Create new event
                const docRef = await db.collection('events').add(eventData);
                this.events[docRef.id] = eventData;
            }

            // Close modal and re-render
            document.getElementById('eventModal').style.display = "none";
            this.renderTimeline();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Error saving event. Please try again.');
        }
    },

    // Render timeline
    renderTimeline() {
        const timeline = document.getElementById('timeline');
        const timelineSVG = document.getElementById('timelineSVG');
        const timelinePath = document.getElementById('timelinePath');
        
        // Clear existing events
        timeline.querySelectorAll('.event').forEach(el => el.remove());
        
        // Convert events object to array and sort by date
        const sortedEvents = Object.entries(this.events)
            .map(([id, event]) => ({ id, ...event }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const eventCount = sortedEvents.length;
        const totalDots = eventCount + 3; // Add 3 preview dots
        
        // Calculate required height
        const rows = Math.ceil(totalDots / 2);
        timeline.style.height = `${rows * 120 + 120}px`;
        
        // Generate points for the SVG path
        let pathPoints = [];
        
        // Add actual events
        sortedEvents.forEach((event, index) => {
            const pos = this.calculateEventPosition(index, totalDots);
            pathPoints.push(pos);
            
            const dot = document.createElement('div');
            dot.className = 'event';
            dot.setAttribute('data-event', event.id);
            dot.setAttribute('data-position', pos.isLeft ? 'left' : 'right');
            dot.style.left = `${pos.x - 12}px`;
            dot.style.top = `${pos.y - 12}px`;
            
            // Add date label
            const dateLabel = document.createElement('div');
            dateLabel.className = 'event-date-label';
            dateLabel.textContent = new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            dot.appendChild(dateLabel);
            
            timeline.appendChild(dot);
            
            // Add click event
            dot.addEventListener('click', () => {
                dot.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    dot.style.transform = 'scale(1)';
                    this.showEventDetails(dot, event);
                }, 200);
            });
        });
        
        // Add preview dots
        for(let i = eventCount; i < eventCount + 2; i++) {
            const pos = this.calculateEventPosition(i, totalDots);
            pathPoints.push(pos);
            
            const previewDot = document.createElement('div');
            previewDot.className = 'event preview';
            previewDot.style.left = `${pos.x - 12}px`;
            previewDot.style.top = `${pos.y - 12}px`;
            timeline.appendChild(previewDot);
        }
        
        // Add the + button as the last dot
        const lastPos = this.calculateEventPosition(totalDots - 1, totalDots);
        pathPoints.push(lastPos);
        
        const addButton = document.createElement('div');
        addButton.className = 'event add-event';
        addButton.innerHTML = '+';
        addButton.style.left = `${lastPos.x - 12}px`;
        addButton.style.top = `${lastPos.y - 12}px`;
        timeline.appendChild(addButton);
        
        // Update SVG path
        timelinePath.setAttribute('d', this.createPath(pathPoints));
        
        // Add click event for add button
        addButton.addEventListener('click', () => {
            addButton.style.transform = 'scale(1.1)';
            setTimeout(() => {
                addButton.style.transform = 'scale(1)';
                document.getElementById('eventDate').value = new Date().toISOString().split('T')[0];
                document.getElementById('eventDescription').value = '';
                document.getElementById('eventPhoto').value = '';
                document.querySelectorAll('.event').forEach(d => d.classList.remove('active'));
                addButton.classList.add('active');
                document.getElementById('eventModal').style.display = "flex";
                setTimeout(() => document.getElementById('eventModal').classList.add('show'), 10);
            }, 200);
        });
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

// Export Timeline module
window.Timeline = Timeline;

// Initialize Timeline module
document.addEventListener('DOMContentLoaded', () => {
    Timeline.init();
}); 
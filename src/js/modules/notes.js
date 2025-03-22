// Notes Module
const Notes = {
    // Initialize notes
    init() {
        // Load notes from Firestore
        this.loadNotes();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initial render
        this.renderNotes();
    },

    // Load notes from Firestore
    async loadNotes() {
        try {
            const snapshot = await db.collection('notes').get();
            this.notes = [];
            snapshot.forEach(doc => {
                this.notes.push({ id: doc.id, ...doc.data() });
            });
            this.renderNotes();
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    },

    // Add event listeners
    addEventListeners() {
        // Save note button
        document.getElementById('saveNoteBtn').addEventListener('click', () => this.saveNote());
        
        // Notes area input
        document.getElementById('notesArea').addEventListener('input', () => {
            const saveBtn = document.getElementById('saveNoteBtn');
            saveBtn.disabled = !document.getElementById('notesArea').value.trim();
        });
    },

    // Save note
    async saveNote() {
        const noteText = document.getElementById('notesArea').value.trim();
        if (!noteText) return;

        try {
            // Show code modal
            Auth.showCodeModal().then(author => {
                if (!author) return;

                // Create note data
                const noteData = {
                    text: noteText,
                    author: author,
                    timestamp: new Date().toISOString(),
                    color: author === 'Aviral' ? '#e3f2fd' : '#fce4ec'
                };

                // Save to Firestore
                db.collection('notes').add(noteData).then(() => {
                    // Clear input
                    document.getElementById('notesArea').value = '';
                    document.getElementById('saveNoteBtn').disabled = true;
                    
                    // Reload notes
                    this.loadNotes();
                }).catch(error => {
                    console.error('Error saving note:', error);
                    alert('Error saving note. Please try again.');
                });
            });
        } catch (error) {
            console.error('Error in save note process:', error);
            alert('Error saving note. Please try again.');
        }
    },

    // Render notes
    renderNotes() {
        const notesContainer = document.getElementById('notesContainer');
        notesContainer.innerHTML = '';

        // Sort notes by timestamp (newest first)
        const sortedNotes = [...this.notes].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        sortedNotes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'saved-note';
            noteElement.style.backgroundColor = note.color;
            noteElement.style.borderColor = note.color === '#e3f2fd' ? '#90caf9' : '#f48fb1';
            
            noteElement.innerHTML = `
                <div class="note-header">
                    <span class="note-author">${note.author}</span>
                    <span class="note-date">${new Date(note.timestamp).toLocaleString()}</span>
                </div>
                <div class="note-content">${note.text}</div>
                <button class="delete-note-btn">🗑️</button>
            `;

            // Add delete button handler
            noteElement.querySelector('.delete-note-btn').addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this note?')) {
                    this.deleteNote(note.id, noteElement);
                }
            });

            notesContainer.appendChild(noteElement);
        });
    },

    // Delete note
    async deleteNote(noteId, noteElement) {
        try {
            // Delete from Firestore
            await db.collection('notes').doc(noteId).delete();
            
            // Remove from local array
            this.notes = this.notes.filter(note => note.id !== noteId);
            
            // Remove element with animation
            noteElement.classList.add('fade-out');
            setTimeout(() => {
                noteElement.remove();
            }, 300);
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Error deleting note. Please try again.');
        }
    }
};

// Export Notes module
window.Notes = Notes;

// Initialize Notes module
document.addEventListener('DOMContentLoaded', () => {
    Notes.init();
}); 
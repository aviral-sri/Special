// Photos Module
const Photos = {
    // Initialize photos
    init() {
        // Load photos from Firestore
        this.loadPhotos();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initial render
        this.renderPhotos();
    },

    // Load photos from Firestore
    async loadPhotos() {
        try {
            const snapshot = await db.collection('photos').get();
            this.photos = [];
            snapshot.forEach(doc => {
                this.photos.push({ id: doc.id, ...doc.data() });
            });
            this.renderPhotos();
        } catch (error) {
            console.error('Error loading photos:', error);
        }
    },

    // Add event listeners
    addEventListeners() {
        // Upload photo button
        document.getElementById('uploadPhotoBtn').addEventListener('click', () => {
            document.getElementById('photoInput').click();
        });

        // Photo input change
        document.getElementById('photoInput').addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                this.uploadPhoto(e.target.files[0]);
            }
        });

        // Close photo modal
        document.getElementById('photoModalClose').addEventListener('click', () => {
            this.closePhotoModal();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === document.getElementById('photoModal')) {
                this.closePhotoModal();
            }
        });
    },

    // Upload photo
    async uploadPhoto(file) {
        try {
            // Show code modal for author verification
            Auth.showCodeModal().then(author => {
                if (!author) return;

                // Create storage reference
                const storageRef = storage.ref(`photos/${Date.now()}_${file.name}`);
                
                // Upload file
                storageRef.put(file).then(() => {
                    // Get download URL
                    storageRef.getDownloadURL().then(url => {
                        // Save photo data to Firestore
                        const photoData = {
                            url: url,
                            author: author,
                            timestamp: new Date().toISOString(),
                            caption: ''
                        };

                        db.collection('photos').add(photoData).then(() => {
                            // Clear input
                            document.getElementById('photoInput').value = '';
                            
                            // Reload photos
                            this.loadPhotos();
                        }).catch(error => {
                            console.error('Error saving photo data:', error);
                            alert('Error saving photo. Please try again.');
                        });
                    });
                }).catch(error => {
                    console.error('Error uploading photo:', error);
                    alert('Error uploading photo. Please try again.');
                });
            });
        } catch (error) {
            console.error('Error in upload process:', error);
            alert('Error uploading photo. Please try again.');
        }
    },

    // Render photos
    renderPhotos() {
        const photosGrid = document.getElementById('photosGrid');
        photosGrid.innerHTML = '';

        // Sort photos by timestamp (newest first)
        const sortedPhotos = [...this.photos].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        sortedPhotos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            
            photoElement.innerHTML = `
                <img src="${photo.url}" alt="Memory" loading="lazy">
                <div class="photo-overlay">
                    <div class="photo-info">
                        <span class="photo-author">${photo.author}</span>
                        <span class="photo-date">${new Date(photo.timestamp).toLocaleDateString()}</span>
                    </div>
                    <button class="delete-photo-btn">🗑️</button>
                </div>
            `;

            // Add click handler for photo view
            photoElement.addEventListener('click', () => {
                this.showPhotoModal(photo);
            });

            // Add delete button handler
            photoElement.querySelector('.delete-photo-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this photo?')) {
                    this.deletePhoto(photo.id, photo.url);
                }
            });

            photosGrid.appendChild(photoElement);
        });
    },

    // Show photo modal
    showPhotoModal(photo) {
        const modal = document.getElementById('photoModal');
        const modalImg = document.getElementById('modalPhoto');
        const modalCaption = document.getElementById('modalCaption');
        
        modalImg.src = photo.url;
        modalCaption.textContent = `Posted by ${photo.author} on ${new Date(photo.timestamp).toLocaleString()}`;
        
        modal.style.display = "flex";
        setTimeout(() => modal.classList.add('show'), 10);
    },

    // Close photo modal
    closePhotoModal() {
        const modal = document.getElementById('photoModal');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    },

    // Delete photo
    async deletePhoto(photoId, photoUrl) {
        try {
            // Delete from storage
            const storageRef = storage.refFromURL(photoUrl);
            await storageRef.delete();

            // Delete from Firestore
            await db.collection('photos').doc(photoId).delete();
            
            // Remove from local array
            this.photos = this.photos.filter(photo => photo.id !== photoId);
            
            // Re-render photos
            this.renderPhotos();
        } catch (error) {
            console.error('Error deleting photo:', error);
            alert('Error deleting photo. Please try again.');
        }
    }
};

// Export Photos module
window.Photos = Photos;

// Initialize Photos module
document.addEventListener('DOMContentLoaded', () => {
    Photos.init();
}); 
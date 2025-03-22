// Firebase Configuration
const firebaseConfig = {
    // Your Firebase config object will go here
    // You'll need to replace this with your actual Firebase config
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Storage
const storage = firebase.storage();

// Export Firebase instances
window.db = db;
window.storage = storage;

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            console.log('Multiple tabs open, persistence disabled');
        } else if (err.code === 'unimplemented') {
            // The current browser doesn't support persistence
            console.log('Browser doesn\'t support persistence');
        }
    }); 
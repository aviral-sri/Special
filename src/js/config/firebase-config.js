// Firebase Configuration
const firebaseConfig = {
    // Your Firebase config object will go here
    // You'll need to replace this with your actual Firebase config
    apiKey: "AIzaSyDxXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqX",
    authDomain: "jana2329.firebaseapp.com",
    projectId: "jana2329",
    storageBucket: "jana2329.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
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
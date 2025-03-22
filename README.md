# Special Anniversary Website

A beautiful and interactive website to celebrate your special moments together. Built with HTML, CSS, JavaScript, and Firebase.

## Features

- Timeline of special events with photos
- Secret notes with color coding for each person
- Photo gallery with upload and delete functionality
- Anniversary countdown timer
- Anniversary message on August 2nd
- Mobile-responsive design
- Offline support
- Real-time updates

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/aviral-sri/Special.git
   cd Special
   ```

2. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

3. Login to Firebase:
   ```bash
   firebase login
   ```

4. Create a new Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup instructions

5. Enable required Firebase services:
   - Firestore Database
   - Storage
   - Hosting

6. Update Firebase configuration:
   - Go to Project Settings
   - Copy your Firebase config object
   - Replace the placeholder in `src/js/config/firebase-config.js`

7. Set up Firestore security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if true;
       }
     }
   }
   ```

8. Set up Storage security rules:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if true;
       }
     }
   }
   ```

## Deployment

1. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select Hosting
   - Select your Firebase project
   - Use `src` as your public directory
   - Configure as a single-page app: Yes
   - Don't overwrite index.html: No

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Project Structure

```
src/
├── assets/
│   ├── images/
│   └── icons/
├── css/
│   ├── styles.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── config/
│   │   └── firebase-config.js
│   ├── modules/
│   │   ├── auth.js
│   │   ├── timeline.js
│   │   ├── notes.js
│   │   └── photos.js
│   └── app.js
└── index.html
```

## Customization

1. Change the anniversary date:
   - Update the date in `src/js/app.js` (search for '2024-08-02')

2. Change secret codes:
   - Update codes in `src/js/modules/auth.js` (search for 'secretCodes')

3. Customize colors:
   - Update color values in `src/css/styles.css`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
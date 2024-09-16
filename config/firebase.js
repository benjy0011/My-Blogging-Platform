const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');

// Firebase configuration details
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  };

// Initialize Firebase app with the configuration
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase authentication service
const auth = getAuth(firebaseApp)
// Initialize Firebase databse service
const db = getFirestore(firebaseApp);
// Initialize Firebase Storage service
const storage = getStorage(firebaseApp);

module.exports = { auth,
                   db,
                   storage
                 };
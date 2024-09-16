// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAopJUh1tbfUk_JxEiqhrSm3jLX8CXgUFs",
  authDomain: "my-blogging-platform-f97a8.firebaseapp.com",
  projectId: "my-blogging-platform-f97a8",
  storageBucket: "my-blogging-platform-f97a8.appspot.com",
  messagingSenderId: "940085905162",
  appId: "1:940085905162:web:b6d00205266c3540751cf3",
  measurementId: "G-3F5BC2KFP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
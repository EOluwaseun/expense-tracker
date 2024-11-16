// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAqPkzjugm7cAK1c4YPJ4RuEdc4plDJ4nI',
  authDomain: 'blog-yt-7f130.firebaseapp.com',
  projectId: 'blog-yt-7f130',
  storageBucket: 'blog-yt-7f130.appspot.com',
  messagingSenderId: '470667599599',
  appId: '1:470667599599:web:06d4ad3ffbb5508209051a',
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);

// google auth

const auth = getAuth(app);

export { app, auth };

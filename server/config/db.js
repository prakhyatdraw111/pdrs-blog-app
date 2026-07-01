const {initializeApp} = require("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyDjclxMFpILZKrhe4lij4ogNgrUJ4wz5Ak",
  authDomain: "bloggggg-69633.firebaseapp.com",
  projectId: "bloggggg-69633",
  storageBucket: "bloggggg-69633.firebasestorage.app",
  messagingSenderId: "924209104687",
  appId: "1:924209104687:web:3affe3e0e785984ca903da",
  measurementId: "G-J69Z0SKM90"
};

connectDB = initializeApp(firebaseConfig);

const {doc, getDocs, Timestamp, query, collection, where, getFirestore, DocumentReference} = require("firebase/firestore");

module.exports = connectDB;
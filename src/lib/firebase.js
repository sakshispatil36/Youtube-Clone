// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6ycaKE50PVvNUdHepZHek1ElVVj_7Baw",
  authDomain: "fir-b0647.firebaseapp.com",
  projectId: "fir-b0647",
  storageBucket: "fir-b0647.firebasestorage.app",
  messagingSenderId: "265992385727",
  appId: "1:265992385727:web:7cc977c006e292cf7e020a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYAeY5ghXq5ufO0NZW30-j7wsBfFoScn4",
  authDomain: "upload-new-files.firebaseapp.com",
  projectId: "upload-new-files",
  storageBucket: "upload-new-files.appspot.com",
  messagingSenderId: "153882342172",
  appId: "1:153882342172:web:3d0b0392b01372f6ce00d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app ;
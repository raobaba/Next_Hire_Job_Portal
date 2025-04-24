// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBlBqVTl5qTuqAFnBURH2UuA4LAOE7bYY8",
  authDomain: "job-portal-website-6a198.firebaseapp.com",
  projectId: "job-portal-website-6a198",
  storageBucket: "job-portal-website-6a198.appspot.com",
  messagingSenderId: "232875364591",
  appId: "1:232875364591:web:ea9ebcfcfb061f19d10b1a",
  measurementId: "G-BFBN1SG1HT",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };

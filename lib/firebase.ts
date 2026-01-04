import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCgqztx3jb5H8BGCS8Yd7rnnsg8Y3za6QE",
    authDomain: "portfolio-ad47c.firebaseapp.com",
    projectId: "portfolio-ad47c",
    storageBucket: "portfolio-ad47c.firebasestorage.app",
    messagingSenderId: "350294018874",
    appId: "1:350294018874:web:b2d013cd26dd2cd05ede03",
    measurementId: "G-FVKP677P9W"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics (only on client)
let analytics;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

// Initialize Firestore
export const db = getFirestore(app);
export { analytics };

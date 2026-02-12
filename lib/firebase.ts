// Firebase Bypass for Demo Mode
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

// Mock Firebase for local/Vercel build without credentials
const app: any = { name: "[DEFAULT]", options: firebaseConfig };
const auth: any = {
    currentUser: null,
    onAuthStateChanged: (cb: any) => {
        // Simple mock: notify subscriber that no one is logged in initially
        setTimeout(() => cb(null), 0);
        return () => { };
    },
    signOut: () => Promise.resolve()
};

export { app, auth };

// Note: This is prepared for future Firebase integration.
// For the current sandbox environment, we use local state or mock data.
// In a real SaaS, you would use these exports.

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "SIMULATED_KEY_FOR_SANDBOX",
  authDomain: "sistema-hidroponia.firebaseapp.com",
  projectId: "sistema-hidroponia",
  storageBucket: "sistema-hidroponia.firebasestorage.app",
  messagingSenderId: "000000000",
  appId: "1:000000000:web:000000000"
};

// These would only be called if keys were present
// export const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);

export const IS_PRODUCTION = false;

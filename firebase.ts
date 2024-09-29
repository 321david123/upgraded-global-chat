// firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJLf2dLdCF1vi0TuHfUgd9JeTgx4hojdg",
  authDomain: "global-chat-cc2fa.firebaseapp.com",
  projectId: "global-chat-cc2fa",
  storageBucket: "global-chat-cc2fa.appspot.com",
  messagingSenderId: "830875236568",
  appId: "1:830875236568:web:f32e5e276ef58403397fad"
};

// Inicializar Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Inicializar Firestore
const db: Firestore = getFirestore(app);

export { db };
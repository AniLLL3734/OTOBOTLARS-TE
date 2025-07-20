import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
// YENİ: Firebase Storage için gerekli importlar
import { getStorage } from "firebase/storage";

// Anahtarları doğrudan yazmak yerine, .env dosyasından güvenli bir şekilde alıyoruz.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// YENİ: Storage servisini başlat ve export et
const storage = getStorage(app);

// YENİ: deleteDoc'u da export ediyoruz, onay sonrası silmek için gerekecek
export { db, storage, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc };
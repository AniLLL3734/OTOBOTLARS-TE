// Gerekli tüm Firebase modüllerini import et
import { initializeApp } from "firebase/app";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp, 
    onSnapshot, 
    query, 
    orderBy, 
    doc, 
    getDoc,
    deleteDoc,
    Timestamp // Olası tip hatalarını önlemek için Timestamp'ı da ekleyelim
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// .env.local dosyasındaki VITE_ ile başlayan değişkenleri al
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Gerekli servisleri başlat
const db = getFirestore(app);
const storage = getStorage(app);

// İhtiyacımız olan her şeyi export et. Bu liste artık tam ve eksiksiz.
export { 
    db, 
    storage, 
    collection, 
    addDoc, 
    serverTimestamp, 
    onSnapshot, 
    query, 
    orderBy, 
    doc, 
    getDoc,
    deleteDoc,
    Timestamp 
};
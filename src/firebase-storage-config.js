import { initializeApp } from "firebase/app";
import {getStorage} from "@firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCtctvnetNreRCVtVPfCy-3-M48jnPjmXs",
    authDomain: "kk-pos-34f82.firebaseapp.com",
    projectId: "kk-pos-34f82",
    storageBucket: "kk-pos-34f82.appspot.com",
    messagingSenderId: "1070745154438",
    appId: "1:1070745154438:web:6006867bed9a1c2189f207",
    measurementId: "G-3ZYNXD8G60"
  };

  const app = initializeApp(firebaseConfig);
  export const storage = getStorage(app);
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyBqG9n3kUXQwPB4BF6zSfA9pvVtI4NOf4U",
    authDomain: "poker-planning-project.firebaseapp.com",
    projectId: "poker-planning-project",
    storageBucket: "poker-planning-project.appspot.com",
    messagingSenderId: "174590914470",
    appId: "1:174590914470:web:e1dc7e167115d40638e967",
    measurementId: "G-E2FD66T7RN"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app);
  export {app,auth,db}
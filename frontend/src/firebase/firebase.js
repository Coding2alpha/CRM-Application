import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

// console.log(import.meta.env.VITE_APP_API_KEY);
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const registerUserToMongo = async (name, email, uid) => {
  await fetch(`${process.env.REACT_APP_BASE_URL}/register`, {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      uid,
    }),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then(() => {
      console.log("User registered sucessfully!");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const signInWithGoogle = async () => {
  try {
    const response = await signInWithPopup(auth, googleProvider);
    const user = response.user;
    console.log(user);

    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    localStorage.setItem("uid", user.uid);
    if (user.uid) {
      window.location.href = "/createCampaigns";
    }
    // await registerUserToMongo(
    //   user.displayName,
    //   user.email,
    //   user.uid
    // );
    // if (docs.docs.length === 0) {
    //   await addDoc(collection(db, "users"), {
    //     uid: user.uid,
    //     name: user.displayName,
    //     authProvider: "google",
    //     email: user.email
    //   });
    // }
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    // console.log(response);
    const user = response.user;
    localStorage.setItem("uid", user.uid);
    if (user.uid) {
      window.location.href = "/createCampaigns";
    }
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = response.user;
    // await addDoc(collection(db, "users"), {
    //   uid: user.uid,
    //   name,
    //   authProvider: "local",
    //   email
    // });
    // await registerUserToMongo(name, email, user.uid);
    localStorage.setItem("uid", user.uid);
    if (user.uid) {
      window.location.href = "/createCampaigns";
    }
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};

const logOut = () => {
  signOut(auth);
  localStorage.clear();
  window.location.href = "/";
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logOut,
};

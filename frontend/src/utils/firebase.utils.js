import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
// For persistent authentication
import { setPersistence, browserLocalPersistence } from "firebase/auth";
// For user created and signed in charts
import { collection, getDocs, query, orderBy } from "firebase/firestore";

// Firebase web configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2R6oYiJSJ1mlhVnTseFWzWeRCM_V32SY",
  authDomain: "cps630-g33-db.firebaseapp.com",
  projectId: "cps630-g33-db",
  storageBucket: "cps630-g33-db.appspot.com",
  messagingSenderId: "598524583198",
  appId: "1:598524583198:web:7f1339266cab52257bbd0f",
};

// Initialize Firebase with the firebase configuration
initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
// Prompt users to select a Google account for authentication
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Get an instance of Firebase authentication
export const auth = getAuth();

// Sign in with Google using Popup
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

// Get an instance of Firestore
export const db = getFirestore();

// Create or get a user doc from Firestore
export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  // If user data does not exist, create/set the document with the data from userAuth in my collection
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date(); // Use camelCase for consistency
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        isAdmin: false, // Explicitly set isAdmin to false
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }
  // If user data exists, return userDocRef
  return userDocRef;
};

// Create a new user with email and password
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Sign in with existed user with email and password
export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

// Sign out the current user
export const signOutUser = async () => await signOut(auth);

// Set up a listener for auth state changes
export const onAuthStateChangedListener = (callback) => {
  onAuthStateChanged(auth, callback);
};

// Set persistent auth state
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Persistence set successfully
    console.log("Persistence set to local");
  })
  .catch((error) => {
    // Handle errors
    console.error("Error setting persistence:", error);
  });

// Fetch users created over time
export const fetchUserCreationData = async () => {
  const q = query(collection(db, "users"), orderBy("createdAt"));
  const querySnapshot = await getDocs(q);
  const userData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return userData;
};

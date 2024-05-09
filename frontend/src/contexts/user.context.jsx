import { createContext, useState, useEffect } from "react";
import {
  createUserDocumentFromAuth,
  onAuthStateChangedListener,
} from "../utils/firebase.utils";
import { getDoc } from "firebase/firestore";

// Create a context with a default value for the current user
export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});

// Provider component to encapsulate childrent components with UserContext
export const UserProvider = ({ children }) => {
  // State hook for storing the current user
  const [currentUser, setCurrentUser] = useState(null);
  // Context value that will be passed down to children
  const value = { currentUser, setCurrentUser };

  // Effect hook to monitor auth state changes
  useEffect(() => {
    // Subcribe to auth state changes and updates the user state accordingly
    const unsubscribe = onAuthStateChangedListener((userAuth) => {
      if (userAuth) {
        // if user is signed in, create or fetch the user doc from Firestore
        createUserDocumentFromAuth(userAuth)
          .then((userRef) => {
            if (userRef) {
              // Fetch the user's doc snapshot
              getDoc(userRef)
                .then((userSnapshot) => {
                  if (userSnapshot.exists()) {
                    // Set the current user with data from Firestore if the doc exists
                    setCurrentUser({
                      id: userSnapshot.id,
                      ...userSnapshot.data(),
                    });
                  }
                })
                .catch((error) =>
                  console.error("Failed to get user document:", error)
                );
            }
          })
          .catch((error) =>
            console.error("Error creating/fetching user document:", error)
          );
      } else {
        setCurrentUser(null); // Set the currentUser to null when sign out
      }
    });

    // Cleanup function to unsubscribe from the auth listener on component mount
    return unsubscribe;
  }, []);

  // Wrap the children with UserContext.Provider to pass down the curren user state and updater function
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

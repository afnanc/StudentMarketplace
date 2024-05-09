import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../utils/firebase.utils";
import { doc, getDoc } from "firebase/firestore";

const Message = () => {
  // State to store the fetched user details
  const [userDetails, setUserDetails] = useState({
    email: "",
    name: "",
    uid: "",
  });

  // Extract userId from URL params
  const { userId } = useParams();

  useEffect(() => {
    // Function to fetch user details from Firestore
    const fetchUserDetails = async () => {
      if (userId) {
        // Fetch the doc snapshot fro the user doc in Firestore
        const userDocRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          // Extract user data form the snapshot and update the state with it
          const userData = userSnapshot.data();
          setUserDetails({
            email: userData.email,
            name: userData.displayName || userData.name,
            uid: userSnapshot.id,
          });
          console.log("this is user data", userData);
        } else {
          console.log("No user details found.");
        }
      }
    };
    // Call the fetch function and re-run if the userId has changed
    fetchUserDetails();
  }, [userId]);

  // Render Message Page
  return (
    <div>
      <h1>Message Page</h1>
      <p>Email: {userDetails.email}</p>
      <p>Name: {userDetails.name}</p>
      <p>UID: {userDetails.uid}</p>
    </div>
  );
};

export default Message;

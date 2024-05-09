import React from "react";
import { useNavigate } from "react-router-dom";
import { signOutUser } from "../../utils/firebase.utils";

const SignOutButton = () => {
  const navigate = useNavigate();

  // Initialize user sign-out process and navigates to homepage upon success
  const handleSignOutClick = async () => {
    try {
      await signOutUser(); // Attempt to sign out the user
      alert("Sign out successful!");

      navigate("/"); // Navigate to home page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Render the button
  return (
    <button
      onClick={handleSignOutClick}
      className="btn btn-link nav-link"
      style={{ textDecoration: "none" }}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;

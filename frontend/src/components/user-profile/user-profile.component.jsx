import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../utils/firebase.utils";
import { doc, getDoc } from "firebase/firestore";
import { UserContext } from "../../contexts/user.context";
import "./user-profile.component.css";

import Breadcrumb from "../breadcrumb/breadcrumb.component";

const UserProfile = () => {
  // State initialization for user profile details and user ads
  const [userProfile, setUserProfile] = useState({ email: "", name: "" });
  const [userAds, setUserAds] = useState(null); // Initialized as null to distinguish between loading and empty states
  const navigate = useNavigate();
  const { userId } = useParams(); // Retrieve user Id from the URL
  const { currentUser } = useContext(UserContext); // Access the current user from the user context

  // Function to convert full name into initals to display a user's profile picture placeholder
  const getInitials = (name) => {
    let initials = name
      .split(" ")
      .map((word) => word[0])
      .join("");
    return initials.toUpperCase();
  };

  // Fetches the user profile from Firestore based on the userId param
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {
        const userDocRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserProfile({
            email: userData.email,
            name: userData.displayName || userData.name,
          });
          fetchUserAds(userData.displayName); // Fetche the ads posted by the user
        } else {
          console.log("No user profile found in Firestore.");
          navigate("/");
        }
      } else {
        console.log("No user ID provided.");
        navigate("/"); // Redirect to the home page if no userId is provided
      }
    };

    // Fetch ads posted by the user from the API endpoint
    const fetchUserAds = async (username) => {
      try {
        const response = await fetch(
          `https://cps630-group33-backend.onrender.com/api/ads/filter?username=${encodeURIComponent(
            username
          )}`
        );
        if (!response.ok) {
          throw new Error("No ads found or an error occurred");
        }
        const adsData = await response.json();
        if (adsData.error || adsData.length === 0) {
          setUserAds([]); // Set to an empty array if no ads are found
        } else {
          setUserAds(adsData);
        }
      } catch (error) {
        console.error("Failed to fetch ads:", error);
        setUserAds([]); // Also set to an empty array in case of error
      }
    };

    fetchUserProfile();
  }, [userId, navigate]);

  // Function to handle the delete of a specific ad by the user
  const handleDeleteAd = async (adId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this ad?"
    );
    if (!isConfirmed) {
      return;
    }

    console.log("Deleting ad:", adId);
    try {
      const response = await fetch(
        `https://cps630-group33-backend.onrender.com/api/ads/${adId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the ad.");
      }

      setUserAds((currentAds) => currentAds.filter((ad) => ad._id !== adId));

      console.log("Ad deleted successfully");
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  };

  // Render the user profile and their ads
  return (
    <div className="container">
      <Breadcrumb
        pathSegments={[
          { label: "Home", path: "/" },
          { label: "User Profile", path: `/user/${userId}` },
        ]}
      />

      <div className="row">
        <div className="col-md-4">
          <div className="profile-container">
            <div className="profile-header">
              <div className="initials">{getInitials(userProfile.name)}</div>
              <h2 className="name">{userProfile.name}</h2>
            </div>

            <div className="user-info">
              <div>
                <p>
                  <strong>Email</strong>
                </p>
                <p>{userProfile.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="listings-container">
            {" "}
            <div className="listings-header">
              <h3>User Ads</h3>
            </div>
            <div className="listings-content">
              {userAds === null ? (
                <p>Loading ads...</p>
              ) : userAds.length > 0 ? (
                userAds.map((ad, i) => (
                  <div className="card mb-3" key={i}>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src={`https://cps630-group33-backend.onrender.com${ad.photos[0]}`}
                          className="img-fluid"
                          alt={ad.title}
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-header">{ad.title}</div>
                        <div className="card-body">
                          <h5 className="card-title">${ad.price}</h5>
                          <p className="card-text">{ad.description}</p>
                          <p className="card-text">
                            <small className="text-muted">
                              {ad.type} | {ad.location}
                            </small>
                          </p>
                        </div>
                        <div className="card-footer d-flex justify-content-between">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate(`/ads/${ad._id}`)}
                          >
                            View Ad
                          </button>
                          {(currentUser?.isAdmin ||
                            currentUser?.id === ad.userID) && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteAd(ad._id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div id="errorMsg">
                  <p>No Ads posted.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

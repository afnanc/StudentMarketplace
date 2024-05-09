// This page is for the single ad page, when a user views a specific ad
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, icon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./AdPage.css";
import "leaflet/dist/images/marker-shadow.png";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../utils/firebase.utils";

// Fix for broken Leaflet marker images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// AdPage component
const AdPage = () => {
  // State for ad details and geographical coordinates
  const [ad, setAd] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch ad data and geocode the location on component mount
  useEffect(() => {
    const fetchAd = async () => {
      try {
        // Fetch the ad details
        const response = await axios.get(
          `https://cps630-group33-backend.onrender.com/api/ads/${id}`
        );
        setAd(response.data);

        // Increment the view count
        if (response.data && response.data.view_count != null) {
          await axios.patch(
            `https://cps630-group33-backend.onrender.com/api/ads/${id}`,
            {
              view_count: response.data.view_count + 1,
            }
          );
        }

        // Geocode the location to get coordinates
        const address = encodeURIComponent(response.data.location);
        const geoResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
        );
        if (geoResponse.data && geoResponse.data.length > 0) {
          setCoordinates({
            lat: parseFloat(geoResponse.data[0].lat),
            lon: parseFloat(geoResponse.data[0].lon),
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAd();
  }, [id]);

  // Function to find if a conversation with the ad poster already exists
  // If not, create a new conversation document in Firestore
  // Else Redirect to the message page for the current user
  const openMessages = async () => {
    // Ensure there's a signed-in user
    if (!auth.currentUser?.uid) {
      console.error("No authenticated user found.");
      return;
    }

    const userDoc = await getDocs(
      query(collection(db, "users"), where("displayName", "==", ad.username))
    );

    if (userDoc.empty) {
      console.error("No user found with the specified username.");
      return;
    }

    const contact_id = userDoc.docs[0].id;
    let contactExists = false;
    const convosDoc = await getDocs(query(collection(db, "conversations")));

    convosDoc.forEach((doc) => {
      const membersSet = new Set(doc.data().members);
      if (membersSet.has(auth.currentUser.uid) && membersSet.has(contact_id)) {
        contactExists = true;
      }
    });

    if (!contactExists) {
      await addDoc(collection(db, "conversations"), {
        members: [auth.currentUser.uid, contact_id],
      });
    }

    navigate(`/message/${auth.currentUser.uid}`);
  };
  // Render the ad details
  if (!ad || !coordinates) {
    return <div>Loading...</div>;
  }

  // Renderting the ad page
  return (
    <div className="ad-card">
      <div className="card-body">
        <h2
          className="card-title text-center"
          style={{
            margin: "10px 0",
            backgroundColor: "blue",
            color: "white",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          {ad.title}
        </h2>

        {/* Carousel for ad images */}
        <div className="row">
          <div className="col-lg-6 col-sm-12">
            <div
              id={`carouselExampleIndicators${ad.id}`}
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                {ad.photos.map((photo, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target={`#carouselExampleIndicators${ad.id}`}
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-current={index === 0 ? "true" : ""}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>
              <div className="carousel-inner">
                {ad.photos.map((photo, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <img
                      src={`https://cps630-group33-backend.onrender.com${photo}`}
                      className="d-block w-100 ad-image"
                      alt={ad.title}
                      height="300px"
                    />
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carouselExampleIndicators${ad.id}`}
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carouselExampleIndicators${ad.id}`}
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>

            {/* Leaflet Map */}
            {coordinates && (
              <MapContainer
                center={[coordinates.lat, coordinates.lon]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "250px", width: "100%", marginTop: "20px" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[coordinates.lat, coordinates.lon]}>
                  <Popup>{ad.location}</Popup>
                </Marker>
              </MapContainer>
            )}
          </div>

          <div className="col-lg-6 col-sm-12">
            <div className="card-text mt-3">
              {" "}
              <div className="info-box">
                <strong>Description:</strong> {ad.description}
              </div>
              <div className="info-box">
                <strong>Price:</strong> ${ad.price}
              </div>
              <div className="info-box">
                <strong>Category:</strong> {ad.category}
              </div>
              <div className="info-box">
                <strong>Location:</strong> {ad.location}
              </div>
              <div className="info-box">
                <strong>Username:</strong> {ad.username}
              </div>
              <div className="info-box">
                <strong>Date Posted:</strong>{" "}
                {new Date(ad.date_posted).toLocaleDateString()}
              </div>
              <div className="info-box">
                <strong>Views:</strong> {ad.view_count}
              </div>
            </div>

            <div className="text-center mt-3">
              <button
                className="btn btn-primary message-button"
                onClick={openMessages}
              >
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPage;

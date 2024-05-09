import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const FrontPageAds = () => {
  const [mostViewedAds, setMostViewedAds] = useState([]);
  const [recentlyPostedAds, setRecentlyPostedAds] = useState([]);

  // Function to prepare ads data by setting default or specific photo URLs
  function getAds(recentAds) {
    for (let i = 0; i < recentAds.length; i++) {
      // Assign a default empty image if no photo is uploaded
      if (recentAds[i]["photos"].length == 0) {
        recentAds[i][
          "photos"
        ][0] = `https://cps630-group33-backend.onrender.com\\img\\nopic.jpg`;
      } else {
        // Correct the photo URL
        let picture = recentAds[i]["photos"][0];
        recentAds[i][
          "photos"
        ][0] = `https://cps630-group33-backend.onrender.com${picture}`;
      }
    }
    return recentAds;
  }
  // Fetch most viewd and recently posted ads on component mount
  useEffect(() => {
    axios
      .get(
        "https://cps630-group33-backend.onrender.com/api/ads/top-10/mostViewedAds"
      )
      .then((response) => {
        // update the state with processed data for most viewed ads
        setMostViewedAds(getAds(response.data.slice(0, 6)));
      })
      .catch((error) => {
        console.error("Error fetching most viewed ads:", error);
      });

    axios
      .get(
        "https://cps630-group33-backend.onrender.com/api/ads/filter?sortBy=newest"
      )
      .then((response) => {
        // update the state with processed data for recently posted ads
        setRecentlyPostedAds(getAds(response.data.slice(0, 6)));
      })
      .catch((error) => {
        console.error("Error fetching recently posted ads:", error);
      });
  }, []);

  // Component rendering for two sectors, each with carousel for ads
  return (
    <div style={{ margin: "20px 0" }}>
      <h2
        className="card-title text-center"
        style={{
          backgroundColor: "#FFC107",
          color: "black",
          padding: "10px",
          fontSize: "18px",
        }}
      >
        Most Viewed Ads
      </h2>
      <div
        id="mostViewedCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {mostViewedAds.map((ad, index) => (
            <div
              key={ad._id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <Link
                to={`/ads/${ad._id}`}
                className="row g-0 h-100 text-decoration-none"
              >
                <div style={{ border: "2px solid black" }} className="col-md-6">
                  <img
                    src={ad.photos[0]}
                    className="img-fluid w-80 h-80"
                    alt={ad.title}
                    style={{ height: "180px" }}
                  />
                </div>
                <div className="col-md-6 d-flex bg-primary text-white p-4">
                  <div>
                    <h4>{ad.title}</h4>
                    <p>{ad.description}</p>
                    <h6>Price: ${ad.price}</h6>
                    <h6>Views: {ad.view_count}</h6>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#mostViewedCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#mostViewedCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
        </button>
      </div>

      <h2
        className="card-title text-center"
        style={{
          backgroundColor: "#FFC107",
          marginTop: "20px",
          color: "black",
          padding: "10px",
          fontSize: "18px",
        }}
      >
        Recently Posted Ads
      </h2>
      <div
        id="recentlyPostedCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {recentlyPostedAds.map((ad, index) => (
            <div
              key={ad._id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <Link
                to={`/ads/${ad._id}`}
                className="row g-0 h-100 text-decoration-none"
              >
                <div style={{ border: "2px solid black" }} className="col-md-6">
                  <img
                    src={ad.photos[0]}
                    className="img-fluid w-80 h-80"
                    alt={ad.title}
                    style={{ height: "180px" }}
                  />
                </div>
                <div className="col-md-6 d-flex align-items-center bg-primary text-white p-4">
                  <div>
                    <h4>{ad.title}</h4>
                    <p>{ad.description}</p>
                    <h6>Price: ${ad.price}</h6>
                    <h6>
                      Date Posted:{" "}
                      {new Date(ad.date_posted).toLocaleDateString()}
                    </h6>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#recentlyPostedCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#recentlyPostedCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </div>
  );
};

export default FrontPageAds;

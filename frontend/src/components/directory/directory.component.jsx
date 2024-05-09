import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/user.context";
import { Modal } from "bootstrap";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

// Directory component for showcasing academic services
const Directory = () => {
  const { currentUser } = useContext(UserContext); // Access the current user from the context
  const [showModal, setShowModal] = useState(false); // State to control the modal display
  const [modalInstance, setModalInstance] = useState(null); // Reference to the modal instance
  // Form field states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adCategory, setAdCategory] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [type, setAdType] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate(); // Hook for programmatic navigation
  const modalRef = useRef(); // Reference to the modal instance

  // function to handled when "Post ad" is clicked
  const handlePostAdClick = (e) => {
    if (!currentUser) {
      e.preventDefault(); // Prevent the default action
      alert("You must be signed in to post an ad.");
      navigate("/auth");
    } else {
      setShowModal(true); // Show the modal if the user is signed in
    }
  };

  // Effect to initialize and show the modal
  useEffect(() => {
    if (showModal) {
      const modalElement = document.getElementById("postAd");
      const instance = new Modal(modalElement); // Create model instance with Bootstrap
      instance.show();
      setModalInstance(instance); // save the modal instance to state
      setShowModal(false); // Reset showModal state
    }
  }, [showModal]);

  // Function post Ad
  const postAd = (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    const formData = new FormData();

    // Validate price input to ensure it's numeric
    const priceRegEx = /^[0-9]+$/;
    if (!priceRegEx.test(price)) {
      alert("Price should only contain numbers.");
      return;
    }

    // Format city input to have the first letter capitalized
    const formattedCity =
      city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    // Construct the form data object for submission
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", adCategory);
    formData.append("price", price);
    formData.append("location", formattedCity);
    formData.append("username", currentUser.displayName);
    formData.append("type", type);

    // Append the images to form data
    for (let i = 0; i < images.length; i++) {
      formData.append("photos", images[i]);
    }

    // Post the form data to the server
    fetch("https://cps630-group33-backend.onrender.com/api/ads", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Ad created!");
        modalInstance.hide(); // Hide modal
        document.body.classList.remove("modal-open"); // Remove the modal and backdrop from DOM to reset state
        const modalBackdrops =
          document.getElementsByClassName("modal-backdrop");
        while (modalBackdrops.length > 0) {
          modalBackdrops[0].parentNode.removeChild(modalBackdrops[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // component to render the method
  return (
    <div
      className="card"
      style={{
        width: "100%",
        position: "relative",
        top: "20px",
        textAlign: "center",
      }}
    >
      <div className="card-header" style={{ textAlign: "center" }}>
        Academic Services
      </div>
      <div className="card-body bg-warning">
        <div
          id="carouselExampleControls"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <img
                    src="https://images.pexels.com/photos/7680209/pexels-photo-7680209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Tutoring services"
                    className="d-block w-100"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-6">
                  <h5 style={{ marginTop: "10px" }} className="card-title">
                    Tutoring Available
                  </h5>
                  <p className="card-text">
                    I had a great experience using the Academic Services feature
                    to find tutoring services. There were numerous ads posted,
                    and I used the message functionality to find a tutor that
                    would be able to help me. I was able to find a tutor any
                    thing that I needed help in. I strongly recommend using the
                    Academic Services feature to find a tutor or any educational
                    items.
                  </p>
                  <em>Jane Doe</em>
                  <div className="star-rating" style={{ margin: "10px 0" }}>
                    &#9733; &#9733; &#9733; &#9733; &#9733;
                  </div>

                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handlePostAdClick}
                  >
                    Find a tutor!
                  </button>
                </div>
              </div>
            </div>

            <div className="carousel-item">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <img
                    src="https://www.shutterstock.com/image-photo/portrait-cheerful-male-international-indian-600nw-2071252046.jpg"
                    alt="Textbook Exchange"
                    className="d-block w-100"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-6">
                  <h5 style={{ marginTop: "10px" }} className="card-title">
                    Textbook Exchange
                  </h5>
                  <p className="card-text">
                    Using this application, finding and exchanging textbooks was
                    a seamless process. There were numerous ad postings, and I
                    could easily filter and find the textbook I was looking for
                    within my price range and location. Having a portion
                    dedicated to academic services is a great feature of this
                    application and for students looking to find educational
                    items.
                  </p>
                  <em>Dave Doe</em>
                  <div className="star-rating" style={{ margin: "10px 0" }}>
                    &#9733; &#9733; &#9733; &#9733; &#9733;
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handlePostAdClick}
                  >
                    Find a textbook!
                  </button>
                </div>
              </div>
            </div>

            <div className="carousel-item">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <img
                    src="https://images.pexels.com/photos/17029986/pexels-photo-17029986/free-photo-of-a-group-of-teenage-boys-and-a-girl-standing-and-smiling.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Study Groups"
                    className="d-block w-100"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-6">
                  <h5 style={{ marginTop: "10px" }} className="card-title">
                    Study Groups
                  </h5>
                  <p className="card-text">
                    The study group feature in the Academic Services ad category
                    is insanely helpful. We were able to find a study group that
                    were in close proximity, and we were able to use the maps to
                    verify this. We were able to meet up and study and form a
                    group message to be able to communicate seamlessly with one
                    another. Highly recommend using this feature!
                  </p>
                  <em>John Doe And Friends</em>
                  <div className="star-rating" style={{ margin: "10px 0" }}>
                    &#9733; &#9733; &#9733; &#9733; &#9733;
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handlePostAdClick}
                  >
                    Find a textbook!
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControls"
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
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Directory;

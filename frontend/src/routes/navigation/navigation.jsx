import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";
import "./navigation.css";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

// For authentication
import { Link } from "react-router-dom";
import SignOutButton from "../../components/sign-out/sign-out.component";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/user.context";
import { Modal } from "bootstrap";

// For user profile
import { FaUserCircle } from "react-icons/fa";

// Initialize the component
const Navigation = () => {
  // For authentication and admin check
  // Utilizing the React Router and Firebase hooks for navigation and accessing the current user's context
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const modalRef = useRef();

  // State declarations for various functionalities including search, ad posting form data, and modal display
  const [category, setCategory] = useState("");
  const [search, setSearchBar] = useState("");
  const [hasSent, setSent] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adCategory, setAdCategory] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [type, setAdType] = useState("");
  const [images, setImages] = useState([]);

  // Handle the search filter submission and navigates to the search results page
  const filterSearch = (e) => {
    e.preventDefault();
    const returnResults = async () => {
      const response = await fetch(
        `https://cps630-group33-backend.onrender.com/api/ads/filter?category=${category}`
      );
      const ads = await response.json();
      navigate("/Search", {
        state: { category: category, input: search, ads: ads, hasSent: true },
      });
    };
    returnResults();
  };

  const [showModal, setShowModal] = useState(false);
  const [modalInstance, setModalInstance] = useState(null);

  // Call this function when "Post ad" is clicked
  const handlePostAdClick = (e) => {
    if (!currentUser) {
      e.preventDefault(); // Prevent the default action
      alert("You must be signed in to post an ad.");
      navigate("/auth");
    } else {
      setShowModal(true); // Show the modal if the user is signed in
    }
  };

  // Initialize the modal instance for posting ads when showModal is true
  useEffect(() => {
    if (showModal) {
      const modalElement = document.getElementById("postAd");
      const instance = new Modal(modalElement);
      instance.show();
      setModalInstance(instance);
      setShowModal(false);
    }
  }, [showModal]);

  // Handle the submission of the ad posting form
  const postAd = (e) => {
    e.preventDefault();
    const formData = new FormData();

    const priceRegEx = /^[0-9]+$/;
    if (!priceRegEx.test(price)) {
      alert("Price should only contain numbers.");
      return;
    }

    const formattedCity =
      city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", adCategory);
    formData.append("price", price);
    formData.append("location", formattedCity);
    formData.append("username", currentUser.displayName);
    formData.append("type", type);
    formData.append("userID", currentUser?.id);

    console.log("post ad formData", currentUser?.id);

    for (let i = 0; i < images.length; i++) {
      formData.append("photos", images[i]);
    }

    fetch("https://cps630-group33-backend.onrender.com/api/ads", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Ad created!");
        modalInstance.hide();
        document.body.classList.remove("modal-open");
        const modalBackdrops =
          document.getElementsByClassName("modal-backdrop");
        while (modalBackdrops.length > 0) {
          modalBackdrops[0].parentNode.removeChild(modalBackdrops[0]);
        }

        // Clear the form
        setTitle("");
        setDescription("");
        setAdCategory("");
        setPrice("");
        setCity("");
        setAdType("");
        setImages([]);

        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Render the navigation bar and confitionally renders profile, sign-in, or sign-out options based on the state of the user authentication
  return (
    <div>
      <>
        <header
          style={{ overflow: "auto !important" }}
          className="container-fluid w-100"
        >
          <nav
            className="navbar navbar-expand-lg navbar-light bg-light"
            style={{ width: "100%" }}
          >
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                {" "}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/TMU_logo.svg/2560px-TMU_logo.svg.png"
                  alt="TMU Logo"
                  style={{ height: 50, width: "auto" }}
                />
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse yellowBorder"
                id="navbarNav"
              >
                <form
                  className="d-flex search form-inline"
                  role="search"
                  onSubmit={filterSearch}
                  style={{ display: "inline-block" }}
                >
                  <input
                    className="form-control me-2 "
                    type="search"
                    style={{ width: "300px", height: "60px" }}
                    placeholder="&#xf002;"
                    aria-label="Search"
                    onChange={(e) => setSearchBar(e.target.value)}
                  />
                  <select
                    className="form-select me-2"
                    id="dropDownCategory"
                    style={{ width: "300px", height: "60px" }}
                    defaultValue={"DEFAULT"}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="DEFAULT" disabled>
                      Select Category
                    </option>
                    <option>Arts</option>
                    <option>Electronics</option>
                    <option>Furniture</option>
                    <option>Fashion</option>
                    <option>Sports</option>
                    <option>Kids</option>
                    <option>Business</option>
                    <option>Health</option>
                    <option>Automotive</option>
                    <option>Education</option>
                    <option>Kitchen</option>
                    <option>Outdoor</option>
                    <option>Other</option>
                  </select>
                  <div>
                    <button className="btn btn-primary mt-2" type="submit">
                      Search
                    </button>
                  </div>
                </form>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    {currentUser && (
                      <a
                        className="nav-link"
                        href={`/message/${currentUser.id}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-chat"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                        </svg>
                      </a>
                    )}
                  </li>
                  {currentUser?.isAdmin && (
                    <li className="nav-item">
                      <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/admin")}
                      >
                        Admin Dashboard
                      </button>
                    </li>
                  )}

                  {currentUser ? (
                    <>
                      <li className="nav-item">
                        <Link
                          to={`/user/${currentUser.id}`}
                          className="nav-link"
                        >
                          <FaUserCircle size={24} />
                        </Link>
                      </li>
                      <li className="nav-item">
                        <SignOutButton />
                      </li>
                    </>
                  ) : (
                    <li className="nav-item">
                      <Link to="/auth" className="nav-link">
                        Sign In
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button
                      className="btn btn-warning"
                      type="button"
                      onClick={handlePostAdClick}
                    >
                      Post ad
                    </button>
                    <div
                      className="modal fade"
                      id="postAd"
                      tabIndex="-1"
                      aria-labelledby="postAdLabel"
                      aria-hidden="true"
                      ref={modalRef}
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1 className="modal-title fs-5" id="postAdLabel">
                              Post Ad
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                              onClick={() => {
                                setTimeout(() => {
                                  document.body.classList.remove("modal-open");
                                  const modalBackdrops =
                                    document.getElementsByClassName(
                                      "modal-backdrop"
                                    );
                                  while (modalBackdrops.length > 0) {
                                    modalBackdrops[0].parentNode.removeChild(
                                      modalBackdrops[0]
                                    );
                                  }
                                }, 200);
                              }}
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="card">
                              <div
                                className="card-body"
                                style={{ backgroundColor: "#d0e1f2" }}
                              >
                                <form className="myModal" onSubmit={postAd}>
                                  <div>
                                    <h5
                                      style={{
                                        display: "inline-block",
                                        marginRight: "5px",
                                      }}
                                    >
                                      Ad Details
                                    </h5>
                                    <i
                                      className="fa fa-info-circle"
                                      title="Make a post explaining what product you're trying to find!"
                                    ></i>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="title">Title of Post</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="title"
                                      value={title}
                                      placeholder="Enter Title"
                                      onChange={(e) => setTitle(e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div
                                    className="form-group"
                                    style={{ marginTop: "6px" }}
                                  >
                                    <label htmlFor="descriptionText">
                                      Description
                                    </label>
                                    <textarea
                                      className="form-control"
                                      id="descriptionText"
                                      rows="3"
                                      value={description}
                                      placeholder="Enter Description"
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                      required
                                    ></textarea>
                                  </div>
                                  <label
                                    htmlFor="selectCategory"
                                    style={{ marginTop: "6px" }}
                                  >
                                    Ad Category
                                  </label>
                                  <select
                                    className="form-select"
                                    defaultValue={"DEFAULT"}
                                    id="selectCategory"
                                    onChange={(e) =>
                                      setAdCategory(e.target.value)
                                    }
                                    required
                                  >
                                    <option value="DEFAULT" disabled>
                                      Select Product Category
                                    </option>
                                    <option>Arts</option>
                                    <option>Electronics</option>
                                    <option>Furniture</option>
                                    <option>Fashion</option>
                                    <option>Sports</option>
                                    <option>Kids</option>
                                    <option>Business</option>
                                    <option>Health</option>
                                    <option>Automotive</option>
                                    <option>Education</option>
                                    <option>Kitchen</option>
                                    <option>Outdoor</option>
                                    <option>Other</option>
                                  </select>

                                  <label
                                    htmlFor="selectType"
                                    style={{ marginTop: "6px" }}
                                  >
                                    Ad Type
                                  </label>
                                  <select
                                    className="form-select"
                                    defaultValue={"DEFAULT"}
                                    id="selectType"
                                    onChange={(e) => setAdType(e.target.value)}
                                    required
                                  >
                                    <option value="DEFAULT" disabled>
                                      Select Ad Type
                                    </option>
                                    <option>Items For Sale</option>
                                    <option>Items Wanted</option>
                                    <option>Academic Services</option>
                                  </select>
                                  <label
                                    htmlFor="selectPrice"
                                    style={{ marginTop: "6px" }}
                                  >
                                    Price
                                  </label>
                                  <input
                                    type="number"
                                    step="1"
                                    className="form-control"
                                    value={price}
                                    placeholder="Enter Price"
                                    onChange={(e) => {
                                      const priceValue =
                                        parseFloat(e.target.value) || 0;
                                      setPrice(priceValue);
                                    }}
                                    required
                                  />

                                  <div
                                    className="input-group mb-3"
                                    style={{ marginTop: "12px" }}
                                  >
                                    <span
                                      className="input-group-text"
                                      style={{ height: "37px" }}
                                    >
                                      <svg
                                        fill="#000000"
                                        version="1.1"
                                        id="Capa_1"
                                        width="20px"
                                        height="20px"
                                        viewBox="0 0 395.71 395.71"
                                      >
                                        <g>
                                          <path
                                            d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738
                                          c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388
                                          C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191
                                          c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"
                                          />
                                        </g>
                                      </svg>
                                    </span>

                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter City"
                                      value={city}
                                      onChange={(e) => {
                                        const formattedCity =
                                          e.target.value
                                            .charAt(0)
                                            .toUpperCase() +
                                          e.target.value.slice(1).toLowerCase();
                                        setCity(formattedCity);
                                      }}
                                      required
                                    />
                                  </div>
                                  <div style={{ marginTop: "12px" }}>
                                    <label
                                      htmlFor="uploadMany"
                                      className="form-label"
                                    >
                                      Upload pictures (maximum 3)
                                    </label>
                                    <input
                                      className="form-control"
                                      type="file"
                                      id="UploadMany"
                                      multiple
                                      onChange={(e) => {
                                        if (e.target.files.length > 3) {
                                          alert(
                                            "You can only upload a maximum of 3 images."
                                          );
                                        } else {
                                          setImages(e.target.files);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="submit"
                                      className="btn btn-primary ms-auto"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </>
    </div>
  );
};

export default Navigation;

import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Search.css";

// For admin users
import { UserContext } from "../../contexts/user.context";

const Search = () => {
  // Access the location to use state passed via naviation
  let location = useLocation();

  // Access the current user from the user context
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Navigate to the ad detail page for a givent adId
  const goToAdDetail = (adId) => {
    navigate(`/ads/${adId}`);
  };

  // States for search results, location filters, price range, ad categories, and more
  const [ads, setAds] = useState([]);
  const [loc, setLoc] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState(
    location.state?.category || "All Categories"
  );
  const [search, setSearch] = useState(location.state?.input);
  const [type, setType] = useState("All Types");
  const [sortBy, setSortBy] = useState("");

  // Clear all the filters to their default values
  const clearFilters = () => {
    setLoc("");
    setMinPrice("");
    setMaxPrice("");
    setType("All Types");
    setSortBy("");
  };

  // Process the ad data to include default images where necessary and update the ad state
  function getAndSetAds(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i]["photos"].length == 0) {
        data[i][
          "photos"
        ][0] = `https://cps630-group33-backend.onrender.com\\img\\nopic.jpg`;
      } else {
        let picture = data[i]["photos"][0];
        data[i][
          "photos"
        ][0] = `https://cps630-group33-backend.onrender.com${picture}`;
      }
    }
    setAds(data);
  }

  // Construct a query string for filtering ads based on selected filters
  const constructFilterString = () => {
    let filterString = "";
    if (loc) filterString += `location=${loc}&`;
    if (minPrice) filterString += `minPrice=${minPrice}&`;
    if (maxPrice) filterString += `maxPrice=${maxPrice}&`;
    if (category && category !== "All Categories")
      filterString += `category=${category}&`;
    if (type && type !== "All Types") filterString += `type=${type}&`;
    if (sortBy) filterString += `sortBy=${sortBy}&`;
    return filterString;
  };

  // Apply the selected filters by fetching ads with the constructed query string
  const applyFilters = async (e) => {
    e.preventDefault();
    const filterString = constructFilterString();
    await fetchAds(filterString);
  };

  // Fetch ads from the backend server based on the query string
  const fetchAds = async (filterString) => {
    const response = await fetch(
      `https://cps630-group33-backend.onrender.com/api/ads/filter?${filterString}`
    );
    const data = await response.json();
    if (search) {
      let searchInput = search.toLowerCase();
      let filteredSet = new Set();
      for (let i = 0; i < data.length; i++) {
        let description = data[i]["description"].toLowerCase();
        let title = data[i]["title"].toLowerCase();
        if (description.includes(searchInput) || title.includes(searchInput)) {
          filteredSet.add(data[i]);
        }
      }
      getAndSetAds([...filteredSet]);
    } else {
      getAndSetAds(data);
    }
  };

  // Navigate to the ad owner profile page
  const handleViewOwnerProfile = (e, userID) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/user/${userID}`);
  };

  // Function to delete an ad by an admin user or the user who posted the ad
  const handleDeleteAd = async (adId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this ad?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `https://cps630-group33-backend.onrender.com/api/ads/${adId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const updatedAds = ads.filter((ad) => ad._id !== adId);
      setAds(updatedAds);

      console.log(`Ad with ID: ${adId} was successfully deleted.`);
    } catch (error) {
      console.error(`Failed to delete ad with ID: ${adId}.`, error);
    }
  };

  // Watch for changes in filter inputs and fetch ads accordingly
  useEffect(() => {
    setCategory(location.state?.category || "All Categories");
  }, [location.state?.category]);

  useEffect(() => {
    setSearch(location.state?.input);
  }, [location.state?.input]);

  useEffect(() => {
    const filterString = constructFilterString();
    fetchAds(filterString);
  }, [category, search, type, sortBy, loc, minPrice, maxPrice]);

  // Rendering the search navigation page
  return (
    <>
      <nav aria-label="breadcrumb" className="ms-2">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Search
          </li>
        </ol>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <div className="sidebar col-lg-3 col-md-4 col-12">
            <h2 style={{ textAlign: "center" }}>Filters</h2>
            <form onSubmit={applyFilters}>
              <div className="mb-3 input-group">
                <span className="input-group-text" style={{ height: "38px" }}>
                  Location
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="enteredCity"
                  placeholder="Enter City"
                  value={loc}
                  onChange={(e) => {
                    const formattedCity =
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1).toLowerCase();
                    setLoc(formattedCity);
                  }}
                />
              </div>

              <div className="mb-3">
                <p style={{ textAlign: "center", fontWeight: "bold" }}>
                  Enter Price Range:
                </p>
                <div className="row">
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      id="fromPrice"
                      placeholder="From"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      id="toPrice"
                      placeholder="To"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <select
                  className="form-select"
                  id="selectType"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="All Types">All Types</option>
                  <option value="Items For Sale">Items For Sale</option>
                  <option value="Academic Services">Academic Services</option>
                  <option value="Items Wanted">Items Wanted</option>
                </select>
              </div>

              <div className="mb-3">
                <select
                  className="form-select"
                  id="selectSortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Sort By...</option>
                  <option value="oldest">Oldest</option>
                  <option value="newest">Newest</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="expensive">Expensive</option>
                </select>
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  type="reset"
                  className="btn btn-warning"
                  onClick={clearFilters}
                >
                  Clear
                </button>
                <button type="submit" className="btn btn-primary ms-3">
                  Apply Filters
                </button>
              </div>
            </form>
          </div>

          <div className="col-lg-9 col-md-8 col-12">
            <div className="content">
              {ads.length > 0 ? (
                ads.map((ad, index) => {
                  console.log("Ad data,", ad);
                  return (
                    <Link
                      to={`/ads/${ad._id}`}
                      key={index}
                      className="text-decoration-none text-dark"
                    >
                      <div
                        className="card mb-3"
                        id="adCard"
                        onClick={() => goToAdDetail(ad._id)}
                      >
                        <div className="row g-0">
                          <div
                            className="col-md-3 col-sm-4 col-5"
                            style={{ border: "2px solid black" }}
                          >
                            <img
                              src={ad.photos[0]}
                              className="img-fluid w-100 h-100"
                              alt={ad.title}
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <div className="col-md-9 col-sm-8 col-7">
                            <div className="card-body">
                              <h5
                                className="card-header"
                                style={{ background: "blue", color: "white" }}
                              >
                                {ad.title}
                              </h5>
                              <div
                                className="card-body"
                                style={{ backgroundColor: "#FFC107" }}
                              >
                                <h5 className="card-title">${ad.price}</h5>
                                <p className="card-text">{ad.description}</p>
                                <p className="card-text">
                                  <small className="text-muted">
                                    {ad.type} | {ad.location}
                                  </small>
                                </p>
                                <p className="card-text">
                                  {new Date(
                                    ad.date_posted
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="card-footer">
                            <button
                              className="btn btn-view-owner ms-2"
                              onClick={(e) =>
                                handleViewOwnerProfile(e, ad.userID)
                              }
                            >
                              View User Profile
                            </button>
                            {(currentUser?.isAdmin ||
                              currentUser?.id === ad.userID) && (
                              <button
                                className="btn btn-danger ms-2"
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent form submission if in form
                                  e.stopPropagation(); // Prevent further propagation
                                  handleDeleteAd(ad._id);
                                }}
                              >
                                Delete Ad
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div id="errorMsg">No ads found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;

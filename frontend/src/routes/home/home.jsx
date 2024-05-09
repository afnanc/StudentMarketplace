import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";
import "./home.css";
import { Outlet } from "react-router-dom";
import Directory from "../../components/directory/directory.component";
import FrontPageAds from "../../components/front-page/front-page-ads";

// Render the home page
const Home = () => {
  return (
    <div className="container-fluid vertical-center">
      <div className="row top-margin">
        <div className="col-md-6 mb-4 mb-md-0">
          <Directory />
        </div>
        <div className="col-md-6 mb-4 mb-md-0">
          <FrontPageAds />
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Home;

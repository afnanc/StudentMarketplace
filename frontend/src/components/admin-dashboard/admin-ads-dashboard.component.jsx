import React, { useState, useEffect } from "react";
import CategoryAdsChart from "../charts/ads-chart.component";

// Component for admin dashboard to display ads by category
const AdminAdsDashboard = () => {
  // State to store ads data
  const [adsData, setAdsData] = useState([]);

  // Effect hook to fetch ads data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch ads data from API endpoint
        const response = await fetch(
          "https://cps630-group33-backend.onrender.com/api/ads/count/adCountByCategory"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Sort data based on count in descending order
        data.sort((a, b) => b.count - a.count);
        setAdsData(data);
      } catch (error) {
        console.error("Could not fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Render method to display chart and title
  return (
    <div>
      <CategoryAdsChart data={adsData} />
      <h5 style={{ textAlign: "center", marginTop: "20px" }}>
        Ads By Category
      </h5>
    </div>
  );
};
export default AdminAdsDashboard;

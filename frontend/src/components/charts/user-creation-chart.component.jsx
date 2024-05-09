import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { fetchUserCreationData } from "../../utils/firebase.utils";
import "chart.js/auto"; // Auto import of Chart.js for react-chartjs-2

// Function to aggregate user creation data by month
const aggregateDataByMonth = (data) => {
  const monthlyData = {};

  data.forEach((item) => {
    const date = item.createdAt.toDate(); // Convert timestamp to Date object
    const monthYear = date.toLocaleDateString("default", {
      month: "long", // January, February, etc.
      year: "numeric",
    });
    // Increament count for each month
    monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
  });

  // Convert to array of objects
  return Object.entries(monthlyData).map(([date, count]) => ({ date, count }));
};

// Component to display user creation trend over time
const UserCreationChart = () => {
  const [chartData, setChartData] = useState({
    labels: [], // x-axis label (months)
    datasets: [
      {
        label: "User Sign-ups", // Dataset label
        data: [], // y-axis label (user sign-up counts)
        fill: false, // No fill under the lone
        borderColor: "rgb(75, 192, 192)", // line color
        tension: 0.1, // Slight curve to the line
      },
    ],
  });

  // Fetch and process user creation data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserCreationData(); // Fetch user creation data
      const processedData = aggregateDataByMonth(userData); // Aggregate user creation data by month
      setChartData({
        labels: processedData.map((data) => data.date), // Set x-axis labels to month-year
        datasets: [
          {
            label: "User Sign-ups",
            data: processedData.map((data) => data.count), // Set dataset values to sign-up counts
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      });
    };
    fetchData();
  }, []);

  // Render the Line chart with updated data
  return (
    <div>
      <h2>User Creation Chart</h2>
      <Line data={chartData} />
      <h5 style={{ textAlign: "center", marginTop: "20px" }}>
        Monthly User Sign-ups
      </h5>
    </div>
  );
};

export default UserCreationChart;

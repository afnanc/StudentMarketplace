import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { useNavigate } from "react-router-dom";

// Component to display ads count by category in a bar chart
const CategoryAdsChart = ({ data }) => {
  // Extract the category and counts from the data object
  const categories = data.map((item) => item.category);
  const counts = data.map((item) => item.count);

  // Navigate hook initializes
  const navigate = useNavigate();

  // Chart colors
  const backgroundColors = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(199, 199, 199, 0.2)",
    "rgba(233, 30, 99, 0.2)",
    "rgba(33, 150, 243, 0.2)",
    "rgba(76, 175, 80, 0.2)",
    "rgba(255, 87, 34, 0.2)",
    "rgba(156, 39, 176, 0.2)",
    "rgba(103, 58, 183, 0.2)",
  ];

  // Chart border colors
  const borderColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(159, 159, 159, 1)",
    "rgba(233, 30, 99, 1)",
    "rgba(33, 150, 243, 1)",
    "rgba(76, 175, 80, 1)",
    "rgba(255, 87, 34, 1)",
    "rgba(156, 39, 176, 1)",
    "rgba(103, 58, 183, 1)",
  ];

  // Chart data structure for react-chartjs-2
  const chartData = {
    labels: categories, // X-axis labels from categories
    datasets: [
      {
        label: "Ads Count by Category", // Dataset label
        data: counts, // Y-axis labels from counts
        backgroundColor: backgroundColors, // Background color
        borderColor: borderColors, // Border color
        borderWidth: 1, // Border width of bars
      },
    ],
  };

  // Chart options
  const options = {
    scales: {
      y: {
        beginAtZero: true, // Y-axis begins at 0
      },
    },
    // Click event on chart elements, which route to the search ads page with the clicked category as state
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const categoryIndex = elements[0].index;
        const category = categories[categoryIndex]; // get the category name based on the index
        navigate("/Search", { state: { category: category } });
      }
    },
  };

  // Render the Bar chart with provided data and options
  return <Bar data={chartData} options={options} />;
};

export default CategoryAdsChart;

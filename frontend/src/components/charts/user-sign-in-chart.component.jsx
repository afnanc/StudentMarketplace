import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { fetchUserSignInData } from "../../utils/firebase.utils";
import "chart.js/auto";

const aggregateSignInDataByMonth = (data) => {
  const monthlyData = {};

  data.forEach((item) => {
    const date = item.signInAt.toDate();
    const monthYear = date.toLocaleDateString("default", {
      month: "long",
      year: "numeric",
    });
    monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
  });

  return Object.entries(monthlyData).map(([date, count]) => ({ date, count }));
};

const UserSignInChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const signInData = await fetchUserSignInData();
      const processedData = aggregateSignInDataByMonth(signInData);
      setChartData({
        labels: processedData.map((data) => data.date),
        datasets: [
          {
            label: "User Sign-Ins",
            data: processedData.map((data) => data.count),
            fill: false,
            borderColor: "rgb(53, 162, 235)",
            tension: 0.1,
          },
        ],
      });
    };
    fetchData();
  }, []);

  return <Line data={chartData} />;
};

export default UserSignInChart;

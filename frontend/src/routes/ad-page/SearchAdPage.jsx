import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const SearchAdsPage = () => {
  const [searchParams] = useSearchParams();
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const category = searchParams.get("category");

  useEffect(() => {
    if (category) {
      setIsLoading(true);
      fetch(
        `https://cps630-group33-backend.onrender.com/api/ads/filter?category=${encodeURIComponent(
          category
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          setAds(data); // Assuming the API returns an array of ads
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch ads:", error);
          setIsLoading(false);
        });
    }
  }, [category]); // Re-run the effect if the category changes

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!ads.length) {
    return <div>No ads found for this category.</div>;
  }

  return (
    <div>
      <h2>Ads for {category}</h2>
      <ul>
        {ads.map((ad) => (
          <li key={ad.id}>
            <h3>{ad.title}</h3>
            <p>{ad.description}</p>
            {/* Add more details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchAdsPage;

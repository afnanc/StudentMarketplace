import React from "react";
import { useNavigate } from "react-router-dom";

// Breadcrumb navigation component to improve user navigation experience
const Breadcrumb = ({ pathSegments }) => {
  const navigate = useNavigate();

  // Render a breadcrumb list based on the path segments properties
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1; // Check if the current segment is last one
          return (
            <li
              key={index}
              className={`breadcrumb-item ${isLast ? "active" : ""}`} // Mark the last item as active
              aria-current={isLast ? "page" : undefined} // Accesscibility attribute for the current page
            >
              {!isLast ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    navigate(segment.path); // Navigate to the segment path on click
                  }}
                >
                  {segment.label}
                </a>
              ) : (
                segment.label
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

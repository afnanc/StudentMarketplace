import "./button.styles.css";

// Object to map button types properties to corresponding CSS classes
const BUTTON_TYPE_CLASSES = {
  google: "google-sign-in", // Google sign in button type
  default: "default", // Default button type
};

// Custom Button component that accepts properties
const Button = ({ children, buttonType, ...otherProps }) => {
  return (
    <button
      className={`button-container ${BUTTON_TYPE_CLASSES[buttonType]}`}
      {...otherProps} // Spread other properties to the button element
    >
      {children}
    </button>
  );
};

export default Button;

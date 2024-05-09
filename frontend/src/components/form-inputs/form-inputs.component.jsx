import React from "react";
import "./form-inputs.component.css";

// FormInput component for resuable form input fields
const FormInput = ({ label, ...otherProps }) => {
  return (
    <div className="group">
      <input {...otherProps} />
      {label ? (
        <label
          className={`${
            otherProps.value.length ? "shrink" : ""
          } form-input-label`}
        >
          {label}
        </label>
      ) : null}
    </div>
  );
};

export default FormInput;

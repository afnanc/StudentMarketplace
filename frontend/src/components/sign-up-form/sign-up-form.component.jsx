import { useState } from "react";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase.utils";
import FormInput from "../form-inputs/form-inputs.component";
import "./sign-up-form.styles.css";
import Button from "../button/button.component";

import { useNavigate } from "react-router-dom";

const defaultFormField = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  // Initialize the form state with default values
  const [formFields, setFormFields] = useState(defaultFormField);
  const { displayName, email, password, confirmPassword } = formFields;

  // Navigate initialization
  const navigate = useNavigate();

  // Reset the form to the initial state upon success
  const resetFormFields = () => {
    setFormFields(defaultFormField);
  };

  // Handles form submission, perform password match check, creates auth user, user doc, and navigates to home
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Password do not match"); // Password verification
      return;
    }

    // User creation process
    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocumentFromAuth(user, { displayName });
      resetFormFields();
      alert("Sign up successful! Welcome!");

      navigate("/");
    } catch (err) {
      // Error handling for user creation process
      if (err.code === "auth/email-already-in-use") {
        alert("Email already in used");
      } else {
        console.log("user creation encountered an error", err);
      }
    }
  };

  // Dynamically updates form fields based on user input
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  // Render method for SignUpForm, includes form inputs for user info and submit button
  return (
    <div className="sign-up-container">
      <h2>Don't have an account?</h2>
      <span>Sign Up With Your Email and Password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Display Name"
          type="text"
          required
          onChange={handleChange}
          name="displayName"
          value={displayName}
        />

        <FormInput
          label="Email"
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />

        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        />

        <FormInput
          label="Confirm Password"
          type="password"
          required
          onChange={handleChange}
          name="confirmPassword"
          value={confirmPassword}
        />

        <Button buttonType="default" type="submit">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;

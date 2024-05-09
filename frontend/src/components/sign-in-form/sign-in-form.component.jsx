import { useState } from "react";
import {
  signInWithGooglePopup,
  signInAuthUserWithEmailAndPassword,
} from "../../utils/firebase.utils";
import { useNavigate } from "react-router-dom";
import FormInput from "../form-inputs/form-inputs.component";
import "./sign-in-form.styles.css";
import Button from "../button/button.component";

const defaultFormField = {
  email: "",
  password: "",
};

const SignInForm = () => {
  // Initializes form state with default values for email and password
  const [formFields, setFormFields] = useState(defaultFormField);
  const { email, password } = formFields;

  // Enable programmatic naviation after action such as signing in
  const navigate = useNavigate();

  // Reset the form fields to the default values
  const resetFormFields = () => {
    setFormFields(defaultFormField);
  };

  // Handle sign in with Google
  const signInWithGoogle = async () => {
    try {
      // Attempt to sign in with Google
      await signInWithGooglePopup();
      console.log("signInWithGooglePopup");
      alert("Sign in successful! Welcome back.");
      navigate("/"); // navigate to home after successfully sign in
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("Failed to sign in with Google. Please try again later.");
    }
  };

  // Handle form submission for email and password sign-in, including error handling and post-sign-in actions
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signInAuthUserWithEmailAndPassword(email, password);
      alert("Sign in successful! Welcome back."); // Alert for successful sign in
      resetFormFields();
      // Redirect to the home page after sign in has completed
      navigate("/");
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          alert("No user found with this email.");
          break;
        case "auth/wrong-password":
          alert("Incorrect password. Please try again.");
          break;
        case "auth/user-disabled":
          alert("User account is disabled.");
          break;
        case "auth/invalid-email":
          alert("Email address is not valid.");
          break;
        default:
          alert("An error occurred during sign in. Please try again.");
      }
    }
  };

  // Update form fields state based on user input, ensuring the form is controlled
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  // Renders the sign-in form with inputs for emial and password and buttons for submitting or signing in with Google
  return (
    <div className="sign-up-container">
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>
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
        <div className="buttons-container">
          <Button buttonType="default" type="submit">
            Sign In
          </Button>
          <Button type="button" buttonType="google" onClick={signInWithGoogle}>
            Google Sign In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;

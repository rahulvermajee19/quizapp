// src/components/Auth.js
import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import "./Auth.css";
import Logo from "../assets/logo.png";      // Your logo image
import Poster from "../assets/poster.jpeg";  // Add your poster image here

const Auth = ({ onAuthSuccess }) => {
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page d-flex flex-column justify-content-center align-items-center min-vh-100 text-center px-4">
      {/* Logo */}
      <img src={Logo} alt="Logo" className="auth-logo mb-3" />

      {/* Poster Image */}
      <img src={Poster} alt="Poster" className="auth-poster mb-4" />

      {/* Welcome Text */}
      <h1 className="display-6 fw-bold mb-2 text-dark">
       Kanchan Convent School
      </h1>
      <h4 className="text-secondary mb-4">
       Admissions Open Now
      </h4>

      {/* Error */}
      {error && <div className="alert alert-danger w-100">{error}</div>}

      {/* Google Button */}
      <button onClick={handleGoogleLogin} className="btn btn-google mt-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png"
          alt="Google"
          className="me-2"
          width="25"
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default Auth;

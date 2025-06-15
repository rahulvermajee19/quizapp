// src/components/Auth.js
import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import "./Auth.css";
import Logo from "../assets/logo.png"; // Placeholder or actual logo

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
    <div className="container-fluid auth-container">
      <div className="row min-vh-100">
        {/* Left Content */}
        <div className="col-md-6 d-flex flex-column justify-content-center px-5 py-4">
         
          <h1 className="display-6 fw-bold mb-2 text-dark">Learn new concepts for each question</h1>
          <h4 className="text-secondary mb-4">We help you prepare for exams and quizzes</h4>

          {error && <div className="alert alert-danger w-100">{error}</div>}

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

        {/* Right Image */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
          <img src={Logo} alt="Visual" className="img-fluid w-50" />
        </div>
      </div>
    </div>
  );
};

export default Auth;

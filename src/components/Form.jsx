// src/components/Form.js
import React, { useState } from "react";
import { db, addDoc, collection } from "../firebase";
import { auth } from "../firebase";
import "./Form.css";

const Form = ({ onNext }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    grade: "",
    contact: "",
    isChaitanyaStudent: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, grade, contact, isChaitanyaStudent } = formData;

    if (!firstName || !lastName || !grade || !contact || !isChaitanyaStudent) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "users"), {
        uid: auth.currentUser.uid,
        ...formData,
        timestamp: Date.now(),
      });
      onNext(); // Go to Quiz
    } catch (error) {
      console.error("Error saving user details:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container form-wrapper">
      <div className="row justify-content-center">
         <h1 className="text-center mb-4 p-3" style={{color:"#800000"}}>Admissions Open Now</h1>
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-sm p-4">
            <h5 className="text-center mb-5 form-title">Enter Your Basic Details</h5>

            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3 col-md-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="Enter First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3 col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  placeholder="Enter Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label">Grade / Class</label>
                  <select
                    name="grade"
                    className="form-select"
                    value={formData.grade}
                    onChange={handleChange}
                  >
                    <option value="">Select Grade</option>
                    <option value="1">1st</option>
                    <option value="2">2nd</option>
                    <option value="3">3rd</option>
                    <option value="4">4th</option>
                    <option value="5">5th</option>
                    <option value="6">6th</option>
                    <option value="7">7th</option>
                    <option value="8">8th</option>
                    <option value="9">9th</option>
                    <option value="10">10th</option>
                    <option value="11">11th</option>
                    <option value="12">12th</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  className="form-control"
                  placeholder="+91-XXXXXXXXXX"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Are you a Kanchan Convent School student?</label>
                <select
                  name="isChaitanyaStudent"
                  className="form-select"
                  value={formData.isChaitanyaStudent}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <button type="submit" className="btn btn-warning w-100 text-white fw-bold shadow-sm">
                Start Quiz
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;

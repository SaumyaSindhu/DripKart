import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import "./register.scss";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    password: "",
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleRegister({
      email: formData.email,
      contact: formData.contactNumber,
      password: formData.password,
      isSeller: formData.isSeller,
      fullname: formData.fullName,
    });

    navigate("/");
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="register-page">
        <div className="register-left">
          <img
            src="/snitch_editorial_warm.png"
            alt="Snitch Fashion Editorial"
            className="register-bg-image"
          />

          <div className="register-overlay"></div>

          <div className="register-left-content">
            <span className="brand-logo">DRIPKART.</span>

            <div className="editorial-content">
              <p className="editorial-heading">
                Define your <br />
                <em>aesthetic.</em>
              </p>

              <p className="editorial-text">
                Join the exclusive movement of creators and brands redefining
                the modern fashion landscape.
              </p>
            </div>
          </div>
        </div>

        <div className="register-right">
          <div className="register-form-wrapper">
            <div className="mobile-brand">
              <span className="brand-logo">DRIPKART.</span>
            </div>

            <div className="register-header">
              <p className="register-subtitle">Welcome to Dripkart</p>

              <h1 className="register-title">Elevate Your Style</h1>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="reg-fullName">Full Name</label>

                <input
                  id="reg-fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-contact">Contact Number</label>

                <input
                  id="reg-contact"
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address</label>

                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="hello@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-password">Password</label>

                <input
                  id="reg-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <label htmlFor="reg-isSeller" className="seller-checkbox">
                <div className="checkbox-wrapper">
                  <input
                    id="reg-isSeller"
                    type="checkbox"
                    name="isSeller"
                    checked={formData.isSeller}
                    onChange={handleChange}
                  />

                  <div
                    className={`custom-checkbox ${formData.isSeller ? "active" : ""}`}
                  >
                    {formData.isSeller && (
                      <svg viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="#fbf9f6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                <span className={formData.isSeller ? "active" : ""}>
                  Register as Seller
                </span>
              </label>

              <button type="submit" className="register-btn">
                Sign Up
              </button>

              <div className="divider">
                <div className="line"></div>

                <span>or</span>

                <div className="line"></div>
              </div>

              <ContinueWithGoogle />

              <p className="footer-text">
                Already have an account? <a href="/login">Sign in</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

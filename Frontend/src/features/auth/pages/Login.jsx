import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import "./login.scss";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await handleLogin({
        email: formData.email,
        password: formData.password,
      });

      if (data?.success) {
        navigate("/seller/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="login-page">
        <div className="login-left">
          <img
            src="/snitch_editorial_warm.png"
            alt="Snitch Fashion Editorial"
            className="login-bg-image"
          />

          <div className="login-overlay"></div>

          <div className="login-left-content">
            <span className="brand-logo">DRIPKART.</span>

            <div className="editorial-content">
              <p className="editorial-heading">
                Welcome <br />
                <em>back.</em>
              </p>

              <p className="editorial-text">
                Sign in to explore the latest exclusive drops and manage your
                aesthetic.
              </p>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <div className="mobile-brand">
              <span className="brand-logo">DRIPKART.</span>
            </div>

            <div className="login-header">
              <p className="login-subtitle">Sign in to DRIPKART</p>

              <h1 className="login-title">Enter the Vault</h1>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="hello@example.com"
                />
              </div>

              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="login-password">Password</label>

                  <a href="#">Forgot password?</a>
                </div>

                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="login-btn">
                Sign In
              </button>

              {error && <p className="login-error">{error}</p>}

              <div className="divider">
                <div className="line"></div>

                <span>or</span>

                <div className="line"></div>
              </div>

              <ContinueWithGoogle />

              <p className="footer-text">
                Don&apos;t have an account? <a href="/register">Sign up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

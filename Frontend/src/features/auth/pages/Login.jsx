import { useState } from "react";
import { useAuth } from "../hook/useAuth.js";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import "./login.scss";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const { loading, user, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    await handleLogin({
        email: formData.email,
        password: formData.password
    });

    navigate("/");

  };

  return (
    <main className="login-page">
      <div className="login-page__stars" />
      <div className="login-page__planet" />

      <section className="login-card" aria-labelledby="login-title">
        <div className="login-card__badge" aria-hidden="true">
          <span />
        </div>

        <div className="login-card__header">
          <p className="login-card__eyebrow">DripKart</p>
          <h1 id="login-title">Welcome back</h1>
          <p>
            Sign in to continue shopping, selling, and managing your account.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-form__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label className="login-form__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="login-form__button">
            Login
          </button>

          <p className="login-footer">
            {error === "User not registered" ? (
              <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
                Register first{" "}
              </span>
            ) : (
              "Don't have an account? "
            )}
            <Link to="/register" className="register-link">
              Register
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;

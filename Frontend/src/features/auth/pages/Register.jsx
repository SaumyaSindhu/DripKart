import { useState } from 'react';
import './register.scss';
import { useAuth } from '../hook/useAuth.js';
import { Link, useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle.jsx';

const Register = () => {

  const { handleRegister } = useAuth();
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await handleRegister({
      fullname: formData.fullname,
      email: formData.email,
      contact: formData.contact,
      password: formData.password,
      isSeller: formData.isSeller
    });

    navigate("/");

  };

  return (
    <main className="register-page">
      <div className="register-page__stars" />
      <div className="register-page__planet" />

      <section className="register-card" aria-labelledby="register-title">
        <div className="register-card__badge" aria-hidden="true">
          <span />
        </div>

        <div className="register-card__header">
          <p className="register-card__eyebrow">DripKart</p>
          <h1 id="register-title">Create your account</h1>
          <p>Join the marketplace and start shopping or selling in minutes.</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <label className="register-form__field">
            <span>Full name</span>
            <input
              type="text"
              name="fullname"
              placeholder="Enter your full name"
              value={formData.fullname}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </label>

          <label className="register-form__field">
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

          <label className="register-form__field">
            <span>Contact</span>
            <input
              type="tel"
              name="contact"
              placeholder="Enter your contact number"
              value={formData.contact}
              onChange={handleChange}
              autoComplete="tel"
              required
            />
          </label>

          <label className="register-form__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </label>

          <label className="register-form__seller">
            <input
              type="checkbox"
              name="isSeller"
              checked={formData.isSeller}
              onChange={handleChange}
            />
            <span>Register as a seller</span>
          </label>

          <button type="submit" className="register-form__button">
            Register
          </button>

          <ContinueWithGoogle />

          <p className="register-footer">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Register;

import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";

import "./nav.scss";

const Nav = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const cartItems = useSelector((state) => state.cart?.items);

  return (
    <nav className="navbar">
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      {/* LOGO */}
      <Link to="/" className="brand-logo">
        DRIPKART.
      </Link>

      {/* RIGHT SIDE */}
      <div className="nav-right">
        {user ? (
          <>
            {/* USER NAME */}
            <span className="user-name">{user.fullname}</span>

            {/* SELLER DASHBOARD */}
            {user.role === "seller" && (
              <Link to="/seller/dashboard" className="nav-link">
                Seller Dashboard
              </Link>
            )}

            {/* CART */}
            <Link to="/cart" className="cart-link" aria-label="Shopping cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />

                <line x1="3" y1="6" x2="21" y2="6" />

                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>

              {cartItems?.length > 0 && (
                <span className="cart-count">
                  {cartItems.length > 9 ? "9+" : cartItems.length}
                </span>
              )}
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Sign In
            </Link>

            <Link to="/register" className="nav-link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;

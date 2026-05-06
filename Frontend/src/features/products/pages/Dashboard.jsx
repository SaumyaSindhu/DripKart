import React, { useEffect } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import "./dashboard.scss";

const Dashboard = () => {
  const { handleGetSellerProducts } = useProduct();

  const sellerProducts = useSelector((state) => state.products.sellerProducts);

  const navigate = useNavigate();

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="dashboard-page">
        <div className="dashboard-container">
          {/* TOP BAR */}
          <div className="top-bar">
            <button onClick={() => navigate(-1)} className="back-btn">
              ←
            </button>

            <span className="brand-logo">DRIPKART.</span>
          </div>

          {/* HEADER */}
          <div className="dashboard-header">
            <div className="header-content">
              <h1>Your Vault</h1>

              <div className="gold-line"></div>
            </div>

            <button
              onClick={() => navigate("/seller/create-product")}
              className="new-listing-btn"
            >
              New Listing
            </button>
          </div>

          {/* PRODUCT GRID */}
          {sellerProducts && sellerProducts.length > 0 ? (
            <div className="product-grid">
              {sellerProducts.map((product) => {
                const imageUrl =
                  product.images && product.images.length > 0
                    ? product.images[0].url
                    : "/snitch_editorial_warm.png";

                return (
                  <div
                    key={product._id}
                    className="product-card"
                    onClick={() => navigate(`/seller/product/${product._id}`)}
                  >
                    {/* IMAGE */}
                    <div className="product-image">
                      <img src={imageUrl} alt={product.title} />
                    </div>

                    {/* DETAILS */}
                    <div className="product-details">
                      <h3>{product.title}</h3>

                      <p>{product.description}</p>

                      <span className="product-price">
                        {product.price?.currency}{" "}
                        {product.price?.amount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span>Empty Vault</span>

              <p>
                You haven't added any curated pieces to your archive yet. Begin
                by creating a new listing.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

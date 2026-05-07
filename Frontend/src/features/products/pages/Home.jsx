import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import { useNavigate } from "react-router";

import "./home.scss";

const Home = () => {
  const products = useSelector((state) => state.products.products);

  const user = useSelector((state) => state.auth.user);

  const { handleGetAllProducts } = useProduct();

  const navigate = useNavigate();

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="home-page">
        <div className="home-container">
          <div className="hero-section">
            <span className="hero-subtitle">The Collection</span>

            <h1 className="hero-title">Curated Archive</h1>

            <p className="hero-description">
              Discover our latest curation of premium minimalist pieces,
              meticulously designed for effortless elegance and enduring
              quality.
            </p>
          </div>

          {products && products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => {
                const imageUrl =
                  product.images && product.images.length > 0
                    ? product.images[0].url
                    : "/snitch_editorial_warm.png";

                return (
                  <div
                    key={product._id}
                    className="product-card"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <div className="product-image">
                      <img src={imageUrl} alt={product.title} />
                    </div>

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
              <h2>No pieces available.</h2>

              <p>
                We are currently preparing our next collection. Please check
                back later.
              </p>
            </div>
          )}
        </div>

        <footer className="home-footer">
          <span>Driptkart. © {new Date().getFullYear()}</span>
        </footer>
      </div>
    </>
  );
};

export default Home;

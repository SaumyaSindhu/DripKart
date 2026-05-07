import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";
import "./productDetails.scss";

const ProductDetail = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const { handleGetProductDetails } = useProduct();

  const navigate = useNavigate();

  async function fetchProductDetails() {
    try {
      setError("");
      const data = await handleGetProductDetails(productId);

      setProduct(data?.product || data);
    } catch (error) {
      console.error("Failed to fetch product details", error);
      setError("Unable to retrieve this piece.");
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (error) {
    return (
      <div className="loading-screen">
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="loading-screen">
        <p>Retrieving piece...</p>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: "/snitch_editorial_warm.png" }];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="product-detail-page">
        <nav className="product-navbar">
          <Link to="/" className="brand-logo">
            DRIPKART.
          </Link>

          <button onClick={() => navigate(-1)} className="back-link">
            Return to Archive
          </button>
        </nav>

        <div className="product-detail-container">
          <div className="product-layout">
            {/* LEFT SIDE */}
            <div className="gallery-section">
              {/* THUMBNAILS */}
              {images.length > 1 && (
                <div className="thumbnail-list">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`thumbnail ${
                        selectedImage === idx ? "active" : ""
                      }`}
                    >
                      <img src={img.url} alt={`View ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* MAIN IMAGE */}
              <div className="main-image-wrapper">
                <img
                  src={images[selectedImage]?.url || images[0].url}
                  alt={product.title}
                  className="main-image"
                />

                {images.length > 1 && (
                  <>
                    <button
                      className="nav-btn prev"
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1,
                        )
                      }
                    >
                      ←
                    </button>

                    <button
                      className="nav-btn next"
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1,
                        )
                      }
                    >
                      →
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="details-section">
              <h1 className="product-title">{product.title}</h1>

              <div className="product-price">
                {product.price?.currency}{" "}
                {product.price?.amount?.toLocaleString()}
              </div>

              <div className="divider"></div>

              {/* DESCRIPTION */}
              <div className="description-section">
                <h3>The Details</h3>

                <p>{product.description}</p>
              </div>

              {/* ACTIONS */}
              <div className="action-buttons">
                <button className="add-cart-btn">Add to Cart</button>

                <button className="buy-now-btn">Buy Now</button>
              </div>

              {/* EXTRA INFO */}
              <div className="extra-info">
                <div className="info-row">
                  <span>Shipping</span>
                  <span>Complimentary over INR 15,000</span>
                </div>

                <div className="info-row">
                  <span>Returns</span>
                  <span>Within 14 days of delivery</span>
                </div>

                <div className="info-row">
                  <span>Authenticity</span>
                  <span>100% Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;

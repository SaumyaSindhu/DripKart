import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../../cart/hook/useCart";
import "./productDetails.scss";

const ProductDetails = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const { handleGetProductDetails } = useProduct();
  const { handleAddItem } = useCart();

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

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedAttributes(product.variants[0].attributes || {});
    }
  }, [product]);

  const activeVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find((v) => {
      if (!v.attributes) return false;
      const vKeys = Object.keys(v.attributes);
      const sKeys = Object.keys(selectedAttributes);
      const isMatch = vKeys.every(
        (k) => v.attributes[k] === selectedAttributes[k],
      );
      // If they don't have exactly the same keys, they shouldn't perfectly match,
      // but we might only care about matching what's available.
      return vKeys.length === sKeys.length && isMatch;
    });
  }, [product, selectedAttributes]);

  const availableAttributes = useMemo(() => {
    if (!product?.variants) return {};
    const attrs = {};
    product.variants.forEach((variant) => {
      if (variant.attributes) {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          if (!attrs[key]) attrs[key] = new Set();
          attrs[key].add(value);
        });
      }
    });
    Object.keys(attrs).forEach((key) => {
      attrs[key] = Array.from(attrs[key]);
    });
    return attrs;
  }, [product]);

  useEffect(() => {
    setSelectedImage(0);
  }, [activeVariant]);

  const handleAttributeChange = (attrName, value) => {
    const newAttrs = { ...selectedAttributes, [attrName]: value };

    // Find if an exact match exists for this combination
    const exactMatch = product.variants.find((v) => {
      const vAttrs = v.attributes || {};
      return (
        Object.keys(newAttrs).every((k) => newAttrs[k] === vAttrs[k]) &&
        Object.keys(vAttrs).every((k) => newAttrs[k] === vAttrs[k])
      );
    });

    if (exactMatch) {
      setSelectedAttributes(exactMatch.attributes);
    } else {
      // Find any variant that has this newly selected attribute to fallback nicely
      const fallbackVariant = product.variants.find(
        (v) => v.attributes && v.attributes[attrName] === value,
      );
      if (fallbackVariant) {
        setSelectedAttributes(fallbackVariant.attributes);
      } else {
        setSelectedAttributes(newAttrs);
      }
    }
  };

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

  // Fallbacks
  const displayImages =
    activeVariant?.images && activeVariant.images.length > 0
      ? activeVariant.images
      : product.images && product.images.length > 0
        ? product.images
        : [{ url: "/snitch_editorial_warm.png" }];

  const displayPrice = activeVariant?.price?.amount
    ? activeVariant.price
    : product.price;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-layout">
            {/* LEFT SIDE */}
            <div className="gallery-section">
              {/* THUMBNAILS */}
              {displayImages.length > 1 && (
                <div className="thumbnail-list">
                  {displayImages.map((img, idx) => (
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
                  src={
                    displayImages[selectedImage]?.url || displayImages[0].url
                  }
                  alt={product.title}
                  className="main-image"
                />

                {displayImages.length > 1 && (
                  <>
                    <button
                      className="nav-btn prev"
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === 0 ? displayImages.length - 1 : prev - 1,
                        )
                      }
                    >
                      ←
                    </button>

                    <button
                      className="nav-btn next"
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === displayImages.length - 1 ? 0 : prev + 1,
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
                {displayPrice?.currency}{" "}
                {displayPrice?.amount?.toLocaleString()}
              </div>

              {/* Options / Variants */}
              {Object.entries(availableAttributes).map(([attrName, values]) => (
                <div key={attrName} className="variant-group">
                  <h3>{attrName}</h3>

                  <div className="variant-options">
                    {values.map((val) => {
                      const isSelected = selectedAttributes[attrName] === val;

                      return (
                        <button
                          key={val}
                          onClick={() => handleAttributeChange(attrName, val)}
                          className={`variant-btn ${
                            isSelected ? "selected" : ""
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Stock Information */}
              {activeVariant && activeVariant.stock !== undefined && (
                <div className="stock-info">
                  <span
                    className={
                      activeVariant.stock > 0 ? "in-stock" : "out-stock"
                    }
                  >
                    {activeVariant.stock > 0
                      ? `${activeVariant.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              )}

              <div className="divider"></div>

              {/* DESCRIPTION */}
              <div className="description-section">
                <h3>The Details</h3>

                <p>{product.description}</p>
              </div>

              {/* ACTIONS */}
              <div className="action-buttons">
                <button 
                  className="add-cart-btn" 
                  onClick={() => { 
                    handleAddItem({
                      productId: product._id,
                      variantId: activeVariant._id
                    })
                  }}
                  >
                    Add to Cart
                </button>

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
};;

export default ProductDetails;

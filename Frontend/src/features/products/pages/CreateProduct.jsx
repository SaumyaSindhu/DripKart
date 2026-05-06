import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";
import "./createProduct.scss";

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const MAX_IMAGES = 7;

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addFiles = (files) => {
    const remaining = MAX_IMAGES - images.length;

    if (remaining <= 0) return;

    const toAdd = Array.from(files).slice(0, remaining);

    const newImages = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();

      setIsDragging(false);

      if (e.dataTransfer.files.length) {
        addFiles(e.dataTransfer.files);
      }
    },
    [images],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];

      URL.revokeObjectURL(updated[index].preview);

      updated.splice(index, 1);

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);

      images.forEach((img) => {
        data.append("images", img.file);
      });

      await handleCreateProduct(data);

      navigate("/seller/Dashboard");
    } catch (err) {
      console.error("Failed to create product", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="create-product-page">
        <div className="create-product-container">
          {/* TOP BAR */}
          <div className="top-bar">
            <button onClick={() => navigate(-1)} className="back-btn">
              ←
            </button>

            <span className="brand-logo">DRIPKART.</span>
          </div>

          {/* HEADER */}
          <div className="page-header">
            <h1>New Listing</h1>

            <div className="gold-line"></div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-grid">
              {/* LEFT SIDE */}
              <div className="left-column">
                {/* TITLE */}
                <div className="form-group">
                  <label htmlFor="cp-title">Product Title</label>

                  <input
                    id="cp-title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Oversized Linen Shirt"
                    required
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="form-group">
                  <label htmlFor="cp-description">Description</label>

                  <textarea
                    id="cp-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe the product — material, fit, details..."
                  />
                </div>

                {/* PRICE */}
                <div className="price-group">
                  <label>Price</label>

                  <div className="price-fields">
                    <div className="amount-field">
                      <span>Amount</span>

                      <input
                        type="number"
                        name="priceAmount"
                        value={formData.priceAmount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="currency-field">
                      <span>Currency</span>

                      <select
                        name="priceCurrency"
                        value={formData.priceCurrency}
                        onChange={handleChange}
                      >
                        {CURRENCIES.map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="right-column">
                <div className="image-header">
                  <label>Images</label>

                  <span>
                    {images.length}/{MAX_IMAGES}
                  </span>
                </div>

                {/* DROP ZONE */}
                {images.length < MAX_IMAGES && (
                  <div
                    className={`drop-zone ${isDragging ? "dragging" : ""}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="upload-icon">↑</div>

                    <div className="drop-content">
                      <p>
                        Drop images here or
                        <span> tap to upload</span>
                      </p>

                      <small>Up to {MAX_IMAGES} images</small>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      hidden
                    />
                  </div>
                )}

                {/* PREVIEWS */}
                {images.length > 0 && (
                  <div className="preview-grid">
                    {images.map((img, index) => (
                      <div key={index} className="preview-card">
                        <img src={img.preview} alt={`Preview ${index + 1}`} />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SUBMIT */}
            <div className="submit-wrapper">
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-btn"
              >
                {isSubmitting ? "Publishing..." : "Publish Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;

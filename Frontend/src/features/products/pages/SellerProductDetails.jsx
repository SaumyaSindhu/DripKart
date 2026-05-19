import React, { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useParams } from "react-router";
import "./sellerProductDetails.scss";

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>

    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const SellerProductDetails = () => {
  const [product, setProduct] = useState(null);

  const [localVariants, setLocalVariants] = useState([]);

  const [isAddingVariant, setIsAddingVariant] = useState(false);

  const [loading, setLoading] = useState(true);

  const [attributeInputs, setAttributeInputs] = useState([
    { key: "", value: "" },
  ]);

  const [newVariant, setNewVariant] = useState({
    images: [],
    stock: 0,
    attributes: {},
    price: {
      amount: "",
      currency: "INR",
    },
  });

  const { productId } = useParams();

  const { handleGetProductDetails, handleAddProductVariant } = useProduct();

  async function fetchProductDetails() {
    setLoading(true);

    try {
      const data = await handleGetProductDetails(productId);

      const prod = data?.product || data;

      setProduct(prod);

      if (prod?.variants) {
        setLocalVariants(prod.variants);
      }
    } catch (error) {
      console.error("Failed to fetch product details", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleStockChange = (index, newStock) => {
    const updatedVariants = [...localVariants];

    updatedVariants[index] = {
      ...updatedVariants[index],
      stock: Number(newStock),
    };

    setLocalVariants(updatedVariants);
  };

  const handleAddNewVariant = async () => {
    const hasValidAttribute = attributeInputs.some(
      (attr) => attr.key.trim() && attr.value.trim(),
    );

    if (!hasValidAttribute) {
      alert("At least one valid attribute is required.");

      return;
    }

    const cleanImages = newVariant.images.map((img) => ({
      url: img.previewUrl,
      file: img.file,
    }));

    const cleanAttributes = {
      ...newVariant.attributes,
    };

    const variantToSave = {
      images: cleanImages,
      stock: Number(newVariant.stock),
      attributes: cleanAttributes,
      price: newVariant.price.amount
        ? Number(newVariant.price.amount)
        : undefined, // price is optional
    };
    
    setLocalVariants([...localVariants, variantToSave]);
    
    setIsAddingVariant(false);
    
    await handleAddProductVariant(productId, variantToSave);
    

    setAttributeInputs([{ key: "", value: "" }]);

    setNewVariant({
      images: [],
      stock: 0,
      attributes: {},
      price: {
        amount: "",
        currency: "INR",
      },
    });
  };

  const handleAddAttribute = () => {
    setAttributeInputs(prev => [...prev, { key: "", value: "" }]);
  };

  const handleAttributeChange = (index, field, value) => {
    const updatedInputs = [...attributeInputs];

    updatedInputs[index][field] = value;

    setAttributeInputs(updatedInputs);

    const newAttrsObj = {};

    updatedInputs.forEach(attr => {
      if (attr.key.trim() !== "") {
        newAttrsObj[attr.key.trim()] = attr.value;
      }
    });

    setNewVariant(prev => ({
      ...prev,
      attributes: newAttrsObj,
    }));
  };

  const handleRemoveAttribute = (index) => {
    const updatedInputs = attributeInputs.filter((_, i) => i !== index);

    setAttributeInputs(updatedInputs);

    const newAttrsObj = {};

    updatedInputs.forEach(attr => {
      if (attr.key.trim() !== "") {
        newAttrsObj[attr.key.trim()] = attr.value;
      }
    });

    setNewVariant((prev) => ({
      ...prev,
      attributes: newAttrsObj,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const availableSlots = 7 - newVariant.images.length;

    const filesToAdd = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      alert(`You can only upload up to 7 images. ${filesToAdd.length} added.`);
    }

    const newImageObjects = filesToAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewVariant((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageObjects],
    }));

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = newVariant.images[index];

    if (imageToRemove?.previewUrl) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    const updatedImages = newVariant.images.filter((_, i) => i !== index);

    setNewVariant((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  if (loading) {
    return <div className="loading-screen">Loading gallery...</div>;
  }

  if (!product) {
    return <div className="loading-screen">Product Not Found</div>;
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="seller-product-page">
        {/* HEADER */}
        <header className="seller-header">
          <h1>
            {product.title?.substring(0, 20)}

            {product.title?.length > 20 ? "..." : ""}
          </h1>
        </header>

        <main className="seller-main">
          {/* PRODUCT INFO */}
          <section className="product-info-section">
            <div className="product-gallery">
              <div className="main-product-image">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0].url} alt={product.title} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="thumbnail-row">
                  {product.images.slice(1).map((img, i) => (
                    <img key={i} src={img.url} alt={`Thumb ${i}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="product-meta">
              <h2>{product.title}</h2>

              <p>{product.description}</p>

              <div className="base-price">
                {product.price?.amount} {product.price?.currency}
              </div>
            </div>
          </section>

          {/* VARIANTS */}
          <section className="variant-section">
            <div className="variant-header">
              <h3>Variants & Inventory</h3>

              {!isAddingVariant && (
                <button
                  onClick={() => setIsAddingVariant(true)}
                  className="add-variant-btn"
                >
                  <PlusIcon />
                  Add New Variant
                </button>
              )}
            </div>

            {/* ADD FORM */}
            {isAddingVariant && (
              <div className="variant-form">
                <div className="form-top">
                  <h4>Create Variant</h4>

                  <button
                    onClick={() => setIsAddingVariant(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>

                <div className="variant-form-grid">
                  {/* LEFT */}
                  <div className="left-form">
                    {/* ATTRIBUTES */}
                    <div className="attribute-group">
                      <label>Attributes (E.G. SIZE, COLOR)*</label>

                      <div className="attribute-list">
                        {attributeInputs.map((attr, index) => (
                          <div key={index} className="attribute-row">
                            <input
                              type="text"
                              placeholder="Key"
                              value={attr.key}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  "key",
                                  e.target.value,
                                )
                              }
                            />

                            <input
                              type="text"
                              placeholder="Value"
                              value={attr.value}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  "value",
                                  e.target.value,
                                )
                              }
                            />

                            {attributeInputs.length > 1 && (
                              <button
                                onClick={() => handleRemoveAttribute(index)}
                                className="remove-attribute-btn"
                              >
                                <TrashIcon />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleAddAttribute}
                        className="add-attribute-btn"
                      >
                        <PlusIcon />
                        Add Attribute
                      </button>
                    </div>

                    {/* STOCK */}
                    <div className="stock-price-row">
                      <div className="input-group">
                        <label>Initial Stock</label>

                        <input
                          type="number"
                          value={newVariant.stock}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              stock: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="input-group">
                        <label>Price amount (Optional)</label>

                        <input
                          type="number"
                          value={newVariant.price.amount}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              price: {
                                ...newVariant.price,
                                amount: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="right-form">
                    <div className="upload-header">
                      <label>Image Upload</label>

                      <span>
                        {newVariant.images.length}
                        /7
                      </span>
                    </div>

                    {/* PREVIEW */}
                    {newVariant.images.length > 0 && (
                      <div className="preview-grid">
                        {newVariant.images.map((img, index) => (
                          <div key={index} className="preview-card">
                            <img src={img.previewUrl} alt="Preview" />

                            <button onClick={() => handleRemoveImage(index)}>
                              <TrashIcon />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* INPUT */}
                    {newVariant.images.length < 7 && (
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="file-input"
                      />
                    )}
                  </div>
                </div>

                <div className="save-wrapper">
                  <button onClick={handleAddNewVariant} className="save-btn">
                    Save Variant
                  </button>
                </div>
              </div>
            )}

            {/* VARIANT LIST */}
            {localVariants.length === 0 ? (
              <div className="empty-variants">
                No variants have been created yet.
              </div>
            ) : (
              <div className="variant-grid">
                {localVariants.map((variant, idx) => (
                  <div key={idx} className="variant-card">
                    <div className="variant-content">
                      <div className="variant-thumb">
                        {variant.images && variant.images.length > 0 ? (
                          <img src={variant.images[0].url} alt="Variant" />
                        ) : (
                          <div className="no-image">N/A</div>
                        )}
                      </div>

                      <div className="variant-details">
                        <div className="attribute-tags">
                          {Object.entries(variant.attributes || {}).map(
                            ([key, val]) => (
                              <span key={key}>
                                <strong>{key}:</strong> {val}
                              </span>
                            ),
                          )}
                        </div>

                        <div className="variant-price">
                          {variant.price?.amount
                            ? `${variant.price.amount} ${variant.price.currency}`
                            : "Base Price"}
                        </div>
                      </div>
                    </div>

                    {/* STOCK */}
                    <div className="variant-stock">
                      <label>Current Stock</label>

                      <input
                        type="number"
                        value={variant.stock || 0}
                        onChange={(e) => handleStockChange(idx, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default SellerProductDetails;

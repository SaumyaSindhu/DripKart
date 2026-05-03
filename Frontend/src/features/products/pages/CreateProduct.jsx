import { useEffect, useMemo, useState } from "react";
import { useProduct } from "../hook/useProduct.js";
import "./createProduct.scss";

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imagePreviews = useMemo(
    () =>
      images.map((image) => ({
        name: image.name,
        size: image.size,
        url: URL.createObjectURL(image),
      })),
    [images],
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [imagePreviews]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const selectedImages = Array.from(event.target.files || []);

    setImages((currentImages) => {
      const nextImages = [...currentImages, ...selectedImages].slice(0, 7);

      if (currentImages.length + selectedImages.length > 7) {
        setStatus({
          type: "warning",
          message: "You can upload a maximum of 7 product images.",
        });
      } else {
        setStatus({
          type: "",
          message: "",
        });
      }

      return nextImages;
    });

    event.target.value = "";
  };

  const handleRemoveImage = (imageIndex) => {
    setImages((currentImages) =>
      currentImages.filter((_, index) => index !== imageIndex),
    );
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setIsSubmitting(true);

    setStatus({
      type: "",
      message: "",
    });

    try {
      const productData = new FormData();

      productData.append("title", formData.title.trim());
      productData.append("description", formData.description.trim());
      productData.append("priceAmount", Number(formData.priceAmount));
      productData.append("priceCurrency", formData.priceCurrency);
      images.forEach((image) => productData.append("images", image));

      await handleCreateProduct(productData);

      setFormData({
        title: "",
        description: "",
        priceAmount: "",
        priceCurrency: "INR",
      });
      setImages([]);
      setStatus({
        type: "success",
        message: "Product created successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Product could not be created. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="create-product-page">
      <section className="create-product-shell" aria-labelledby="product-title">
        <div className="create-product-hero">
          <p className="create-product-hero__eyebrow">Seller Studio</p>
          <h1 id="product-title">Create a premium product drop</h1>
          <p>
            Add sharp details, polished pricing, and a gallery that makes your
            product feel ready for the spotlight.
          </p>

          <div className="create-product-hero__metrics" aria-label="Product setup summary">
            <span>{images.length}/7 images</span>
            <span>{formData.priceCurrency}</span>
            <span>Live preview</span>
          </div>
        </div>

        <form className="create-product-form" onSubmit={handleSubmit}>
          <div className="create-product-form__grid">
            <section className="product-panel product-panel--details">
              <div className="product-panel__header">
                <span>01</span>
                <div>
                  <h2>Product details</h2>
                  <p>Keep the title clean and the description persuasive.</p>
                </div>
              </div>

              <label className="product-field">
                <span>Product title</span>
                <input
                  type="text"
                  name="title"
                  placeholder="Oversized cotton streetwear hoodie"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </label>

              <label className="product-field">
                <span>Description</span>
                <textarea
                  name="description"
                  placeholder="Describe the fit, fabric, finish, and why shoppers will want it."
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={1000}
                  rows={8}
                  required
                />
              </label>
            </section>

            <section className="product-panel product-panel--pricing">
              <div className="product-panel__header">
                <span>02</span>
                <div>
                  <h2>Price</h2>
                  <p>Set a clear amount and supported currency.</p>
                </div>
              </div>

              <div className="product-price-row">
                <label className="product-field">
                  <span>Amount</span>
                  <input
                    type="number"
                    name="priceAmount"
                    placeholder="2499"
                    value={formData.priceAmount}
                    onChange={handleChange}
                    min="1"
                    step="0.01"
                    required
                  />
                </label>

                <label className="product-field">
                  <span>Currency</span>
                  <select
                    name="priceCurrency"
                    value={formData.priceCurrency}
                    onChange={handleChange}
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="product-panel product-panel--images">
              <div className="product-panel__header">
                <span>03</span>
                <div>
                  <h2>Images</h2>
                  <p>Upload up to 7 images. Selected files appear below.</p>
                </div>
              </div>

              <label className="product-upload">
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={images.length >= 7}
                />
                <span className="product-upload__icon" aria-hidden="true">
                  +
                </span>
                <strong>Choose product images</strong>
                <small>PNG, JPG, WEBP. Maximum 5MB each.</small>
              </label>

              <div className="product-preview" aria-live="polite">
                <div className="product-preview__header">
                  <h3>Preview</h3>
                  <span>{images.length} selected</span>
                </div>

                {imagePreviews.length > 0 ? (
                  <div className="product-preview__grid">
                    {imagePreviews.map((image, index) => (
                      <article className="product-preview__item" key={image.url}>
                        <img src={image.url} alt={`Selected product ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          aria-label={`Remove ${image.name}`}
                        >
                          Remove
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="product-preview__empty">
                    <span aria-hidden="true" />
                    <p>Your selected images will preview here.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {status.message && (
            <p className={`create-product-status create-product-status--${status.type}`}>
              {status.message}
            </p>
          )}

          <div className="create-product-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateProduct;

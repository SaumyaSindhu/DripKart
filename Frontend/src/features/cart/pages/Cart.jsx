import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hook/useCart";
import { Link, useNavigate } from "react-router";

import "./cart.scss";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);

  const { handleGetCart, handleIncrementCartItem } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    handleGetCart();
  }, [handleGetCart]);

  const getVariantDetails = (product, variantId) => {
    if (!product?.variants || !variantId) return null;

    return product.variants.find((variant) => variant._id === variantId);
  };

  const getDisplayImage = (product, variant) => {
    if (variant?.images?.length) {
      return variant.images[0].url;
    }

    if (product?.images?.length) {
      return product.images[0].url;
    }

    return null;
  };

  const formatCurrency = (amount, currency = "INR") =>
    `${currency} ${Number(amount).toLocaleString("en-IN")}`;

  if (!cartItems?.length) {
    return (
      <div className="cart-empty-page">
        <nav className="cart-navbar">
          <Link to="/" className="brand-logo">
            Snitch.
          </Link>

          <button onClick={() => navigate(-1)} className="back-btn">
            Return to Archive
          </button>
        </nav>

        <div className="empty-content">
          <h1>Your selection is empty.</h1>

          <p>Curate your collection</p>

          <Link to="/" className="explore-btn">
            Explore the Archive
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((acc, item) => {
    const amount = item.price?.amount || item.product?.price?.amount || 0;

    return acc + amount * (item.quantity || 1);
  }, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* LEFT */}
        <div className="cart-left">
          <div className="cart-heading">
            <h1>Your Selection</h1>

            <p>
              {cartItems.length} {cartItems.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          <div className="cart-list">
            {cartItems.map((item) => {
              const { _id: cartItemId, product, variant: variantId, price } = item;
              const productId = product?._id;

              const variantDetail = getVariantDetails(product, variantId);

              const imageUrl = getDisplayImage(product, variantDetail);

              const displayPrice =
                price || variantDetail?.price || product?.price;

              const qty = item.quantity || 1;

              const attributes = variantDetail?.attributes || {};

              return (
                <div key={cartItemId} className="cart-card">
                  <div className="product-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product?.title} />
                    ) : (
                      <div className="image-placeholder"></div>
                    )}
                  </div>

                  <div className="product-info">
                    <div>
                      <h2>{product?.title}</h2>

                      {Object.keys(attributes).length > 0 && (
                        <div className="attribute-list">
                          {Object.entries(attributes).map(([key, val]) => (
                            <span key={key}>{val}</span>
                          ))}
                        </div>
                      )}

                      <p className="price">
                        {displayPrice
                          ? formatCurrency(
                              displayPrice.amount,
                              displayPrice.currency,
                            )
                          : "—"}
                      </p>
                    </div>

                    <div className="bottom-row">
                      <div className="qty-box">
                        <button type="button" disabled>-</button>

                        <span>{qty}</span>

                        <button onClick={() => handleIncrementCartItem({ productId, variantId })}>+</button>
                      </div>

                      <button className="remove-btn">Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="cart-right">
          <div className="summary-box">
            <h2>The Total</h2>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>

              <span>
                {subtotal >= 15000 ? "Complimentary" : "Calculated later"}
              </span>
            </div>

            <div className="summary-total">
              <span>Total</span>

              <span>{formatCurrency(subtotal)}</span>
            </div>

            <button className="checkout-btn">Proceed to Checkout</button>

            <button className="continue-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


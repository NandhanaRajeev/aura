import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../Components/LandingPage/CartPage/CartContext";
import { useWishlist } from "../../Components/LandingPage/Wishlist/WishlistContext";
import "./ProductDetail.css";
import {
  MdVerifiedUser,
  MdOutlineLocalShipping,
  MdReplay,
} from "react-icons/md";

const ProductDetail = () => {
  const { state } = useLocation();
  const product = state?.product;
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");

  if (!product) return <p>Product not found</p>;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent event propagation

    // Ensure no wishlist logic is triggered
    const item = {
      id: product.id,
      image: product.img,
      title: product.title,
      star: product.star,
      reviews: product.reviews,
      prevPrice: product.prevPrice,
      price: product.newPrice,
      quantity,
      size,
    };
    addToCart(item);
    alert("Item added to cart!");
  };

  const handleBuyNow = () => {
    const item = {
      id: product.id,
      image: product.img,
      title: product.title,
      star: product.star,
      reviews: product.reviews,
      prevPrice: product.prevPrice,
      price: product.newPrice,
      quantity,
      size,
    };
    addToCart(item);
    navigate("/cart"); // Redirect to cart
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault(); // Prevent event bubbling and triggering cart logic
    e.stopPropagation(); // Ensure no other events fire

    // Only trigger wishlist logic
    const item = {
      id: product.id,
      image: product.img,
      title: product.title,
      star: product.star,
      reviews: product.reviews,
      prevPrice: product.prevPrice,
      price: product.newPrice,
      size: size,
    };

    try {
      await addToWishlist(item); // Only add to wishlist
      alert("Item added to wishlist!");
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      alert(error.message || "Failed to add item to wishlist.");
    }
  };

  return (
    <div className="product-detail">
      <img src={product.img} alt={product.title} />
      <div className="product-info">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-rating">Rating: {product.star} ★</p>
        <p className="product-reviews">Reviews: ({product.reviews} reviews)</p>
        <p className="product-price">
          <del>{product.prevPrice}</del>
          <strong>{product.newPrice}</strong>
        </p>

        <div className="product-options">
          <label>Size:</label>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>

        <div className="action-buttons">
          {/* Add to Cart Button */}
          <button type="button" className="add-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {/* View Cart Button */}
          <button type="button" className="buy-btn" onClick={handleBuyNow}>
            View Cart
          </button>

          {/* Add to Wishlist Button */}
          <button
            type="button"
            className="addwishlist-btn"
            onClick={handleAddToWishlist}
          >
            Wishlist
          </button>
        </div>

        {/* Trust Badges Section */}
        <div className="trust-badges">
          <div className="badge">
            <MdVerifiedUser className="badge-icon" />
            <p>Authenticity Guaranteed – 100% original and verified products.</p>
          </div>
          <div className="badge">
            <MdOutlineLocalShipping className="badge-icon" />
            <p>Cash on Delivery – Pay after you receive your product.</p>
          </div>
          <div className="badge">
            <MdReplay className="badge-icon" />
            <p>Easy Returns – Return within 7 days with no hassle.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

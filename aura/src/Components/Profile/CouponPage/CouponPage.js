import React, { useState } from "react";
import "./CouponPage.css"; // Import CSS

const CouponPage = () => {
  const [coupons] = useState([
    { id: 1, title: "🔥 20% OFF", description: "On your next purchase!", code: "SAVE20", discount: "20%" },
    { id: 2, title: "🚚 Free Shipping", description: "On orders above ₹999", code: "FREESHIP", discount: "₹0 Delivery" },
    { id: 3, title: "💰 Flat ₹100 OFF", description: "On orders above ₹500", code: "FLAT100", discount: "₹100 OFF" },
    { id: 4, title: "🎉 Buy 1 Get 1", description: "On selected products", code: "BOGO", discount: "BOGO Offer" },
    { id: 5, title: "💸 ₹200 Cashback", description: "Via Wallet Payment", code: "CASHBACK200", discount: "₹200 Cashback" },
  ]);

  return (
    <div className="coupon-page">
      <div className="coupon-content">
        <h2>🎁 Exclusive Coupons Just for You!</h2>
        <p className="sub-text">Save more on your next shopping spree! 🛍️</p>

        <div className="coupon-list">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="coupon">
              <h3>{coupon.title}</h3>
              <p>{coupon.description}</p>
              <p className="discount">{coupon.discount}</p>
              <div className="coupon-footer">
                <span className="coupon-code">{coupon.code}</span>
                <button className="redeem-btn">Redeem</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponPage;

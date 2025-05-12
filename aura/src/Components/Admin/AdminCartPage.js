import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);
  const [newSize, setNewSize] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch cart items when the component mounts
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin-cart",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCartItems(response.data);
      } catch (err) {
        setError("Error fetching cart data");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // Add item to cart (Admin)
  const addItemToCart = async (productId, userId, size) => {
    setIsAdding(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin-cart/add-to-cart",
        { product_id: productId, user_id: userId, size, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        setCartItems((prevItems) => [
          ...prevItems,
          {
            product_id: productId,
            user_id: userId,
            size,
            quantity: 1,
            title: "New Item",
            price: 20,
            img: "",
          },
        ]);
        alert("Item added to cart successfully!");
      }
    } catch (err) {
      setError("Error adding item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  // Remove item from cart
  const removeItemFromCart = async (productId, userId, size) => {
    const uniqueId = `${userId}-${productId}-${size}`;
    setRemovingItems((prev) => new Set(prev.add(uniqueId)));

    try {
      await axios.delete(
        `http://localhost:3000/api/admin-cart/remove/${userId}/${productId}?size=${size}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setCartItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.product_id === productId &&
              item.user_id === userId &&
              item.size === size
            )
        )
      );
    } catch (err) {
      setError("Error removing item from cart");
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(uniqueId);
        return newSet;
      });
    }
  };

  // Update item in cart (Admin)
  const updateCartItem = async () => {
    const { user_id, product_id, size } = editingItem;

    try {
      const response = await axios.put(
        "http://localhost:3000/api/admin-cart/update",
        { user_id, product_id, size, quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.user_id === user_id &&
            item.product_id === product_id &&
            item.size === size
              ? { ...item, quantity: newQuantity, size: newSize }
              : item
          )
        );
        alert("Item updated successfully!");
        setShowModal(false);
      }
    } catch (err) {
      setError("Error updating cart item");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Cart Management</h1>

      {/* <button
        onClick={() => addItemToCart("newProductId", "newUserId", "newSize")}
        style={addButtonStyle}
        disabled={isAdding}
      >
        {isAdding ? "Adding..." : "Add New Item to Cart"}
      </button> */}

      {cartItems.length === 0 ? (
        <p>No cart items found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>User ID</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Size</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={`${item.user_id}-${item.product_id}-${item.size}`}>
                <td style={tdStyle}>{item.user_id}</td>
                <td style={tdStyle}>{item.title}</td>
                <td style={tdStyle}>{item.quantity}</td>
                <td style={tdStyle}>{item.size}</td>
                <td style={tdStyle}>${item.price}</td>
                <td style={tdStyle}>
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td style={tdStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      style={deleteButtonStyle}
                      onClick={() =>
                        removeItemFromCart(
                          item.product_id,
                          item.user_id,
                          item.size
                        )
                      }
                    >
                      {removingItems.has(
                        `${item.user_id}-${item.product_id}-${item.size}`
                      )
                        ? "Removing..."
                        : "Delete"}
                    </button>
                    <button
                      style={buttonStyle}
                      onClick={() => {
                        setEditingItem(item);
                        setNewSize(item.size);
                        setNewQuantity(item.quantity);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
  <div style={modalOverlayStyle}>
    <div style={modalBoxStyle}>
      <h2>Edit Item</h2>
      <label style={labelStyle}>
        Quantity:
        <input
          type="number"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
          style={inputStyle}
        />
      </label>
      <label style={labelStyle}>
        Size:
        <input
          type="text"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          style={inputStyle}
        />
      </label>
      <div style={{ marginTop: "20px" }}>
        <button onClick={updateCartItem} disabled={isAdding} style={saveButtonStyle}>
          Save Changes
        </button>
        <button onClick={() => setShowModal(false)} style={cancelButtonStyle}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

const addButtonStyle = {
  padding: "6px 12px",
  backgroundColor: "#9C7B79",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginBottom: "20px",
};
const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f9f9f9",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

const buttonStyle = {
  marginRight: "5px",
  padding: "5px 10px",
  backgroundColor: "#9C7B79",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const deleteButtonStyle = {
  padding: "5px 12px",
  backgroundColor: "#e74c3c", // Red color for Delete button
  color: "#fff",
  border: "none",
  borderRadius: "3px",
  cursor: "pointer",
  transition: "background-color 0.3s",
  marginRight: "8px", // ✅ Add space to the right
};
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalBoxStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "8px",
  width: "300px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
};

const labelStyle = {
  display: "block",
  marginBottom: "15px",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const saveButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#2ecc71",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "10px",
};

const cancelButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default AdminCartPage;

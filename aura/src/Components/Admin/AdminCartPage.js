import React, { useState, useEffect } from "react";
import axios from "axios";
import SERVER_URL from '../../config';

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

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/admin-cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCartItems(response.data);
      } catch (err) {
        setError("Error fetching cart data");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const addItemToCart = async (productId, userId, size) => {
    setIsAdding(true);
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/admin-cart/add-to-cart`,
        { product_id: productId, user_id: userId, size, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

  const removeItemFromCart = async (productId, userId, size) => {
    const uniqueId = `${userId}-${productId}-${size}`;
    setRemovingItems((prev) => new Set(prev.add(uniqueId)));

    try {
      await axios.delete(
        `${SERVER_URL}/api/admin-cart/remove/${userId}/${productId}?size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCartItems((prevItems) =>
        prevItems.filter(
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

  const updateCartItem = async () => {
    const { user_id, product_id, size } = editingItem;

    try {
      const response = await axios.put(
        `${SERVER_URL}/api/admin-cart/update`,
        { user_id, product_id, size, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Cart Management</h1>

      {cartItems.length === 0 ? (
        <p>No cart items found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Size</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={`${item.user_id}-${item.product_id}-${item.size}`}>
                <td>{item.user_id}</td>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>{item.size}</td>
                <td>${item.price}</td>
                <td>
                  {item.img ? (
                    <img src={item.img} alt={item.title} style={{ width: 50, height: 50, objectFit: "cover" }} />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => removeItemFromCart(item.product_id, item.user_id, item.size)}
                    disabled={removingItems.has(`${item.user_id}-${item.product_id}-${item.size}`)}
                  >
                    {removingItems.has(`${item.user_id}-${item.product_id}-${item.size}`) ? "Removing..." : "Delete"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setNewSize(item.size);
                      setNewQuantity(item.quantity);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal">
          <h3>Edit Cart Item</h3>
          <label>Quantity</label>
          <input type="number" value={newQuantity} onChange={(e) => setNewQuantity(Number(e.target.value))} />
          <label>Size</label>
          <input type="text" value={newSize} onChange={(e) => setNewSize(e.target.value)} />
          <button onClick={updateCartItem}>Update</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminCartPage;

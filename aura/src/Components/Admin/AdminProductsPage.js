// src/components/Admin/AdminProductsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import SERVER_URL from "../../config";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    img: "", title: "", star: "", reviews: "",
    prev_price: "", new_price: "", company: "",
    color: "", category: "",
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/admin-products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProducts(res.data);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    setRemoving(productId);
    try {
      await axios.delete(`${SERVER_URL}/api/admin-products/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      setError("Failed to delete product");
    } finally {
      setRemoving(null);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${SERVER_URL}/api/admin-products`, newProduct, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts([...products, { ...newProduct, id: res.data.id || Date.now() }]);
      setNewProduct({
        img: "", title: "", star: "", reviews: "",
        prev_price: "", new_price: "", company: "",
        color: "", category: "",
      });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to add product");
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${SERVER_URL}/api/admin-products/${editProduct.id}`, editProduct, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(products.map(p => p.id === editProduct.id ? editProduct : p));
      setShowEditModal(false);
      setEditProduct(null);
    } catch (err) {
      console.error(err);
      setError("Failed to edit product");
    }
  };

  const parsePrice = (price) => {
    return typeof price === 'string' ? price.replace(/[^\d.]/g, '') : price;
  };

  const formatPrice = (price) => {
    const parsed = parseFloat(parsePrice(price));
    return isNaN(parsed) ? '' : `$${parsed.toFixed(2)}`;
  };

  const handleEditChange = (e, key) => {
    const value = e.target.value;
    setEditProduct((prev) => ({
      ...prev,
      [key]: ["star", "prev_price", "new_price"].includes(key)
        ? parsePrice(value)
        : value
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Product Management</h1>
      <button style={addButtonStyle} onClick={() => setShowAddModal(true)}>+ Add Product</button>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Previous Price</th>
            <th style={thStyle}>New Price</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={tdStyle}>{p.id}</td>
              <td style={tdStyle}>{p.title}</td>
              <td style={tdStyle}>{formatPrice(p.prev_price)}</td>
              <td style={tdStyle}>{formatPrice(p.new_price)}</td>
              <td style={tdStyle}>{p.category}</td>
              <td style={tdStyle}>
                {p.img ? <img src={p.img} alt={p.title} style={{ width: 50, height: 50 }} /> : "No image"}
              </td>
              <td style={tdStyle}>
                <button
                  style={deleteButtonStyle}
                  onClick={() => window.confirm("Are you sure?") && deleteProduct(p.id)}
                  disabled={removing === p.id}
                >
                  {removing === p.id ? "Deleting..." : "Delete"}
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => { setEditProduct({ ...p }); setShowEditModal(true); }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Modal */}
      {showAddModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Add Product</h2>
            <form onSubmit={handleAddProduct} style={{ display: "grid", gap: 10 }}>
              {Object.keys(newProduct).map((key) => (
                <input
                  key={key}
                  type="text"
                  name={key}
                  placeholder={key.toUpperCase()}
                  value={newProduct[key]}
                  onChange={(e) => setNewProduct({ ...newProduct, [key]: e.target.value })}
                  required
                />
              ))}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" style={addButtonStyle}>Add</button>
                <button type="button" onClick={() => setShowAddModal(false)} style={cancelButtonStyle}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editProduct && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Edit Product</h2>
            <form onSubmit={handleEditProduct} style={{ display: "grid", gap: 10 }}>
              {Object.keys(editProduct).filter(k => k !== "id").map((key) => (
                <input
                  key={key}
                  type="text"
                  name={key}
                  placeholder={key.toUpperCase()}
                  value={["star", "prev_price", "new_price"].includes(key) ? formatPrice(editProduct[key]) : editProduct[key]}
                  onChange={(e) => handleEditChange(e, key)}
                  required
                />
              ))}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" style={addButtonStyle}>Save</button>
                <button type="button" onClick={() => setShowEditModal(false)} style={cancelButtonStyle}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// CSS styles
const thStyle = { border: "1px solid #ccc", padding: "10px", background: "#f4f4f4" };
const tdStyle = { border: "1px solid #ccc", padding: "10px" };
const buttonStyle = { marginRight: "5px", padding: "5px 10px", background: "#9C7B79", color: "#fff", border: "none", borderRadius: "4px" };
const deleteButtonStyle = { ...buttonStyle, background: "#e74c3c" };
const addButtonStyle = { ...buttonStyle, background: "#2ecc71" };
const cancelButtonStyle = { ...buttonStyle, background: "#7f8c8d" };
const modalOverlay = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center"
};
const modalBox = {
  backgroundColor: "#fff", padding: "20px", borderRadius: "8px", width: "400px"
};

export default AdminProductsPage;

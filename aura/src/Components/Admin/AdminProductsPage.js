import React, { useEffect, useState } from "react";
import axios from "axios";

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
        const res = await axios.get("http://localhost:3000/api/admin-products", {
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
      await axios.delete(`http://localhost:3000/api/admin-products/${productId}`, {
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
      const res = await axios.post("http://localhost:3000/api/admin-products", newProduct, {
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
      await axios.put(`http://localhost:3000/api/admin-products/${editProduct.id}`, editProduct, {
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

  // Helper functions for parsing and formatting prices
  const parsePrice = (price) => {
    if (typeof price === 'string') {
      return price.replace(/[^\d.-]/g, ''); // Remove non-numeric characters except "."
    }
    return price;
  };

  const formatPrice = (price) => {
    const parsedPrice = parseFloat(parsePrice(price));
    return isNaN(parsedPrice) ? '' : `$${parsedPrice.toFixed(2)}`; // Format with "$" and two decimal places
  };

  // Handle change for both price and star fields
  const handleEditChange = (e, key) => {
    const value = e.target.value;

    setEditProduct((prevProduct) => ({
      ...prevProduct,
      [key]: key === "star" || key === "prev_price" || key === "new_price"
        ? parsePrice(value)  // Clean the value for numeric fields (remove "$")
        : value
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Product Management</h1>
      <button style={addButtonStyle} onClick={() => setShowAddModal(true)}>
        + Add Product
      </button>

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
          {products.map((product) => (
            <tr key={product.id}>
              <td style={tdStyle}>{product.id}</td>
              <td style={tdStyle}>{product.title}</td>
              <td style={tdStyle}>{formatPrice(product.prev_price)}</td>
              <td style={tdStyle}>{formatPrice(product.new_price)}</td>
              <td style={tdStyle}>{product.category}</td>
              <td style={tdStyle}>
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.title}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                ) : "No Image"}
              </td>
              <td style={tdStyle}>
                <button
                  style={deleteButtonStyle}
                  onClick={() => window.confirm("Are you sure you want to delete this product?") && deleteProduct(product.id)}
                  disabled={removing === product.id}
                >
                  {removing === product.id ? "Deleting..." : "Delete"}
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => {
                    setEditProduct({ ...product }); // clone to make editable
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct} style={{ display: "grid", gap: "10px" }}>
              {Object.keys(newProduct).map((key) => (
                <input
                  key={key}
                  type={["star", "prev_price", "new_price"].includes(key) ? "text" : "text"} // Keep as text to allow "$"
                  name={key}
                  placeholder={key.replace("_", " ").toUpperCase()}
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

      {/* Edit Product Modal */}
      {showEditModal && editProduct && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Edit Product</h2>
            <form onSubmit={handleEditProduct} style={{ display: "grid", gap: "10px" }}>
              {Object.keys(editProduct).filter(k => k !== "id").map((key) => (
                <input
                  key={key}
                  type={["star", "prev_price", "new_price"].includes(key) ? "text" : "text"} // Keep as text to allow "$"
                  name={key}
                  placeholder={key.replace("_", " ").toUpperCase()}
                  value={key === "prev_price" || key === "new_price" || key === "star" ? formatPrice(editProduct[key]) : editProduct[key] ?? ""}
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

// Styles
const thStyle = { border: "1px solid #ddd", padding: "8px", backgroundColor: "#f9f9f9", textAlign: "left" };
const tdStyle = { border: "1px solid #ddd", padding: "8px" };
const buttonStyle = { marginRight: "5px", padding: "5px 10px", backgroundColor: "#9C7B79", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };
const deleteButtonStyle = { padding: "5px 12px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer", marginRight: "8px" };
const addButtonStyle = { padding: "10px 15px", backgroundColor: "#9C7B79", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };
const cancelButtonStyle = { padding: "10px 15px", backgroundColor: "#aaa", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" };
const modalBox = { background: "white", padding: "30px", borderRadius: "10px", width: "900px", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 5px 15px rgba(0,0,0,0.3)" };

export default AdminProductsPage;

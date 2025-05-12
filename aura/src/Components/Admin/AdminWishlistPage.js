import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Admin Wishlist Page Component
const AdminWishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removing, setRemoving] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newWishlistItem, setNewWishlistItem] = useState({
        user_id: '',
        product_id: '',
    });

    // Fetch wishlist items when the component mounts
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/admin-wishlist", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setWishlist(res.data);
            } catch (err) {
                setError("Failed to fetch wishlist items");
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    // Handle item deletion
    const handleDelete = async (itemId) => {
        setRemoving(itemId);
        try {
            await axios.delete(`http://localhost:3000/api/admin-wishlist/${itemId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setWishlist(wishlist.filter(item => item.id !== itemId));
        } catch (err) {
            setError("Failed to delete wishlist item");
        } finally {
            setRemoving(null);
        }
    };

    // // Handle adding item to the cart
    // const handleAddToCart = async (itemId, userId, productId) => {
    //     try {
    //         await axios.post('http://localhost:3000/api/admin-wishlist/add-to-cart', {
    //             userId,
    //             productId
    //         }, {
    //             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //         });
    //         setWishlist(wishlist.filter(item => item.id !== itemId));
    //     } catch (err) {
    //         setError("Failed to add item to cart");
    //     }
    // };

// Handle adding a new wishlist item
const handleAddWishlistItem = async (e) => {
    e.preventDefault();
    try {
        // Send the request to the correct endpoint
        const res = await axios.post('http://localhost:3000/api/admin-wishlist', newWishlistItem, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // On success, add the new item to the wishlist state
        setWishlist([...wishlist, res.data]);

        // Reset the form and close the modal
        setNewWishlistItem({ user_id: '', product_id: '' });
        setShowAddModal(false);
    } catch (err) {
        setError("Failed to add wishlist item");
        console.error(err);
    }
};

    // If the wishlist is loading or there is an error, show the appropriate message
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Wishlist</h1>
            <button style={addButtonStyle} onClick={() => setShowAddModal(true)}>
                + Add to Wishlist
            </button>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>User ID</th>
                        <th style={thStyle}>Product Title</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Added At</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {wishlist.map((item) => (
                        <tr key={item.id}>
                            <td style={tdStyle}>{item.id}</td>
                            <td style={tdStyle}>{item.user_id}</td>
                            <td style={tdStyle}>{item.title}</td>
                            <td style={tdStyle}>${item.new_price}</td>
                            <td style={tdStyle}>{new Date(item.added_at).toLocaleString()}</td>
                            <td style={tdStyle}>
                                <button
                                    style={deleteButtonStyle}
                                    onClick={() => handleDelete(item.id)}
                                    disabled={removing === item.id}
                                >
                                    {removing === item.id ? "Deleting..." : "Delete"}
                                </button>
                               
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add to Wishlist Modal */}
            {showAddModal && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <h2>Add New Item to Wishlist</h2>
                        <form onSubmit={handleAddWishlistItem} style={{ display: "grid", gap: "10px" }}>
                            <input
                                type="text"
                                placeholder="User ID"
                                value={newWishlistItem.user_id}
                                onChange={(e) => setNewWishlistItem({ ...newWishlistItem, user_id: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Product ID"
                                value={newWishlistItem.product_id}
                                onChange={(e) => setNewWishlistItem({ ...newWishlistItem, product_id: e.target.value })}
                                required
                            />
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <button type="submit" style={addButtonStyle}>Add</button>
                                <button type="button" onClick={() => setShowAddModal(false)} style={cancelButtonStyle}>Cancel</button>
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
const deleteButtonStyle = { padding: "5px 12px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" };
const addButtonStyle = { padding: "10px 15px", backgroundColor: "#9C7B79", color: "white", border: "none", borderRadius: "px", cursor: "pointer", fontWeight: "bold" };
const cancelButtonStyle = { padding: "10px 15px", backgroundColor: "#aaa", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" };
// Styling for modal and input fields
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" };
const modalBox = { background: "white", padding: "30px", borderRadius: "10px", width: "900px", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 5px 15px rgba(0,0,0,0.3)" };

export default AdminWishlistPage;

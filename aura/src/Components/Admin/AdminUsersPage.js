import React, { useState, useEffect } from "react";
import axios from "axios";
import SERVER_URL from '../../config'; // Import SERVER_URL

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editUser, setEditUser] = useState(null); // Track user being edited
    const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", gender: "", dob: "", address: "" }); // New user form state
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false); // Modal state

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/api/admin-users`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                setError("Error fetching users data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersData();
    }, []);

    const handleDelete = async (userId) => {
        console.log(`Attempting to delete user with ID: ${userId}`);  // Add this line
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this user?");
            if (confirmDelete) {
                const token = localStorage.getItem("token");
                console.log("Using token:", token);  // Log the token to verify it's being sent
                await axios.delete(`${SERVER_URL}/api/admin-users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(users.filter(user => user.id !== userId));  // Update the users list after deletion
                console.log("Updated users after deletion:", users);  // Log the updated users list
                alert("User deleted successfully.");
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Error deleting user");
        }
    };

    const handleEdit = (userId) => {
        const userToEdit = users.find(user => user.id === userId);
        setEditUser(userToEdit);  // Set the user data to be edited
        setIsAddUserModalOpen(true);  // Open the modal
    };

    const handleUpdateUser = async () => {
        try {
            const { id, name, email, phone, gender, dob, address } = editUser;
            await axios.put(`${SERVER_URL}/api/admin-users/${id}`, { name, email, phone, gender, dob, address }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUsers(users.map(user => user.id === id ? editUser : user));  // Update the user in the state
            alert("User updated successfully.");
            setIsAddUserModalOpen(false);  // Close the modal
        } catch (err) {
            alert("Error updating user");
            console.error(err);
        }
    };

    const handleAddUser = async () => {
        try {
            const { name, email, phone, gender, dob, address } = newUser;
            const response = await axios.post(`${SERVER_URL}/api/admin-users`, { name, email, phone, gender, dob, address }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUsers([...users, response.data]);
            alert("User added successfully.");
            setIsAddUserModalOpen(false);  // Close the modal
        } catch (err) {
            alert("Error adding user");
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editUser) {
            setEditUser({ ...editUser, [name]: value });  // Update the editUser state for editing
        } else {
            setNewUser({ ...newUser, [name]: value });  // Update the newUser state for adding
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Users Management</h1>
            <br /> 
            <button onClick={() => setIsAddUserModalOpen(true)} style={buttonStyle}>Add User</button>
            <br /> 
            <br /> 
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th style={thStyle}>User ID</th>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Phone</th>
                            <th style={thStyle}>Gender</th>
                            <th style={thStyle}>DOB</th>
                            <th style={thStyle}>Address</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ textAlign: "center" }}>
                                <td style={tdStyle}>{user.id}</td>
                                <td style={tdStyle}>{user.name}</td>
                                <td style={tdStyle}>{user.email}</td>
                                <td style={tdStyle}>{user.phone}</td>
                                <td style={tdStyle}>{user.gender}</td>
                                <td style={tdStyle}>{user.dob}</td>
                                <td style={tdStyle}>{user.address}</td>
                                <td style={tdStyle}>
                                    <button style={deleteButtonStyle} onClick={() => handleDelete(user.id)}>Delete</button>
                                    <button style={buttonStyle} onClick={() => handleEdit(user.id)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Add or Edit User Modal */}
            {isAddUserModalOpen && (
                <div style={modalStyle}>
                    <div style={modalContentStyle}>
                        <h2>{editUser ? "Edit User" : "Add New User"}</h2>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={editUser ? editUser.name : newUser.name}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={editUser ? editUser.email : newUser.email}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={editUser ? editUser.phone : newUser.phone}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            name="gender"
                            placeholder="Gender"
                            value={editUser ? editUser.gender : newUser.gender}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                        <input
                            type="date"
                            name="dob"
                            value={editUser ? editUser.dob : newUser.dob}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                        <textarea
                            name="address"
                            placeholder="Address"
                            value={editUser ? editUser.address : newUser.address}
                            onChange={handleInputChange}
                            style={textareaStyle}
                        ></textarea>
                        <button style={buttonStyle} onClick={editUser ? handleUpdateUser : handleAddUser}>
                            {editUser ? "Update" : "Add"} User
                        </button>
                        <button style={buttonStyle} onClick={() => setIsAddUserModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Styles
const thStyle = {
    padding: "10px",
    border: "1px solid #ddd",
};

const tdStyle = {
    padding: "10px",
    border: "1px solid #ddd",
};

const buttonStyle = {
    padding: "6px 12px",
    backgroundColor: "#9C7B79",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    margin: "0 5px",
};
const deleteButtonStyle = {
    padding: "6px 12px",
    backgroundColor: "#e74c3c",  // Red color for Delete button
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
};

const modalStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const modalContentStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "4px",
    width: "400px",
    boxSizing: "border-box",
};

const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
};

const textareaStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    minHeight: "80px",
};

export default AdminUsersPage;

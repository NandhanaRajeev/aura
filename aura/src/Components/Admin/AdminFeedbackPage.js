import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminFeedbackPage = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/admin-feedback", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                console.log("Feedback data from API:", res.data); // 👈 Add this line for debugging
                setFeedbackList(res.data);
            } catch (err) {
                setError("Failed to fetch feedback");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            try {
                await axios.delete(`http://localhost:3000/api/admin-feedback/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setFeedbackList(feedbackList.filter(f => f.fed_id !== id));
                alert("Feedback deleted.");
            } catch (err) {
                console.error(err);
                alert("Failed to delete feedback.");
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>User Feedback Management</h1>
            {feedbackList.length === 0 ? (
                <p>No feedback available.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th style={thStyle}>Feedback ID</th>
                            <th style={thStyle}>User Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Rating</th>
                            <th style={thStyle}>Comments</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbackList.map(f => (
                            <tr key={f.fed_id}>
                                <td style={tdStyle}>{f.fed_id}</td>
                                <td style={tdStyle}>{f.name}</td> {/* Changed to user_name */}
                                <td style={tdStyle}>{f.email}</td>
                                <td style={tdStyle}>{f.rating}</td>
                                <td style={tdStyle}>{f.comments}</td>
                                <td style={tdStyle}>
                                    <button style={buttonStyle} onClick={() => handleDelete(f.fed_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const thStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
};

const tdStyle = {
    padding: "10px",
    border: "1px solid #ddd",
};

const buttonStyle = {
    padding: "6px 12px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
};

export default AdminFeedbackPage;

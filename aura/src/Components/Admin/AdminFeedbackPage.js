import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../App.css'; // Reuse global styles if available
import SERVER_URL from '../../config'; // Centralized server URL

function AdminFeedbackPage() {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/api/admin-feedback`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setFeedbackList(res.data);
            } catch (err) {
                console.error('Error fetching feedback:', err);
                setError('Failed to fetch feedback.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this feedback?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`${SERVER_URL}/api/admin-feedback/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setFeedbackList(feedbackList.filter(f => f.fed_id !== id));
            alert('Feedback deleted.');
        } catch (err) {
            console.error('Error deleting feedback:', err);
            alert('Failed to delete feedback.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>User Feedback Management</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : feedbackList.length === 0 ? (
                    <p>No feedback available.</p>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Feedback ID</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Rating</th>
                                <th>Comments</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbackList.map(f => (
                                <tr key={f.fed_id}>
                                    <td>{f.fed_id}</td>
                                    <td>{f.name}</td>
                                    <td>{f.email}</td>
                                    <td>{f.rating}</td>
                                    <td>{f.comments}</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.fed_id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AdminFeedbackPage;

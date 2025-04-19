import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Validation from "./LoginValidation";
import "../../App.css";
import { LoginContext } from "../../Components/LoginContext";

function Login() {
    const [values, setValues] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login } = useContext(LoginContext); // Use context to manage global login state

    const handleInput = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const res = await axios.post("http://localhost:3000/login", values);

                // Check if login was successful
                if (res.data.success) {
                    const token = res.data.token;  // Assuming the token is returned from backend
                    localStorage.setItem("token", token); // Store the token in localStorage
                    login(); // Update global login state using context
                    navigate("/"); // Navigate to the homepage or profile
                } else {
                    setErrors({ general: res.data.message });
                }
            } catch (error) {
                setErrors({ general: "Invalid credentials or server error" });
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Sign-In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleInput}
                            className="form-control"
                            autoComplete="off"
                        />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleInput}
                            className="form-control"
                        />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    {errors.general && <p className="text-danger">{errors.general}</p>}
                    <button type="submit" className="btn btn-success w-100">Log in</button>
                    <Link to="/signup" className="btn btn-outline-secondary w-100 mt-2">Create Account</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Validation from "./LoginValidation";
import "../../App.css";

function Login() {
    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const res = await axios.post("http://localhost:3000/login", values);
                if (res.data.success) {
                    // console.log("Login successful:", res.data);
                    navigate("/"); // Redirect to the dashboard on successful login
                } else {
                    setErrors({ general: res.data.message });
                }
            } catch (error) {
                console.error("Login error:", error);
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
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            onChange={handleInput}
                            className="form-control"
                        />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            onChange={handleInput}
                            className="form-control"
                        />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    {errors.general && <p className="text-danger">{errors.general}</p>}
                    <button type="submit" className="btn btn-success w-100">Log in</button>
                    <p>You are agreeing to our terms and policies</p>
                    <Link to="/signup" className="btn btn-default w-100 text-decoration-none">
                        Create Account
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Login;

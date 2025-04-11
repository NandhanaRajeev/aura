import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';
import "../../App.css"; // Ensure the CSS is applied

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const handleInput = (event) => {
        setValues((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = Validation(values);
        setErrors(validationErrors);

        // Proceed only if there are no errors
        if (Object.keys(validationErrors).length === 0) {
            try {
                const res = await axios.post('http://localhost:3000/signup', values);
                
                if (res.status === 200) {
                    console.log('Signup successful:', res.data);
                    navigate('/login'); // Redirect to login after signup
                } else {
                    setServerError('Signup failed. Please try again.');
                }
            } catch (error) {
                console.error('Signup error:', error);
                setServerError(error.response?.data?.message || 'Signup failed. Try again later.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Sign-Up</h2>
                {serverError && <p className="text-danger">{serverError}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="name"><strong>Name</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            name="name"
                            value={values.name}
                            onChange={handleInput}
                            className="form-control"
                        />
                        {errors.name && <span className="text-danger">{errors.name}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            value={values.email}
                            onChange={handleInput}
                            className="form-control"
                        />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            value={values.password}
                            onChange={handleInput}
                            className="form-control"
                        />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    <button type="submit" className="btn btn-success w-100">Sign up</button>
                    <p>You are agreeing to our terms and policies</p>
                    <Link to="/login" className="btn btn-default w-100 text-decoration-none">
                        Login
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Signup;

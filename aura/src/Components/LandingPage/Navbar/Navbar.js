import React, { useContext, useState } from 'react';
import './Navbar.css';
import logo from '../../Assets/logo.png';
import shoppingcart from '../../Assets/shoppingcart.png';
import profile from '../../Assets/profile.png';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../../LoginContext';
import { CartContext } from '../CartPage/CartContext'; // Use relative path to go from Navbar to CartPage
import wishlistIcon from '../../Assets/wishlistIcon.png';


const Navbar = () => {
    const [menu, setMenu] = useState("");
    const { isLoggedIn, logout } = useContext(LoginContext); // Use login context
    const { cartItems } = useContext(CartContext); // Use cart context
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Calculate the total number of items in the cart
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Check if user is logged in based on the presence of token
    const token = localStorage.getItem("token");

    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt="logo" style={{ width: "120px", height: "auto" }} />
            </div>

            <ul className='nav-menu'>
                <li onClick={() => setMenu("women")}>
                    <Link to="/" style={{ textDecoration: 'none' }}>WOMEN</Link>
                    {menu === "women" && <hr />}
                </li>
                <li onClick={() => setMenu("latest")}>
                    <Link to="/latest" style={{ textDecoration: 'none' }}>LATEST</Link>
                    {menu === "latest" && <hr />}
                </li>
                <li onClick={() => setMenu("about")}>
                    <Link to="/about" style={{ textDecoration: 'none' }}>ABOUT</Link>
                    {menu === "about" && <hr />}
                </li>
                {/* <li onClick={() => setMenu("chatbot")}>
                <Link to="/chatbot" style={{ textDecoration: 'none' }}>CHATBOT</Link>
                {menu === "chatbot" && <hr />}
                </li> */}

            </ul>

            <div className='nav-login-cart'>
                {isLoggedIn || token ? (  // Check if logged in or if token exists
                    <>
                        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                        <Link to='/profile' style={{ marginLeft: '10px' }}>
                            <img src={profile} alt="Profile" style={{ width: "35px", height: "auto" }} />
                        </Link>
                    </>
                ) : (
                    <li onClick={() => setMenu("login")}>
                        <Link to='/login' style={{ textDecoration: 'none' }}>
                            <button>Login</button>
                        </Link>
                        {menu === "login" && <hr />}
                    </li>
                )}
                <Link to='/wishlist' style={{ marginLeft: '10px' }}>
                <img src={wishlistIcon} alt="Wishlist" style={{ width: "35px", height: "auto" }} />
                </Link>
                <Link to='/cart' style={{ marginLeft: '10px' }}>
                    <img src={shoppingcart} alt="Cart" style={{ width: "35px", height: "auto" }} />
                </Link>
                <div className="nav-cart-count">{cartItemCount}</div> {/* Display dynamic cart count */}
            </div>
        </div>
    );
};

export default Navbar;

import React, { useState } from 'react'
import './Navbar.css'
import logo from '../../Assets/logo.png'
import shoppingcart from '../../Assets/shoppingcart.png'
import profile from '../../Assets/profile.png';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const [menu, setMenu] = useState(" ");
    return (
        <div className='navbar'>
            <div className="nav-logo">
                {/* LOGO */}
                <img src={logo} alt="" style={{ width: "120px", height: "auto", alignItems: 'left' }} />
                {/* <p>AURA</p> */}
            </div>

            <ul className='nav-menu'>
                <li onClick={() => { setMenu("women") }}><Link to="/" style={{ textDecoration: 'none' }}>WOMEN</Link> {menu === "women" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("latest") }}><Link to="/latest" style={{ textDecoration: 'none' }}>LATEST</Link> {menu === "latest" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("about") }}><Link to="about" style={{ textDecoration: 'none' }}>ABOUT</Link> {menu === "about" ? <hr /> : <></>}</li>

            </ul>
            <div className='nav-login-cart'>
                <li onClick={() => { setMenu("login") }}>
                    <Link to='/login' style={{ textDecoration: 'none' }}>
                        <button>Login</button>
                    </Link>
                    {menu === "login" ? <hr /> : <></>}
                </li>
                <Link to='' style={{ textDecoration: 'none', marginRight: '10px' }}>
                <img src={profile} alt="Profile" style={{ width: "35px", height: "auto" }} />
                </Link>
                <Link to='/cart' style={{ textDecoration: 'none' }}><img src={shoppingcart} alt="" style={{ width: "35px", height: "auto" }} /></Link>
                <div className="nav-cart-count">0</div>
            </div>

        </div>
    )
}

export default Navbar

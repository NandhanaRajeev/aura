import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { LoginContext } from "../../LoginContext";
import { jwtDecode } from "jwt-decode";  // Corrected import

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { isLoggedIn } = useContext(LoginContext);
    const [wishlistItems, setWishlistItems] = useState([]);

    const validateToken = (token) => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);  // Decode the JWT token
            return decoded.exp > Date.now() / 1000;  // Check expiration
        } catch (err) {
            return false;
        }
    };

    const fetchWishlist = async () => {
        const token = localStorage.getItem("token");
        
        if (!isLoggedIn || !token || !validateToken(token)) {
            console.warn("Not logged in or invalid token during fetch. Clearing wishlist.");
            setWishlistItems([]);
            return;
        }

        try {
            const response = await axios.get("http://localhost:3000/api/wishlist/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const formattedWishlist = response.data.map(item => ({
                product_id: item.id,
                title: item.title || "No title",
                image: item.img || "default-image.jpg",
                price: item.new_price || 0,
                prev_price: item.prev_price || 0,
                star: item.star || 0,
                reviews: item.reviews || 0,
            }));

            setWishlistItems(formattedWishlist);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const addToWishlist = async (newItem) => {
        const token = localStorage.getItem("token");

        if (!isLoggedIn || !token || !validateToken(token)) {
            console.warn("Not logged in or token expired during addToWishlist.");
            localStorage.removeItem("token");
            alert("Session expired. Please log in again.");
            setWishlistItems([]);  // Clear wishlist when session expires
            return;
        }

        const exists = wishlistItems.some(item => item.product_id === newItem.id);

        if (!exists) {
            try {
                await axios.post("http://localhost:3000/api/wishlist/add", {
                    product_id: newItem.id,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                await fetchWishlist();  // Refresh local list after adding item
            } catch (error) {
                console.error("Error adding to wishlist:", error);
            }
        } else {
            console.log("Item already exists in wishlist. Skipping add.");
        }
    };

    const removeFromWishlist = async (productId) => {
        const token = localStorage.getItem("token");

        if (!isLoggedIn || !token || !validateToken(token)) {
            console.warn("Session invalid during removeFromWishlist — clearing wishlist!");
            localStorage.removeItem("token");
            alert("Session expired. Please log in again.");
            setWishlistItems([]);  // Clear wishlist when session expires
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/api/wishlist/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setWishlistItems((prevItems) => prevItems.filter(item => item.product_id !== productId));
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchWishlist();  // Fetch wishlist whenever the user logs in
        } else {
            setWishlistItems([]);  // Clear wishlist if not logged in
        }
    }, [isLoggedIn]);

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
export default WishlistContext;

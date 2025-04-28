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
            setWishlistItems([]);  // Clear the wishlist if not logged in or session expired
            return;
        }

        try {
            const response = await axios.get("http://localhost:3000/api/wishlist/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Log the response to check the structure of data returned
            console.log("Fetched wishlist data:", response.data);

            // Ensure the data is in the expected format
            const formattedWishlist = response.data.map(item => ({
                product_id: item.product_id,
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
            localStorage.removeItem("token");
            alert("Session expired. Please log in again.");
            setWishlistItems([]);
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
                await fetchWishlist();  // Fetch updated list
            } catch (error) {
                console.error("Error adding to wishlist:", error);
            }
        }
    };

    const removeFromWishlist = async (productId) => {
        const token = localStorage.getItem("token");
        if (!isLoggedIn || !token || !validateToken(token)) {
            localStorage.removeItem("token");
            alert("Session expired. Please log in again.");
            setWishlistItems([]);  // Clear wishlist
            return;
        }
    
        try {
            await axios.delete(`http://localhost:3000/api/wishlist/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // After successful deletion from the server, update the context state
            setWishlistItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };
    const addToCart = async (item) => {
        const token = localStorage.getItem("token");
        if (!isLoggedIn || !token || !validateToken(token)) {
            localStorage.removeItem("token");
            alert("Session expired. Please log in again.");
            return;
        }

        try {
            const cartItem = {
                id: item.product_id,  
                title: item.title,
                image: item.image,
                price: item.price,
                prevPrice: item.prev_price,
                star: item.star,
                reviews: item.reviews,
            };
            const response = await axios.post("http://localhost:3000/api/cart/add", cartItem, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Item added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart.");
        }
    };

    useEffect(() => {
        fetchWishlist();  // Fetch wishlist on component mount
    }, [isLoggedIn]);  // Re-run the fetch when login status changes

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, fetchWishlist, addToCart }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
export default WishlistContext;

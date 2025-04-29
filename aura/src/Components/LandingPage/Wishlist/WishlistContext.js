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

            console.log("Fetched wishlist data from server:", response.data);

            const formattedWishlist = response.data.map(item => {
                console.log("Formatting wishlist item:", item);
                return {
                    product_id: item.id,
                    title: item.title || "No title",
                    image: item.img || "default-image.jpg",
                    price: item.new_price || 0,
                    prev_price: item.prev_price || 0,
                    star: item.star || 0,
                    reviews: item.reviews || 0,
                };
            });

            console.log("Formatted wishlist:", formattedWishlist);

            setWishlistItems(formattedWishlist);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const addToWishlist = async (newItem) => {
        console.log("Adding newItem to wishlist:", newItem);
        const token = localStorage.getItem("token");

        if (!isLoggedIn || !token || !validateToken(token)) {
            console.warn("Not logged in or token expired during addToWishlist.");
            localStorage.removeItem("token");
            alert("Session expired. Please log in again.");
            setWishlistItems([]);
            return;
        }

        console.log("Current wishlist items:", wishlistItems);

        const exists = wishlistItems.some(item => {
            console.log(`Checking if item.product_id (${item.product_id}) === newItem.id (${newItem.id})`);
            return item.product_id === newItem.id;
        });

        if (!exists) {
            try {
                console.log("Item does not exist in wishlist. Sending request to server with product_id:", newItem.id);
                await axios.post("http://localhost:3000/api/wishlist/add", {
                    product_id: newItem.id,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Item added successfully to wishlist on server.");
                await fetchWishlist();  // Refresh local list
            } catch (error) {
                console.error("Error adding to wishlist:", error);
            }
        } else {
            console.log("Item already exists in wishlist. Skipping add.");
        }
    };

    const removeFromWishlist = async (productId) => {
        const token = localStorage.getItem("token");
        console.log("Removing item with productId:", productId);
        console.log("isLoggedIn:", isLoggedIn);
        console.log("token:", token);
        console.log("validateToken(token):", validateToken(token));

        if (!isLoggedIn || !token || !validateToken(token)) {
            console.warn("Session invalid during removeFromWishlist — clearing wishlist!");
            localStorage.removeItem("token");
            alert("Session expired. Please log in again.");
            setWishlistItems([]);
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/api/wishlist/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Item successfully removed from server. Updating local state.");
            setWishlistItems((prevItems) => {
                const updated = prevItems.filter((item) => item.product_id !== productId);
                console.log("Updated wishlist after removal:", updated);
                return updated;
            });
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    const addToCart = async (item) => {
        const token = localStorage.getItem("token");
        console.log("Adding item to cart:", item);

        if (!isLoggedIn || !token || !validateToken(token)) {
            console.warn("Not logged in or token expired during addToCart.");
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
            console.log("Prepared cartItem to send:", cartItem);

            const response = await axios.post("http://localhost:3000/api/cart/add", cartItem, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Item added to cart on server:", response.data);
            alert("Item added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart.");
        }
    };

    useEffect(() => {
        console.log("isLoggedIn changed. Fetching wishlist.");
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

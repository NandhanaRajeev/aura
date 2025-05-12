import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { LoginContext } from "../../LoginContext";
import { jwtDecode } from "jwt-decode";
import SERVER_URL from "../../../config";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { isLoggedIn } = useContext(LoginContext);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    console.log("WishlistContext SERVER_URL:", SERVER_URL);

    const validateToken = (token) => {
        if (!token) {
            console.warn("No token found in localStorage");
            return false;
        }
        try {
            const decoded = jwtDecode(token);
            console.log("Decoded token:", decoded);
            return decoded.exp > Date.now() / 1000;
        } catch (err) {
            console.error("Token validation error:", err);
            return false;
        }
    };

    const fetchWishlist = useCallback(async () => {
        const token = localStorage.getItem("token");
        
        if (!isLoggedIn || !token || !validateToken(token)) {
            console.warn("Not logged in or invalid token during fetch. Clearing wishlist.");
            setWishlistItems([]);
            setError("Please log in to view your wishlist.");
            return;
        }

        try {
            setError(null);
            console.log("Fetching wishlist from:", `${SERVER_URL}/api/wishlist/`);
            const response = await axios.get(`${SERVER_URL}/api/wishlist/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Wishlist fetch response:", response.data);

            if (!Array.isArray(response.data)) {
                throw new Error("Expected an array of wishlist items");
            }

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
            console.error("Error fetching wishlist:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setError("Failed to load wishlist. Please try again.");
        }
    }, [isLoggedIn]);

    const addToWishlist = async (newItem) => {
        const token = localStorage.getItem("token");

        if (!isLoggedIn || !token || !validateToken(token)) {
            console.warn("Not logged in or token expired during addToWishlist.");
            localStorage.removeItem("token");
            setWishlistItems([]);
            setError("Session expired. Please log in again.");
            alert("Session expired. Please log in again.");
            return false;
        }

        if (!newItem || !newItem.id) {
            console.error("Invalid item provided to addToWishlist:", newItem);
            setError("Cannot add item to wishlist. Invalid item data.");
            return false;
        }

        const exists = wishlistItems.some(item => item.product_id === newItem.id);
        console.log("Checking if item exists:", { itemId: newItem.id, exists });

        if (!exists) {
            try {
                setError(null);
                setSuccess(null);
                // Optimistic update
                const optimisticItem = {
                    product_id: newItem.id,
                    title: newItem.title || "No title",
                    image: newItem.image || "default-image.jpg",
                    price: newItem.price || 0,
                    prev_price: newItem.prev_price || 0,
                    star: newItem.star || 0,
                    reviews: newItem.reviews || 0,
                };
                setWishlistItems((prevItems) => [...prevItems, optimisticItem]);
                console.log("Optimistic update applied:", optimisticItem);

                const payload = { product_id: newItem.id };
                console.log("Adding to wishlist:", {
                    url: `${SERVER_URL}/api/wishlist/add`,
                    payload,
                    headers: { Authorization: `Bearer ${token}` },
                });
                const response = await axios.post(`${SERVER_URL}/api/wishlist/add`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Add to wishlist response:", response.data);
                await fetchWishlist();
                setSuccess("Item added to wishlist!");
                return true;
            } catch (error) {
                console.error("Error adding to wishlist:", {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                // Roll back optimistic update
                setWishlistItems((prevItems) => prevItems.filter(item => item.product_id !== newItem.id));
                setError(
                    error.response?.status === 400
                        ? "Invalid product ID."
                        : error.response?.status === 409
                        ? "Item already in wishlist."
                        : "Failed to add item to wishlist. Please try again."
                );
                return false;
            }
        } else {
            console.log("Item already exists in wishlist:", newItem.id);
            setError("Item is already in your wishlist.");
            return false;
        }
    };

    const removeFromWishlist = async (productId) => {
        const token = localStorage.getItem("token");

        if (!isLoggedIn || !token || !validateToken(token)) {
            console.warn("Session invalid during removeFromWishlist — clearing wishlist!");
            localStorage.removeItem("token");
            setWishlistItems([]);
            setError("Session expired. Please log in again.");
            alert("Session expired. Please log in again.");
            return false;
        }

        try {
            setError(null);
            setSuccess(null);
            console.log("Removing from wishlist:", `${SERVER_URL}/api/wishlist/remove/${productId}`);
            const response = await axios.delete(`${SERVER_URL}/api/wishlist/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Remove from wishlist response:", response.data);
            setWishlistItems((prevItems) => prevItems.filter(item => item.product_id !== productId));
            setSuccess("Item removed from wishlist!");
            return true;
        } catch (error) {
            console.error("Error removing from wishlist:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setError("Failed to remove item from wishlist. Please try again.");
            return false;
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
            setError(null);
            setSuccess(null);
        }
    }, [isLoggedIn, fetchWishlist]);

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, error, success }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
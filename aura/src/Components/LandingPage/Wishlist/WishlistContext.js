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

    const validateToken = (token) => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            return decoded.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    };

    const fetchWishlist = useCallback(async () => {
        const token = localStorage.getItem("token");

        if (!isLoggedIn || !token || !validateToken(token)) {
            setWishlistItems([]);
            setError("Please log in to view your wishlist.");
            return;
        }

        try {
            setError(null);
            const response = await axios.get(`${SERVER_URL}/api/wishlist/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const formattedWishlist = Array.isArray(response.data)
                ? response.data.map(item => ({
                      product_id: item.id,
                      title: item.title || "No title",
                      image: item.img || "default-image.jpg",
                      price: item.new_price || 0,
                      prev_price: item.prev_price || 0,
                      star: item.star || 0,
                      reviews: item.reviews || 0,
                  }))
                : [];

            setWishlistItems(formattedWishlist);
        } catch (error) {
            setError("Failed to load wishlist. Please try again.");
        }
    }, [isLoggedIn]);


const addToWishlist = async (newItem) => {
    const token = localStorage.getItem("token");

    if (!isLoggedIn || !token || !validateToken(token)) {
        localStorage.removeItem("token");
        setWishlistItems([]);
        setError("Session expired. Please log in again.");
        return false;
    }

    if (!newItem || !newItem.id) {
        setError("Cannot add item to wishlist. Invalid item data.");
        return false;
    }

    const exists = wishlistItems.some(item => item.product_id === newItem.id);
    if (exists) {
        setError("Item is already in your wishlist.");
        return false;
    }

    try {
        setError(null);
        setSuccess(null);

        // Optimistically update the wishlist state
        const updatedWishlist = [...wishlistItems, {
            product_id: newItem.id,
            title: newItem.title || "No title",
            image: newItem.img || "default-image.jpg",
            price: newItem.new_price || 0,
            prev_price: newItem.prev_price || 0,
            star: newItem.star || 0,
            reviews: newItem.reviews || 0,
        }];
        setWishlistItems(updatedWishlist);

        const payload = { product_id: newItem.id };

        // Log the payload being sent to the backend
        console.log("Sending payload to backend:", payload);

        await axios.post(`${SERVER_URL}/api/wishlist/add`, payload, {
    headers: { Authorization: `Bearer ${token}` },
});


        setSuccess("Item added to wishlist!");
        return true;
    } catch (error) {
        if (error.response?.status === 400) {
            setError("Invalid product ID.");
        } else if (error.response?.status === 409) {
            setError("Item already in wishlist.");
        } else {
            setError("Failed to add item to wishlist.");
        }

        // Rollback the optimistic state update in case of failure
        setWishlistItems(prev => prev.filter(item => item.product_id !== newItem.id));
        return false;
    }
};


    const removeFromWishlist = async (productId) => {
        const token = localStorage.getItem("token");

        if (!isLoggedIn || !token || !validateToken(token)) {
            localStorage.removeItem("token");
            setWishlistItems([]);
            setError("Session expired. Please log in again.");
            return false;
        }

        try {
            setError(null);
            setSuccess(null);

            await axios.delete(`${SERVER_URL}/api/wishlist/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
            setSuccess("Item removed from wishlist!");
            return true;
        } catch (error) {
            setError("Failed to remove item from wishlist.");
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
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist, // This is now properly exported
                fetchWishlist, // Optional external trigger
                error,
                success,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );

    
};

export const useWishlist = () => useContext(WishlistContext);

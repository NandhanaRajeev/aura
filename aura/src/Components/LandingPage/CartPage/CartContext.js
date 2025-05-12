import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { LoginContext } from "../../LoginContext";
import { jwtDecode } from "jwt-decode";

// Create CartContext to store cart data globally
export const CartContext = createContext();

// CartProvider component to provide context to children
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { isLoggedIn } = useContext(LoginContext);

    // Function to validate JWT token
    const validateToken = (token) => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Current time in seconds
            if (decoded.exp < currentTime) {
                console.log("Token expired:", decoded);
                return false;
            }
            return true;
        } catch (error) {
            console.error("Invalid token:", error);
            return false;
        }
    };

    // Transfer cart to orders after payment
    const transferCartToOrders = async () => {
        const token = localStorage.getItem("token");

        if (!isLoggedIn || !token || !validateToken(token)) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCartItems([]);
            localStorage.removeItem("cartItems");
            alert("Your session has expired. Please log in again.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/checkout",
                {user_id:1},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Transferred cart items to orders:", response.data);
            await clearCart(); // Clear cart after successful transfer
        } catch (error) {
            console.error("Error transferring cart to orders:", error.response?.data || error.message);
            alert("Failed to complete order. Please try again.");
        }
    };


    // Function to fetch cart items from backend, memoized with useCallback
    const fetchCart = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!isLoggedIn || !token) {
            setCartItems([]);
            localStorage.removeItem("cartItems");
            return;
        }

        if (!validateToken(token)) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCartItems([]);
            localStorage.removeItem("cartItems");
            alert("Your session has expired. Please log in again.");
            return;
        }

        try {
            const response = await axios.get("http://localhost:3000/api/cart/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched cart items with product details:", response.data);
            setCartItems(response.data);
            localStorage.setItem("cartItems", JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching cart from backend:", error.response?.data || error.message);
            if (error.response?.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                setCartItems([]);
                localStorage.removeItem("cartItems");
                alert("Your session has expired. Please log in again.");
            }
        }
    }, [isLoggedIn, setCartItems]);

    // Fetch cart items on component mount
    useEffect(() => {
        fetchCart();
    }, [isLoggedIn, fetchCart]);

    // Save cart items to localStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // Merge local cart with backend after login
    const syncCartWithBackend = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!isLoggedIn || !token) return;

        if (!validateToken(token)) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCartItems([]);
            localStorage.removeItem("cartItems");
            alert("Your session has expired. Please log in again.");
            return;
        }

        const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        if (localCart.length > 0) {
            setCartItems([]);
            for (const item of localCart) {
                if (!item.product_id && !item.id) {
                    console.error("Skipping cart item sync due to missing product_id:", item);
                    continue;
                }

                try {
                    const payload = {
                        product_id: item.product_id || item.id,
                        quantity: item.quantity || 1,
                        size: item.size || "M",
                    };
                    console.log("Merging cart item with backend, payload:", payload);
                    await axios.post(
                        "http://localhost:3000/api/cart/add",
                        payload,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } catch (error) {
                    console.error("Error merging cart item with backend:", error.response?.data || error.message);
                    if (error.response?.status === 403) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userId");
                        setCartItems([]);
                        localStorage.removeItem("cartItems");
                        alert("Your session has expired. Please log in again.");
                        return;
                    }
                }
            }
            await fetchCart(); // Fetch updated cart after syncing
        }
    }, [isLoggedIn, fetchCart]);

    // Call syncCartWithBackend when the user logs in
    useEffect(() => {
        if (isLoggedIn) {
            syncCartWithBackend();
        }
    }, [isLoggedIn, syncCartWithBackend]);

    // Add item to the cart (or update quantity if item exists) and sync with backend
    const addToCart = async (newItem) => {
        if (!newItem?.id) {
            console.error("Cannot add item to cart: product_id is missing in newItem:", newItem);
            throw new Error("Product ID is missing. Cannot add item to cart.");
        }

        const token = localStorage.getItem("token");
        let userId;

        if (token) {
            try {
                const decoded = jwtDecode(token);
                userId = decoded.id;
            } catch (error) {
                console.error("Error decoding token:", error);
                throw new Error("Invalid token. Please log in again.");
            }
        }

        if (isLoggedIn && token && !validateToken(token)) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCartItems([]);
            localStorage.removeItem("cartItems");
            alert("Your session has expired. Please log in again.");
            throw new Error("Invalid token. Please log in again.");
        }

        let tempCartItems = [...cartItems];
        const existingItemIndex = tempCartItems.findIndex(
            (item) => item.product_id === newItem.id && item.size === (newItem.size || "M")
        );

        if (existingItemIndex !== -1) {
            tempCartItems[existingItemIndex].quantity += newItem.quantity || 1;
            setCartItems(tempCartItems);

            if (isLoggedIn && token && userId) {
                try {
                    const payload = {
                        userId: userId,
                        productId: newItem.id,
                        quantity: tempCartItems[existingItemIndex].quantity,
                        size: tempCartItems[existingItemIndex].size,
                    };
                    console.log("Updating quantity in backend, payload:", payload);
                    const response = await axios.put(
                        "http://localhost:3000/api/cart/update",
                        payload,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    console.log("Update quantity response:", response.data);
                    await fetchCart(); // Fetch updated cart
                } catch (error) {
                    console.error("Error updating quantity in backend:", error.response?.data || error.message);
                    tempCartItems[existingItemIndex].quantity -= newItem.quantity || 1;
                    setCartItems([...tempCartItems]);
                    if (error.response?.status === 403) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userId");
                        setCartItems([]);
                        localStorage.removeItem("cartItems");
                        alert("Your session has expired. Please log in again.");
                    }
                    throw new Error(error.response?.data?.error || "Failed to update quantity in cart.");
                }
            }
        } else {
            const newCartItem = {
                product_id: newItem.id,
                quantity: newItem.quantity || 1,
                size: newItem.size || "M",
                title: newItem.title,
                image: newItem.image,
                price: newItem.price,
                prev_price: newItem.prevPrice,
                star: newItem.star,
                reviews: newItem.reviews,
            };
            tempCartItems = [...tempCartItems, newCartItem];
            setCartItems(tempCartItems);

            if (isLoggedIn && token) {
                try {
                    const payload = {
                        product_id: newItem.id,
                        quantity: newItem.quantity || 1,
                        size: newItem.size || "M",
                    };
                    console.log("Adding item to backend, payload:", payload);
                    const response = await axios.post(
                        "http://localhost:3000/api/cart/add",
                        payload,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    console.log("Add to cart response:", response.data);
                    await fetchCart(); // Fetch updated cart
                } catch (error) {
                    console.error("Error adding item to backend:", error.response?.data || error.message);
                    setCartItems(cartItems.filter((item) => item !== newCartItem));
                    if (error.response?.status === 403) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userId");
                        setCartItems([]);
                        localStorage.removeItem("cartItems");
                        alert("Your session has expired. Please log in again.");
                    }
                    throw new Error(error.response?.data?.error || "Failed to add item to cart.");
                }
            }
        }
    };

    // Remove item from the cart by product_id and size
    const removeFromCart = async (productId, size) => {
        const token = localStorage.getItem("token");
        let userId;

        if (token) {
            try {
                const decoded = jwtDecode(token);
                userId = decoded.id;
            } catch (error) {
                console.error("Error decoding token:", error);
                throw new Error("Invalid token. Please log in again.");
            }
        }

        const originalCartItems = [...cartItems];
        const updatedItems = cartItems.filter((item) => item.product_id !== productId || item.size !== size);

        setCartItems(updatedItems);

        if (isLoggedIn && token && userId) {
            try {
                const response = await axios.delete(`http://localhost:3000/api/cart/remove/${userId}/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: { size },
                });
                console.log("Remove from cart response:", response.data);
                await fetchCart(); // Fetch updated cart
            } catch (error) {
                console.error("Error removing item from backend:", error.response?.data || error.message);
                setCartItems(originalCartItems); // Revert on error
                if (error.response?.status === 403) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    setCartItems([]);
                    localStorage.removeItem("cartItems");
                    alert("Your session has expired. Please log in again.");
                }
                throw new Error(error.response?.data?.error || "Failed to remove item from cart.");
            }
        }
    };

    // Update the quantity of a specific item
    const updateQuantity = async (productId, size, quantity) => {
        const token = localStorage.getItem("token");
        let userId;

        if (token) {
            try {
                const decoded = jwtDecode(token);
                userId = decoded.id;
            } catch (error) {
                console.error("Error decoding token:", error);
                throw new Error("Invalid token. Please log in again.");
            }
        }

        const originalCartItems = [...cartItems];
        const updatedItems = [...cartItems];
        const itemIndex = updatedItems.findIndex((item) => item.product_id === productId && item.size === size);

        if (itemIndex !== -1) {
            updatedItems[itemIndex].quantity = quantity;
            setCartItems(updatedItems);

            if (isLoggedIn && token && userId) {
                try {
                    const payload = {
                        userId,
                        productId,
                        quantity,
                        size,
                    };
                    console.log("Updating quantity in backend, payload:", payload);
                    const response = await axios.put(
                        "http://localhost:3000/api/cart/update",
                        payload,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    console.log("Update quantity response:", response.data);
                    await fetchCart(); // Fetch updated cart
                } catch (error) {
                    console.error("Error updating quantity in backend:", error.response?.data || error.message);
                    setCartItems(originalCartItems);
                    if (error.response?.status === 403) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userId");
                        setCartItems([]);
                        localStorage.removeItem("cartItems");
                        alert("Your session has expired. Please log in again.");
                    }
                    throw new Error(error.response?.data?.error || "Failed to update quantity in cart.");
                }
            }
        }
    };

    // Clear the cart
    const clearCart = async () => {
        const token = localStorage.getItem("token");
        setCartItems([]);

        if (isLoggedIn && token) {
            try {
                await axios.delete("http://localhost:3000/api/cart/clear", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Cart cleared in backend");
            } catch (error) {
                console.error("Error clearing cart from backend:", error.response?.data || error.message);
                if (error.response?.status === 403) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    setCartItems([]);
                    localStorage.removeItem("cartItems");
                    alert("Your session has expired. Please log in again.");
                }
            }
        }
        localStorage.removeItem("cartItems");
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                fetchCart,
                transferCartToOrders,
            }}
        >
            {children}
        </CartContext.Provider>
    );

    
};

// Custom hook to access CartContext values
export const useCart = () => useContext(CartContext);
export default CartContext;
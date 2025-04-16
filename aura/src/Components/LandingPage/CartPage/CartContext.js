import React, { createContext, useState, useEffect, useContext } from "react";

// Create CartContext to store cart data globally
export const CartContext = createContext();

// CartProvider component to provide context to children
export const CartProvider = ({ children }) => {
  // State to hold cart items
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, []);

  // Save cart items to localStorage whenever the cartItems state changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to the cart (or update quantity if item exists)
  const addToCart = (newItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.title === newItem.title && item.size === newItem.size
      );

      if (existingItemIndex !== -1) {
        // Increment quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
        return updatedItems;
      } else {
        // Add new item if not in cart
        return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
      }
    });
  };

  // Remove item from the cart by title and size
  const removeFromCart = (title, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.title !== title || item.size !== size)
    );
  };

  // Update the quantity of a specific item
  const updateQuantity = (title, size, quantity) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      const itemIndex = updatedItems.findIndex(
        (item) => item.title === title && item.size === size
      );
      if (itemIndex !== -1) {
        updatedItems[itemIndex].quantity = quantity;
      }
      return updatedItems;
    });
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Return the context provider with values
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access CartContext values
export const useCart = () => useContext(CartContext);
export default CartContext;

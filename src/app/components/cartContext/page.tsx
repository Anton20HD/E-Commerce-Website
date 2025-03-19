
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  quantity: number;
}

// functions go here
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string, size: string) => void;
  calculateTotalPrice: (itemId: string, itemSize: string, itemPrice: number) => number;
  updateCartQuantity: (itemId: string, size: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const ls = typeof window !== "undefined" ? window.localStorage : null;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const localStorageKey = "cartItems";

  // Merge guest cart with user cart
  const mergeCarts = (userCart: CartItem[], guestCart: CartItem[]) => {
    const mergedCart = [...userCart];

    guestCart.forEach((guestItem) => {
      const existingItem = mergedCart.find(
        (item) => item._id === guestItem._id && item.size === guestItem.size
      );

      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        mergedCart.push(guestItem);
      }
    });

    return mergedCart;
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/cart", { method: "GET" });
          if (response.ok) {
            const userCart = await response.json();

            
            const storedCart = ls ? JSON.parse(ls.getItem(localStorageKey) || "[]") : [];

            if (storedCart.length > 0) {
              // Merge guest cart with user cart
              const mergedCart = mergeCarts(userCart.cart, storedCart);

              // Save merged cart to database
              await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartItems: mergedCart }),
              });

              // if (ls) {
              //   //ls.removeItem(localStorageKey);
              // }
              setCart(mergedCart);
            } else {
              setCart(userCart.cart);
            }
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      } else if (status === "unauthenticated" && ls) {
        const storedCart = ls.getItem(localStorageKey);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      }
    };

    if (status === "authenticated" || status === "unauthenticated") {
      fetchCart();
    }
  }, [status, ls]);

  useEffect(() => {
    if (status === "unauthenticated" && ls) {
      ls.setItem(localStorageKey, JSON.stringify(cart));
    }
  }, [cart, status, ls]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id && cartItem.size === item.size
      );

      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((cartItem) =>
          cartItem._id === item._id && cartItem.size === item.size
            ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + 1) }
            : cartItem
        );
      } else {
        updatedCart = [...prevCart, { ...item, quantity: 1 }];
      }

      if (status === "unauthenticated" && ls) {
        ls.setItem(localStorageKey, JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  };

  const removeFromCart = (itemId: string, size: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (cartItem) => !(cartItem._id === itemId && cartItem.size === size)
      );

      if (status === "unauthenticated" && ls) {
        ls.setItem(localStorageKey, JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  };

  const updateCartQuantity = (itemId: string, size: string, quantity: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((cartItem) =>
          cartItem._id === itemId && cartItem.size === size
            ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + quantity) }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0);

      if (status === "unauthenticated" && ls) {
        ls.setItem(localStorageKey, JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  };

  const calculateTotalPrice = (itemId: string, itemSize: string | undefined, itemPrice: number) => {
    const totalQuantity = cart
      .filter((item) => item._id === itemId && (item.size === itemSize || item.size === "onesize"))
      .reduce((acc, item) => acc + item.quantity, 0);
    return totalQuantity * itemPrice;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        calculateTotalPrice,
        updateCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

"use client";

// Good way to manage global state(especially where you need access to multiple components)
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface WishlistItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  size: string;
}

// functions go here
interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string, size: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (wishlist?.length > 0) {
      ls?.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, ls]);

  useEffect(() => {
    if (ls) {
      const storedWishList = ls.getItem("wishlist");
      if (storedWishList) {
        setWishlist(JSON.parse(storedWishList));
      }
    }
  }, []);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prevWishlist) => {
      if (!prevWishlist.find((wishlistItem) => wishlistItem._id === item._id)) {
        return [...prevWishlist, item];
      }
      return prevWishlist;
    });
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((wishlistItem) => wishlistItem._id !== itemId)
    );
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

//Function to use the cart
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error();
  }
  return context;
};

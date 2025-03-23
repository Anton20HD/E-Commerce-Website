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
  size?: string;
  category: string;
}

// functions go here
interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
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
  }, [ls]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prevWishlist) => {
      if (!prevWishlist.find((wishlistItem) => wishlistItem._id === item._id)) {
        const updatedWishlist = [...prevWishlist, item];
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); 
        return updatedWishlist;
      }
      return prevWishlist;
    });
  };
  const removeFromWishlist = (itemId: string) => {
    setWishlist((prevWishlist) => {
      const updatedWishlist = prevWishlist.filter((item) => item._id !== itemId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist)); 
      return updatedWishlist;
    });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

//Function to use the wishlist
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/apparel/page.module.scss";
//import { useSearch } from "../components/searchContext/page";
import { useWishlist } from "../../components/WishlistContext/WishlistContext";
import HeartOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HeartFilledIcon from "@mui/icons-material/Favorite";
//import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string[];
  sizes: string[];
  soldout: boolean;
  category: string;
  subCategory: string;
}

const AllApparel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  // const { searchTerm } = useSearch();
  const router = useRouter();
  const { addToWishlist, wishlist, removeFromWishlist } = useWishlist();
  const [selectedSize] = useState("S");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?category=apparel");
        if(!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleProduct = (productId: string) => {
    router.push(`/apparel/${productId}`);
  };

  const handleWishlistToggle = (product: Product) => {
    const isAlreadyInWishlist = wishlist.some((item) => item._id === product._id);

    if (isAlreadyInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        image: product.image[0],
        category: product.category,
      });
    }
  };


  //const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className={styles.productSection}>
      {products.map((product: Product) => {
       const isWishlisted = wishlist.some((item) => item._id === product._id);

       return (
        <div key={product._id} onClick={() => handleProduct(product._id)}>
          <div className={styles.productCard}>
            <div className={styles.buttonContent}>
              <button 
              className={styles.wishList} 
              onClick={(e) => {

                e.stopPropagation(); // Prevent navigation to single product page when clicking
                handleWishlistToggle(product);

              }}
              >
                {isWishlisted ? (
                <HeartFilledIcon sx={{ color: "black", fontSize: 20 }} />
              ) : (
                <HeartOutlinedIcon sx={{fontSize: 20}} />
              )}
              </button>
            </div>
            {product.image.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={product.name}
                className={styles.productImage}
              />
            ))}
          </div>
          <h2 className={styles.productName}>{product.name}</h2>
          <p className={styles.productPrice}>{product.price} kr</p>
        </div>
       )
     })}
    </div>
  );
};

export default AllApparel;

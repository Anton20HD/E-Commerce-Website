"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/app/apparel/[id]/page.module.scss";
import RelatedProducts from "@/app/components/relatedProducts/page";
import { useCart } from "@/app/components/cartContext/page";
import { useWishlist } from "@/app/components/wishlistContext/page";
import HeartOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HeartFilledIcon from "@mui/icons-material/Favorite";
import { useSession } from "next-auth/react";
import { CartItem } from "@/app/components/cartContext/page";
//import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string[];
  sizes?: string[];
  soldout: boolean;
  category: string;
  subCategory: string;
}

const AccessoryPage = () => {
  const { id } = useParams(); // Access to the specific id for the product
  const [product, setProduct] = useState<Product | null>(null); // Single product initialization. Is either null or an object
  const [selectedSize, setSelectedSize] = useState("onesize");
  const { addToCart, cart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { data: session } = useSession();
  //const userId = session?.user?.id;
  const [iswishlisted, setIsWishlisted] = useState(false);

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    console.log("Session in handleaddtocart:", session);

    if (product) {
      console.log("Adding product to cart:", { product });

      const newCartItem: CartItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        size: "onesize",
        image: product.image[0],
        quantity: 1,
      };

      const existingItem = cart.find(
        (item) => item._id === product._id && item.size === "onesize"
      );

      if (existingItem) {
        return; // Prevent adding the same item again
      }

      try {
        addToCart(newCartItem);

        if (session?.user?.id) {
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cartItems: [newCartItem],
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            console.error("Error adding to cart:", data.message);
          }
        }
      } catch (error) {
        console.error("Network error adding to cart:", error);
      }
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (iswishlisted) {
        removeFromWishlist(product._id);
        setIsWishlisted(false);
      } else {
        addToWishlist({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image[0],
          size: "One Size",
          category: "accessory",
        });
        setIsWishlisted(true);
      }
    }
  };

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) {
            throw new Error("Product not found");
          }
          const data = await response.json();
          setProduct(data);

          // check if the product is already in the wishlist
          if (wishlist.some((item) => item._id === id)) {
            setIsWishlisted(true);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };
      fetchProduct();
    }
  }, [id, wishlist]);

  return product ? (
    <div>
      <div className={styles.productSection}>
        <div className={styles.ImageSection}>
          {product.image.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={product.name}
              className={styles.productImage}
            />
          ))}
        </div>
        <div className={styles.mainSection}>
          <h2 className={styles.productName}>{product.name}</h2>

          {product.sizes && product.sizes.length > 0 && (
            <div className={styles.sizeSection}>
              <p className={styles.size}>
                Size <span className={styles.selectedSize}>{selectedSize}</span>
              </p>
              <div className={styles.buttonsContainer}>
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => handleSizeChange(size)}
                    className={`${styles.sizeButton} ${
                      selectedSize === size ? styles.selectedSizeButton : ""
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className={styles.productPrice}>{product.price} kr</p>

          <div className={styles.buttonSection}>
            <button
              className={styles.addToCartButton}
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
            <button
              className={styles.wishListButton}
              onClick={handleWishlistToggle}
            >
              {iswishlisted ? (
                <HeartFilledIcon sx={{ color: "black", fontSize: 20 }} />
              ) : (
                <HeartOutlinedIcon sx={{ fontSize: 20 }} />
              )}
            </button>
          </div>
          <div className={styles.descriptionSection}>
            <h3 className={styles.descriptionTitle}>Description</h3>
            <p className={styles.description}>{product.description}</p>
          </div>
        </div>
      </div>

      <RelatedProducts
        category={product.category}
        subCategory={product.subCategory}
        currentProductId={product._id}
      />
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default AccessoryPage;

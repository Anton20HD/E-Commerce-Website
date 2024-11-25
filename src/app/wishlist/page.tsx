"use client"

import React from "react";
import styles from "@/app/wishlist/page.module.scss";

import RemoveIcon from "@mui/icons-material/Remove";
import { useWishlist } from "@/app/components/wishlistContext/page";

const WishListPage = () => {

  console.log("useWishlist:", useWishlist);
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className={styles.wishlistContainer}>
      <div className={styles.wishlistTitleContent}>
        <h1>Wishlist</h1>
      </div>
      <div className={styles.wishlistContent}>
      {wishlist.length === 0 ? (
          <div className={styles.emptyWishlistSection}>
            <h4 className={styles.emptyWishlistTitle}>
              Your Wishlist is empty
            </h4>
          </div>
        ) : (
          wishlist.map((item) => (
            <div
              key={`$item._id}-${item.size}`}
              className={styles.wishlistItem}
            >
              <img
                src={item.image}
                alt={item.name}
                className={styles.wishlistItemImage}
              />
              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p>Size: {item.size}</p>
                <p className={styles.itemPrice}>{item.price} kr</p>
                <div className={styles.removeSection}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => removeFromWishlist(item._id)}
                  >
                    <RemoveIcon className={styles.quantityIcon} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishListPage;

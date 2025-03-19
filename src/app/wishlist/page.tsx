"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "@/app/wishlist/page.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { useWishlist } from "@/app/components/wishlistContext/page";
import { useCart } from "../components/cartContext/page";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const WishListPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [open, setOpen] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Record provides a clean way to define an object type with key-value pairs,especially a dynamic structure like sizes.
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {}
  );

  const handleSizeSelect = (itemId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }));
    setOpen(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        dropdownRefs.current[open] &&
        !dropdownRefs.current[open]!.contains(event.target as Node)
      ) {
        setOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className={styles.wishlistContainer}>
      <div className={styles.wishlistTitleContent}>
        <h1 className={styles.wishlistTitle}>Wishlist</h1>
      </div>
      <div className={styles.wishlistContent}>
        {wishlist.length === 0 ? (
          <div className={styles.emptyWishlistSection}>
            <h4 className={styles.emptyWishlistTitle}>
              Your Wishlist is empty
            </h4>
          </div>
        ) : (
          wishlist.map((item) => {
            const isAccessory = item.category === "accessory";

            return (
              <div
                key={`${item._id}-${item.size || "onesize"}`}
                className={styles.wishlistItem}
              >
                <div className={styles.wishlistWrapper}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.wishlistItemImage}
                  />
                  <div className={styles.itemDetails}>
                    <div className={styles.productInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemPrice}>{item.price} kr</p>
                    </div>

                    <div className={styles.sizeAndAddProductSection}>
                      {!isAccessory && (
                        <div
                          className={styles.sizeDetails}
                          ref={(el) => {
                            if (el) dropdownRefs.current[item._id] = el;
                          }}
                        >
                          <div
                            className={styles.chooseSizeSection}
                            onClick={() => {
                              setOpen(open === item._id ? null : item._id);
                            }}
                          >
                            <span className={styles.chooseSize}>
                              {selectedSizes[item._id] || "Choose size"}
                            </span>
                            {open === item._id ? (
                              <ExpandMoreIcon />
                            ) : (
                              <ExpandLessIcon />
                            )}
                          </div>

                          {open === item._id && (
                            <div className={styles.dropdownMenu}>
                              <ul>
                                {["S", "M", "L"].map((size) => (
                                  <DropdownItem
                                    key={size}
                                    size={size}
                                    onClick={() =>
                                      handleSizeSelect(item._id, size)
                                    }
                                  />
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {isAccessory && (
                        <div className={styles.sizeDetails}>
                          <span className={styles.chooseSize}>One Size</span>
                        </div>
                      )}

                      <button
                        className={styles.addToCartButton}
                        onClick={() =>
                          addToCart({
                            _id: item._id,
                            name: item.name,
                            image: item.image,
                            price: item.price,
                            size: isAccessory
                              ? "One Size"
                              : selectedSizes[item._id],
                            quantity: 1,
                          })
                        }
                        disabled={isAccessory ? false : !selectedSizes[item._id]}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
                <div className={styles.navCloseIcon}>
                  <CloseIcon
                    onClick={() => removeFromWishlist(item._id)}
                    className={styles.closeIcon}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

interface DropdownItemProps {
  size: string;
  onClick: () => void;
}

function DropdownItem({ size, onClick }: DropdownItemProps) {
  return (
    <li onClick={onClick}>
      <a className={styles.sizeInfo}>{size}</a>
    </li>
  );
}

export default WishListPage;

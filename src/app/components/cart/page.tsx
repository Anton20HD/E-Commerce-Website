"use client";

import React from "react";
import styles from "@/app/components/cart/page.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../cartContext/page";
import Link from "next/link";
import { CartItem } from "../cartContext/page";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

interface CartProps {
  toggleMenu: () => void;
  isVisible: boolean;
}

const Cart = ({ toggleMenu, isVisible }: CartProps) => {
  const {
    cart,
    removeFromCart,
    calculateTotalPrice,
    updateCartQuantity,
  } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    toggleMenu();
    router.push(`/checkout`);
  };

  const increaseAmount = (item: CartItem) => {
    updateCartQuantity(item._id, item.size || "onesize", 1);
  };

  const decreaseAmount = (item: CartItem) => {
    if (item.quantity > 1) {
      updateCartQuantity(item._id, item.size || "onesize", -1);
    } else {
      removeFromCart(item._id, item.size || "onesize");
    }
  };

  return (
    <div className={`${styles.cartContainer} ${isVisible ? styles.open : ""}`}>
      <div className={styles.titleSection}>
        <div className={styles.cartInfo}>
          <h2 className={styles.cartTitle}> Your cart</h2>
        </div>
        <div className={styles.navCloseIcon} onClick={toggleMenu}>
          <CloseIcon className={styles.closeIcon}></CloseIcon>
        </div>
      </div>
      <div className={styles.productContent}>
        {cart.length === 0 ? (
          <div className={styles.emptyCartSection}>
            <h4 className={styles.emptyCartTitle}>Your Cart is empty</h4>
            <div className={styles.buttonSection}>
              <Link href="/apparel">
                <button className={styles.navigateButton} onClick={toggleMenu}>
                  Shop Products
                </button>
              </Link>
              <Link href="/accessories">
                <button className={styles.navigateButton} onClick={toggleMenu}>
                  Shop Accessories
                </button>
              </Link>
            </div>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={`${item._id}-${item.size || "onesize"}-${item.quantity}`}
              className={styles.cartItem}
            >
              <img
                src={item.image}
                alt={item.name}
                className={styles.cartItemImage}
              />
              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p>
                  {item.size === "onesize"
                    ? "Size: One Size"
                    : `Size: ${item.size}`}
                </p>
                <p className={styles.itemPrice}>
                  {calculateTotalPrice(item._id, item.size || "", item.price)}{" "}
                  kr
                </p>
                <div className={styles.removeSection}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => decreaseAmount(item)}
                  >
                    <RemoveIcon className={styles.quantityIcon} />
                  </button>
                  <span className={styles.quantityNumber}>{item.quantity}</span>
                  <button
                    className={styles.quantityButton}
                    onClick={() => increaseAmount(item)}
                  >
                    <AddIcon className={styles.quantityIcon} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        {cart.length > 0 && (
          <div className={styles.orderInfo}>
            <div className={styles.totalPriceSection}>
              <p className={styles.totalLabel}>Total </p>
              <p className={styles.totalPrice}>
                {cart.reduce(
                  (total, item) =>
                    total +
                    calculateTotalPrice(
                      item._id,
                      item.size ?? "onesize",
                      item.price
                    ),
                  0
                )}
                kr
              </p>
            </div>
            <button className={styles.paymentButton} onClick={handleCheckout}>
              Continue to payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

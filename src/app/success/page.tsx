"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/success/page.module.scss";
import shoppingBagCheck from "@/app/assets/shoppingBagCheck.svg";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface OrderDetails {
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  orderNumber: string;
}

const Success = () => {
  const { data: session } = useSession();
  const user = session?.user;
  //const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    items: [],
    totalAmount: 0,
    customerName: "",
    orderNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    if (!session && !localStorage.getItem("guestOrder"))
      return router.push("/checkout");

    const clearCartFromServer = async () => {
      if (user?.id) {
        try {
          await fetch("/api/cart", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.id }),
          });
          console.log("Cart cleared from the server.");
        } catch (error) {
          console.error("Error clearing cart from server:", error);
        }
      }
    };

    const fetchSessionAndStoreOrder = async () => {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id"
      );

      if (!sessionId) {
        return router.push("/checkout");
      }

      const response = await fetch(
        `/api/stripe-session?session_id=${sessionId}`
      );
      const session = await response.json();
      const cart = JSON.parse(session.metadata.cart || "[]");

      const orderData = {
        user: user ? user.id : null,
        orderNumber: session.metadata.order_number,
        products: cart,
        totalPrice: session.amount_total / 100,
        paid: true,
      };

      console.log("Order data being sent:", orderData);

      // store guest order in ls if no user is logged in
      if (user?.id) {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        await clearCartFromServer();
      } else {
        localStorage.setItem("guestOrder", JSON.stringify(orderData));
      }

      setOrderDetails({
        items: cart,
        totalAmount: orderData.totalPrice,
        customerName: session.metadata.customer_name || "",
        orderNumber: session.metadata.order_number || "N/A",
      });

      //setOrderPlaced(true);
      setLoading(false);
      localStorage.removeItem("cartItems");
    };

    fetchSessionAndStoreOrder();
  }, [router, user, session]);

  console.log("orderDetails", orderDetails);

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.successPageContainer}>
      <div className={styles.cartImageSection}>
        <img
          src={shoppingBagCheck.src}
          className={styles.shoppingBagCheck}
          alt=""
        />
      </div>
      <div className={styles.successMessageSection}>
        <h1 className={styles.successMessageTitle}>
          Thank you {orderDetails.customerName}!
        </h1>
        <p className={styles.successMessageInfoText}>
          Your order has been successfully placed
        </p>
        <div>
          <p className={styles.orderNumberText}>
            Order number: <strong>{orderDetails.orderNumber}</strong>
          </p>
        </div>
      </div>
      <div className={styles.continueShoppingButtonSection}>
        <Link href="/" passHref>
          <button className={styles.shopMoreButton}>Shop more</button>
        </Link>
      </div>
      <div className={styles.orderDetailsTitleSection}>
        <h2 className={styles.orderDetailsText}>Your order details:</h2>
      </div>
      <div className={styles.orderDetailsSection}>
        {orderDetails.items.length > 0 ? (
          <ul className={styles.orderDetailsList}>
            {orderDetails.items.map((item) => (
              <li
                key={`${item._id}-${item.quantity}`}
                className={styles.orderItem}
              >
                <div className={styles.itemImageSection}>
                  <img
                    className={styles.itemImage}
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.itemNameAndPriceSection}>
                    <p className={styles.itemName}>
                      <strong>{item.name}</strong>
                    </p>
                    <p>
                      <strong>{item.price} SEK</strong>
                    </p>
                  </div>
                  <div className={styles.itemDetailsText}>
                    <p>Size: {item.size}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            It seems there was an issue with retrieving your order details.
            Please contact support
          </p>
        )}
        <div className={styles.totalAmountSection}>
          <h3>
            {" "}
            Total:{" "}
            <span className={styles.totalAmountText}>
              {orderDetails.totalAmount} SEK
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Success;

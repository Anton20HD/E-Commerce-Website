"use client";

import React, { use, useEffect, useState } from "react";
import styles from "@/app/dashboard/page.module.scss";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import HeartIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ReceiptIcon from "@mui/icons-material/Receipt";

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeLink, setActiveLink] = useState<
    "orders" | "wishlist" | "signout"
  >("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // const renderContent = () => {
  //   switch (activeLink) {
  //     case "orders":
  //       return <Orders />;
  //     case "wishlist":
  //       return <Wishlist />;
  //     case "signout":
  //       return <SignOut />;
  //     default:
  //       return <Orders />;
  //   }
  // };

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/login");
    }
  }, [session, status, router]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleWishlist = () => {
    router.push("/wishlist");
  };

  const fetchOrders = async () => {
    if (!session) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders");

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      } else {
        setError("There was an error fetching your orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("There was an error fetching your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeLink === "orders") {
      fetchOrders();
    }
  }, [activeLink]);

  if (!session) {
    return null; // Avoid rendering anything until redirect is handled
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardTitleContent}>
        <h1 className={styles.dashboardTitle}>Hello {session.user.name}!</h1>
      </div>
      <div className={styles.dashboardSection}>
        <div className={styles.profileOverviewSection}>
          <div
            className={`${styles["itemWrapper"]} ${
              activeLink === "orders" ? styles["active"] : ""
            }`}
            onClick={() => setActiveLink("orders")}
          >
            <ReceiptIcon />
            <span className={styles.itemName}>Orders</span>
          </div>

          <div
            className={`${styles["itemWrapper"]} ${
              activeLink === "wishlist" ? styles["active"] : ""
            }`}
            onClick={() => {
              setActiveLink("wishlist");
              handleWishlist();
            }}
          >
            <HeartIcon />
            <span className={styles.itemName}>Wishlist</span>
          </div>

          <div
            className={`${styles["itemWrapper"]} ${
              activeLink === "signout" ? styles["active"] : ""
            }`}
            onClick={() => {
              setActiveLink("signout");
              handleSignOut();
            }}
          >
            <ExitToAppIcon />
            <span className={styles.itemName}>Signout</span>
          </div>
        </div>
        <div className={styles.accountContent}>
          {activeLink === "orders" && (
            <div>
              <h2 className={styles.myOrdersTitle}>My orders</h2>

              {loading && <p>Loading orders</p>}
              {error && <p>{error}</p>}

              {!loading && !error && orders.length === 0 && (
                <p>You have no orders yet.</p>
              )}

              {orders.length > 0 && (
                <div>
                  {orders.map((order: any) => (
                    <div key={order._id} className={styles.orderCard}>
                      <div className={styles.orderStatusAndPriceSection}>
                        <h3 className={styles.orderNumber}>
                          Order: {order.orderNumber}
                        </h3>
                        <div className={styles.orderInfo}>
                          <p>
                            <b>Status: </b>
                            {order.paid ? "Paid" : "Unpaid"}
                          </p>
                          <p>
                            <b>Total Price: </b> {order.totalPrice} kr
                          </p>
                          <p>
                            <b>Ordered on: </b>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <ul className={styles.orderProductsSection}>
                        {order.products.map((product: any) => (
                          <li key={product._id} className={styles.productItem}>
                            <img
                              src={product.image}
                              alt={product.name}
                              className={styles.productImage}
                            />
                            {/* <span>
                              {product.name} - {product.size} x{" "}
                              {product.quantity} - ${product.price}
                            </span> */}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeLink === "wishlist" && <div></div>}
          {activeLink === "signout" && <div></div>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

"use client";

import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import styles from "@/app/login/page.module.scss";
import homeIcon from "@/app/assets/GymBeast.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorIcon from "@mui/icons-material/Error";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (session) {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Clear previous errors
    setEmailError(null);
    setPasswordError(null);
    setError(null);

    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      setEmailError("Email must be valid");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    // If validation fails, stop execution
    if (!isValid) return;

    try {
      const result = await signIn("credentials", {
        callbackUrl: "/dashboard",
        redirect: true, // prevents nextauth from redirecting automatically
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        console.log("Login succesful!");

        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
          const cartItems = JSON.parse(storedCart);

          if (cartItems > 0) {
            const response = await fetch("/api/cart", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId, cartItems }),
            });

            if (!response.ok) {
              setError("Failed to sync cart with the server");
              return;
            } else {
              localStorage.removeItem("cartItems"); // Clear data after successful syncing
              console.log("Cart synced with backend");
            }
          }
        }

        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        <div className={styles.iconWrapper}>
          <img className={styles.icon} src={homeIcon.src} alt="Home" />
        </div>
        <h1 className={styles.loginTitle}>Gymbeast Login</h1>
        <form onSubmit={handleSubmit} className={styles.orderInfo}>
          <div className={styles.inputInfo}>
            <div className={styles.shippingSection}>
              <h2 className={styles.shippingTitle}></h2>
            </div>

            <input
              className={styles.loginLabel}
              type="text"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.errorSection}>
              {emailError && (
                <p className={styles.errorText}>
                  <ErrorIcon />
                  {emailError}
                </p>
              )}
            </div>
            <input
              className={styles.loginLabel}
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className={styles.errorSection}>
              {passwordError && (
                <p className={styles.errorText}>
                  <ErrorIcon />
                  {passwordError}
                </p>
              )}
              {error && (
                <p className={styles.errorText}>
                  <ErrorIcon />
                  {error}
                </p>
              )}
            </div>
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
            <div className={styles.registrationSection}>
              <h3 className={styles.registrationText}>
                Don&apos;t have an account?{" "}
                <Link href={"/register"}>
                  <span className={styles.registrationSpanText}>
                    Sign up here!
                  </span>
                </Link>
              </h3>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

"use client";

import React, { useState } from "react";
import styles from "@/app/register/page.module.scss";
import homeIcon from "@/app/assets/GymBeast.svg";
import Link from "next/link";
import ErrorIcon from "@mui/icons-material/Error";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [password2Error, setPassword2Error] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Clear previous errors
    setEmailError(null);
    setNameError(null);
    setPasswordError(null);
    setPassword2Error(null);
    setError(null);

    let isValid = true;

    //Email validation
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      setEmailError("Email must be valid");
      isValid = false;
    }

    //Firstname and Lastname validation
    if (!firstName || !lastName) {
      setNameError("Name is required");
      isValid = false;
    } else if (
      !/^[A-Za-z0-9!?\s]+$/.test(firstName) ||
      !/^[A-Za-z0-9!?\s]+$/.test(lastName)
    ) {
      setNameError("Please only use characters, numbers or ! and ?");
      isValid = false;
    } else if (firstName.length > 20 || lastName.length > 20) {
      setNameError("Name must be less than 20 characters");
      isValid = false;
    }

    //Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
    ) {
      setPasswordError("Password must be valid");
      isValid = false;
    } else if (password !== password2) {
      setPassword2Error("Passwords must match");
      isValid = false;
    }

    // If validation fails, stop execution
    if (!isValid) return;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmail("");
        setFirstName("");
        setLastName("");
        setPassword("");
        setPassword2("");
        console.log("Registration successful!");
        router.push("/login");
      } else {
        if (data.code === "USER_EXIST") {
          setEmailError(data.message);
        } else {
          setError(data.message || "Invalid credentials. Please try again");
        }
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An error occured. Please try again");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerContent}>
        <div className={styles.iconWrapper}>
          <img className={styles.icon} src={homeIcon.src} alt="Home" />
        </div>
        <h1 className={styles.registerTitle}>Gymbeast Signup</h1>
        <form onSubmit={handleSubmit} className={styles.orderInfo}>
          <div className={styles.inputInfo}>
            <div className={styles.shippingSection}>
              <h2 className={styles.shippingTitle}></h2>
            </div>

            <input
              className={styles.registerLabel}
              type="text"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
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
              className={styles.registerLabel}
              type="text"
              placeholder="First Name"
              name="firstName"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setNameError(null);
              }}
            />
            <div className={styles.errorSection}>
              {nameError && (
                <p className={styles.errorText}>
                  <ErrorIcon />
                  {nameError}
                </p>
              )}
            </div>
            <input
              className={styles.registerLabel}
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setNameError(null);
              }}
            />
            <div className={styles.errorSection}>
              {nameError && (
                <p className={styles.errorText}>
                  <ErrorIcon />
                  {nameError}
                </p>
              )}
            </div>
            <input
              className={styles.registerLabel}
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null);
              }}
            />
            <div className={styles.errorSection}>
              {passwordError && (
                <p className={styles.errorText}>
                  <ErrorIcon />
                  {passwordError}
                </p>
              )}
            </div>
            <input
              className={styles.registerLabel}
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={password2}
              onChange={(e) => {
                setPassword2(e.target.value);
                setPassword2Error(null);
              }}
            />
            <div className={styles.errorSection}>
              {password2Error && (
                <p className={styles.errorText}>
                  <ErrorIcon />
                  {password2Error}
                </p>
              )}
            </div>
            <button type="submit" className={styles.registerButton}>
              Register
            </button>
            <div className={styles.loginSection}>
              <h3 className={styles.loginText}>
                Already have an account?{" "}
                <Link href={"/login"}>
                  <span className={styles.loginSpanText}>Login!</span>
                </Link>
              </h3>
            </div>
          </div>
        </form>
        {error && (
          <div className={styles.errorSection}>
            <p className={styles.errorText}>
              <ErrorIcon />
              {error}
            </p>
          </div>
           )}
      </div>
    </div>
  );
};

export default RegisterPage;

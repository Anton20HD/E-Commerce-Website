"use client";

import React, { useState } from "react";
import styles from "@/app/checkout/page.module.scss";
import { useCart } from "@/app/components/cartContext/page";
import { loadStripe } from "@stripe/stripe-js";
import ErrorIcon from '@mui/icons-material/Error';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Checkout = () => {
  const { cart, calculateTotalPrice } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [cityError, setCityError] = useState<string | null>(null);
  const [postalCodeError, setPostalCodeError] = useState<string | null>(null);
  const [streetAddressError, setStreetAddressError] = useState<string | null>(
    null
  );
  const [countryError, setCountryError] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    setNameError(null);
    setEmailError(null);
    setPostalCodeError(null);
    setStreetAddressError(null);
    setCountryError(null);
    setCityError(null);

    let valid = true;

    if (!name) {
      setNameError("Name is required");
      valid = false;
    }

    if(typeof name !== "string") {
      setNameError("Name must be characters")
      valid = false;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Valid email is required");
      valid = false;
    }
    if (!city) {
      setCityError("City is required");
      valid = false;
    }

    if(typeof city !== "string") {
      setNameError("Name must be characters")
      valid = false;
    }

    if (!postalCode) {
      setPostalCodeError("Postal code is required");
      valid = false;
    }

    if(isNaN(Number(postalCode))) {
      setNameError("Postal code must be in numbers")
      valid = false;
    }

    if (!streetAddress) {
      setStreetAddressError("Street address is required");
      valid = false;
    }

    if (!country) {
      setCountryError("Country is required");
      valid = false;
    }

    if(typeof country !== "string") {
      setNameError("Country must be characters")
      valid = false;
    }

    if (!valid) return;

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
        user: {
          name,
          email,
          city,
          postalCode,
          streetAddress,
          country,
        },
      }),
    });

    if (!response.ok) {
      console.error("Error creating Stripe session");
      return;
    }

    const { sessionId } = await response.json();

    localStorage.setItem(
      "guestOrder",
      JSON.stringify({
        sessionId,
        cart,
        user: { name, email, city, postalCode, streetAddress, country },
      })
    );

    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
  };

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutTitleSection}>
        <h1 className={styles.checkoutTitle}>Checkout</h1>
      </div>
      <div className={styles.productContent}>
        <div className={styles.cartSection}>
          <h2 className={styles.cartTitle}>Your Cart</h2>
        </div>
        {cart.map((item) => (
          <div key={`${item._id}-${item.size}`} className={styles.cartItem}>
            <img
              src={item.image}
              alt={item.name}
              className={styles.cartItemImage}
            />
            <div className={styles.itemDetails}>
              <h3 className={styles.itemName}>{item.name}</h3>
              <p>Size: {item.size}</p>
              <p className={styles.itemPrice}>
                {calculateTotalPrice(item._id, item.size ?? "", item.price)} kr
              </p>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <form className={styles.orderInfo} onSubmit={handleCheckout}>
          <div className={styles.inputInfo}>
            <div className={styles.shippingSection}>
              <h2 className={styles.shippingTitle}>Shipping address</h2>
            </div>

            <input
              className={styles.checkoutLabel}
              type="text"
              placeholder="Name"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
            />

            <div className={styles.errorSection}>
            {nameError && <p className={styles.errorText}><ErrorIcon/>{nameError}</p>}
            </div>
       
            <input
              className={styles.checkoutLabel}
              type="text"
              placeholder="Email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className={styles.errorSection}>
            {emailError && <p className={styles.errorText}><ErrorIcon/>{emailError}</p>}
            </div>

            <input
              className={styles.checkoutLabel}
              type="text"
              placeholder="City"
              value={city}
              name="city"
              onChange={(e) => setCity(e.target.value)}
            />

        
            <div className={styles.errorSection}>
            {cityError && <p className={styles.errorText}><ErrorIcon/>{cityError}</p>}
            </div>

            <div className={styles.addressLabel}>
              <input
                className={styles.checkoutLabel}
                type="text"
                placeholder="Postal Code"
                value={postalCode}
                name="postalCode"
                onChange={(e) => setPostalCode(e.target.value)}
              />

            <div className={styles.errorSection}>
            {postalCodeError && <p className={styles.errorText}><ErrorIcon/>{postalCodeError}</p>}
            </div>

            
              <input
                className={styles.checkoutLabel}
                type="text"
                placeholder="Street Address"
                value={streetAddress}
                name="streetAddress"
                onChange={(e) => setStreetAddress(e.target.value)}
              />

            <div className={styles.errorSection}>
            {streetAddressError && <p className={styles.errorText}><ErrorIcon/>{streetAddressError}</p>}
            </div>

          
            </div>
            <input
              className={styles.checkoutLabel}
              type="text"
              placeholder="Country"
              value={country}
              name="country"
              onChange={(e) => setCountry(e.target.value)}
            />

            <div className={styles.errorSection}>
            {countryError && <p className={styles.errorText}><ErrorIcon/>{countryError}</p>}
            </div>

          </div>
          <div className={styles.totalPriceSection}>
            <p className={styles.totalLabel}>Total</p>
            <p className={styles.totalPrice}>
              {cart.reduce(
                (total, item) =>
                  total +
                  calculateTotalPrice(item._id, item.size ?? "", item.price),
                0
              )}{" "}
              kr
            </p>
          </div>
          <button type="submit" className={styles.paymentButton}>
            Pay now
          </button>
        </form>
      )}
    </div>
  );
};

export default Checkout;

"use client";

import React, { useState } from "react";
import styles from "@/app/components/header/page.module.scss";
import homeIcon from "@/app/assets/GymBeast.svg";
import SearchBar from "../searchBar/page";
import HeartIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlineOutlined";
import CartIcon from "@mui/icons-material/LocalMallOutlined";
import ButtonContent from "../buttons/page";
import Link from "next/link";
import Cart from "../cart/page";
import { useCart } from "../cartContext/page";
import { useWishlist } from "../wishlistContext/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isCartVisible, setIsCartVisible] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const {data: session } = useSession();
  const router = useRouter();

  const toggleCart = () => {
    setIsCartVisible((prevState) => !prevState);
  };


  const handleProfileClick = () => {
    if (session) {
      router.push("/dashboard"); //Navigate to dashboard if logged in
    } else {
      router.push("/login"); // Navigate to login if not logged in
    }
  };

  return (
    <>
      {isCartVisible && (
        <div className={styles.overlay} onClick={toggleCart}></div>
      )}

      <div className={styles.headerContent}>
        <div className={styles.iconContent}>
          <Link href="/" passHref>
            <div className={styles.iconWrapper}>
              <img className={styles.icon} src={homeIcon.src} alt="Home" />
            </div>
          </Link>
        </div>
        <ButtonContent />
        <div className={styles.searchBarContent}>
          <SearchBar />
        </div>
        <div className={styles.iconsContent}>
          <div className={styles.wishlistButton}>
            <Link href={"/wishlist"}>
              <HeartIcon className={styles.heartIcon} />
            </Link>
            {wishlist.length > 0 && (
              <div className={styles.wishlistCounter}>{wishlist.length}</div>
            )}
          </div>
          <div className={styles.profileButton} onClick={handleProfileClick}>
            <PersonIcon className={styles.personIcon} />
          </div>
          <div className={styles.cartButton} onClick={toggleCart}>
            <CartIcon />
            {cart.length > 0 && (
              <div className={styles.cartCounter}>{cart.length}</div>
            )}
          </div>
        </div>
        <Cart toggleMenu={toggleCart} isVisible={isCartVisible} />
      </div>
    </>
  );
};

export default Header;

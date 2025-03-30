"use client";

import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import homeIcon from "@/app/assets/GymBeast.svg";
import SearchBar from "../SearchBar/SearchBar";
import SearchIcon from "@mui/icons-material/Search";
import HeartIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlineOutlined";
import CartIcon from "@mui/icons-material/LocalMallOutlined";
import ButtonContent from "../Buttons/Buttons";
import Link from "next/link";
import Cart from "../Cart/Cart";
import { useCart } from "../CartContext/CartContext";
import { useWishlist } from "../WishlistContext/WishlistContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Header = () => {
  const { cart, isVisible, toggleMenu } = useCart();
  const { wishlist } = useWishlist();
  const { data: session } = useSession();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible((prevState) => !prevState);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleProfileClick = () => {
    if (session) {
      router.push("/dashboard"); //Navigate to dashboard if logged in
    } else {
      router.push("/login"); // Navigate to login if not logged in
    }
  };

  return (
    <>
      {isVisible && <div className={styles.overlay} onClick={toggleMenu}></div>}

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
          {!isMobile ? (
            <SearchBar
              isDropdownVisible={isDropdownVisible}
              toggleDropdown={toggleDropdown}
            />
          ) : (
            <div
              className={styles.searchIcon}
              onClick={() => {
                setIsDropdownVisible(true);
              }}
            >
              <SearchIcon />
            </div>
          )}
        </div>

        {isMobile && isDropdownVisible && (
          <div className={styles.mobileSearchOverlay}>
            <SearchBar
              isDropdownVisible={isDropdownVisible}
              toggleDropdown={toggleDropdown}
            />
          </div>
        )}
        
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
          <div className={styles.cartButton} onClick={toggleMenu}>
            <CartIcon />
            {cart.length > 0 && (
              <div className={styles.cartCounter}>{cart.length}</div>
            )}
          </div>
        </div>
        <Cart />
      </div>
    </>
  );
};

export default Header;

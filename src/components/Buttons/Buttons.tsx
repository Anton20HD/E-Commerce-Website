"use client";

import React, { useState } from "react";
import styles from "@/components/Buttons/Buttons.module.scss";
import Link from "next/link";

const ButtonContent = () => {
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const handleMouseEnter = (link: string) => {
    setActiveLink(link);
  };

  const handleMouseLeave = () => {
    setActiveLink(null);
  };

  return (
    <div className={styles.buttonContainer}>
      <div className={styles.buttonContent}>

      <Link href="/apparel">
      <button
        className={`${styles.headerButtons} ${
          activeLink === "apparel" ? styles.active : ""
        }`}
        onMouseEnter={() => handleMouseEnter("apparel")}
        onMouseLeave={handleMouseLeave}
      >
        APPAREL
      </button>
      </Link>

      <Link href="/accessories">
      <button
        className={`${styles.headerButtons} ${
          activeLink === "accessories" ? styles.active : ""
        }`}
        onMouseEnter={() => handleMouseEnter("accessories")}
        onMouseLeave={handleMouseLeave}
        >
        ACCESSORIES
      </button>
        </Link>
      </div>
    </div>
  );
};

export default ButtonContent;

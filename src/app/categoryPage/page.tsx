import React from "react";
import styles from "@/app/categoryPage/page.module.scss";
import clothesImg from "@/app/assets/clothes.jpg";
import accessoriesImg from "@/app/assets/accessories.jpeg";
import Link from "next/link";
//import Image from "next/image";

const CategoryPage = () => {
  return (
    <div className={styles.categoryContainer}>
      <div className={styles.categorySection}>
        <div className={styles.imageWrapper}>
          <img className={styles.clothesImg} src={clothesImg.src} alt=""  /> 
          <Link href="/apparel">
            <button className={styles.categoryButton}>Apparel</button>
          </Link>
        </div>

        <div className={styles.imageWrapper}>
          <img
            className={styles.accessoriesImg}
            src={accessoriesImg.src}
            alt=""
          />
          <Link href="/accessories">
            <button className={styles.categoryButton}>Accessories</button>
          </Link>
        </div>
      </div>
      <div className={styles.buttonSection}></div>
    </div>
  );
};

export default CategoryPage;

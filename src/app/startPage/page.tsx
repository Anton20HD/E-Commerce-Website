"use client";

import React from "react";
import styles from "@/app/startPage/page.module.scss";
//import Products from "@/app/components/products/page";
import CategoryPage from "@/app/categoryPage/page";

const StartPage = () => {
  // const [products, setProducts] = useState([]);
  // useEffect(() => {
  //   fetch("")
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       setProducts(data);
  //     });
  // }, []);

  return (
    <div className={styles.startPageContainer}>
      <div className={styles.videoSection}>
        <video
          className={styles.video}
          src="/videos/running.mp4"
          autoPlay
          loop
          muted
        />
      </div>

      {/* <Products /> */}
      <CategoryPage />
    </div>
  );
};

export default StartPage;

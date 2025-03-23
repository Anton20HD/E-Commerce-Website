// import React, { useState } from "react";
// import styles from "@/app/components/products/page.module.scss";
// import picture from "@/app/assets/white-t-shirt.png";
// import HeartIcon from "@mui/icons-material/FavoriteBorderOutlined";
// import ArrowLeftIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
// import ArrowRightIcon from "@mui/icons-material/ArrowForwardIosOutlined";

// const ImageSlider = () => {
//   const [slide, setSlide] = useState(0);
//   const itemsPerSlide = 4; // Number of items shown at once

//   // calculate maximun slide index
//   const maxSlide = Math.ceil(products.length / itemsPerSlide) - 1;

//   const nextSlide = () => {
//     if (slide < Math.ceil(products.length / itemsPerSlide) - 1) {
//       setSlide(slide + 1);
//     }
//   };

//   const prevSlide = () => {
//     if (slide > 0) {
//       setSlide(slide - 1);
//     }
//   };


//   //ContentWrapper is essential if you want to change the position of the heading aswell and just not 1 element

//   return (
//     <div className={styles.cardContainer}>
//       <div className={styles.contentWrapper}>   
//        <h1 className={styles.cardHeading}>Latest Drops</h1>
//       <div className={styles.sliderWrapper}>
//         <div
//           className={styles.productSection}
//           style={{ transform: `translateX(-${slide * 30}%)` }} // Shifts the element horizontally along the X-axis.
//         >
//           {products.map((product, index) => (
//             <div className={styles.card} key={index}>
//               <div className={styles.cardWrapper}>
//                 <button className={styles.wishList}>
//                   <HeartIcon className={styles.heartIcon} />
//                 </button>
//                 <img
//                   className={styles.cardImage}
//                   src={product.image.default.src}
//                   height={290}
//                   width={230}
//                   key={index}
//                   alt=""
//                 />
//               </div>
//               <div className={styles.cardDetails}>
//                 <h3 className={styles.cardTitle}>{product.title}</h3>
//                 <p className={styles.cardPrice}>{product.price} kr</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className={styles.arrowSection}>
//         <button
//           className={styles.arrowLeft}
//           onClick={prevSlide}
//           disabled={slide === 0}
//           style={{
//             opacity: slide === 0 ? 0.5 : 1,
//             cursor: slide === 0 ? "default" : "pointer",
//           }}
//         >
//           <ArrowLeftIcon className={styles.arrows} />
//         </button>
//         <button
//           className={styles.arrowRight}
//           onClick={nextSlide}
//           disabled={slide === maxSlide}
//           style={{
//             opacity: slide === maxSlide ? 0.5 : 1,
//             cursor: slide === maxSlide ? "default" : "pointer"
//           }}
//         >
//           <ArrowRightIcon className={styles.arrows}  />
//         </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageSlid½;

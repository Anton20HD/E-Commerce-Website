"use client"

import React, { useEffect, useState } from "react";
import styles from "./RelatedProducts.module.scss";
import { useRouter } from "next/navigation";

interface RelatedProducts {
  _id: string;
  name: string;
  price: number;
  image: string[];
}

interface RelatedProductsProps {
  category: string;
  subCategory: string;
  currentProductId: string;
}

const RelatedProducts = ({category,subCategory,currentProductId,}: RelatedProductsProps) => {

  const [relatedProducts, setRelatedProducts] = useState<RelatedProducts[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);
      setError(null); //Reset error state before fetching
      try {
        const response = await fetch(
          `/api/products/related?category=${category}&subCategory=${subCategory}&excludeId=${currentProductId}`
        );
        if (!response.ok) throw new Error("Failed to fetch related products");
        const data: RelatedProducts[] = await response.json();
        setRelatedProducts(data);
      } catch (error) {
        console.error("Error fetching related products:", error);
        setError("Failed to load related products");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category, subCategory, currentProductId]);

  const handleProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  if (loading) return <div>Loading related products..</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.relatedProductContainer}>
        <div>
        <h3 className={styles.relatedProductTitle}>Dont miss our other products!</h3>
        </div>
    <div className={styles.relatedProductSection}>
      {relatedProducts.length === 0 ? (
        <div>No related products found</div>
      ) : (
        relatedProducts.map((relatedProduct) => (
          <div
            key={relatedProduct._id}
            className={styles.contentWrapper}
            onClick={() => handleProduct(relatedProduct._id)}
          >
            <div className={styles.productCard}>
              {relatedProduct.image.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={relatedProduct.name}
                  className={styles.productImage}
                />
              ))}
            </div>
            <h2 className={styles.productName}>{relatedProduct.name}</h2>
            <p className={styles.productPrice}>{relatedProduct.price} kr</p>
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default RelatedProducts;

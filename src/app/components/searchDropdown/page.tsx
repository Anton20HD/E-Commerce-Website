"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useSearch } from "../searchContext/page";
import styles from "@/app/components/searchDropdown/page.module.scss";
import HeartIcon from "@mui/icons-material/FavoriteBorderOutlined";
import homeIcon from "@/app/assets/GymBeast.svg";
import CloseIcon from "@mui/icons-material/Close";

interface SearchDropdownProps {
  toggleDropdown: () => void;
  isVisible: boolean;
}

const ProductSearchDropdown = ({
  toggleDropdown,
  isVisible,
}: SearchDropdownProps) => {
  const { searchTerm, setSearchTerm, filteredProducts } = useSearch();
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showNoResults, setShowNoResults] = useState(false);

  useEffect(() => {
    const storedSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    setRecentSearches(storedSearches);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setShowNoResults(false); // reset no results when search is cleared
      return;
    }

    const timeoutId = setTimeout(() => {
      if (filteredProducts.length === 0) {
        setShowNoResults(true);
      }
    }, 500); //(500ms)

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filteredProducts]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const matchedProduct = filteredProducts.find((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    toggleDropdown(); // Close the dropdown

    if (matchedProduct) {
      const route = matchedProduct.category.toLowerCase();
      router.push(`/${route}/${matchedProduct._id}`);
    } else {
      // Navigate to search page if no searchword is matching
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }

    setSearchTerm(searchQuery);
    const updatedSearches = [searchQuery, ...recentSearches].slice(0, 3); //stores last 3 searches
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);
  };

  const handleProduct = (productId: string, category: string) => {
    toggleDropdown();
    setSearchTerm("");
    const route = category.toLowerCase();
    router.push(`/${route}/${productId}`);
  };

  const handlecloseDropdown = () => {
    toggleDropdown();
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent page from reloading
      handleSearch(searchTerm);
    }
  };

  return (
    <div
      className={`${styles.searchDropdownContainer} ${
        isVisible ? styles.open : ""
      }`}
    >
      <div className={styles.searchBarContent}>
        <div className={styles.iconContent}>
          <img className={styles.icon} src={homeIcon.src} alt="Home" />
        </div>
        <Paper
          component="form"
          className={styles.searchBar}
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
            backgroundColor: "#f4f4f4",
            boxShadow: "none",
            borderRadius: "20px",
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label="menu">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="What are you looking for?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            inputProps={{ "aria-label": "search clothes" }}
          />
        </Paper>

        <div className={styles.navCloseIconContent}>
          <div
            className={styles.closeIconWrapper}
            onClick={handlecloseDropdown}
          >
            <CloseIcon className={styles.closeIcon}></CloseIcon>
          </div>
        </div>
      </div>

      <div className={styles.productSection}>
        {searchTerm && filteredProducts.length === 0 && showNoResults && (
          <div className={styles.noResultsSection}>
            <h2 className={styles.noResultsTitle}>No results found</h2>
            <p className={styles.noResultsText}>
            We didn&apos;t find anything for &quot;{searchTerm}&quot;
            </p>
          </div>
        )}

        {searchTerm &&
          filteredProducts.map((product) => (
            <div key={product._id} onClick={() => handleProduct(product._id, product.category)}>
              <div className={styles.productCard}>
                <div className={styles.buttonContent}>
                  <button className={styles.wishList}>
                    <HeartIcon className={styles.heartIcon} />
                  </button>
                </div>
                {product.image.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={product.name}
                    className={styles.productImage}
                  />
                ))}
              </div>
              <h2 className={styles.productName}>{product.name}</h2>
              <p className={styles.productPrice}>{product.price} kr</p>
            </div>
          ))}

        {!searchTerm && recentSearches.length > 0 && (
          <div className={styles.recentSearchesSection}>
            <p className={styles.recentSearchesTitle}>Recent Searches:</p>
            {recentSearches.map((search, index) => (
              <li
                key={index}
                onClick={() => handleSearch(search)}
                className={styles.recentSearchItem}
              >
                <SearchIcon />
                {search}
              </li>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearchDropdown;

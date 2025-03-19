"use client";

import React, { useState } from "react";
import styles from "./page.module.scss";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ProductSearchDropdown from "../searchDropdown/page";

const SearchBar = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible((prevState) => !prevState);
  };


  return (
    <>
    {isDropdownVisible && (
      <div className={styles.overlay} onClick={toggleDropdown}></div>
    )}
    <div className={styles.searchBarContainer}>
      <Paper
        component="form"
        onClick={toggleDropdown}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 260,
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
          placeholder="What are you looking for?.."
          inputProps={{ "aria-label": "search clothes" }}
        />
      </Paper>
      <ProductSearchDropdown toggleDropdown={toggleDropdown} isVisible={isDropdownVisible}/>
    </div>
    </>
  );
};

export default SearchBar;

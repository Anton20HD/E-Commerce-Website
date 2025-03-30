"use client";

import React  from "react";
import styles from "./SearchBar.module.scss";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ProductSearchDropdown from "../SearchDropdown/SearchDropdown";

interface SearchBarProps {
  isDropdownVisible: boolean;
  toggleDropdown: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isDropdownVisible, toggleDropdown }) => {

  return (
    <>
    {isDropdownVisible && (
      <div className={styles.overlay} onClick={toggleDropdown}></div>
    )}
    <div className={styles.searchBarContainer}>
      <Paper
        component="form"
        onClick={(e) => {

          e.stopPropagation();
          toggleDropdown(); 
        }}
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
      {isDropdownVisible && <ProductSearchDropdown toggleDropdown={toggleDropdown} isVisible={isDropdownVisible} />}
    </div>
    </>
  );
};

export default SearchBar;

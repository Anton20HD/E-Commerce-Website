"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import ArrowRightIcon from '@mui/icons-material/ArrowRightAlt';
import styles from "./NewsLetterBar.module.scss";

const NewsLetterBar = () => {
  // const [searchQuery, setSearchQuery] = useState<string>("");
  // const router = useRouter();

  return (
    <Paper
    className={styles.newsLetterBar}
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 260,
        backgroundColor: "#f4f4f4",
        boxShadow: "none",
        borderRadius: "5px"
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Email adress.."
        inputProps={{ "aria-label": "Enter email" }}
      />
       <IconButton sx={{ p: "10px" }} aria-label="menu">
        <ArrowRightIcon />
      </IconButton>
     
    </Paper>
  );
};

export default NewsLetterBar;

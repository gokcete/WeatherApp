import React from "react";
import logo from "../logo.png";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img className={styles.img} src={logo} alt="logo" />
          <h3>MyWeather</h3>
        </div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </header>
    </>
  );
};

export default Header;

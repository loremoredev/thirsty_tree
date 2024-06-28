import React, { useEffect, useState } from "react";
import "../css/Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <p className="footer-content">
        <Link to="/blog">blog</Link>
      </p>
    </div>
  );
};

export default Footer;

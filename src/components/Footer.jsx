import React, { useEffect, useState } from "react";
import "../css/Footer.css";
import { getData } from "../modules/octokit";

const Footer = () => {
  const [date, setDate] = useState("");
  useEffect(() => {
    getData(setDate);
  }, []);
  return (
    <div className="footer">
      <p className="footer-content">Last updated on {date}</p>
    </div>
  );
};

export default Footer;

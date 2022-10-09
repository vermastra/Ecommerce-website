import React from "react";
import playStore from "../../../images/playStore.png";
import appStore from "../../../images/appStore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h2>Shopii.</h2>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2022 &copy; Aditya Verma</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="http://instagram.com/vermastra">Instagram</a>
        <a href="https://www.linkedin.com/in/aditya-verma-554b42217">LinkedIn</a>
        <a href="https://m.facebook.com/100015889993034/">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
import React from "react";

function Footer() {
  return (
    <footer>
      <div className="blue window">
        <p>
          &copy; {new Date().getFullYear()} Detroit - A Crypto faucet. All rights reserved.
          Made by <a href="https://alansaji-portfolio.netlify.app/">Alan Saji</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;

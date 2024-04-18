import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import {BrowserRouter, Link, Switch, Route} from "react-router-dom";
import homeImage from "../../assets/home-img.png";
import Minter from "./Minter";
import Gallery from "./Gallery";
import { openNFT } from "../../../declarations/openNFT";
import CURRENT_USER_ID from "../index";
import { Principal } from "@dfinity/principal";


function Header() {
  const [userOwnedGallery, setUserOwnedGallery] = useState();
  const [ListingGallery, setListingGallery] = useState();



  async function getNFTs() {
    
    const userNFTids = await openNFT.getOwnedNFTs(CURRENT_USER_ID);
    console.log(userNFTids);
    setUserOwnedGallery(<Gallery title="My NFTs" ids={userNFTids} role="collection"/> )

    const listedNFTids = await openNFT.getListedNFTs();
    console.log(listedNFTids);
    setListingGallery(<Gallery title="Discover" ids={listedNFTids} role="discover"/>)
  }
  useEffect(() => {
    getNFTs();
  },[])

  return (
    <BrowserRouter forceRefresh={true}>
    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>
          <Link to="/">
          <h5 className="Typography-root header-logo-text">OpenNFT</h5>
          </Link>
          
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">

            <Link to="/discover">
            Discover
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/minter">  
            Minter
            </Link>
           
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/collection">
            My NFTs
            </Link>
            
          </button>
        </div>
      </header>
    </div>
    <Switch>
    
    <Route path="/discover">
    {ListingGallery}
    </Route>
    
    <Route path="/minter">
      <Minter/>
    </Route>
    <Route path="/collection">
      {userOwnedGallery}
    </Route>
    <Route exact path="/">
      <img className="bottom-space" src={homeImage} />
    </Route>
    </Switch>
    </BrowserRouter>
  );
}

export default Header;

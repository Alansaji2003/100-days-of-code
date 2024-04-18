import React, { useEffect, useState } from "react";
import {Actor, HttpAgent} from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIdlFactory } from "../../../declarations/token";
import { openNFT } from "../../../declarations/openNFT";
import Button from "./Button";
import { Principal } from "@dfinity/principal";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) {
  const [name, setName] = useState();
  const [owner, SetOwner] = useState();
  const [image, SetImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setloaderHidden] = useState(true);
  const [blur, setblur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();
  const [shouldDisplay, setDisplay] = useState(true);

  const id = props.id;
  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({host : localHost});      //to call nft canister http request is needed
  agent.fetchRootKey(); //remove this when deploying live!

  let NFTActor;

  async function loadNFT(){
    NFTActor =  await Actor.createActor(idlFactory,{
      agent,
      canisterId: id,
    });


    const name = await NFTActor.getName();
    setName(name)

    const owner = await NFTActor.getOwner();
    SetOwner(owner.toText());

    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(new Blob([imageContent.buffer], {type:"image/png"}))
    SetImage(image);

    if(props.role == "collection"){
      const nftIsListed = await openNFT.isListed(props.id);


      if(nftIsListed){
      SetOwner("OpenNFT");
      setblur({ filter : "blur(4px)"});
      setSellStatus(" (Listed)");
      }else{
        setButton(<Button handleClick={handleSell} text={"sell"}/>);
      }
    }else if(props.role == "discover"){
      const originalOwner = await openNFT.getOriginalOwner(props.id);
      if(originalOwner.toText() != CURRENT_USER_ID.toText()){
        setButton(<Button handleClick={handleBuy} text={"Buy"}/>);
      }

      const price = await openNFT.getListedNFTPrice(props.id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()}/>)
    }
    
    

  }
  useEffect(()=> {
    loadNFT();
  }, [])

let price;
function handleSell(){

  console.log("Sell clicked")
  setPriceInput(<input
    placeholder="Price in DLN"
    type="number"
    className="price-input"
    value={price}
    onChange={(e) => price=e.target.value}
  />)

  setButton(<Button handleClick={sellItem} text={"confirm"}/>)
}

async function sellItem() {
  setblur({ filter : "blur(4px)"});
  setloaderHidden(false)
  console.log("SetPrice "+price)
  const listingResult = await openNFT.listItem(props.id, Number(price))
  console.log("ListingResult "+listingResult);

  if(listingResult == "Success"){
    const openNFTId = await openNFT.getOpenNFTCanisterID();
    const transferResult = await NFTActor.transferOwnerShip(openNFTId)
    console.log("transfer"+transferResult);
    if(transferResult == "Success"){
      setloaderHidden(true);
      setButton();
      setPriceInput();
      SetOwner("OpenNFT");
      setSellStatus(" (Listed)");
    }
  }
}
async function handleBuy(){
  setloaderHidden(false)
  console.log("Buy was triggred");
  const tokenActor = await Actor.createActor(tokenIdlFactory,{
    agent,
    canisterId: Principal.fromText("sbzkb-zqaaa-aaaaa-aaaiq-cai"),
  });

  const sellerId = await openNFT.getOriginalOwner(props.id);
  const itemPrice = await openNFT.getListedNFTPrice(props.id);


 const result =  await tokenActor.transfer(sellerId, itemPrice);
//  console.log(result);
if(result == "Success"){
  //transfer ownership
  const tranferResult =   await openNFT.completePurchase(props.id, sellerId, CURRENT_USER_ID);
  console.log("Purchase "+tranferResult);
  setloaderHidden(true);
  setDisplay(false);
}
};

  return (
    <div style={{display : shouldDisplay?"inline":"none"}} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text">{sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;

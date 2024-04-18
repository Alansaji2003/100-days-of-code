import React, { useState } from "react";
import {token, canisterId, createActor} from "../../../declarations/token";
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';


function Transfer() {
  
  const [recpientId, setID] = useState("");
  const [amount, setAmount] = useState("");
  const [FeedBackText, SetText] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [isHidden, setHidden] = useState(true);


  async function handleClick() {
    
    setDisabled(true);
    const recipient = Principal.fromText(recpientId);
    const amountToTransfer = Number(amount);

    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      }
    });

    const result = await authenticatedCanister.transfer(recipient,amountToTransfer);
    SetText(result);
    setHidden(false);
    setDisabled(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recpientId}
                onChange={(e)=> setID(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e)=> setAmount(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={isDisabled} >
            Transfer
          </button>
        </p>
        <p hidden={isHidden}>
            {FeedBackText}!!
          </p>

      </div>
    </div>
  );
}

export default Transfer;

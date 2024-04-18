import React, { useState } from "react";
import {token, canisterId, createActor} from "../../../declarations/token";
import { AuthClient } from '@dfinity/auth-client';

function Faucet(props) {

  const [isDisabled, setDisabled] = useState(false);
  const [ButtonText, SetText] = useState("Get DLN");

  async function handleClick(event) {
    setDisabled(true);

    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();

    const authenticatedCanister = createActor(canisterId, {
      agentOptions:{
        identity,
      },
    });

    const result = await authenticatedCanister.payOut();
    SetText(result);
    //setDisabled(false);

  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free Det-Lan tokens here! Claim 10,000 DLN coins to {props.userPrincipal}.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={isDisabled}>
          {ButtonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;

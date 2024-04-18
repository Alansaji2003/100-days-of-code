import ReactDOM from 'react-dom'
import React from 'react'
import App from "./components/App";
import { AuthClient } from '@dfinity/auth-client';


const init = async () => { 
  

  const authClient = await AuthClient.create();

  if(await  authClient.isAuthenticated()){
    console.log("Logged_In");
    handleAuth(authClient);
  }else{
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#autherize",
      onSuccess: () =>{
        handleAuth(authClient);
      }
    });
  }
  }
  

async function handleAuth(authClient){
  const identity = await authClient.getIdentity();
  const userPrincipal = identity._principal.toString();
  console.log(userPrincipal);
  ReactDOM.render(<App loggedInPrincipal={userPrincipal}/>, document.getElementById("root"));
}

init();



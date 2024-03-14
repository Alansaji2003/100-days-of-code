import React from "react";
import Form from "./Form";

var userIsRegistered = false;      //try changing this to true

function App() {
  return (
    <div className="container">
      <Form isRegistered={userIsRegistered} />
    </div>
  );
}

export default App;

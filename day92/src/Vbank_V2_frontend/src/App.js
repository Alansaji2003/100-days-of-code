// Import necessary modules and components
import { html, render } from 'lit-html';
import { Vbank_V2_backend } from 'declarations/Vbank_V2_backend';
import logo from "./Vbank_logo.svg";

class App {
  currentAmount = 0.00;
  
  constructor() {
    this.#render();
  }

  #handleSubmit = async (e) => {
    e.preventDefault();
    const button = e.target.querySelector("#submit-btn");

    const inputAmount = parseFloat(document.getElementById("input-amount").value);
    const outputAmount = parseFloat(document.getElementById("withdrawal-amount").value);
    if(document.getElementById("input-amount").value.length != 0){
      button.setAttribute("disabled", true);
      await Vbank_V2_backend.topUp(inputAmount);    //top up function from motoku
      
    }
    if(document.getElementById("withdrawal-amount").value.length != 0){
      button.setAttribute("disabled", true);
      await Vbank_V2_backend.withdraw(outputAmount);    //withdraw from motoku
    }

    await Vbank_V2_backend.calculateCompoundInterest();
          
      
    this.currentAmount = await Vbank_V2_backend.showValue(); // Get the current amount using Vbank.showValue()
    this.currentAmount = this.currentAmount.toFixed(2)
    this.#render();
    document.getElementById("input-amount").value = "";
    document.getElementById("withdrawal-amount").value = "";
    button.removeAttribute("disabled");
  };

  #render() {
    let body = html`
      <div class="container">
        <img src="${logo}" alt="VBank logo" width="100" />
        <h1>Current Balance: $<span id="value">${this.currentAmount}</span></h1>
        <div class="divider"></div>
        <form action="#">
          <h2>Amount to Top Up</h2>
          <input id="input-amount" type="number" step="0.01" min=0 name="topUp" value="" />
          <h2>Amount to Withdraw</h2>
          <input id="withdrawal-amount" type="number" name="withdraw" step="0.01" min=0 value="" />
          <input id="submit-btn" type="submit" value="Finalise Transaction" />
        </form>
      </div>
    `;
    render(body, document.getElementById('root'));
    document.querySelector('form').addEventListener('submit', this.#handleSubmit);

    // Fetch currentAmount asynchronously
    window.addEventListener("load", async () => {
      this.currentAmount = await Vbank_V2_backend.showValue(); // Get the current amount using Vbank.showValue()
      this.currentAmount = this.currentAmount.toFixed(2)
      this.#render();
    });
  }
}

export default App;

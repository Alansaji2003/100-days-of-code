import Debug "mo:base/Debug";
import Time "mo:base/Time"; 
import Float "mo:base/Float";

// to run this code open terminal and type dfx start, then on a new terminal type dfx deploy



actor VBank_V2 {   //a new cannister
  //orthogonal persistence
  // we can persist data by adding a stable key word in the begining of a variable (even if you deploy again the value of variable wont change)
  stable var currentValue:Float = 300; //Nat datatype : Natural Numbers, Float datatype
  // currentValue:= 300;
  Debug.print(debug_show(currentValue));

  //currentValue := 100; //reassign using :=
  stable var startTime:Float  = Float.fromInt(Time.now());
  
  // startTime := Float.fromInt(Time.now());
  Debug.print(debug_show(startTime));
  // let id = 324242342344134; //immutable it cant be changed


  // Debug.print(debug_show(currentValue));          //to print
  // Debug.print(debug_show(id));

  //increase amount function
  public func topUp(amount: Float) {     //use public to make it acessible outside the cannister
    currentValue += amount;
    Debug.print(debug_show(currentValue));
    
  };

  // topUp();   function call
  // use 'dfx canister call Vbank topUp' to call this function in the terminal (outside canister)

  //candid language to get easy ui
  // to get id 'dfx canister id __Candid_UI'
  //eg: r7inp-6aaaa-aaaaa-aaabq-cai
  // to get ui , go to the port with these added at the end
  //http://127.0.0.1:8000/?canisterId=r7inp-6aaaa-aaaaa-aaabq-cai
  // to get our Vbank canister Id type "dfx canister id Vbank"
  //put it inside the gui

  //decrease amount function
  public func withdraw(amount: Float){
    let temp: Float = currentValue - amount;            //Int datatype can go to negetives
    if(temp >= 0){
      currentValue -= amount;
      Debug.print(debug_show(currentValue));
    }else{
    Debug.print(debug_show("Insufficient Balance!"))
  }
  };

  //query functions and update functions: query functions are readonly functions
  //they are faster than update functions
  //update function, update the blockchain therefore making it slow
  //exmple of a query function

  public query func showValue(): async Float{
      return currentValue;
  };

  public func calculateCompoundInterest() {
    let currentTime: Float = Float.fromInt(Time.now());
    let timeElapsed = currentTime - startTime;
    let timeElapsedInMonths = timeElapsed / (1000000000 * 86400 * 30); // Convert nanoseconds to months
    let annualInterestRate: Float = 0.01; // Assuming an annual interest rate of 1% (0.01)
    let monthlyInterestRate = annualInterestRate / 12;
    let numberOfMonths = timeElapsedInMonths;
    currentValue := currentValue * (1 + monthlyInterestRate) ** numberOfMonths;
    startTime := currentTime;
}

  

}

import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";


actor Token{

    Debug.print("HELLO");

    let owner : Principal = Principal.fromText("6mylh-ip55n-bwxxl-pn7s5-xcwzs-r2hmi-s3lo3-ussvk-wdesv-2hqrs-vqe"); //my id
    let totalSupply : Nat = 1000000000;
    let symbol : Text = "DLN";

    private stable var balanceEntries : [(Principal, Nat)]  = [];          //since hashmap cant be stable

    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash); //who owns how much

    if(balances.size() < 1){    
            balances.put(owner, totalSupply);       //if deploying for first time
    };

    public query func balanceOf(who: Principal) : async Nat {


        let balance : Nat = switch (balances.get(who)){        //the balences.get returns a optional datatype ?Nat, we use switch statement to find if it is null or does it have a value 
            case null 0;
            case (?result) result;
        };


        if(balances.get(who) == null){
            return 0;
        }else{
            return balance;
        }

    };
    public query func getSymbol():async Text{
        return symbol;
    };
    public shared(msg) func payOut(): async Text{
        
        Debug.print(debug_show(msg.caller));         //user id
        if(balances.get(msg.caller)  == null){
            let amount = 10000;
            let result =  await transfer(msg.caller, amount);
            return result;
        }else{
            return "Tokens already claimed ";
        }
        
    };
    public shared(msg) func transfer(to: Principal, amount: Nat): async Text{
        let fromBalance = await balanceOf(msg.caller);
        if(fromBalance > amount){
            let newfromBalance: Nat = fromBalance - amount;
            balances.put(msg.caller, newfromBalance);

            let toBalance = await balanceOf(to);
            let newToBalance = toBalance + amount;
            balances.put(to, newToBalance);

            return "Success";
        }else{
            return "Insufficient funds.."
        }

        
    };
//for working with stable array BalanceEntries
    system func preupgrade(){
        balanceEntries := Iter.toArray(balances.entries()) //entries will iterate through each, the Iter will turn it into array
    };  
    system func postupgrade(){
        balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);      //val get backs iter 
        if(balances.size() < 1){
            balances.put(owner, totalSupply);
        }
        
    };      
}
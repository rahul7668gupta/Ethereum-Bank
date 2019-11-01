var ethers = require("ethers");//importing installed ethers.js library
var fs = require("fs");//importing installed filesystem

var provider = new ethers.providers.JsonRpcProvider(); // setting up provider
var contractByteCode = fs.readFileSync('EthereumBank_sol_EthereumBank.bin').toString() // retrieve the deployed contract's bytecode from .bin file using filesystem
var contractAbi = JSON.parse(fs.readFileSync('EthereumBank_sol_EthereumBank.abi').toString()) //json parse the contract abi after converting it into string
var contractAddress = null; //0x6147d8d1ca1913857e85171ac1B61d9f8045e703 //set contract deplyed address to null

const deploy = async()=>{ //create an asynchronus function to deploy the contract
    try{//using try catch method to catch any error if it occurs
        var signerWallet = provider.getSigner(0); //not understood
        var factory = new ethers.ContractFactory( //(maybe) use ethers.js library's property "ContractFactory" 
            contractAbi,
            contractByteCode,
            signerWallet
        );

        var contract = await factory.deploy();//deploy the contract and store it's returned values in the variable

        contractAddress = contract.address;//store contractAddress here using contract's address property
        
    } catch(error) { //catching error if occurred using error property
        console.log(error);
    }
};

const interactWithBank = async()=>{//async function to interact with the contract
    await deploy();

    var contract = new ethers.Contract(contractAddress, contractAbi, provider); //store contract in the variable to interact with it's functions later on
    var wallet = provider.getSigner(1); //setup wallet using provider

    contract = contract.connect(wallet); //connect contract woth wallet
    
    var balance = await contract.getUserBalance(); //interact with contract to get user balance

    console.log(balance.toString(10));//convert balance to string and log it

    var parameters = {
        value: ethers.utils.parseEther('1.0')//parse the given string value to ether using ethers.js
    }

    var tx = await contract.deposit(parameters);//interacting with contract to deposit ether and creating a txn
    console.log(tx.hash);//console log txn hash

     var balance = await contract.getUserBalance();//interact with contract to get user balance
     console.log(ethers.utils.formatEther(balance.toString(10)));//convert balance to base 10 and logs

     tx = await contract.withdraw(ethers.utils.parseEther('1.0'));//interacts with bank to withdraw ether
     console.log(tx.hash);//logs withdraw txn hash

     var balance = await contract.getUserBalance();//interacts with contract to checck balance
     console.log(ethers.utils.formatEther(balance.toString(10)));//convert balance to base 10 and logs 
}

interactWithBank();// call interactwithbank function
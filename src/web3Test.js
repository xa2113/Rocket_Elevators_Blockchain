const Web3 = require("web3");
const fs = require("fs");

const rocketNFT = JSON.parse(
    fs.readFileSync("../build/contracts/RocketNFT.json", "utf8")
);
const rocketToken = JSON.parse(
    fs.readFileSync("../build/contracts/RocketToken.json", "utf8")
);

const url = "http://localhost:7545";
const contractAddress = "0x4af1a69dfbDA90675Cea421fEccE818c427B3647";
const userAddress = "0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc";
const contractAddressToken = "0x6df3046D243654B5F8E1Cf884a0fe19f6cf2F86B";

const web3 = new Web3(url);
const r = new web3.eth.Contract(rocketNFT.abi, contractAddress);
const rt = new web3.eth.Contract(rocketToken.abi, contractAddressToken);

const params = [
    {
        from: "0x04e4664FDE82B439eAb6f1877F0Ffa8091495431",
        to: contractAddress,
        value: web3.utils.toWei("1", "ether"),
    },
];

// rt.methods
//     .faucet(userAddress) // const transactionhash = r.methods.acceptMatic
//     .call((err, res) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(res);
//         }
//     });

// rt.methods.balanceOf(userAddress).call((err, res) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(res);
//     }
// });

// console.log(r.mehtods.whitelisted);

r.methods.isWhitelisted(userAddress).call((err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
});

// r.methods.isWhitelisted(userAddress).call((err, res) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(res);
//     }
// });

// r.methods.tokenURI(9).call((err, res) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("TOKEN URI: " + res);
//     }
// });

// {
// “Name”: String
// “Description”: String
// “Image”: Link to the source of the image
// // }
// let string = r.methods.mintForAccount(
//     "0x4B507F8f6a7b1650E926483f2b0dcb6FaEc9fcB1",
//     33
// );
// console.log(string);
// let output = r.methods.balanceOf("0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc");
// console.log(output);

// Image URI: ipfs://bafkreig5s4oq574drfafphiyazroxxngmid3m6vensuvk3y2qvoz5ubhmi

// var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

// var Contract = require("web3-eth-contract");
// Contract.setProvider(url);
// var contract2 = new Contract(contract);
// r.methods.balanceOf("0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc");

// console.log(web3);
// web3.eth.getAccounts().then((accounts) => console.log(accounts));
// let contractInstance = new web3.eth.Contract(abi_string);
// console.log(contractInstance);

// r.methods
//     .checkAccount("0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc", 100)
//     .call((err, res) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(res);
//         }
//     });

// r.methods
//     .mintForAccount("0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc", 9)
//     .call((err, res) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("MINT FOR ACCOUNT: " + res);
//         }
//     });

// let bal = r.methods
//     .balanceOf("0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc")
//     .call((err, res) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(res);
//         }
//     });

// console.log(bal);
// console.log(daiToken);

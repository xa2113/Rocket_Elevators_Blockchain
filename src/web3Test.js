const Web3 = require("web3");
// import { abi_string } from "../utils/web3NFT";
// import { contractJSON } from "../build/contracts/RocketNFT.json";
// import Web3 from "web3";
// import { AbiItem } from "web3-utils";
const ERC721ABI = require("../build/contracts/RocketNFT.json");

// const { default: Web3 } = require("web3");
const fs = require("fs");
const rocketNFT = JSON.parse(
    fs.readFileSync("../build/contracts/RocketNFT.json", "utf8")
);

// console.log(JSON.stringify(contract.abi));
// const abi_string = JSON.stringify(contract.abi);

const url = "http://localhost:7545";
const contractAddress = "0xAb41ae698C7F0330a68F740D8C47Ce2aCdC50C8B";
const web3 = new Web3(url);
const r = new web3.eth.Contract(rocketNFT.abi, contractAddress);

r.methods.tokenURI(9).call((err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("TOKEN URI: " + res);
    }
});

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

// import Web3 from "web3";
// import fs from "fs";
const Web3 = require("web3");
const fs = require("fs");
const nftJson = "../build/contracts/RocketNFT.json";
const tokenJson = "../build/contracts/RocketToken.json";

const rocketNFT = JSON.parse(fs.readFileSync(nftJson, "utf8"));
const rocketToken = JSON.parse(fs.readFileSync(tokenJson, "utf8"));

const URL = "http://localhost:7545";
const contractAddress = "0x558cca7aAf8B5e548CCBB75c7BA722914D7848C7";
const userAddress = "0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc";

const web3 = new Web3(URL);
const connNFT = new web3.eth.Contract(rocketNFT.abi, contractAddress);

const contractAddressToken = "0x6df3046D243654B5F8E1Cf884a0fe19f6cf2F86B";
const connToken = new web3.eth.Contract(rocketToken.abi, contractAddressToken);

// connNFT.methods
//     .isWhitelisted("0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc")
//     .call((err, res) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(res);
//         }
//     });

// export const whiteList = async () => {
//     await connNFT.methods.isWhitelisted(userAddress).call((err, res) => {
//         if (err) {
//             console.log(err);
//             return err;
//         } else {
//             console.log(res);
//             return res;
//         }
//     });
// };

// rocketNFT.methods.balanceOf(userAddress).call((err, res) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(res);
//     }
// });

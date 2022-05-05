const express = require("express");
const Web3 = require("web3");
const fs = require("fs");
const Contract = require("web3-eth-contract");

const nftJson = "../build/contracts/RocketNFT.json";
const rocketNFT = JSON.parse(fs.readFileSync(nftJson, "utf8"));

const URL = "http://localhost:7545";
const contractAddress = "0xB92739C36318B680dfBE6419337F3BbCe05B1dAF";
// const ipfsAddress =
//     "ipfs://bafkreig5s4oq574drfafphiyazroxxngmid3m6vensuvk3y2qvoz5ubhmi";
const app = express();
const web3 = new Web3(URL);
const connNFT = new web3.eth.Contract(rocketNFT.abi, contractAddress);

Contract.setProvider(URL);
var contract = new Contract(rocketNFT.abi, contractAddress);

const accounts = web3.eth.getAccounts().then((res) => {
    return res;
});
console.log(accounts);

app.get("/", function (req, res) {
    return res.send("Hello world");
});

app.get("/NFT/eligible/:address", function (req, res) {
    const walletAddress = req.params["address"];
    connNFT.methods
        .isEligibleForFreeNFT(walletAddress)
        .call()
        .then((data) => {
            return res.send(data);
        });
});

app.get("/NFT/free/:address", (req, res) => {
    const walletAddress = req.params["address"];
    let tokenId;
    const ipfs =
        "ipfs://bafkreig5s4oq574drfafphiyazroxxngmid3m6vensuvk3y2qvoz5ubhmi";
    //await RocketElevatorsNFT.methods.gift(wallet_address, "").send( {from: your_wallet, gas: 5500000})
    // .on('receipt', function(receipt){
    //     tokenId = receipt.events.Transfer.returnValues.tokenId;
    // })

    // const owner = await contract.methods.owner().call();
    // console.log(owner);
    const options = {
        from: "0x04e4664FDE82B439eAb6f1877F0Ffa8091495431", // OWNER
    };

    connNFT.methods
        .mintForFree(walletAddress, ipfs)
        .send(options)
        .then(function (receipt) {
            console.log(receipt);
            // return res.send(receipt);
        });
    // const token = await contract.methods
    //     .mintForFree(walletAddress, ipfs)
    //     .send(options)
    //     .then("receipt", function (receipt) {
    //         tokenId = receipt.events.Transfer.returnValues.tokenId;
    //     });

    // console.log(token);
});

app.get("/NFT/mint/:address", function (req, res) {
    const walletAddress = req.params["address"];
    const ipfs =
        "ipfs://bafkreig5s4oq574drfafphiyazroxxngmid3m6vensuvk3y2qvoz5ubhmi";

    connNFT.methods
        .safeMint(walletAddress, ipfs)
        .send()
        .then((data) => {
            console.log(data);
            return res.send(data);
        });
});

app.get("/NFT/balance/:address", function (req, res) {
    const walletAddress = req.params["address"];
    connNFT.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
            console.log(data);
            return res.send(data);
        });
});

app.get("/NFT/tokensByOwner/:address", function (req, res) {
    const walletAddress = req.params["address"];
    connNFT.methods
        .getTokenIdsOfOwner(walletAddress)
        .call()
        .then((data) => {
            console.log(data);
            return res.send(data);
        });
});

app.get(`/NFT/eligible`, function (req, res) {
    const userAddress = "0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc";
    connNFT.methods
        .isWhitelisted(userAddress)
        .call()
        .then((data) => {
            return res.send(data);
        });
});

app.listen(process.env.PORT || 8080);

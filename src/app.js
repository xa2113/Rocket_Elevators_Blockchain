const express = require("express");
const Web3 = require("web3");
const fs = require("fs");
const util = require("util");
const Contract = require("web3-eth-contract");
const { exec } = require("child_process");
const nftJson = "../build/contracts/RocketNFT.json";
const rocketNFT = JSON.parse(fs.readFileSync(nftJson, "utf8"));
const execa = util.promisify(exec);
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = fs.readFileSync("../secret").toString().trim();
const provider = () =>
    new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/");
const URL = "http://localhost:7545";
const contractAddressNFT = "0xA59e5C0e7ECC0eBBb4eB31a1E0322BA714aA2622"; // TODO: CHANGE

const tokenJson = "../build/contracts/RocketToken.json";
const rocketToken = JSON.parse(fs.readFileSync(tokenJson, "utf8"));

// const ipfsAddress =
//     "ipfs://bafkreig5s4oq574drfafphiyazroxxngmid3m6vensuvk3y2qvoz5ubhmi";
const fetch = require("node-fetch");

const app = express();
const web3 = new Web3(URL);
const connNFT = new web3.eth.Contract(rocketNFT.abi, contractAddressNFT);

Contract.setProvider(URL);
var contract = new Contract(rocketNFT.abi, contractAddressNFT);

const accounts = web3.eth.getAccounts().then((res) => {
    return res;
});

app.get("/", async function (req, res) {
    const command = await execa(
        "npm run generate && npm run upload_file && npm run upload_metadata"
    );

    fs.readFile("../nft/_ipfsMetas.json", "utf8", (err, data) => {
        if (err) {
            return res.send("something went wrong");
        } else {
            const dataJson = JSON.parse(data);
            const ipfsURI = dataJson[0]["metadata_uri"];
            return res.send(ipfsURI);
        }
    });
});

app.get("/NFT/eligible/:address", async function (req, res) {
    const walletAddress = req.params["address"];
    connNFT.methods
        .isEligibleForFreeNFT(walletAddress)
        .call()
        .then((data) => {
            return res.send(data);
        });
});

app.get("/NFT/free/:address", async (req, res) => {
    const walletAddress = req.params["address"];
    const command = await execa(
        "npm run generate && npm run upload_file && npm run upload_metadata"
    );
    fs.readFile("../nft/_ipfsMetas.json", "utf8", (err, data) => {
        if (err) {
            return "";
        } else {
            const dataJson = JSON.parse(data);
            const ipfsURI = dataJson[0]["metadata_uri"];
            const options = {
                from: "0x04e4664FDE82B439eAb6f1877F0Ffa8091495431", // TODO: CHANGE
                gas: 5500000,
            };
            connNFT.methods
                .mintForFree(walletAddress, ipfsURI)
                .send(options)
                .then((data) => {
                    console.log(data);
                    return res.send(data);
                });
        }
    });
});

app.get("/NFT/mint/:address", function (req, res) {
    const walletAddress = req.params["address"];
    connNFT.methods
        .safeMint(walletAddress, "fake_ipfs")
        .send({
            from: "0x04e4664FDE82B439eAb6f1877F0Ffa8091495431",
            gas: 5500000,
        })
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

app.get("/NFT/collectionURIs/:address", async function (req, res) {
    const walletAddress = req.params["address"];
    let tokenIds = await connNFT.methods
        .getTokenIdsOfOwner(walletAddress)
        .call()
        .then((data) => {
            return data;
        });

    let tokenURIs = await connNFT.methods
        .getTokenURIs(tokenIds)
        .call()
        .then((data) => {
            let cleanedData = data.map((datum) => {
                console.log(datum);
                return "https://ipfs.io/ipfs/" + datum.substring(7);
            });
            return cleanedData;
        });

    const result = await Promise.all(
        tokenURIs.map((url) => {
            fetch(url)
                .then(function (response) {
                    return response.json();
                })
                .then((response) => {
                    console.log(response);
                    return res.send(response);
                })
                .catch((err) => console.log(err));
        })
    );
});

app.get(`/NFT/pay/rocket/:address`, async function (req, res) {
    let walletAddress = req.params["address"];

    const contractAddressToken = "0x9c0659Aaf51115D5aB9577bdD3C58CCFFe3CC4C9";
    const connToken = new web3.eth.Contract(
        rocketToken.abi,
        contractAddressToken
    );

    // step 0 set requester as rocketToken wallet address
    let tokenAddress = await connNFT.methods
        .setRocketTokenAddress(contractAddressToken)
        .call()
        .then((address) => {
            console.log(address);
            return address;
        })
        .catch((err) => {
            console.log(err);
        });
    // step 1 check balance
    let balance = await connToken.methods
        .balanceOf(walletAddress)
        .call()
        .then((bal) => {
            console.log("balance " + bal);
            if (bal < 1) {
                return res.send("Sorry, not enough rocket token :(");
            }
        });

    // step 2 approve transaction from wallet
    let isApproved = await connToken.methods
        .approve(contractAddressNFT, 1)
        .send({ from: walletAddress })
        .then((approved) => {
            console.log("approval " + approved);
            if (!approved) {
                return res.send("Sorry, transaction was not approved :(");
            }
        });

    // step 3 check allowance
    let allowance = await connToken.methods
        .allowance(walletAddress, "0xA59e5C0e7ECC0eBBb4eB31a1E0322BA714aA2622")
        .call({ from: walletAddress })
        .then((allowance) => {
            console.log("allowance " + allowance);
            if (allowance < 1) {
                return res.send("Sorry, transaction was not allowed :( ");
            }
        })
        .catch((err) => console.log(err));

    // step 4 perform mint
    const options = {
        from: "0x04e4664FDE82B439eAb6f1877F0Ffa8091495431", // TODO: CHANGE
        gas: 5500000,
    };

    let mint = await connNFT.methods
        .mintWithRocket(walletAddress, "fakeIPFS")
        .send(options)
        .then((data) => {
            console.log(data);
            return res.send(data);
        });
});

app.get("/Rocket/rich/:address", function (req, res) {
    let walletAddress = req.params["address"];
    const contractAddressToken = "0x9c0659Aaf51115D5aB9577bdD3C58CCFFe3CC4C9";
    const connToken = new web3.eth.Contract(
        rocketToken.abi,
        contractAddressToken
    );
    const options = {
        from: "0x04e4664FDE82B439eAb6f1877F0Ffa8091495431", // TODO: CHANGE
        gas: 5500000,
    };
    connToken.methods
        .faucet(walletAddress)
        .send(options)
        .then((bal) => {
            res.send(bal);
        });
});

app.get("/Rocket/balance/:address", function (req, res) {
    let walletAddress = req.params["address"];
    const contractAddressToken = "0x9c0659Aaf51115D5aB9577bdD3C58CCFFe3CC4C9";
    const connToken = new web3.eth.Contract(
        rocketToken.abi,
        contractAddressToken
    );

    connToken.methods
        .balanceOf(walletAddress)
        .call()
        .then((bal) => {
            return res.send(bal);
        });
});

app.get(`/NFT/pay/matic`, function (req, res) {});

app.listen(process.env.PORT || 8080);

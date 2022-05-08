const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const basePath = process.cwd();
const fetch = require("node-fetch");
const util = require("util");

const fs = require("fs");
const execa = util.promisify(exec);
const dotenv = require("dotenv");
dotenv.config({ path: `${basePath}/.env` });

// LOCAL DEVELOPMENT
// const URL = "http://localhost:7545";
// const ownerAddress = "0x04e4664FDE82B439eAb6f1877F0Ffa8091495431";
// const contractAddressNFT = "0x5BF70a654b7b63E9C306Fbe3c7d8c2324e1cEa2C";
// const contractAddressToken = "0x5593A5C0D33dC3Fe74AeBB6268feBe3B3BcBB965";

// DEPLOYMENT ENVIRONMENT
const URL =
    "https://speedy-nodes-nyc.moralis.io/6a20f4bfebb920c2ab0fb82b/polygon/mumbai";
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const web3 = new Web3(
    new HDWalletProvider(
        "lecture quarter sugar pill slot clap brick tent ice forest split deposit",
        URL
    )
);
const ownerAddress = "0xEc206446346bF108E31cb79d28E93070dCc99FB8";
const contractAddressNFT = "0x56654E1415e4dc587F60D5787a707C2E38d299da";
const contractAddressToken = "0x4D266d91e6bf8f111f0068E8990d43093FDA1b27";

const nftJson = `${basePath}/build/contracts/RocketNFT.json`;
const tokenJson = `${basePath}/build/contracts/RocketToken.json`;

const rocketNFT = JSON.parse(fs.readFileSync(nftJson, "utf8"));
const rocketToken = JSON.parse(fs.readFileSync(tokenJson, "utf8"));

const connNFT = new web3.eth.Contract(rocketNFT.abi, contractAddressNFT);
const connToken = new web3.eth.Contract(rocketToken.abi, contractAddressToken);

const app = express();
app.use(cors());

app.get("/", function (req, res) {
    res.send("hello world~");
});

app.get("/NFT/eligible/:address", async function (req, res) {
    try {
        const walletAddress = req.params["address"];
        connNFT.methods
            .isEligibleForFreeNFT(walletAddress)
            .call()
            .then((data) => {
                res.send(data);
            });
    } catch (err) {
        res.send("Bad Request: " + err.message);
    }
});

app.get("/NFT/free/:address", async (req, res) => {
    try {
        const walletAddress = req.params["address"];
        const command = await execa(
            "npm run generate && npm run upload_file && npm run upload_metadata"
        );
        fs.readFile(`${basePath}/nft/_ipfsMetas.json`, "utf8", (err, data) => {
            if (err) {
                console.log("error");
                return "";
            } else {
                const dataJson = JSON.parse(data);
                const ipfsURI = dataJson[0]["metadata_uri"];
                console.log(ipfsURI);
                const options = {
                    from: ownerAddress, // TODO: CHANGE
                    gas: 5500000,
                };
                console.log("mintForFree");
                connNFT.methods
                    .mintForFree(walletAddress, ipfsURI)
                    .send(options)
                    .then((data) => {
                        console.log(data);
                        return res.send(data);
                    });
            }
        });
    } catch (err) {
        res.send(err.message);
    }
});

app.get("/NFT/mint/:address", async function (req, res) {
    try {
        const walletAddress = req.params["address"];
        const command = await execa(
            "npm run generate && npm run upload_file && npm run upload_metadata"
        );
        fs.readFile(`${basePath}/nft/_ipfsMetas.json`, "utf8", (err, data) => {
            console.log(data);
            if (err) {
                return "";
            } else {
                const dataJson = JSON.parse(data);
                const ipfsURI = dataJson[0]["metadata_uri"];
                const options = {
                    from: ownerAddress,
                    gas: 5500000,
                };
                console.log("SafeMinting");
                connNFT.methods
                    .safeMint(walletAddress, ipfsURI)
                    .send(options)
                    .then((data) => {
                        console.log(data);
                        return res.send(data);
                    });
            }
        });
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

app.get("/NFT/balance/:address", function (req, res) {
    try {
        const walletAddress = req.params["address"];
        connNFT.methods
            .balanceOf(walletAddress)
            .call()
            .then((data) => {
                console.log(data);
                return res.send(data);
            });
    } catch (err) {
        res.send("Bad Request: " + err.message);
    }
});

app.get("/NFT/collectionURIs/:address", async function (req, res) {
    try {
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

        console.log(tokenIds);
        console.log(tokenURIs);
        Promise.all(tokenURIs.map((u) => fetch(u)))
            .then((responses) =>
                Promise.all(responses.map((resp) => resp.json()))
            )
            .then((respJsons) => res.send(respJsons))
            .catch((err) => console.log(err));
    } catch (err) {
        res.send("Bad Request: " + err.message);
    }
});

app.post(`/NFT/pay/rocket/:address`, async function (req, res) {
    console.log("ROCKET PAYMENT REQUEST");
    try {
        let walletAddress = req.params["address"];

        // let tokenAddress = await connNFT.methods
        //     .setRocketTokenAddress(contractAddressToken)
        //     .call()
        //     .then((address) => {
        //         console.log(address);
        //         return address;
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
        const command = await execa(
            "npm run generate && npm run upload_file && npm run upload_metadata"
        );

        fs.readFile(`${basePath}/nft/_ipfsMetas.json`, "utf8", (err, data) => {
            console.log("Reading file");
            if (err) {
                return res.send("! IPFS METAS DOES NOT EXIST !");
            } else {
                const dataJson = JSON.parse(data);
                const ipfsURI = dataJson[0]["metadata_uri"];
                const options = {
                    from: ownerAddress, // TODO: CHANGE
                    gas: 5500000,
                };
                console.log("MINT WITH ROCKET");
                connNFT.methods
                    .mintWithRocket(walletAddress, ipfsURI)
                    .send(options)
                    .then((data) => {
                        console.log(data);
                        return res.send(data);
                    });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Bad Request " + err);
    }
});

app.get("/Rocket/rich/:address", function (req, res) {
    try {
        let walletAddress = req.params["address"];
        const options = {
            from: ownerAddress, // TODO: CHANGE
            gas: 5500000,
        };
        connToken.methods
            .faucet(walletAddress)
            .send(options)
            .then((bal) => {
                res.send(bal);
            });
    } catch (err) {
        console.log(err);
        res.send("Bad Request: " + err);
    }
});

app.get("/NFT/bal/:address", async function (req, res) {
    try {
        let walletAddress = req.params["address"];

        const options = {
            from: ownerAddress, // TODO: CHANGE
            gas: 5500000,
        };

        let tokenAddress = await connNFT.methods
            .setRocketTokenAddress(contractAddressToken)
            .call()
            .then((address) => {
                return address;
            })
            .catch((err) => {
                console.log(err);
            });

        console.log(tokenAddress);
        await connNFT.methods
            .checkRocketBalance(walletAddress)
            .call()
            .then((bal) => {
                res.send(bal);
            });
    } catch (err) {
        console.log(err);
        res.send("Bad Request: " + err.message);
    }
});

app.get("/Rocket/balance/:address", function (req, res) {
    try {
        let walletAddress = req.params["address"];

        connToken.methods
            .balanceOf(walletAddress)
            .call()
            .then((bal) => {
                return res.send(bal);
            });
    } catch (err) {
        console.log(err);
        res.send("Bad Request: " + err.message);
    }
});

app.listen(process.env.PORT || 5000);

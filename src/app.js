const { exec } = require("child_process");
const fetch = require("node-fetch");
const express = require("express");
const util = require("util");
const Web3 = require("web3");
const fs = require("fs");
const nftJson = "../build/contracts/RocketNFT.json";
const rocketNFT = JSON.parse(fs.readFileSync(nftJson, "utf8"));
const execa = util.promisify(exec);

// const URL = "http://localhost:7545";
const URL =
    "https://speedy-nodes-nyc.moralis.io/6a20f4bfebb920c2ab0fb82b/polygon/mumbai";
const ownerAddress = "0x04e4664FDE82B439eAb6f1877F0Ffa8091495431";
const contractAddressNFT = "0xEeBbbcf2AE0bac3bBcBe64CdD9465eeF0318456f";
const contractAddressToken = "0x4D266d91e6bf8f111f0068E8990d43093FDA1b27";
const tokenJson = "../build/contracts/RocketToken.json";
const rocketToken = JSON.parse(fs.readFileSync(tokenJson, "utf8"));

const app = express();
const web3 = new Web3(URL);
const connNFT = new web3.eth.Contract(rocketNFT.abi, contractAddressNFT);
const connToken = new web3.eth.Contract(rocketToken.abi, contractAddressToken);

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

app.get("/NFT/hello", (req, res) => {
    res.send("Hello world!");
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
            console.log(ipfsURI);
            const options = {
                from: "ownerAddress", // TODO: CHANGE
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

app.get("/NFT/mint/:address", async function (req, res) {
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
                from: ownerAddress,
                gas: 5500000,
            };
            connNFT.methods
                .safeMint(walletAddress, ipfsURI)
                .send(options)
                .then((data) => {
                    console.log(data);
                    return res.send(data);
                });
        }
    });
    // connNFT.methods
    //     .safeMint(walletAddress, "fake_ipfs")
    //     .send({
    //         from: ownerAddress,
    //         gas: 5500000,
    //     })
    //     .then((data) => {
    //         console.log(data);
    //         return res.send(data);
    //     });
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
                res.send("Sorry, not enough rocket token :(");
            }
            return bal;
        });

    // step 2 approve transaction from wallet
    let isApproved =
        balance >= 1
            ? await connToken.methods
                  .approve(contractAddressNFT, 1)
                  .send({ from: walletAddress })
                  .then((approved) => {
                      console.log("approval " + approved);
                      if (!approved) {
                          res.send("Sorry, transaction was not approved :(");
                          // res.end();
                          return approved;
                      }
                      return approved;
                  })
            : false;

    // step 3 check allowance
    let allowance = isApproved
        ? await connToken.methods
              .allowance(walletAddress, contractAddressNFT)
              .call({ from: walletAddress })
              .then((allowance) => {
                  console.log("allowance " + allowance);
                  if (allowance < 1) {
                      res.send("Sorry, transaction was not allowed :( ");
                      return allowance;
                      // res.end();
                  }
                  return allowance;
              })
              .catch((err) => console.log(err))
        : false;

    // step 4 perform mint
    const options = {
        from: ownerAddress, // TODO: CHANGE
        gas: 5500000,
    };

    let mint =
        allowance >= 1
            ? connNFT.methods
                  .mintWithRocket(walletAddress, "fakeIPFS")
                  .send(options)
                  .then((data) => {
                      console.log(data);
                      return res.send(data);
                  })
            : res.send("not enough allowance");

    // GENERATING NFT
    // const command = await execa(
    //     "npm run generate && npm run upload_file && npm run upload_metadata"
    // );
    // fs.readFile("../nft/_ipfsMetas.json", "utf8", (err, data) => {
    //     if (err) {
    //         return "";
    //     } else {
    //         const dataJson = JSON.parse(data);
    //         const ipfsURI = dataJson[0]["metadata_uri"];
    //         const options = {
    //             from: ownerAddress, // TODO: CHANGE
    //             gas: 5500000,
    //         };
    //         await connNFT.methods
    //             .mintWithRocket(walletAddress, ipfsURI)
    //             .send(options)
    //             .then((data) => {
    //                 console.log(data);
    //                 return res.send(data);
    //             });
    //     }
    // });
});

app.get("/Rocket/rich/:address", function (req, res) {
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
});

app.get("/NFT/check/:address", async function (req, res) {
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
        .confirmRocketTokenAddress()
        .call()
        .then((oops) => {
            res.send(">> Output" + oops);
        });
});

app.get("/NFT/bal/:address", async function (req, res) {
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
});

app.get("/Rocket/balance/:address", function (req, res) {
    let walletAddress = req.params["address"];

    connToken.methods
        .balanceOf(walletAddress)
        .call()
        .then((bal) => {
            return res.send(bal);
        });
});

app.get(`/NFT/pay/matic/:address`, function (req, res) {
    let walletAddress = req.params["address"];
    const options = {
        from: ownerAddress, // TODO: CHANGE
        gas: 5500000,
    };
    connNFT.methods
        .mintWithMatic(walletAddress, "fakeIPFS")
        .send(options)
        .then((data) => {
            console.log(data);
            return res.send(data);
        });

    //// GENERATING NFT
    // const command = await execa(
    //     "npm run generate && npm run upload_file && npm run upload_metadata"
    // );
    // fs.readFile("../nft/_ipfsMetas.json", "utf8", (err, data) => {
    //     if (err) {
    //         return "";
    //     } else {
    //         const dataJson = JSON.parse(data);
    //         const ipfsURI = dataJson[0]["metadata_uri"];
    //         const options = {
    //             from: ownerAddress, // TODO: CHANGE
    //             gas: 5500000,
    //         };
    //         connNFT.methods
    //             .mintWithMatic(walletAddress, ipfsURI)
    //             .send(options)
    //             .then((data) => {
    //                 console.log(data);
    //                 return res.send(data);
    //             });
    //     }
    // });
});

app.listen(process.env.PORT || 8080);

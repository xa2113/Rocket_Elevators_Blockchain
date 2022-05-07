const HDWalletProvider = require("@truffle/hdwallet-provider");
const env = require("dotenv").config({ path: "./.env" });
const mnemonic = process.env.MNEMONIC;
module.exports = {
    compilers: {
        solc: {
            version: "0.8.13",
        },
    },
    networks: {
        development: {
            host: "127.0.01",
            port: 7545,
            network_id: "*",
            gas: 5500000,
        },
        matic: {
            provider: () =>
                new HDWalletProvider(
                    mnemonic,
                    "https://speedy-nodes-nyc.moralis.io/6a20f4bfebb920c2ab0fb82b/polygon/mumbai"
                ),
            network_id: 80001,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true,
        },
    },
};

const HDWalletProvider = require("@truffle/hdwallet-provider");
const env = require("dotenv").config();

module.exports = {
    networks: {
        development: {
            host: "127.0.01",
            port: 7545,
            network_id: "*",
        },
    },
    matic: {
        provider: () =>
            new HDWalletProvider(
                "lecture quarter sugar pill slot clap brick tent ice forest split deposit",
                "https://speedy-nodes-nyc.moralis.io/6a20f4bfebb920c2ab0fb82b/polygon/mumbai"
            ),
        network_id: 80001,
        confirmations: 2,
        timeoutBlocks: 200,
        skipDryRun: true,
    },
};

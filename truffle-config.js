const HDWalletProvider = require("@truffle/hdwallet-provider");
const env = require("dotenv").config();

module.exports = {
    networks: {
        development: {
            host: "127.0.01",
            port: 7545,
            network_id: "*",
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

        mumbai: {
            provider: () =>
                new HDWalletProvider(
                    "lecture quarter sugar pill slot clap brick tent ice forest split deposit",
                    `https://speedy-nodes-nyc.moralis.io/717b1363253ad503ceb93b79/polygon/mumbai`
                ),
            network_id: 80001, // Ropsten's id
            gas: 5500000, // Ropsten has a lower block limit than mainnet
            confirmations: 2, // # of confs to wait between deployments. (default: 0)
            timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
            skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
        },
    },
};

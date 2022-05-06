var RocketToken = artifacts.require("RocketToken");
var RocketNFT = artifacts.require("RocketNFT");

module.exports = function (deployer) {
    deployer.deploy(RocketNFT);
};

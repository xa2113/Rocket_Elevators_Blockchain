const RocketNFT = artifacts.require("./contracts/RocketNFT.sol");
const RocketToken = artifacts.require("./contracts/RocketToken.sol");
const BN = web3.utils.BN;
const truffleAssert = require('truffle-assertions');

contract("RocketNFT", (accounts) => {
    let rocketNFT;

    beforeEach(async () => {
        rocketNFT = await RocketNFT.new( {from: accounts[0], gas: 5500000});
    })

    //mintForFree
    it("should not be able to mint for free", async () => {
        await truffleAssert.reverts(
            rocketNFT.mintForFree(accounts[1], "fake_ipfs")
        )
    })

    //mintForFree
    it("should be able to mint for free", async () => {
        rocketNFT.addToWhitelist(accounts[2]);

        await rocketNFT.mintForFree(accounts[2], "fake_ipfs2")

        let balance = await rocketNFT.balanceOf(accounts[2])

        // console.log(balance);
        assert.equal(await rocketNFT.balanceOf(accounts[2]), 1, "Mint was not successful");
    })

    //mintWithRocket
    it("should not be able to mint with Rocket", async () => {
        await truffleAssert.reverts(
            rocketNFT.mintWithRocket(accounts[2], "fake_ipfs3")
        )
    })

    //checkRocketBalance
    it("should check the Rocket balance", async () => {
        rocketToken = await RocketToken.new( {from: accounts[1], gas: 5500000});
        await rocketToken.faucet(accounts[4]);
        // console.log(rocketToken.address)
        await rocketNFT.setRocketTokenAddress(rocketToken.address);
        // console.log("rocket token address" + rocketNFT.ROCKETTOKENADDRESS());
        // console.log("ROCKET TOKEN ADDRESS FUNCTION" + rocketNFT.confirmRocketTokenAddress());

        let balance = await rocketNFT.checkRocketBalance(accounts[4]);
        // console.log("balance: >>>>" + balance);
        assert.equal(balance, 100, "Balance is not correct!");
    })

    //withdrawWithRocket
    it("should withdraw all Rocket tokens from wallet", async () => {
        rocketToken = await RocketToken.new( {from: accounts[0], gas: 5500000});
        let beforeBalance = rocketToken.balanceOf(rocketNFT.address);

        await rocketNFT.setRocketTokenAddress(rocketToken.address);
        await rocketNFT.withdrawWithRocket();

        let afterBalance = await rocketToken.balanceOf(rocketNFT.address);
        assert.equal(afterBalance, 0, "There is still Rocket tokens after withdrawal!");
    })

    //isWhitelisted && addToWhitelist
    it("should add an address to the whitelist and check if the address is whitelisted", async () => {
        await rocketNFT.addToWhitelist(accounts[5]);

        assert.equal(await rocketNFT.isWhitelisted(accounts[5]), true, "Account is not whitelisted.")

    })

    //isEligibleForFreeNFT
    it("should add an address to the whitelist", async () => {
        await rocketNFT.addToWhitelist(accounts[5]);
        assert.equal(await rocketNFT.isEligibleForFreeNFT(accounts[5]), true, "Account is not eligible.")
    })

})
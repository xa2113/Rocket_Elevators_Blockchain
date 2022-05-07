// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./RocketToken.sol";

contract RocketNFT is ERC721, ERC721URIStorage, Pausable, Ownable, ERC721Enumerable,  ERC721Burnable {
    
    // TOKEN ID AUTO-INCREMENT
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // PROPERTIES
    uint public rocketPrice;
    uint public maticPrice;
    address public ROCKETTOKENADDRESS;
    mapping(address => uint) rocketBalance; 
    mapping(address => uint) maticBalance; 
    mapping(address => bool) public freeMintUsed;
    mapping(address => bool) public whitelisted;
    mapping(uint256 => address) internal allowance;

    // CONSTRUCTOR
    constructor() ERC721('RocketNFT', 'RE') {
        rocketPrice = 1;
        maticPrice = 100000000000000000 wei; // 0.1 MATIC
        whitelisted[0xEc206446346bF108E31cb79d28E93070dCc99FB8] = true;
        whitelisted[0xdB1024d778CE348eff7FaeD22CCC270e4AF5Dedd] = true;
        whitelisted[0xd1679bB3543e8aD195FF9f3Ac3436039bA389237] = true;
        whitelisted[0xF4F555ca1586C40067cd215578f123d30813De02] = true;
        whitelisted[0x5563D3361408D41BF172E3720C30b0e35F19A444] = true;
        whitelisted[0x6ffdAf0795D208c11C583C88Cb5dbd2A8955A59e] = true;

        // LOCAL ACC
        whitelisted[0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc] = true;
        whitelisted[0x4B507F8f6a7b1650E926483f2b0dcb6FaEc9fcB1] = true;
    }

    // TRANSACTIONS
    function mintForFree(address requester, string memory ipfs) public{
        if(isWhitelisted(requester) && freeMintUsed[requester] == false){
            safeMint(requester, ipfs);
            freeMintUsed[requester] = true;
        }else{
            revert();
        }
    }

    function mintWithMatic(address requester, string memory ipfs) public payable{
        require(msg.value >= maticPrice, "Sorry, you do not own enough balance :(");
        safeMint(requester, ipfs);
    }

    function mintWithRocket(address requester, string memory ipfs) public payable{
        ERC20 RT = ERC20(ROCKETTOKENADDRESS);
        RT.transferFrom(requester, address(this), 1);
        safeMint(requester, ipfs);
        // uint256 balance = RT.balanceOf(requester);
        // require(balance >= 1, ">> Sorry, you do not own enough balance :(");
    }

    function checkRocketBalance(address requester) external view returns(uint256){
        ERC20 RT = ERC20(ROCKETTOKENADDRESS);
        uint256 balance = RT.balanceOf(requester);
        return balance;
    }
    
    //Withdraw MATIC
    function withdrawWithMatic() public payable onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }
    //Withdraw ROCKET
    function withdrawWithRocket() public onlyOwner {
        ERC20 RT = ERC20(ROCKETTOKENADDRESS);
        uint balance = RT.balanceOf(address(this));
        RT.transfer(msg.sender, balance);
    }
    // SET ROCKETTOKENADDRESS
    function setRocketTokenAddress(address rocketTokenAddress) public onlyOwner returns (address){
        return ROCKETTOKENADDRESS = rocketTokenAddress;
    }
    function confirmRocketTokenAddress() external view returns (address){
        return ROCKETTOKENADDRESS;
    }
    // TODO: Allowance
    function getAllowance(uint256 tokenId) external view returns (address){
        return allowance[tokenId];
    }


    // UTILITY FUNCTIONS
    function isWhitelisted(address requester) public view returns(bool){
        return whitelisted[requester];
    }
    function checkFreeMintUsage(address requester) external view returns(bool){
        return freeMintUsed[requester];
    }
    function getTokenURIs(uint[] memory tokenIds) public view returns (string[] memory){
        string[] memory ipfsURIs = new string[](tokenIds.length);
        uint i;
        for(i = 0; i < tokenIds.length; i++){
            ipfsURIs[i] = tokenURI(tokenIds[i]);
        }
        return ipfsURIs;
    }
    function isEligibleForFreeNFT(address requester) public view returns(bool){
       if(whitelisted[requester] && freeMintUsed[requester] == false){
           return true;
       } else {
           return false;
       }
    }
    function getTokenIdsOfOwner(address owner) public view returns (uint[] memory) {
        uint[] memory tokensOfOwner = new uint[](ERC721.balanceOf(owner));
        uint bal = ERC721.balanceOf(owner);
        uint i;
        for(i = 0; i < bal; i++){
            tokensOfOwner[i] = ERC721Enumerable.tokenOfOwnerByIndex(owner, i);
        }
       return tokensOfOwner;
    }
    function addToWhitelist(address receiver) public onlyOwner {
        whitelisted[receiver] = true;
    }

    // BASE FUNCTIONS
    function safeMint(address to, string memory ipfsURI) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, ipfsURI);
    }
    function pause() public onlyOwner {
        _pause();
    }
    function unpause() public onlyOwner {
        _unpause();
    }
    function burn(uint256 tokenId) public override{
        _burn(tokenId);
    }
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage)
    returns (string memory){
        return super.tokenURI(tokenId);
    }
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable){
        super._beforeTokenTransfer(from, to, tokenId);
    }
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool){
        return super.supportsInterface(interfaceId);
    }

}

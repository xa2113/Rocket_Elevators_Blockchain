// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {RocketToken} from './RocketToken.sol';


contract RocketNFT is ERC721, ERC721URIStorage, Pausable, Ownable, ERC721Burnable {
    
    // TOKEN ID AUTO-INCREMENT
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // PROPERTIES
    uint public rocketPrice;
    uint public maticPrice;
    mapping(address => uint) rocketBalance; 
    mapping(address => uint) maticBalance; 
    mapping(address => bool) public freeMintUsed;
    mapping(address => bool) public whitelisted;
    string ipfsAddress = "ipfs://bafkreig5s4oq574drfafphiyazroxxngmid3m6vensuvk3y2qvoz5ubhmi";
    mapping(uint256 => address) internal allowance;


    // CONSTRUCTOR
    constructor() ERC721('RocketNFT', 'RE') {
        rocketPrice = 1;
        maticPrice = 100000000000000000 wei; // 0.1 MATIC
        whitelisted[0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc] = true;
        whitelisted[0x4B507F8f6a7b1650E926483f2b0dcb6FaEc9fcB1] = true;
        whitelisted[0x37719D62Be56b9CB0ede514C5071894E1590bd14] = true;
    }

    // TRANSACTIONS
    function mintForFree(address requester) public{
        if(isWhitelisted(requester) && freeMintUsed[requester] == false){
            safeMint(requester, ipfsAddress);
            freeMintUsed[requester] = true;
        }else{
            revert();
        }
    }
    function mintWithMatic(address requester, uint256 qty) public payable{
        if (msg.sender != owner()){
            if(!isWhitelisted(requester)){
                require(msg.value >= maticPrice * qty);
            }
        }
        for(uint256 i = 1; i <= qty; i++){
            safeMint(requester, ipfsAddress);
        }
        payable(owner()).transfer(msg.value); // direct transfer
    }
    function mintWithRocket(address requester, uint256 qty) public payable{
        if (msg.sender != owner()){
            if(!isWhitelisted(requester)){
                require(msg.value >= rocketPrice * qty);
            }
        }
        for(uint256 i = 1; i <= qty; i++){
            safeMint(requester, ipfsAddress);
        }
        payable(owner()).transfer(msg.value); // direct transfer
    }
    function withdraw() public payable onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
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
    function getTokenURI(uint256 tokenId) public view{
        tokenURI(tokenId);
    }

    // BASE FUNCTIONS
    function safeMint(address to, string memory ipfsURI) public onlyOwner {
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

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override{
        super._beforeTokenTransfer(from, to, tokenId);
    }
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage)
    returns (string memory){
        return super.tokenURI(tokenId);
    }

}


///////////////////// CONTRACT DRAFT //////////////////////
    
    // address[] whitelisted = [0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc, 0x4B507F8f6a7b1650E926483f2b0dcb6FaEc9fcB1, 0x37719D62Be56b9CB0ede514C5071894E1590bd14];

    // TODO: Create a function that communicates with the ERC20 RocketToken 

    // function mintFree(address acc, uint256 tokenId) public {
    //     for(uint i = 0; i < whitelisted.length; i++){
    //         if(whitelisted[i] == acc && freeMintRecord[acc] < 1){ 
    //             _mint(acc, tokenId);
    //             _setTokenURI(tokenId, 'ipfs://bafkreig5s4oq574drfafphiyazroxxngmid3m6vensuvk3y2qvoz5ubhmi');
    //             freeMintRecord[acc] += 1;
    //         } else {
    //             // redirect to payment.
    //         }
    //     } // TODO: error handling.
    //     // return tokenURI(tokenId);
    // }
    
    // function safeMint(address to, uint256 tokenId, string memory uri)
    //     public
    //     onlyOwner{
    //     _safeMint(to, tokenId);
    //     _setTokenURI(tokenId, uri);
    // }
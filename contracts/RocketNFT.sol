// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
// import "@nomiclabs/builder/console.sol";

contract RocketNFT is ERC721, ERC721URIStorage, Pausable, Ownable, ERC721Burnable {

    constructor() ERC721('RocketNFT', 'RE') {
        _mint(msg.sender, 1000000);
    }

    mapping(address => uint256) public record;
    address[] freeAcc = [0xFB4736eADE1a08c42E65aa187dd32C36E160AAcc, 0x4B507F8f6a7b1650E926483f2b0dcb6FaEc9fcB1, 0x37719D62Be56b9CB0ede514C5071894E1590bd14];

    function getRecor(address acc) external view returns(uint256){
        return record[acc];
    }

    function mintForAccount(address acc, uint256 tokenId) public {
        for(uint i = 0; i < freeAcc.length; i++){
            if(freeAcc[i] == acc && record[acc] < 1){ 
                _mint(acc, tokenId);
                _setTokenURI(tokenId, 'ipfs://bafkreig5s4oq574drfafphiyazroxxngmid3m6vensuvk3y2qvoz5ubhmi');
                record[acc] += 15;
            } else {
                // redirect to payment.
            }
        } // TODO: error handling.
        // return tokenURI(tokenId);
    }
    // ipfs://bafkreig5s4oq574drfafphiyazroxxngmid3m6vensuvk3y2qvoz5ubhmi

    function getTokenURI(uint256 tokenId) public returns(string memory){
        return tokenURI(tokenId);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        onlyOwner{
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override{
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory){
        return super.tokenURI(tokenId);
    }

    // TODO: Create a function that communicates with the ERC20 RocketToken 
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract RocketNFT is ERC721, ERC721URIStorage, Pausable, Ownable, ERC721Burnable {

    constructor() ERC721('RocketNFT', 'RE') {
        _mint(msg.sender, 1000000);
    }

    // 0xF4F555ca1586C40067cd215578f123d30813De02 // MH
    // 0xEc206446346bF108E31cb79d28E93070dCc99FB8 // FH

    // (0) 0xc3a61688ed375fd1f848a6ead82f7554cfd1e0aa
    // (1) 0x2a3c056279d2a4044a08a8ff1db8bc3a0967923c
    // (2) 0x71251f5774d45051561cc5f34986082c0c7829a8


    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        onlyOwner
    {
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
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // TODO: Create a function that communicates with the ERC20 RocketToken 
}
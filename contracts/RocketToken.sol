// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract RocketToken is ERC20, Pausable, Ownable, ERC20Permit {

    mapping(address => uint) public lastFaucetRequest;

    constructor() ERC20("RocketToken", "ROCKET") ERC20Permit("RocketToken") {
        _mint(msg.sender, 1000);
        _mint(address(this), 1000000000);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function faucet(address requester) public {
        require(block.timestamp >= lastFaucetRequest[requester] + 86400, "Only one request can be made per day");
        lastFaucetRequest[requester] = block.timestamp;
        _transfer(address(this), requester, 100);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}

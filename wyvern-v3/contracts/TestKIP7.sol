// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@klaytn/contracts/KIP/token/KIP7/KIP7.sol";
import "@klaytn/contracts/access/Ownable.sol";

contract TestKIP7 is KIP7, Ownable {
    constructor() KIP7("Test Token", "TST") {     
        _mint(msg.sender, 100000 * 10 ** 18);        
    }

     function mint(address account, uint256 amount) public onlyOwner {
        _safeMint(account, amount);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@klaytn/contracts/KIP/token/KIP17/KIP17.sol";

contract TestKIP17 is KIP17 {


    constructor() KIP17("TestKIP17", "TST") {
        mint(msg.sender, 1);
        mint(msg.sender, 2);
        mint(msg.sender, 3);
    }

    /**
     */
    function mint(address to, uint256 tokenId) public returns (bool) {
        _safeMint(to, tokenId);
        return true;
    }
    
}
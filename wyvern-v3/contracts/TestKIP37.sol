// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@klaytn/contracts/KIP/token/KIP37/KIP37.sol";

contract TestKIP37 is KIP37("http://test/{id}.json") {

	/**
	 */
	constructor () public {
	}

	function mint(address to, uint256 tokenId) public returns (bool) {
		_mint(to, tokenId, 1, "");
		return true;
	}
	
	function mint(address to, uint256 tokenId, uint256 amount) public returns (bool) {
		_mint(to, tokenId, amount, "");
		return true;
	}
}
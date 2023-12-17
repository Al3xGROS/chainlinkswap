// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract Token1 is ERC20{

    constructor() ERC20("LucasToken", "LUC"){
        uint256 decimals = decimals();
        uint256 valueToMint = 100000 * 10 ** decimals;
        _mint(msg.sender, valueToMint);
    }

    function receiveToken(uint256 _amount) public {
        _mint(msg.sender, _amount*10**18);
    }
}
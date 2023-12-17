// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {AggregatorV3Interface} from "../lib/foundry-chainlink-toolkit/src/interfaces/AggregatorV3Interface.sol";

contract Swapper{

    IERC20 public tokenA;
    IERC20 public tokenB;
    AggregatorV3Interface internal LETHPriceFeed;

    constructor(address _tokenAAddress, address _tokenBAddress, address _lethPriceFeedAddress){
        tokenA = IERC20(_tokenAAddress);
        tokenB = IERC20(_tokenBAddress);
        LETHPriceFeed = AggregatorV3Interface(_lethPriceFeedAddress);
    }

    function swap(uint256 _amount) public{
        require(tokenA.allowance(msg.sender, address(this)) >= uint(_amount), "TokenA Allowance too low");
        // require(tokenB.allowance(address, spender);)

        uint256 result = getPrice(_amount);

        require(tokenB.balanceOf(address(this)) >= uint(result), "Not enough balance in the contract");
        tokenA.transferFrom(msg.sender, address(this), _amount*10**18);
        tokenB.transfer(msg.sender, result);
    }   

    function getPrice(uint256 _amount) public view returns (uint256) {
        (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound) = LETHPriceFeed.latestRoundData();
        return (_amount*uint(answer))/(10**8);
    }

    function _safeTransferFrom(IERC20 token, address sender, address recipient, uint256 amount) private {
        bool sent = token.transferFrom(sender, recipient, amount);
        require(sent, "Token transfer failed");
    }
}
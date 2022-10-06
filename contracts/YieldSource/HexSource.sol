pragma solidity ^0.8.0;

import "../interfaces/IYieldSource.sol";
import "../interfaces/IHEX.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract HexSource is IYieldSource {
    
    IERC20 public token;
    IHEX public Hex;
    constructor(address _token) {
        token = IERC20(_token); 
        Hex = IHEX(_token);
    }

    function depositToken() external view override returns(IERC20) {
        return token;
    }


    function balanceOfToken(address addr) external view returns (uint256) {
        return token.balanceOf(addr);
    }

    
    function supplyTokenTo(uint256 amount ) external{
        token.transferFrom(msg.sender, address(this), amount);

    }


    function redeemToken(uint256 amount) external returns (uint256){

    }

    function supplyToYield(uint numberOfDays) external {
        IHEX(address(token)).stakeStart(token.balanceOf(address(this)),numberOfDays);

    }

}
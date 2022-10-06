
pragma solidity ^0.8.0;

interface IHEX {
 
    function stakeStart(uint256 newStakedHearts, uint256 newStakedDays) external;
    function stakeGoodAccounting(address stakerAddr, uint256 stakeIndex, uint40 stakeIdParam) external;
    function stakeEnd(uint256 stakeIndex, uint40 stakeIdParam) external;
}
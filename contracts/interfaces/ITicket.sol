
pragma solidity ^0.8.0;

interface ITicket {

    function controllerMint(address _user, uint256 _amount) external;

    function controllerBurn(address _user, uint256 _amount) external;
}
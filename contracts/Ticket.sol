pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "./interfaces/ITicket.sol";

contract Ticket is ERC20Permit,ITicket{

    

    address public controller ;

    modifier onlyController() {
        require(controller==msg.sender,"NOT PERMISSIONED");
        _;
    }
    constructor(address _controller) ERC20Permit("Ticket Token") ERC20("Ticket","TCK") {
        controller= _controller;
    }


    function controllerMint(address _user, uint256 _amount)
        external
        virtual
        
        onlyController
    {
        _mint(_user, _amount);
    }

     function controllerBurn(address _user, uint256 _amount)
        external
        virtual
        onlyController
    {
        _burn(_user, _amount);
    }
    
}
pragma solidity ^0.8.0;

import "../interfaces/ITicket.sol";
import "../interfaces/IYieldSource.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract PrizePool {
    ITicket public ticket;
    address public owner;
    IYieldSource public yieldSource;

    mapping(address=>uint) public shares;

    modifier onlyOwner() {
        require(owner==msg.sender);
        _;
    }

    constructor(IYieldSource _yieldSource) {
        yieldSource = _yieldSource;
        owner=msg.sender;

    }

    function setTicket(address _ticket) external {
        ticket = ITicket(_ticket);
    }

    function _isControlled(ITicket __token) public view returns(bool){
        return ticket==__token;
    }

     function _mint(
        address _to,
        uint256 _amount,
        ITicket _controlledToken
    ) internal {
        _controlledToken.controllerMint(_to, _amount);
    }

    function _token() public view returns (IERC20) {
        return yieldSource.depositToken();
    }

       function balanceOfYieldSource() public returns(uint) {
        return yieldSource.balanceOfToken(address(yieldSource));
    }

    function totalTicketAmount() public view returns(uint) {
        return IERC20(address(ticket)).totalSupply();
    }

    function depositTo(uint _amount) external {
        
        ITicket _ticket = ticket;
         uint _totalTicketAmount;
         uint tickets;
         uint totalTokenAmount = balanceOfYieldSource();

        if(totalTokenAmount>0)
        {   
        _totalTicketAmount = totalTicketAmount();
        tickets = (_totalTicketAmount  * _amount/totalTokenAmount);
        shares[msg.sender] += tickets;

        _token().transferFrom(msg.sender, address(this), _amount);

        _mint(msg.sender, tickets, _ticket);
        _supply(_amount);

       

         
        }
        else {
        _token().transferFrom(msg.sender, address(this), _amount);

        _mint(msg.sender, _amount, _ticket);
        _supply(_amount);

        shares[msg.sender] += _amount;

        
        }
    }




    function withdrawFrom(uint256 _amount)
        external
        returns (uint256)
    {   require(_amount<=shares[msg.sender] && _amount !=0,"Not enough shares");
        ITicket _ticket = ticket;
        uint totalTokenAmount = balanceOfYieldSource();
        uint _totalTicketAmount = totalTicketAmount();
        
        uint tokenAmount = (totalTokenAmount * _amount / _totalTicketAmount);

        // burn the tickets
        _ticket.controllerBurn(msg.sender, _amount);

        // redeem the tickets
        _redeem(tokenAmount);

        _token().transfer(msg.sender, tokenAmount);

        shares[msg.sender]-=_amount;

        
    }

      function _supply(uint256 _mintAmount) internal {
        _token().approve(address(yieldSource), _mintAmount);
        yieldSource.supplyTokenTo(_mintAmount);
    }


    function _redeem(uint256 _redeemAmount) internal returns (uint256) {
        return yieldSource.redeemToken(_redeemAmount);
        
    }

}
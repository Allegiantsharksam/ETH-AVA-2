// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(address indexed depositor, uint256 amount);
    event Withdraw(address indexed recipient, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable onlyOwner {
        balance += _amount;
        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _withdrawAmount) public onlyOwner {
        require(balance >= _withdrawAmount, "Insufficient balance");

        balance -= _withdrawAmount;
        emit Withdraw(msg.sender, _withdrawAmount);
    }

    // Allow the owner to transfer ownership to a new address
    function transferOwnership(address payable _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Invalid new owner address");
        owner = _newOwner;
    }

    // Fallback function to receive Ether
    receive() external payable {
        balance += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw Ether from the contract (onlyOwner)
    function withdrawEther(uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient contract balance");
        owner.transfer(_amount);
    }
}

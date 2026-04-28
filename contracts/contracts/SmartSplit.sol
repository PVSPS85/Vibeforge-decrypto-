// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SmartSplit {
    event ExpenseAdded(address indexed payer, uint256 totalAmount, address[] participants);
    event DebtSettled(address indexed debtor, address indexed creditor, uint256 amount);

    // Tracks who owes whom: debts[debtor][creditor] = amount
    mapping(address => mapping(address => uint256)) public debts;

    function addExpense(uint256 totalAmount, address[] memory participants) public {
        require(participants.length > 0, "Must have participants");
        
        uint256 splitAmount = totalAmount / participants.length;

        for (uint i = 0; i < participants.length; i++) {
            address participant = participants[i];
            
            if (participant != msg.sender) {
                debts[participant][msg.sender] += splitAmount;
            }
        }

        emit ExpenseAdded(msg.sender, totalAmount, participants);
    }

    function settleDebt(address creditor) public payable {
        uint256 amountOwed = debts[msg.sender][creditor];
        
        require(msg.value > 0, "Must send ETH to settle debt");
        require(msg.value <= amountOwed, "You are sending more than you owe");

        debts[msg.sender][creditor] -= msg.value;
        payable(creditor).transfer(msg.value);

        emit DebtSettled(msg.sender, creditor, msg.value);
    }

    function getDebt(address debtor, address creditor) public view returns (uint256) {
        return debts[debtor][creditor];
    }
}

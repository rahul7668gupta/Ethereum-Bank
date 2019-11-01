pragma solidity 0.5.7;

contract EthereumBank{
    mapping(address => uint256) private _balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint amount);

    function deposit() external payable {
        uint256 value = msg.value;
        require(value>0, "Invalid Value!!");

        _balances[msg.sender] = _balances[msg.sender] + value;
        emit Deposit(msg.sender, value);
    }

    function withdraw(uint256 amount) external {
        require(amount>0, "Amount should be greater than 0!!");
        require(amount<=_balances[msg.sender], "Insufficient Balance");
        _balances[msg.sender] = _balances[msg.sender] - amount;
        msg.sender.transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    function getUserBalance() external view returns(uint256){
        return _balances[msg.sender];
    }
}
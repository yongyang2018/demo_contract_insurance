pragma solidity >=0.4.21 <0.6.0;
 
/**
 * owned是合约的管理者
 */
contract owned {
    address public owner;
 
    /**
     * 初台化构造函数
     */
    constructor() public {
        owner = msg.sender;
    }
 
    /**
     * 判断当前合约调用者是否是合约的所有者
     */
    modifier onlyOwner {
        require( msg.sender == owner,
        "sender is not authorized");
        _;
    }
 
    /**
     * 合约的所有者指派一个新的管理员
     * @param  newOwner address 新的管理员帐户地址
     */
    function transferOwnership(address newOwner) public onlyOwner{
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }
}

contract Insurance is owned{

    //属性
    struct Comminfo {
        string flightInfo;//航班信息
        string time;    //起保时间
        string number;  //保单好吗
        uint8  status;  //1是待审核，2是用过
    }

    //记录所有数据映射
    mapping (uint => Comminfo) commOf;
    
    uint[] lengths;

    constructor() public{}

    //获取长度
    function getlength() public view returns (uint len){
        return lengths.length;
    }

    //保存
    function saveinfo(string memory flightInfo ,string memory time,string memory number) public{
        uint les = lengths.length;

        commOf[les].flightInfo = flightInfo;
        commOf[les].time=time;
        commOf[les].number=number;
        commOf[les].status=1;
        lengths.push(les);
    }

    //清空
    function deleteinfo() public{
        uint les = lengths.length;

        commOf[les].flightInfo = "";
        commOf[les].time="";
        commOf[les].number="";
        commOf[les].status=0;
        lengths = new uint[](1);
    }
 
    //查询数据
    function selectAll(uint key) public view returns (string memory flightInfo ,string memory time,string memory number,uint8 status,uint id){
        flightInfo=commOf[key].flightInfo;
        time=commOf[key].time;
        number=commOf[key].number;
        status=commOf[key].status;  
        id=key;

        return (flightInfo,time,number,status,id);
    }

    //审核
    function update(uint key) public{
        commOf[key].status=2;
    }

}


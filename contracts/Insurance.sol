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
    
    constructor() public{}


    //保存
    function saveinfo(string memory flightInfo ,string memory time,string memory number) public{
        commOf[0].flightInfo = flightInfo;
        commOf[0].time=time;
        commOf[0].number=number;
        commOf[0].status=1;
    }

    //清空
    function deleteinfo() public{
        commOf[0].flightInfo = "";
        commOf[0].time="";
        commOf[0].number="";
        commOf[0].status=0;
    }
 
    //查询数据
    function selectAll() public view returns (string memory flightInfo ,string memory time,string memory number,uint8 status,uint id){
        flightInfo=commOf[0].flightInfo;
        time=commOf[0].time;
        number=commOf[0].number;
        status=commOf[0].status;  
        id=0;

        return (flightInfo,time,number,status,id);
    }

    //审核
    function update() public{
        commOf[0].status=2;
    }

}


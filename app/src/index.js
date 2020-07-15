import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/Insurance.json";

const App = {
  web3: null,
  account: null, 
  meta: null,
  

  start: async function() {
    const { web3 } = this;
    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );
      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
      console.log(error);
    }
  },

  selectAll: async function(){
    const { selectAll } = this.meta.methods;
    var result = await selectAll().call();
    var flightInfo = result.flightInfo;
    var number = result.number;
    document.getElementById("aviation-flight").innerHTML = flightInfo;
    document.getElementById("aviation-number").innerHTML = number;
  },

  save: async function(flight,time,number){
    const { web3 } = this;
    const { saveinfo } = this.meta.methods;
    await saveinfo(flight,time,number).send({from:this.account, gas: 3141592},function(error, transactionHash){
      localStorage.setItem("hash_1", transactionHash);
      var url = "success.html?type=1";
      window.location.href=url; 
    });
  },

  address:async function(){
    await this.start();
    const { web3 } = this;
    document.getElementById("user_address").innerHTML = this.account;
    document.getElementById("airline_company_address").innerHTML = this.account;
    document.getElementById("insurance_company_address").innerHTML = this.account;
  },

  update: async function() {
    const { web3 } = this;
    const { update } = this.meta.methods;
    await  update().send({from:this.account, gas: 3141592},function(error, transactionHash){
      var url = "success.html?type=2";
      window.location.href=url;
      localStorage.setItem("hash_2", transactionHash);
    });
    
  },
  search: async function(type) {
    const { selectAll } = this.meta.methods;
    var result = await selectAll().call();
    if(type == 1){
      if(result.flightInfo == ""){
        var url = "user.html";
        window.location.href=url; 
      }else{
        alert("用户信息已完善！");
        return;
      }
    }else if(type == 2){
      if(result.flightInfo == ""){
        alert("请先完善用户信息！");
        return;
      }
      if(result.status == 2){
        alert("航空公司已确认！");
        return;
      }
      var url = "aviation.html";
      window.location.href=url; 
    } 
  },
  aviation: async function() {
    var t = global.address;
    await this.start();
    const { web3 } = this;
    const { selectAll } = this.meta.methods;
    var result = await selectAll().call();
    document.getElementById("aviation-flight").innerHTML = result.flightInfo;
    document.getElementById("aviation-number").innerHTML = result.number;
    document.getElementById("tx_hash").innerHTML = localStorage.getItem("hash_1");
    if(localStorage.getItem("hash_1") != null){
      web3.eth.getTransaction(localStorage.getItem("hash_1"),function(error, transaction){
        if(transaction != null){
          document.getElementById("block_hash").innerHTML = transaction.blockHash;
          document.getElementById("block_height").innerHTML = transaction.blockNumber;
        }
      });
    }
  },
  hash: function(type) {
    if(type == 1){
      document.getElementById("hash_1").innerHTML = localStorage.getItem("hash_1");
    }else if(type == 2){
      document.getElementById("hash_1").innerHTML = localStorage.getItem("hash_2");
    }
  },
  select_claim: function(hash){
    if(localStorage.getItem("hash_1") == hash){
        var url = "select-claim.html";
        window.location.href=url;
    }else{
      alert("暂无信息");
      return;
    }
  },
  select_claim_info: async function(type) {
    if(localStorage.getItem("hash_1") != null){
      await this.start();
      const { web3 } = this;
      const { selectAll } = this.meta.methods;
      var result = await selectAll().call();
      document.getElementById("info").innerHTML = result.flightInfo;
      document.getElementById("time").innerHTML = result.time;
      document.getElementById("number").innerHTML = result.number;
      web3.eth.getTransaction(localStorage.getItem("hash_1"),function(error, transaction){
        if(transaction != null){
          document.getElementById("height").innerHTML = transaction.blockNumber;
          document.getElementById("block_hash").innerHTML = transaction.blockHash;
          document.getElementById("tx_hash").innerHTML = localStorage.getItem("hash_1");
        }  
      });
    }
  },
  select_compensate_info: async function(type) {
    await this.start();
    const { web3 } = this;
    const { selectAll } = this.meta.methods;
    var result = await selectAll().call();
    if(localStorage.getItem("hash_2") != null){
      document.getElementById("info").innerHTML = result.flightInfo;
      document.getElementById("time").innerHTML = result.time;
      web3.eth.getTransaction(localStorage.getItem("hash_2"),function(error, transaction){
        document.getElementById("height").innerHTML = transaction.blockNumber;
        document.getElementById("block_hash").innerHTML = transaction.blockHash;
        document.getElementById("tx_hash").innerHTML = localStorage.getItem("hash_1");
      });
    }
  },
  remake: async function(type) {
    const { deleteinfo } = this.meta.methods;
    await  deleteinfo().send({from:this.account, gas: 3141592},function(error, transactionHash){
      localStorage.setItem("hash_1", null);
      localStorage.setItem("hash_2", null);
      alert("成功");
    });
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://192.168.1.167:7545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://192.168.1.167:7545"),
    );
  }
  App.start();
});

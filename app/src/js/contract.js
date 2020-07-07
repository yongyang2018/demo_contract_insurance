import Web3 from "web3";
import metaCoinArtifact from "../../../build/contracts/Insurance.json";

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
      console.log(accounts[0]);
      document.getElementById("user_address").innerHTML = accounts[0];
      document.getElementById("airline_company_address").innerHTML = accounts[0];
      document.getElementById("insurance_company_address").innerHTML = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  save: async function(){
    const { web3 } = this;
    //商品代码
    var codes=document.getElementById('codes').value
    //名称
    var name=document.getElementById('name').value
    //数量
    var count=document.getElementById('count').value
    //上下架
    var status=document.getElementById('switch').value
    if(code==''||name==''||count==''){
      alert("Parameter cannot be null!");
      return 
    }
    const { saveinfo } = this.meta.methods;
    await saveinfo(name,codes,count,status).send({from:this.account, gas: 3141592},function(){
      location.reload();
      });
  },
  update: async function() {
    const { web3 } = this;
    var dataid='';
    $('tbody').find('input').each(function(){
      if($(this).prop('checked')==true){
        dataid=$(this).attr("data-id");
        return false;
      }
    })
    if(dataid==''){
      alert("No choice!");
      return false;
    }
    const { update } = this.meta.methods;
    await  update(dataid).send({from:this.account, gas: 3141592},function(){
      location.reload();
      });
    
  },
  test: async function(tt) {
    alert("this is test");
    alert(tt);
    var url = "success.html";
    window.location.href=url;    
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
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );
  }
  App.start();
});

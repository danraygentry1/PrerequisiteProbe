
((configRepo)=>{
  configRepo.SetConfig = (paypal)=>{
    console.log("Config Hit");
    let config = {
      "host" : "api.paypal.com",
      "mode" : "live",
      "port" : "",
      "client_id" : "",  // your paypal serverlication client id
      "client_secret" : "" // your paypal serverlication secret id
    }
    paypal.configure(config);
  };
})
(
    module.exports
);  //this is an IIFE (Immediately Invoked Function Expression)

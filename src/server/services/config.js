((configRepo)=>{
  configRepo.SetConfig = (paypal)=>{
    console.log("Config Hit");
    let config = {
      "host" : "api.sandbox.paypal.com",
      "port" : "",
      "client_id" : "AeCVb_Qbl2Hy9k2esZmbD26SQyqdfJYzKX-78Z33MitTRW5XCUKBYEPkMZP8_p83HTjXqCwkm6-hAo72",  // your paypal serverlication client id
      "client_secret" : "EHIZnnaIdqgkKKMQnOvPCV3hVdGgius2v1Rb5yPHR5Y-6u6SOggQDfF7qcDmE-U8VjJW7vsxdQ49WmtG" // your paypal serverlication secret id
    }
    paypal.configure(config);
  };
})
(
  module.exports
);  //this is an IIFE (Immediately Invoked Function Expression)

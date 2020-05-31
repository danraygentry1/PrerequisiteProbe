((configRepo)=>{
  configRepo.SetConfig = (paypal)=>{
    console.log("Config Hit");
    let config = {
      "mode" : "live",
      "host" : "api.paypal.com",
      "port" : "",
      "client_id" : "AQQKGrwdfpyYyecTSUfXs-u6wwFcQHAd40VmlvWZ379bobn-ASrwv1HtlBZXrt_BWI6xj9I8Z-QJDqXy",  // your paypal serverlication client id
      "client_secret" : "EG2QiXcbDHPCRHSIgxGNp5Ntak2ZNf0a_FTqhheL_wTLNIhD3POmrE00pYprdF_D_nSrpI0pBJg7JCGC" // your paypal serverlication secret id
    }
    paypal.configure(config);
  };
})
(
    module.exports
);  //this is an IIFE (Immediately Invoked Function Expression)

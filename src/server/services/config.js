
((configRepo)=>{
  configRepo.SetConfig = (paypal)=>{
    console.log("Config Hit");
    let config = {
      "host" : "api.paypal.com",
      "mode" : "live",
      "port" : "",
      "client_id" : "AV5MkMmK1rO35qp0m4DLMLUJ1EM8E6GCZuhg3xET38zGcFplEHJVhNbBZxTknkW07PXQ83_Ktliu0I6J",  // your paypal serverlication client id
      "client_secret" : "EH9MIbjtCjcBsjGc1Su-jDrVKjIdoaJUNTcHjG39ORwMi7lv1dSHYXR6xGsHX2CJXsDGT5j7aFz9onis" // your paypal serverlication secret id
    }
    paypal.configure(config);
  };
})
(
    module.exports
);  //this is an IIFE (Immediately Invoked Function Expression)
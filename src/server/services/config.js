((configRepo)=>{
  configRepo.SetConfig = (paypal)=>{
    console.log("Config Hit");
    let config = {
      "host" : "api.sandbox.paypal.com",
      "port" : "",
      "client_id" : "AdMHIIMwj2s_kEIhH6_M-cME1KKFMUmYNv3asOzkaAgFWgl3mvqSuwyvT62r9pM0uDaAClS1YF7_mT-F",  // your paypal serverlication client id
      "client_secret" : "ECkQxrFGyudydzzxLaFqCnTjj2XMXF0VcaphJNYzWk-EQezi9IhVpZAZBpPAEcDx5NJibDyQ7f9HdJ7L" // your paypal serverlication secret id
    }
    paypal.configure(config);
  };
})
(
    module.exports
);  //this is an IIFE (Immediately Invoked Function Expression)

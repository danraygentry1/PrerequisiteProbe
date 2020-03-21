((squatchPurchaseRepo, paypal, ObjectID, mongoService, paymentService)=>{

  squatchPurchaseRepo.BuySingle = (orderObj, cb)=>{

    let transactionArray = [];

    //for(let i = 0; i < itemCount; i++){
      let itemObj = paymentService.CreateItemObj(orderObj.purchaseName, orderObj.purchasePrice, 1);
      transactionArray.push(itemObj);
    //}

    let transactionItemObj = [paymentService.CreateTransactionObj(orderObj.taxPrice, orderObj.shippingPrice, orderObj.description, transactionArray)];

    paymentService.CreateWithPaypal(transactionItemObj, orderObj, "http://localhost:9229/success", "http://localhost:9229/cancel", (err, results)=>{
      if(err){
        return cb(err);
      } else {
        return cb(null, results);
      }
    });

  };

  squatchPurchaseRepo.CancelOrder = (orderID, cb)=>{
    postgresService.Delete("paypal_orders", { _id: new ObjectID(orderID) }, (err, results)=>{
      return cb(err, results);
    });
  }; //when user hits cancel button on paypal

  squatchPurchaseRepo.ExecuteOrder = (payerID, orderID, payID, cb)=>{
    console.log("EXECUTE ORDER FUNCTION" + orderID)
    paymentService.ExecutePayment(payerID, orderID, payID, (err, response)=>{
      return cb(err, response);
    });
  };


  squatchPurchaseRepo.GetOrder = (orderID, cb)=>{
    postgresService.Read("paypal_orders", { _id: new ObjectID(orderID) }, (order_err, paymentObj)=>{
      if(order_err){
        return cb(order_err);
      } else {
        paymentService.GetPayment(paymentObj[0].OrderDetails.id, (err, results)=>{
          return cb(err, results);
        });
      }
    });
  };

  squatchPurchaseRepo.RefundOrder = (orderID, cb)=>{
    squatchPurchaseRepo.GetOrder(orderID, (order_err, order)=>{
      if(order_err){
        return cb(order_err);
      }
      let saleID = order.transactions[0].related_resources[0].sale.id;
      let refundPrice = Number(order.transactions[0].amount.total);
      paymentService.RefundPayment(saleID, refundPrice, (err, refund)=>{
        cb(err, refund);
      });
    });
  }; //sale.id is PayPal's unique identifier, OrderID is mongodb's unique identifier

})
(
    module.exports,
    require('paypal-rest-sdk'),
    require('mongodb').ObjectId,
    require('../server/services/postgresService.js'),
    require('../server/services/paymentService.js'),
);

((squatchPurchaseRepo, paypal, ObjectID, mongoService, paymentService) => {
  squatchPurchaseRepo.BuySingle = (orderObj, userObj, cb) => {
    const transactionArray = [];

    // for(let i = 0; i < itemCount; i++){
    const itemObj = paymentService.CreateItemObj(orderObj.purchaseName, orderObj.purchasePrice, 1);
    transactionArray.push(itemObj);
    // }

    const transactionItemObj = [paymentService.CreateTransactionObj(orderObj.taxPrice, orderObj.shippingPrice, orderObj.description, transactionArray)];

    paymentService.CreateWithPaypal(transactionItemObj, orderObj, userObj, 'http://localhost:3000/success', 'http://localhost:3000/cancel', (err, results) => {
      if (err) {
        return cb(err);
      }
      return cb(null, results);
    });
  };

  squatchPurchaseRepo.CancelOrder = (orderID, cb) => {
    postgresService.Delete('paypal_orders', { _id: new ObjectID(orderID) }, (err, results) => cb(err, results));
  }; // when user hits cancel button on paypal

  squatchPurchaseRepo.ExecuteOrder = (payerID, orderID, payID, cb) => {
    console.log(`EXECUTE ORDER FUNCTION${orderID}`);
    paymentService.ExecutePayment(payerID, orderID, payID, (err, response) => cb(err, response));
  };


  squatchPurchaseRepo.GetOrder = (orderID, cb) => {
    postgresService.Read('paypal_orders', { _id: new ObjectID(orderID) }, (order_err, paymentObj) => {
      if (order_err) {
        return cb(order_err);
      }
      paymentService.GetPayment(paymentObj[0].OrderDetails.id, (err, results) => cb(err, results));
    });
  };

  squatchPurchaseRepo.RefundOrder = (orderID, cb) => {
    squatchPurchaseRepo.GetOrder(orderID, (order_err, order) => {
      if (order_err) {
        return cb(order_err);
      }
      const saleID = order.transactions[0].related_resources[0].sale.id;
      const refundPrice = Number(order.transactions[0].amount.total);
      paymentService.RefundPayment(saleID, refundPrice, (err, refund) => {
        cb(err, refund);
      });
    });
  }; // sale.id is PayPal's unique identifier, OrderID is mongodb's unique identifier
})(
  module.exports,
  require('paypal-rest-sdk'),
  require('mongodb').ObjectId,
  require('../server/services/postgresService.js'),
  require('../server/services/paymentService.js'),
);

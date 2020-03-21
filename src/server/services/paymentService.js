((paymentService, paypal, postgresService, ObjectID)=>{
  require('./config.js').SetConfig(paypal); //server will inject PayPal service on startup, so we only have to call this once

  paymentService.CreateItemObj = (name, price, quantity)=>{
    let itemObj = {
      name: name,
      price: price,
      currency: "USD",
      quantity: quantity
    };
    return itemObj;
  };  //CreateItemObj AKA Module.exports.  This method scaffolds an item, then returns it

  paymentService.CreateTransactionObj = (tax, shipping, description, itemList)=>{
    let total = 0.0;
    for(let i = 0; i < itemList.length; i++){
      let newQuant = itemList[i].quantity;
      if(newQuant >= 1){
        total += itemList[i].price;
      } else {
          total = itemList[i].price;
      }
    }
    let transactionObj = {
      "amount": {
        "total": total,
        "currency": "USD",
        "details": {
            "tax": tax,
            "shipping": shipping
        }
      },
      "description": description,
      "item_list" : { "items" : itemList }
    }
    return transactionObj;
  };

  paymentService.CreatePaymentCardJSON = (cardType, cardNumber, cardExpireMonth, cardExpireYear, cardCVV2, cardFirstName,
                                            cardLastName, billingAddressObj, transactionsArray)=>{
    let card = {
      "intent": "sale",
      "payer": {
          "payment_method": "credit_card",
          "funding_instruments": [{
            "credit_card": {
              "type": cardType,
              "number": cardNumber,
              "expire_month": cardExpireMonth,
              "expire_year": cardExpireYear,
              "cvv2": cardCVV2,
              "first_name": cardFirstName,
              "last_name": cardLastName,
              "billing_address": billingAddressObj
            }
          }]
      },
      "transactions": transactionsArray
    };

    return card;
  };

  //--------------------------------------------------------
  //Single Purchases

  paymentService.CreateWithPaypal = (transactionsArray, orderObj, returnUrl, cancelUrl, cb)=>{
  /*  let dbObj = {
      OrderID: "",
      CreateTime: "",
      Transactions: ""
    };*/
    postgresService.create_pt_user_order_on_buy('paypal_orders', orderObj, (results)=>{
      let paymentObj = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": returnUrl + "/" + results[0].pt_user_order_id,
            "cancel_url": cancelUrl + "/" + results[0].pt_user_order_id
        },
        "transactions": transactionsArray
      };
      console.log('BEFORE CREATE PAYMENT')

      //creates payment and returns PayId
      paypal.payment.create(paymentObj, (err, response)=>{
        if (err) {
          console.log('AFTER CREATE PAYMENT' + err)
          return cb(err);
        } else {
          console.log('AFTER CREATE PAYMENT SUCCESS')
          postgresService.update_pt_user_order_on_buy('paypal_orders', results[0].pt_user_order_id, response.id, (err, results)=>{
            for(let i = 0; i < response.links.length; i++){
              if(response.links[i].rel == "approval_url"){
                return cb(null, response.links[i].href);
              }
            }
          });
        }
      });
    });
  };
  //attach GetPayment method to PaymentService object.  Responsible for getting created payment info
  paymentService.GetPayment = (paymentID, cb)=>{
    paypal.payment.get(paymentID, (err, payment)=>{
      if(err) {
        console.log(err);
        return cb(err);
      } else {
        return cb(null, payment);
      }
    });
  };

  paymentService.ExecutePayment = (payerID, orderID, payID, cb)=>{

      let payerObj = { payer_id : payerID };

      console.log("EXECUTE PAYMENT" + "payerID:" + payerID, "orderID:" + orderID, "payID:" + payID)

    postgresService.get_pt_user_order('pt_user_order', payID, (err, results)=>{
        if(results){
          console.log("PAY ID" + results[0].pay_id)
          paypal.payment.execute(results[0].pay_id, payerObj, {}, (err, response)=>{
            if(err){
              return cb(err);
            }
            console.log('AFTER EXECUTE SUCCESS')

            if(response){
              postgresService.update_pt_user_order_on_execute('pt_user_order', payerID, orderID, payID, (err, results)=>{
                return cb(null, orderID);
              });
            }
          });
        } else {
            return cb("no pay_id found for this user order");
        }
      });
  };

  paymentService.RefundPayment = (saleID, amount, cb)=>{
    let data = {
      "amount": {
        "currency": "USD",
        "total": amount
      }
    };

    paypal.sale.refund(saleID, data, (err, refund)=>{
      if(err) {
        return cb(err);
      } else {
        return cb(null, refund);
      }
    });
  };

})
(
  module.exports,
  require('paypal-rest-sdk'),
  require('./postgresService.js'),
  require('mongodb').ObjectId
);

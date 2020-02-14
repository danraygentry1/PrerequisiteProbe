import {connectDB} from "../connect-db";

((postgresService, connectDB)=>{

  let connectionString = process.env.MongoConnectionString || "mongodb://localhost:27017/paypaltesting";

  let Connect = (cb)=>{
    mongodb.connect(connectionString, (err, db)=>{
      cb(err, db, ()=>{
        return db.close();
      });
    });
  };

/*  postgresService.Create = (colName, createObj, cb)=>{
    Connect((err, db, close)=>{
      db.collection(colName).insert(createObj, (err, results)=>{
        cb(err, results);
        return close();
      });
    });
  };*/ //postgresService object aka our module.exports object

  postgresService.Create = async (colName, orderObj, cb)=>{
      const pool = await connectDB.connectDB();
      const text = 'INSERT INTO pt_user_order(pt_user_id, order_type, purchase_name, purchase_price, tax_price, "desc") VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
      const values = [1, orderObj.orderType, orderObj.purchaseName, orderObj.purchasePrice, orderObj.taxPrice, orderObj.description]
        try {
          const res = await pool.query(text, values)
          console.log(res.rows[0])
          cb(res.rows);
          // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
        } catch (err) {
          console.log(err.stack)
        }

  }; //postgresService object aka our module.exports object





/*  postgresService.Update = (colName, findObj, updateObj, cb)=>{
    Connect((err, db, close)=>{
      db.collection(colName).update(findObj, { $set: updateObj }, (err, results)=>{
        cb(err, results);
        return close();
      });
    });
  };*/

  postgresService.get_pt_user_order = async (tableName, payId, cb)=>{
    const pool = await connectDB.connectDB();
    const text = 'Select *  pt_user_order where pay_id = $1 RETURNING *'
    const values = [payId]
    try {
      const res = await pool.query(text, values)
      //const res = await pool.query('UPDATE pt_user_order set order_id = ($1) where pt_user_id = ($2)', [orderId, ptUserId]);
      console.log(res.rows[0])
      cb(res.rows);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    } catch (err) {
      console.log(err.stack)
    }
  };

  postgresService.Update = async (colName, ptUserId, payId, cb)=>{
    const pool = await connectDB.connectDB();
    const text = 'UPDATE pt_user_order set pay_id = $1 where pt_user_order_id = $2 RETURNING *'
    const values = [payId, ptUserId]
    try {
      const res = await pool.query(text, values)
      //const res = await pool.query('UPDATE pt_user_order set order_id = ($1) where pt_user_id = ($2)', [orderId, ptUserId]);
      //console.log(res.rows[0])
      cb(res.rows);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    } catch (err) {
      console.log(err.stack)
    }
  };

  postgresService.update_pt_user_order_on_execute = async (tableName, payerID, orderID, payID, cb)=>{
    const pool = await connectDB.connectDB();
    const text = 'UPDATE pt_user_order set payer_id = $1, order_id = $2 where pay_id  = $3 RETURNING *'
    const values = [payerID, orderID, payID]
    try {
      const res = await pool.query(text, values)
      //const res = await pool.query('UPDATE pt_user_order set order_id = ($1) where pt_user_id = ($2)', [orderId, ptUserId]);
      console.log(res.rows[0])
      cb(res.rows);
      //return res.rows;
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    } catch (err) {
      console.log(err.stack)
    }
  };

  postgresService.createPTUser = async (tableName, userObj, cb)=>{
    const pool = await connectDB.connectDB();
    const text = 'INSERT INTO pt_user(first_name, last_name, user_name, password_hash, email_address) VALUES($1, $2, $3, $4, $5) RETURNING *'
    const values = [userObj.first_name, userObj.last_name, userObj.user_name, userObj.password_hash, userObj.email_address]
    try {
      const res = await pool.query(text, values)
      console.log(res.rows[0])
      cb(res.rows);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    } catch (err) {
      console.log(err.stack)
    }

  };

  postgresService.Delete = (colName, findObj, cb)=>{
    Connect((err, db, close)=>{
      db.collection(colName).remove(findObj, (err,results)=>{
        cb(err,results);
        return close();
      });
    });
  };

})
(
  module.exports, //use so other files can have access to the objects or methods we attach to module.exports
    require('../connect-db'),
);

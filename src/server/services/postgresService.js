import { connectDB } from '../connect-db';

((postgresService, connectDB) => {
  // ------pt_user_order table----------------------------------------------------------------------------------------------------------------------------------------

  postgresService.create_pt_user_order_on_buy = async (colName, orderObj, cb) => {
    const pool = await connectDB.connectDB();
    const text = 'INSERT INTO pt_user_order(pt_user_id, order_type, purchase_name, purchase_price, tax_price, "desc") VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [1, orderObj.orderType, orderObj.purchaseName, orderObj.purchasePrice, orderObj.taxPrice, orderObj.description];
    try {
      const res = await pool.query(text, values);
      console.log(res.rows[0]);
      cb(res.rows);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    } catch (err) {
      console.log(err.stack);
    }
  }; // postgresService object aka our module.exports object


  postgresService.get_pt_user_order = async (tableName, payId, cb) => {
    const pool = await connectDB.connectDB();
    const text = 'Select * from pt_user_order where pay_id = $1';
    const values = [payId];
    console.log('AFTER GET_PT_USER_ORDER');
    try {
      const res = await pool.query(text, values);
      console.log(res.rows);
      // const res = await pool.query('UPDATE pt_user_order set order_id = ($1) where pt_user_id = ($2)', [orderId, ptUserId]);
      // console.log(res.rows[0])
      cb(null, res.rows);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    } catch (err) {
      console.log(err.stack);
    }
  };

  postgresService.update_pt_user_order_on_buy = async (colName, ptUserId, payId, cb) => {
    const pool = await connectDB.connectDB();
    const text = 'UPDATE pt_user_order set pay_id = $1 where pt_user_order_id = $2 RETURNING *';
    const values = [payId, ptUserId];
    try {
      const res = await pool.query(text, values);
      // const res = await pool.query('UPDATE pt_user_order set order_id = ($1) where pt_user_id = ($2)', [orderId, ptUserId]);
      // console.log(res.rows[0])
      cb(res.rows);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    } catch (err) {
      console.log(err.stack);
    }
  };

  postgresService.update_pt_user_order_on_execute = async (tableName, payerID, orderID, payID, cb) => {
    const pool = await connectDB.connectDB();
    console.log('NOW IN UPDATE PAYPAL ORDER ON EXECUTE');
    const text = 'UPDATE pt_user_order set payer_id = $1, order_id = $2 where pay_id = $3 RETURNING *';
    const values = [payerID, orderID, payID];
    try {
      const res = await pool.query(text, values);
      // const res = await pool.query('UPDATE pt_user_order set order_id = ($1) where pt_user_id = ($2)', [orderId, ptUserId]);
      console.log(res.rows[0]);
      cb(res.rows);
      // return res.rows;
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    } catch (err) {
      console.log(err.stack);
    }
  };

  // ------pt_user table----------------------------------------------------------------------------------------------------------------------------------------------------------------

  postgresService.create_pt_user = async (tableName, userObj, cb) => {
    const pool = await connectDB.connectDB();
    const text = 'INSERT INTO pt_user(first_name, last_name, user_name, password_hash, email_address, subscribed) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    // eslint-disable-next-line max-len
    const values = [userObj.first_name, userObj.last_name, userObj.user_name, userObj.password_hash, userObj.email_address, userObj.subscribed];
    try {
      const res = await pool.query(text, values);
      console.log(res.rows[0]);
      cb(res.rows);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    } catch (err) {
      cb(err);
      console.log(err.stack);
    }
  };

  postgresService.update_pt_user_password_reset = async (tableName, passwordReset, emailAddress, cb) => {
    const pool = await connectDB.connectDB();
    const text = 'UPDATE pt_user set password_reset = $1 where email_address = $2 RETURNING *';
    const values = [passwordReset, emailAddress];
    try {
      const res = await pool.query(text, values);
      console.log(res.rows[0]);
      cb(res.rows, null);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    } catch (err) {
      cb(null, err);
      console.log(err.stack);
    }
  };
  postgresService.update_pt_user_password = async (passwordHash, passwordReset, cb) => {
    const pool = await connectDB.connectDB();
    const text = 'UPDATE pt_user set password_hash = $1 where password_reset = $2 RETURNING *';
    const values = [passwordHash, passwordReset];
    try {
      const res = await pool.query(text, values);
      if (res.rows[0]) {
        cb(res.rows, null);
      } else cb(null, null);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    } catch (err) {
      cb(null, err);
      console.log(err.stack);
    }
  };
})(
  module.exports, // use so other files can have access to the objects or methods we attach to module.exports
  require('../connect-db'),
);

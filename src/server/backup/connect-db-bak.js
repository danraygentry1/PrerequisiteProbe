//import { MongoClient } from 'mongodb';
//const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/myorganizer';
//let db = null;

//import { Pool } from 'pg'
const { Pool, Client } = require('pg')

export async function connectDB() {
     const pool = new Pool({
        user: 'postgres',
        host: 'pt-prerequisite.cbzc8wikqhsi.us-west-2.rds.amazonaws.com',
        database: 'Physical_Therapy',
        password: 'postgres',
        port: 5432,
    })
    //pool.query('SELECT NOW()', (err, res) => {
     //   console.log(err, res)
      //  pool.end()
   // });
    return pool
}
export async function getPTSchoolInfo(pool)
{
    let ptSchoolColumnsArray = [];
    let ptSchoolColumnsArray2 = [];
    let ptSchoolColumnsObject = {};
    let ptSchoolRowsArray = [];
    let ptSchoolRowsArray2 = [];
    let ptSchoolRowsObject = {};

   const ptSchoolSelect = {
           text: 'SELECT name, program_link, interview_req, tuition_in_state_full, program_start_dt ' + '' +
               'FROM pt_school',
           rowMode: 'array'
       }
       // async/await - check out a client
   await (async () => {
       const client = await pool.connect()
       try {

           const resPT = await client.query(ptSchoolSelect);
           resPT.fields.map(function (key){
                ptSchoolColumnsArray.push({text: key.name, datafield: key.name})
           })

           let i = 0
           resPT.rows.map(function (rowkey){
               ptSchoolColumnsArray.map(function (columnkey){
                   ptSchoolRowsObject[columnkey.text] = rowkey[i]
                   //console.log(ptSchoolRowsObject)
                   //ptSchoolRowsArray.push({[columnkey.name]: rowkey[i]})
                   i = i + 1
               })
               ptSchoolRowsArray.push(ptSchoolRowsObject);
               ptSchoolRowsObject = {};
               i = 0;
           })
           //ptSchoolColumnsArray = resPT.fields.map(key => {key: key.name, name: key.name});
           //ptSchoolRows = resPT.rows
           console.log("PT School Rows!!!")
           console.log(ptSchoolRowsArray)
           //console.log("PT School Rows Object!!!")
           //console.log(ptSchoolRowsObject)
           console.log("PT School Columns!!!")
           console.log(ptSchoolColumnsArray)
           //console.log("PT REs!!!")
           //console.log(resPT)
       } finally {
           // Make sure to release the client before any error handling,
           // just in case the error handling itself throws an error.
           client.release()
       }
   })().catch(e => console.log(e.stack))

    return{
        ptSchoolRowsArray,
        ptSchoolColumnsArray,
        session:{authenticated:'AUTHENTICATED', id:1}
    }
}
export async function getPTUser(pool)
{
    let ptUserRows = [];

    const ptUserSelect = {
        text: 'SELECT * FROM pt_user',
        rowMode: 'array'
    }
        // async/await - check out a client
    await (async () => {
    const client = await pool.connect()
    try {
        const resUser = await client.query(ptUserSelect);
        ptUserRows = resUser.rows;
        //console.log(res.fields.map(f => f.name))
    } finally {
        // Make sure to release the client before any error handling,
        // just in case the error handling itself throws an error.
        client.release()
    }
    })().catch(e => console.log(e.stack))

    return ptUserRows

}
//connectDB()
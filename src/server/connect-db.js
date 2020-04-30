// import { MongoClient } from 'mongodb';
// const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/myorganizer';
// let db = null;

// import { Pool } from 'pg'
const { Pool, Client } = require('pg');

export async function connectDB() {
  const pool = new Pool({
    user: 'postgres',
    host: 'pt-prerequisite.cbzc8wikqhsi.us-west-2.rds.amazonaws.com',
    database: 'Physical_Therapy',
    password: 'postgres',
    port: 5432,
  });
  // pool.query('SELECT NOW()', (err, res) => {
  //   console.log(err, res)
  //  pool.end()
  // });
  return pool;
}
export async function getPTSchoolInfo(pool) {
  const ptSchoolColumnsArray = [];
  const ptSchoolRowsArray = [];
  let ptSchoolRowsInnerArray = [];

  const ptSchoolSelect = {
    text: 'select pt_school.pt_school_id, pt_school.name as school_name, pt_school.state, pt_school.interview_req, pt_school.lor_num,  pt_school.program_start_dt, '
           + 'pt_deadline.ptcas_deadline_dt, pt_school.class_size, pt_hours.hours_min, pt_school.tuition_in_state_full, pt_school.tuition_out_state_full, pt_gpa.gpa_overall_min, '
       + 'pt_gpa.gpa_prereq_min, pt_gre_exam.score_verbal_min, pt_gre_exam.score_quant_min, pt_gre_exam.score_total_min ' + ''
       + 'from pt_school '
       + 'Inner Join pt_deadline on pt_school.pt_school_id = pt_deadline.pt_school_id '
       + 'Inner Join pt_gpa on pt_school.pt_school_id = pt_gpa.pt_school_id '
       + 'Inner Join pt_gre_exam on pt_school.pt_school_id = pt_gre_exam.pt_school_id '
       + 'Inner Join pt_hours on pt_school.pt_school_id = pt_hours.pt_school_id ' + ''
       // 'Inner Join pt_school_course on pt_school.pt_school_id = pt_school_course.pt_school_id ' +
       // 'Inner Join pt_course on pt_school_course.pt_course_id = pt_course.pt_course_id ' + '' +
       + 'order by pt_school.pt_school_id',
    rowMode: 'array',
  };
  // async/await - check out a client
  await (async () => {
    const client = await pool.connect();
    try {
      const resPT = await client.query(ptSchoolSelect);
      resPT.fields.map((key) => {
        ptSchoolColumnsArray.push({ text: key.name, datafield: key.name });
      });

      let i = 0;
      resPT.rows.map((rowkey) => {
        ptSchoolColumnsArray.map((columnkey) => {
          ptSchoolRowsInnerArray.push(rowkey[i]);
          i += 1;
        });
        ptSchoolRowsArray.push(ptSchoolRowsInnerArray);
        ptSchoolRowsInnerArray = [];
        i = 0;
      });
      // console.log("PT School Rows!!!")
      // console.log(ptSchoolRowsArray)
      // console.log("PT School Columns!!!")
      // console.log(ptSchoolColumnsArray)
      // console.log("PT REs!!!")
      // console.log(resPT)
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release();
    }
  })().catch((e) => console.log(e.stack));

  return {
    ptSchoolRowsArray,
    ptSchoolColumnsArray,
    session: { authenticated: 'AUTHENTICATED', id: 1 },
  };
}
export async function getPTSchoolCourseInfo(pool) {
  const ptSchoolCourseColumnsArray = [];
  const ptSchoolCourseRowsArray = [];
  let ptSchoolCourseRowsInnerArray = [];

  const ptSchoolCourseSelect = {
    text: 'select pt_school.pt_school_id, pt_course.name as course_name, pt_school_course.course_level, pt_school_course.lab_req ' + ''
            + 'from pt_school '
            + 'Inner Join pt_school_course on pt_school.pt_school_id = pt_school_course.pt_school_id '
            + 'Inner Join pt_course on pt_school_course.pt_course_id = pt_course.pt_course_id ' + ''
            + 'order by pt_school.pt_school_id',
    rowMode: 'array',
  };
  // async/await - check out a client
  await (async () => {
    const client = await pool.connect();
    try {
      const resPT = await client.query(ptSchoolCourseSelect);
      resPT.fields.map((key) => {
        ptSchoolCourseColumnsArray.push({ text: key.name, datafield: key.name });
      });

      let i = 0;
      resPT.rows.map((rowkey) => {
        ptSchoolCourseColumnsArray.map((columnkey) => {
          ptSchoolCourseRowsInnerArray.push(rowkey[i]);
          i += 1;
        });
        ptSchoolCourseRowsArray.push(ptSchoolCourseRowsInnerArray);
        ptSchoolCourseRowsInnerArray = [];
        i = 0;
      });
      console.log('PT School Course Rows!!!');
      console.log(ptSchoolCourseRowsArray);
      // console.log("PT School Course Columns!!!")
      // console.log(ptSchoolCourseColumnsArray)
      // console.log("PT REs!!!")
      // console.log(resPT)
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release();
    }
  })().catch((e) => console.log(e.stack));

  return ptSchoolCourseRowsArray;
}
export async function getPTUser(pool, username) {
  const ptUserRows = {};
  const ptUserColumns = [];

  const ptUserSelect = {
    text: 'SELECT * FROM pt_user WHERE user_name = $1',
    values: [username],
    rowMode: 'array',
  };

  console.log('PT User Select!!!');
  console.log(ptUserSelect);
  // async/await - check out a client
  await (async () => {
    const client = await pool.connect();
    try {
      const resUser = await client.query(ptUserSelect);
      let i = 0;
      resUser.fields.map((key) => {
        ptUserColumns.push({ key: key.name });
      });
      resUser.rows.map((rowkey) => {
        ptUserColumns.map((columnkey) => {
          ptUserRows[columnkey.key] = rowkey[i];
          i += 1;
        });
        i = 0;
      });
      // console.log("Res Fields!!!")
      // console.log(resUser.fields)
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release();
    }
  })().catch((e) => console.log(e.stack));


  return ptUserRows;
}
export async function getPTUserByEmail(pool, email) {
  const ptUserRows = {};
  const ptUserColumns = [];

  const ptUserSelect = {
    text: 'SELECT * FROM pt_user WHERE email_address = $1',
    values: [email],
    rowMode: 'array',
  };

  console.log('PT User Select!!!');
  console.log(ptUserSelect);
  // async/await - check out a client
  await (async () => {
    const client = await pool.connect();
    try {
      const resUser = await client.query(ptUserSelect);
      let i = 0;
      resUser.fields.map((key) => {
        ptUserColumns.push({ key: key.name });
      });
      resUser.rows.map((rowkey) => {
        ptUserColumns.map((columnkey) => {
          ptUserRows[columnkey.key] = rowkey[i];
          i += 1;
        });
        i = 0;
      });
      // console.log("Res Fields!!!")
      // console.log(resUser.fields)
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release();
    }
  })().catch((e) => console.log(e.stack));


  return ptUserRows;
}
export async function getPTUserByHash(pool, passwordResetHash) {
  const ptUserRows = {};
  const ptUserColumns = [];

  const ptUserSelect = {
    text: 'SELECT * FROM pt_user WHERE password_reset = $1',
    values: [passwordResetHash],
    rowMode: 'array',
  };

  console.log('PT User Select!!!');
  console.log(ptUserSelect);
  // async/await - check out a client
  await (async () => {
    const client = await pool.connect();
    try {
      const resUser = await client.query(ptUserSelect);
      let i = 0;
      resUser.fields.map((key) => {
        ptUserColumns.push({ key: key.name });
      });
      resUser.rows.map((rowkey) => {
        ptUserColumns.map((columnkey) => {
          ptUserRows[columnkey.key] = rowkey[i];
          i += 1;
        });
        i = 0;
      });
      // console.log("Res Fields!!!")
      // console.log(resUser.fields)
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release();
    }
  })().catch((e) => console.log(e.stack));


  return ptUserRows;
}



// connectDB()

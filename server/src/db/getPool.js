
import mysql from 'mysql2';

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;

let pool;

const getPool = async () => {
  try
  {
    if ( !pool )
    {
      const dbConnection = await mysql.createConnection( {
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASS,
      } );

      await dbConnection.query(
        `CREATE DATABASE IF NOT EXISTS ${ MYSQL_DB }`
      );

      pool = mysql.createPool( {
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASS,
        database: MYSQL_DB,
        connectionLimit: 10,
        timezone: 'Z',
      } );
    }
    return await pool;
  } catch ( err )
  {
    console.error( err );
  }
};

export default getPool;
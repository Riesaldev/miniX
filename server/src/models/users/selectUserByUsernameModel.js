import getPool from '../../db/getPool.js';

const selectUserByUsernameModel = async ( username ) => {
  const pool = await getPool();
  const [ users ] = await pool.query(
    'SELECT id, email, password, username FROM users WHERE username = ?',
    [ username ]
  );
  return users[ 0 ];
};

export default selectUserByUsernameModel;

import getPool from '../../db/getPool.js';

const updateBioModel = async ( userId, bio ) => {
  const pool = await getPool();
  const [ result ] = await pool.query(
    'UPDATE users SET bio = ?, modifiedAt = NOW() WHERE id = ?',
    [ bio, userId ]
  );
  return result; // permite comprobar affectedRows
};

export default updateBioModel;

import getPool from '../../db/getPool.js';

const updateAvatarModel = async ( userId, avatarName ) => {
  const pool = await getPool();

  const [ result ] = await pool.query(
    'UPDATE users SET avatar = ?, modifiedAt = NOW() WHERE id = ?', [
    avatarName,
    userId
  ]
  );
  return result; // permitirá comprobar affectedRows
};

export default updateAvatarModel;
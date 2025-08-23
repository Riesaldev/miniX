import getPool from '../../db/getPool.js';
import generateError from '../../utils/generateErrorUtil.js';

const selectUserByIdModel = async (userId) => {
  const pool = await getPool();

  const [users] = await pool.query(
    'SELECT id, email, username, avatar FROM users WHERE id = ?',
    [userId]
  );

  if (users.length < 1) {
    generateError('Usuario no encontrado', 404);
  }

  return users[0];
};

export default selectUserByIdModel;
import getPool from '../../db/getPool.js';

const updateAvatarModel = async (userId, avatarName) => {
  const pool = await getPool();

  await pool.query(
    'UPDATE users SET avatar = ? WHERE id = ?',[
      avatarName,
      userId
    ]
  );
};

export default updateAvatarModel;
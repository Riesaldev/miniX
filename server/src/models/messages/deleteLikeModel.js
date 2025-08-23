import getPool from '../../db/getPool.js';

const deleteLike = async (userId, messageId) => {
  const pool = await getPool();
  await pool.query(
    'DELETE FROM likes WHERE userId = ? AND messageId = ?',
    [userId, messageId]
  );

  const [likes] = await pool.query(
    'SELECT COUNT(messageId) AS totalLikes FROM likes WHERE messageId = ? GROUP BY messageId',
    [messageId]
  );

  return likes[0]?.totalLikes;
};

export default deleteLike;

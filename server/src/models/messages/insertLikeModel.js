
import getPool from '../../db/getPool.js';

import generateError from '../../utils/generateErrorUtil.js';

const insertLike = async (userId, msgId) => {
  const pool = await getPool();

  const [existingLike] = await pool.query(
    'SELECT id FROM likes WHERE userId = ? AND msgId = ?',
    [userId, msgId]
  );

  console.log(existingLike);

  if (existingLike.length > 0) {
    generateError('You have already liked this message', 409);
  }

  await pool.query(
    'INSERT INTO likes (userId, msgId) VALUES (?, ?)',
    [userId, msgId]
  );

  console.log('Like inserted successfully');

  const [likes] = await pool.query(
    'SELECT COUNT(msgId) as totalLikes FROM likes WHERE msgId = ? GROUP BY msgId',
    [msgId]
  );

  console.log(likes);
  return likes[0]?.totalLikes;
};

export default insertLike;
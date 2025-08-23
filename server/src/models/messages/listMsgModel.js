
import getPool from '../../db/getPool.js';

const listMessages = async (userId) => {
  const pool = await getPool();
  const [messages] = await pool.query(
    'SELECT msg.id, username, msg.text, msg.image, msg.createdAt, BIT_OR(like.userId) as likedByMe, COUNT(like.msgId) as totalLikes FROM messages msg LEFT JOIN users usr ON msg.userId = usr.id LEFT JOIN likes like ON like.messageId = msg.id GROUP BY msg.id ORDER BY msg.createdAt DESC',
    [userId]
  );

  return messages;
}

export default listMessages;
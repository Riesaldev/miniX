import getPool from "../../db/getPool.js";

const selectMessageById = async (msgId, userId) => {
  const pool = await getPool();

  const [message] = await pool.query(
    'SELECT msg.id, username, msg.text, msg.image, msg.createdAt, BIT_OR(like.userId) as likedByMe, COUNT(like.msgId) as totalLikes FROM messages msg LEFT JOIN users usr ON msg.userId = usr.id LEFT JOIN likes like ON like.msgId = msg.id WHERE msg.id = ? GROUP BY msg.id',
    [msgId, userId]
  );

  return message;
};

export default selectMessageById;
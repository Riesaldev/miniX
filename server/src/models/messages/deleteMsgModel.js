import getPool from "../../db/getPool.js";
import generateError from "../../utils/generateErrorUtil.js";

const deleteMsg = async (messageId, userId) => {
  const pool = await getPool();
  const [msg] = await pool.query(
    'SELECT id, userId FROM messages WHERE id = ?',
    [messageId]
  );

  if (!msg.length) {
    throw generateError("Message not found", 404);
  }

  if (msg[0].userId !== userId) {
    throw generateError("Unauthorized", 403);
  }

  await pool.query(
    'DELETE FROM likes WHERE messageId = ?',
    [messageId]
  );

  await pool.query(
    'DELETE FROM messages WHERE id = ?',
    [messageId]
  );
};

export default deleteMsg;

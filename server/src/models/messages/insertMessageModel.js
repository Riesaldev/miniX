
import getPool from '../../db/getPool.js';

const insertMessage = async (userId, text, imgName) => {
  const pool = await getPool();

  const [result] = await pool.query(
    'INSERT INTO messages (userId, text, image) VALUES (?, ?, ?)',
    [userId, text, imgName]
  );

  console.log('result', result.insertId);
};

export default insertMessage;
import 'dotenv/config';

import getPool from './getPool.js';

const initDb = async () => {
  try {
    const pool = await getPool();

    console.log('Borrando tablas si existen...');
    await pool.query(`DROP TABLE IF EXISTS likes, messages, users`);

    console.log('Creando tablas...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        avatar VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        userId INT UNSIGNED NOT NULL,
        text VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        userId INT UNSIGNED NOT NULL,
        messageId INT UNSIGNED NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (messageId) REFERENCES messages(id),
        UNIQUE (userId, messageId),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tablas creadas!!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

initDb();
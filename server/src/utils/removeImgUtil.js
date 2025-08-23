
import fs from 'fs/promises';
import path from 'path';

import generateError from './generateErrorUtil.js';

const removeImgUtil = async (imgName) => {
  try {
    const imgPath = path.join(
      process.cwd(),
      process.env.UPLOADS_DIR,
      imgName
    );

    try {
      await fs.access(imgPath);
    } catch {
      return;
    }

    await fs.unlink(imgPath);
  } catch (err) {
    console.error(err);
    generateError('Error al eliminar la imagen', 500);
  }
};

export default removeImgUtil;
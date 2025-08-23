
import jwt from 'jsonwebtoken';

import generateError from '../utils/generateErrorUtil.js';

const authUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      generateError('No se proporcionó un token', 401);
    }

    try {
      const tokenInfo = jwt.verify(authorization, process.env.SECRET);
      req.user = {
        id: tokenInfo.id,
      };
      next();
    } catch (err) {
      console.log(err);
      generateError('Token inválido', 403);
    }
  } catch (err) {
    next(err);
  }
};

export default authUser;

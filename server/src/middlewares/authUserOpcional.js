
import jwt  from 'jsonwebtoken';

import generateError from '../utils/generateErrorUtil.js';
import e from 'express';

const authUserOptional = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (authorization) {
            let tokenInfo;

            try {
                tokenInfo = jwt.verify(authorization, process.env.SECRET);

                req.user = {
                    id: tokenInfo.id,
                };
            } catch (err) {
                console.log(err);
                generateError('Token inválido', 403);
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};

export default authUserOptional;
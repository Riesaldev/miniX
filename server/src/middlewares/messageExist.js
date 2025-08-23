import selectMessageById from '../models/messages/selectMessageByIdModel.js';
import generateError from '../utils/generateErrorUtil.js';

const messageExist = async (req, res, next) => {
  try {
    const { msgId } = req.params;
    if (!msgId) {
      generateError('No se proporcionó un ID de mensaje', 400);
    }
    const message = await selectMessageById(msgId, req.user?.id);
    if (!message.length) {
      generateError('El mensaje no existe', 404);
    }
    next();
  } catch (err) {
    next(err);
  }
};

export default messageExist;


import insertLike from '../../models/messages/insertLikeModel.js';
import generateError from '../../utils/generateErrorUtil.js';

const likeMsg = async (req, res, next) => {
  try {
    const { msgId } = req.params;

    if (!msgId) {
      generateError('Message ID is required', 400);
    }

    const numLike = await insertLike(req.user.id, msgId);

    res.send({
      status: 'ok',
      message: 'Message liked',
      data: {
        numLike
      },
    });
  } catch (err) {
    next(err);
  }
};

export default likeMsg;
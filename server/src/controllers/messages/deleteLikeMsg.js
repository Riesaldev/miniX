import deleteLike from '../../models/messages/deleteLikeModel.js';

const deleteLikeMessage = async (req, res, next) => {
  try {
    const { msgId } = req.params;

    let numLikes = await deleteLike(req.user.id, msgId);
    numLikes = numLikes ? numLikes : 0;

    res.send({
      status: 'ok',
      message: 'Like removed',
      data: {
        msgId,
        userId: req.user.id,
        numLikes,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default deleteLikeMessage;

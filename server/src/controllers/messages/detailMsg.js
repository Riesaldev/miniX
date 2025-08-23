
import selectMessageById from '../../models/messages/selectMessageByIdModel.js';

const detailMsg = async (req, res, next) => {
  try {
    const { msgId } = req.params;

    const message = await selectMessageById(msgId, req.user?.id);

    res.send({
      status: 'ok',
      message: 'Message details',
      data: message[0],
    });
  } catch (err) {
    next(err);
  }
};

export default detailMsg;
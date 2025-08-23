import deleteMsg from '../../models/messages/deleteMsgModel.js';

const deleteMessage = async (req, res, next) => {
  try {
    const { msgId } = req.params;

    await deleteMsg(msgId, req.user.id);
    res.send({
      status: 'ok',
      message: 'Message deleted',
    });
  } catch (err) {
    next(err);
  }
};

export default deleteMessage;

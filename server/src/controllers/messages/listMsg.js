import listMsgModel from '../../models/messages/listMsgModel.js';

const listMsg = async (req, res, next) => {
  try {
    const messages = await listMsgModel(req.user?.id);
    res.send({
      status: 'ok',
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

export default listMsg;

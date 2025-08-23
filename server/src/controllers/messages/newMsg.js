
import insertMessage from '../../models/messages/insertMessageModel.js';
import generateError from '../../utils/generateErrorUtil.js';
import saveImage from '../../utils/saveImgUtil.js';

const newMsg = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      generateError('Text is required', 400);
    }

    const imagen = req.files?.image;

    let imgName = null;

    if (imagen) {
      imgName = await saveImage(imagen,600);
    }
  
    const idMsg = await insertMessage(req.user.id, text, imgName);

    res.status(201).send({
      status: 'ok',
      message: 'Message created',
      data: {
        id: idMsg,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default newMsg;

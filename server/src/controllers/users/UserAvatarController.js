import selectUserByIdModel from '../../models/users/selectUserByIdModel.js';
import updateAvatarModel from '../../models/users/updateAvatarModel.js';

import saveImgUtil from '../../utils/saveImgUtil.js';
import removeImgUtil from '../../utils/removeImgUtil.js';

import generateError from '../../utils/generateErrorUtil.js';

const userAvatarController = async (req, res, next) => {
  try {
    const avatar = req.files?.avatar;

    if (!avatar) {
      generateError('Faltan campos', 400);
    }

    const user = await selectUserByIdModel(req.user.id);

    if (user?.avatar) {
      await removeImgUtil(user.avatar);
    }

    const avatarName = await saveImgUtil(avatar, 100);
    await updateAvatarModel(req.user.id, avatarName);

    res.send({
      status: 'ok',
      message: 'Avatar actualizado',
    });
  } catch (err) {
    next(err);
  }
};

export default userAvatarController;

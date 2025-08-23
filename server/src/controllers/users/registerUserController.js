import insertUserModel from '../../models/users/insertUserModel.js';
import generateError from '../../utils/generateErrorUtil.js';

const registerUserController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      generateError('Faltan campos por completar', 400);
    }
    await insertUserModel(username, email, password);

    res.status(201).send({
      status:'ok',
      message:'Usuario registrado',
    })
  } catch (error) {
    next(error)
  }
};

export default registerUserController;
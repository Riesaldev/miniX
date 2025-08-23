
import express from 'express';
import authUser from '../middlewares/authUser.js';

import {
  registerUserController,
  loginUserController,
  getPrivateUserProfileController,
  userAvatarController,
} from '../controllers/users/index.js';

const router = express.Router();

router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.get('/profile', authUser, getPrivateUserProfileController);
router.put('/avatar', authUser, userAvatarController);

export default router;
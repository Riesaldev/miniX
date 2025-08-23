
import express from 'express';

import {
  newMsg,
  deleteLikeMsg,
  listMsg,
  likeMsg,
  deleteMsg,
  detailMsg,
} from '../controllers/messages/index.js';

import msgExists from '../middlewares/messageExist.js';

import authUser from '../middlewares/authUser.js';
import authUserOpcinal from '../middlewares/authUserOpcional.js';

const router = express.Router();

router.post('',authUser, newMsg);
router.get('', authUserOpcinal, listMsg);
router.get('/:msgId', authUserOpcinal, msgExists, detailMsg);
router.post('/:msgId/likes', authUser, msgExists, likeMsg);
router.delete('/:msgId', authUser, msgExists, deleteMsg);
router.delete('/:msgId/likes', authUser, msgExists, deleteLikeMsg);

export default router;
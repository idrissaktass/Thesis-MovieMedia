import express from "express";
import { getAllUser } from "../../server/Controllers/UserController.js";
import { deleteUser, followUser, getUser, UnFollowUser, updateUser } from "../Controllers/UserController.js";
import authMiddleWare from "../MiddleWare/authMiddleWare.js";
const router = express.Router();

router.get('/', getAllUser)
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id',authMiddleWare, deleteUser);
router.put('/:id/follow',authMiddleWare, followUser);
router.put('/:id/unfollow',authMiddleWare, UnFollowUser);

export default router;

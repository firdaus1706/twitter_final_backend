import express from "express";
import { bookmark, follow, getMyProfile, getOtherUsers, Login, Logout, Register, unFollow } from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

router.route('/register').post(Register);
router.route('/login').post(Login);
router.route('/logout').get(Logout);
router.route('/bookmark/:id').put(isAuthenticated, bookmark);
router.route('/profile/:id').get(isAuthenticated, getMyProfile);
router.route('/others/:id').get(isAuthenticated, getOtherUsers);
router.route('/follow/:id').post(isAuthenticated, follow);
router.route('/unfollow/:id').post(isAuthenticated, unFollow);

export default router;
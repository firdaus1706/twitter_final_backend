import express from "express";
import isAuthenticated from "../config/auth.js";
import { createTweet, deleteTweet, getAllTweets, getFollowingTweets, likeOrDislike } from "../controllers/tweetController.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createTweet);
router.route("/delete/:id").delete(isAuthenticated, deleteTweet);
router.route("/like/:id").put(isAuthenticated, likeOrDislike);
router.route("/allTweets/:id").get(isAuthenticated, getAllTweets);
router.route("/followingTweets/:id").get(isAuthenticated, getFollowingTweets);

export default router;
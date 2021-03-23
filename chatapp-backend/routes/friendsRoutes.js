const express = require('express');

const router = express.Router();

const FriendCtrl = require('../controllers/friends');
const AuthHelper = require('../helpers/authHelper');

router.post('/follow-user', AuthHelper.VerifyToken, FriendCtrl.followUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, FriendCtrl.unfollowUser);
router.post('/mark/:id', AuthHelper.VerifyToken, FriendCtrl.markNotification);
router.post('/mark-all', AuthHelper.VerifyToken, FriendCtrl.markAllNotifications);


module.exports = router;
const express = require('express');

const router = express.Router();

const UserCtrl = require('../controllers/user');
const AuthHelper = require('../helpers/authHelper');

router.get('/users', AuthHelper.VerifyToken, UserCtrl.getAllUsers);
router.get('/user/:id', AuthHelper.VerifyToken, UserCtrl.getUser);
router.get('/username/:username', AuthHelper.VerifyToken, UserCtrl.getUserByName);

module.exports = router;
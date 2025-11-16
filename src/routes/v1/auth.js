const express = require('express');
const router = express.Router();
const authCtrl = require('../../controllers/auth');

router.post('/register', authCtrl.register);
router.get('/verify/:token', authCtrl.verifyEmail);
router.post('/login', authCtrl.login);
router.post('/refresh', authCtrl.refresh);
router.post('/logout', authCtrl.logout);

module.exports = router;
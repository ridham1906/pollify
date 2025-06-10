const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { authController } = require('../controller/authController');

router.post('/google-auth', wrapAsync(authController));

module.exports = router;
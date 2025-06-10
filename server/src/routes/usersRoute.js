const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const { getUser } = require('../controller/userController');
const { jwtAuth } = require('../utils/middleware');
const router = express.Router();

router.get('/me', jwtAuth, wrapAsync(getUser));

module.exports = router;
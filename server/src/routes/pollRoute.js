const express = require('express');
const { jwtAuth } = require('../utils/middleware');
const wrapAsync = require('../utils/wrapAsync');
const { createPoll, getPollByCode, pollResults, pollsByAdmin, deletePoll } = require('../controller/pollController');
const router = express.Router();

router.post('/create', jwtAuth, wrapAsync(createPoll));

router.get('/:code', wrapAsync(getPollByCode));

router.get('/admin/all', jwtAuth,wrapAsync(pollsByAdmin));

router.delete('/remove/:code', jwtAuth, wrapAsync(deletePoll));

module.exports = router;
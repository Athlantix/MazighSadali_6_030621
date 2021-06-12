const express = require('express');
const router = express.Router();
const likesCtrl = require('../controllers/like');

router.post('/like',likesCtrl.postLikes);

module.exports = router;
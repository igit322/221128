const express = require('express');
const router = express.Router();

const main = require('./main.js');
const contactUs = require('./contactUs.js');
const knuDownload = require('./knuDownload.js');
const about = require('./about.js');
const overview = require('./overview.js');
const portfolio = require('./portfolio.js');
const newslist = require('./newslist.js');
const article = require('./article.js');

router.use('/', main);
router.use('/user', contactUs);
router.use('/knuDownload', knuDownload);
router.use('/about', about);
router.use('/overview', overview);
router.use('/portfolio', portfolio);
router.use('/newslist', newslist);
router.use('/article', article);

module.exports = router;
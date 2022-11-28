var express = require('express');
var router = express.Router();
var fs = require('fs');

var connection = require('../../config/db').conn;

//로그인 페이지
router.get('/contact_us.li', async (req, res) => {

    let route = req.app.get('views') + '/ejs/userEjs/contact_us.ejs';
    res.render(route);

});

module.exports = router;
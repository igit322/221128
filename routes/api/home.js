var express = require('express');
var router = express.Router();

//리소프트 메인 페이지
router.get('/', async (req, res) => {
    try {
        let route = req.app.get('views') + '/ejs/userEjs/index.ejs';
        res.render(route, {
            layout: false
        });
    } catch (error) {
        res.status(401).send(error.message);
    }

});

module.exports = router;
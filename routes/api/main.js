var express = require('express');
var router = express.Router();
// DB 연결
var connection = require('../../config/db').conn;

//리소프트 메인페이지
router.get('/', async (req, res) => {
    try {

        var sql = "select * from partners;\
                    select *, date_format(newsDate, '%Y-%m-%d') from news order by newsDate desc limit 4;"
        
        connection.query(sql, function (err, results) {
            let route = req.app.get('views') + '/ejs/userEjs/index.ejs';
            res.render(route, {
                layout: false,
                partners: results[0],
                news: results[1],
            });

        });

    } catch (error) {
        res.status(401).send(error.message);
    }

});

module.exports = router;
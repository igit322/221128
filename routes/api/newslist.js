var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

//리소프트 정보마당 페이지
router.get('/', async (req, res) => {
    try {

        var sql = "select *, date_format(newsDate, '%Y-%m-%d') as dateFmt from news order by newsId desc;"

        connection.query(sql, function (err, results) {

            let route = req.app.get('views') + '/ejs/userEjs/newslist.ejs';
            res.render(route, {
                layout: false,
                news: results
            });

        });
    } catch (error) {
        res.status(401).send(error.message);
    }

});

module.exports = router;
var express = require('express');
var router = express.Router();     
var connection = require('../../../config/db').conn;

//게시글 상세조회
router.get('/', async (req, res) => {
    try {
        var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
        const page = req.query.page;
        const param = req.query.newsId;
        const sql = "select *, date_format(newsDate, '%Y-%m-%d') as newsDateFmt from news where newsId = ?";
                     
        connection.query(sql, [param], (err, result) => {
            console.log(result)
            if (err) {
                res.json({
                    msg: "select query error"
                });
            } 
            let route = req.app.get('views') + '/ejs/admin/news/news_viewForm.ejs';
            res.render(route, {
                result: result,
                page: page,
                searchText: searchText
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;
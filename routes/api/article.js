var express = require('express');
var router = express.Router();

//리소프트 정보마당-상세글 페이지
router.get('/', async (req, res) => {
    const newsId = req.query.newsId;
    try {

        const sql = "call selectNews(?)";
        
        connection.query(sql, newsId, (err, result) => {
            if (err) {
                return err;
            }
            console.log(result[1])
            console.log(result[2])
                let route = req.app.get('views') + '/ejs/userEjs/article.ejs';
                res.render(route, {
                    layout: false,
                    news: result[0],
                    beforeId: result[1],
                    nextId: result[2]
                });    

        });
    } catch (error) {
        res.status(401).send(error.message);
    }

});

module.exports = router;
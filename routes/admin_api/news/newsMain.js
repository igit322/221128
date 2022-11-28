var express = require('express');
var router = express.Router();
const fs = require('fs');

const path = require('path');

// DB 커넥션 생성\              
var connection = require('../../../config/db').conn;

//카테고리별 글 전체조회
router.get('/', async (req, res) => {
    try {
        var page = req.query.page;
        var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
        var sql = "select newsId, newsTitle, date_format(newsDate, '%Y-%m-%d') newsDateFmt from news";
        if (searchText != '') {
            sql += " where (newsTitle like '%" + searchText + "%' or newsContent like '%" + searchText + "%')";
        }
        sql += " order by newsId desc";
        connection.query(sql, (err, results) => {
            var countPage = 10; //하단에 표시될 페이지 개수
            var page_num = 10; //한 페이지에 보여줄 개수
            var last = Math.ceil((results.length) / page_num); //마지막 장
            var endPage = Math.ceil(page / countPage) * countPage; //끝페이지(10)
            var startPage = endPage - countPage; //시작페이지(1)
            if (err) {
                console.log(err);
            }
            if (last < endPage) {
                endPage = last
            };
            let route = req.app.get('views') + '/ejs/admin/news/news.ejs';
            res.render(route, {
                news: results,
                searchText: searchText,
                page: page, //현재 페이지
                length: results.length - 1, //데이터 전체길이(0부터이므로 -1해줌)
                page_num: page_num,
                countPage: countPage,
                startPage: startPage,
                endPage: endPage,
                pass: true,
                last: last
            });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
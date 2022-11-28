var express = require('express');
var router = express.Router();

// DB 커넥션 생성\              
var connection = require('../../../config/db').conn;

//게시글 검색(ajax)
router.get('/', async (req, res) => {
    var page = req.query.page;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    var sql = "select newsId, newsTitle, date_format(newsDate, '%Y-%m-%d') newsDateFmt from news";
    if (searchText != '') {
        sql += " where (newsTitle like '%" + searchText + "%' or newsContent like '%" + searchText + "%')";
    }
    sql += " order by newsDate desc";
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err)
        }
        var countPage = 10; //하단에 표시될 페이지 개수
        var page_num = 10; //한 페이지에 보여줄 개수
        var last = Math.ceil((results.length) / page_num); //마지막 장
        var endPage = Math.ceil(page / countPage) * countPage; //끝페이지(10)
        var startPage = endPage - countPage; //시작페이지(1)
        // ajaxSearch = results;
        if (last < endPage) {
            endPage = last
        };
        res.send({
            ajaxSearch: results,
            page: page, //현재 페이지
            length: results.length - 1, //데이터 전체길이(0부터이므로 -1해줌)
            page_num: page_num,
            countPage: countPage,
            startPage: startPage,
            endPage: endPage,
            pass: true,
            last: last, 
            searchText: searchText
        });
        // console.log("page = " + page)
    });
});

module.exports = router;
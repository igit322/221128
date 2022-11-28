var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

//메인 페이지
router.get('/', async (req, res) => {

    var page = req.query.page;
    //date
    var searchType = req.query.searchType == undefined ? "" : req.query.searchType;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    var sql = "select * from projectAdmin where 1=1";
    if (searchType != '') {
        sql += " and projectType = '" + searchType + "' \n";
    }
    if (searchText != '') {
        sql += " and (projectName like '%" + searchText + "%')";
    }
    sql += " order by 1 desc";

    try {
        connection.query(sql, function (err, results) {
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
            // console.log(results);
            let route = req.app.get('views') + '/ejs/admin/main.ejs';
            res.render(route, {
                searchType: searchType,
                searchText: searchText,
                results: results,
                page: page,
                length: results.length - 1,
                page_num: page_num,
                countPage: countPage,
                startPage: startPage,
                endPage: endPage,
                pass: true,
                last: last
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;
var express = require('express');
var router = express.Router();
const models = require('../../../models');
var connection = require('../../../config/db').conn;

//주간업무일지 페이지
router.get('/', async (req, res) => {
    var page = req.query.page;
    //date
    var searchType1 = req.query.searchType1 == undefined ? "" : req.query.searchType1;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    var sql = "select w.*, a.adminNick, date_format(w.reportDate, '%Y-%m-%d') as reportDatefmt from weekReport w join admin a on w.adminId = a.adminId where 1=1";
        if (searchType1 != '') {
            sql += " and date_format(w.reportDate, '%Y-%m-%d') = '" + searchType1 + "' \n";
        }
        if (searchText != '') {
            sql += " and a.adminNick  = '" + searchText + "'";
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
            let route = req.app.get('views') + '/ejs/admin/weekReport/weekReport.ejs';
            res.render(route, {
                searchType1: searchType1,
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
var express = require('express');
var router = express.Router();
const fs = require('fs');

const path = require('path');

// DB 커넥션 생성\              
var connection = require('../../../config/db').conn;

//카테고리별 글 전체조회
router.get('/', async (req, res) => {
    try {
        //카테고리 명 조회
        const param = req.query.boardDivId;
        const sql1 = "select * from boardDiv where boardDivId = ?";
        let community = "";
        connection.query(sql1, param, (err, results) => {
            if (err) {
                console.log(err);
            }
            community = results;
        });
        
        var page = req.query.page;
        var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
        var sql = "select b.*, c.*, a.adminNick, a.adminId, date_format(boardDate, '%Y-%m-%d') as boardDatefmt, date_format(boardUpdDate, '%Y-%m-%d') as boardUpdDatefmt\
                    ,(select count(*) from comment c where c.boardId = b.boardId) as mcount,\
                    (select count(*) from hitCount where hitCount.boardId = b.boardId) as hitCount from board b\
                    left join boardDiv c on c.boardDivId = b.boardDivId\
                    left join admin a  on a.adminId = b.adminId\
                    where b.boardDivId = ?";
        if (searchText != '') {
            sql += " and (b.boardTitle like '%" + searchText + "%' or b.boardContent like '%" + searchText + "%')";
        }
        sql += " order by b.boardFix desc, b.boardDate desc";
        connection.query(sql, param, (err, results) => {
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
            let route = req.app.get('views') + '/ejs/admin/board/board.ejs';
            res.render(route, {
                boardDivId: param,
                community: community,
                searchText: searchText,
                results: results,
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
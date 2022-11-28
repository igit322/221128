var express = require('express');
var router = express.Router();     
var connection = require('../../../config/db').conn;

//게시글 상세조회
router.get('/', async (req, res) => {
    try {
        var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
        var projectId = req.query.projectId == undefined ? "" : req.query.projectId;
        var boardName = req.query.boardName;
        const page = req.query.page;
        const param = req.query.boardId;
        const boardDivId = req.query.boardDivId;
        const adminNick = req.session.user.id;
        const sql = "select b.*,date_format(boardDate, '%Y-%m-%d') as boardDateFmt, a.adminNick,\
                            (select count(*) from hitCount where hitCount.boardId = b.boardId) as hitCount,\
                            f.fileRoute, f.fileType, f.fileOrgName from board b left join file f on b.boardId = f.boardId\
                            left join admin a  on a.adminId = b.adminId\
                            where b.boardId = ?;\
                     select c.*, a.adminNick, a.adminId ,date_format(cmtDate, '%Y-%m-%d') as cmtDateFmt from comment c left join admin a on a.adminId = c.adminId where boardId = ?;";
        
        connection.query(sql, [param,param], (err, result) => {
            if (err) {
                res.json({
                    msg: "select query error"
                });
            } 
            let route = req.app.get('views') + '/ejs/admin/board/brd_viewForm.ejs';
            res.render(route, {
                result: result[0],
                cmtResult: result[1],
                page: page,
                searchText: searchText,
                boardName: boardName,
                boardDivId: boardDivId,
                projectId: projectId,
                adminNick: adminNick
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;
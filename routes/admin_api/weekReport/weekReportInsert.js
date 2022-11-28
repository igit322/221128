var express = require('express');
var router = express.Router();
const models = require('../../../models');
var connection = require('../../../config/db').conn;

//게시글 등록 폼 이동
router.get('/', async (req, res) => {
    let route = req.app.get('views') + '/ejs/admin/weekReport/weekReport_writForm.ejs';
    var page = req.query.page;
    res.render(route, {
        page: page
    });
});

//공지사항 작성
router.post('/', async (req, res, next) => {
    try {
        
    const adminId = req.session.user.id;
    var report = req.body.report;
    var lastReport = [];
    var nextPlan = req.body.nextPlan;
    var lastNextPlan = [];
        
    if (typeof report == 'object') {
        for (var i = 0; i < report.length; i++){
            lastReport.push(report[i] + '完');
        }
    } else {
        lastReport.push(report);
    }
    if (typeof nextPlan == 'object') {
        for (var i = 0; i < nextPlan.length; i++) {
            lastNextPlan.push(nextPlan[i] + '完');
        }
    } else {
        lastNextPlan.push(nextPlan);
    }
        
    //     report = report.toString().replaceAll(",", "無");
    //     //lastReport = "<li>" + report + "</li>" ;

    //     nextPlan = nextPlan.toString().replaceAll(",", "無");
    //     //lastNextPlan = "<li>" + nextPlan + "</li>";

        const param1 = adminId
        
        const sql1 = "select adminId from admin where adminNick = ?";
        const sql2 = "insert into weekReport (report, nextPlan, note, adminId) values(?,?,?,?)";

        connection.query(sql1, param1, (err, result) => {
            if (err) {
                throw err;
            }
            const param2 = [lastReport.toString(), lastNextPlan.toString(), req.body.note, result[0].adminId];
            connection.query(sql2, param2, (err) => {
                if (err) {
                    throw err;
                }
                res.send('<script>alert("업무일지가 등록되었습니다."); location.href="/admin/weekReport?&page=1";</script>');
            });
        });

    } catch (error) {
        res.send(error.message);
    }
});
module.exports = router;
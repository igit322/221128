var express = require('express');
var router = express.Router();
const models = require('../../../models');
var connection = require('../../../config/db').conn;

//주간업무일지 상세보기
router.get('/', async (req, res) => {
    var page = req.query.page;
    var searchType1 = req.query.searchType1 == undefined ? "" : req.query.searchType1;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    var sql = "select w.*, a.adminNick, date_format(w.reportDate, '%Y-%m-%d') as reportDatefmt from weekReport w join admin a on w.adminId = a.adminId where weekReportId=?";
    const param = req.query.weekReportId;
    var sessionId = req.session.user.id;
    var reports = [];
    var nextPlans = [];
    try {
        connection.query(sql, param, function (err, result) {
            if (err) {
                console.log(err);
            }

            var report = result[0].report 
            if (report.indexOf('完,') != -1) {
                do {
                    reports.push(report.substring(0, report.indexOf('完,')));
                    report = report.substring((report.indexOf('完,') + 2))
                } while (report.indexOf('完,') != -1)
           
                reports.push(report.toString().replace("完", ""));
            } else {
                reports.push(report);
            }

            var nextPlan = result[0].nextPlan
            if (nextPlan.indexOf('完,') != -1) {
                do {
                    nextPlans.push(nextPlan.substring(0, nextPlan.indexOf('完,')));
                    nextPlan = nextPlan.substring((nextPlan.indexOf('完,') + 2))
                } while (nextPlan.indexOf('完,') != -1)
                nextPlans.push(nextPlan.toString().replace("完", ""));
            } else {
                nextPlans.push(nextPlan);
            }
                
            let route = req.app.get('views') + '/ejs/admin/weekReport/weekReport_viewForm.ejs';
            res.render(route, {
                searchType1: searchType1,
                searchText: searchText,
                result: result,
                page: page,
                reports: reports,
                nextPlans: nextPlans,
                sessionId: sessionId
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;
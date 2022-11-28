var express = require('express');
var router = express.Router();
const models = require('../../../models');
var connection = require('../../../config/db').conn;

//주간업무일지 수정 폼 이동
router.get('/', async (req, res) => {
    let route = req.app.get('views') + '/ejs/admin/weekReport/weekReport_udtForm.ejs';
    var page = req.query.page;
    var searchType1 = req.query.searchType1 == undefined ? "" : req.query.searchType1;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    const sql = "select * from weekReport where weekReportId=?"
    const param = req.query.weekReportId;
    var reports = [];
    var nextPlans = [];
    try{
        connection.query(sql, param, (err, result) => {
            if (err) {
                console.error(err);
            }

            // 주간업무일지 상세보기와 로직 동일
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
        res.render(route, {
            page: page,
            searchText: searchText,
            searchType1: searchType1,
            result: result,
            reports: reports,
            nextPlans: nextPlans,
            weekReportId: param
        });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//주간업무일지 수정
router.post('/', async (req, res) => {
    var page = req.body.page;
    var searchType1 = req.body.searchType1 == undefined ? "" : req.body.searchType1;
    var searchText = req.body.searchText == undefined ? "" : req.body.searchText;
    var weekReportId = req.body.weekReportId
    var sql = "update weekReport set report=?, nextPlan=?, note=? where weekReportId = ?";

    var report = req.body.report;
    var lastReport = [];
    var nextPlan = req.body.nextPlan;
    var lastNextPlan = [];

    // 주간업무일지 등록과 로직 동일
    if (typeof report == 'object') {
        for (var i = 0; i < report.length; i++) {
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

    const param = [lastReport.toString(), lastNextPlan.toString(), req.body.note, weekReportId];
    try {
        connection.query(sql, param, function (err) {
            if (err) {
                console.log(err);
            }
            res.redirect('weekReportOne?weekReportId=' + req.body.weekReportId + '&page=' + page + '&searchType1='+ searchType1 + '&searchText=' + searchText);
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;
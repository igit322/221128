var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//메인 페이지
router.get('/main', async (req, res) => {
    const calendarDivId = req.query.calendarDivId;
    const adminNick = req.session.user.id;
    let route;
    if(calendarDivId == 1) {
        route = req.app.get('views') + '/ejs/admin/calendar/calendar.ejs';
    } else {
        route = req.app.get('views') + '/ejs/admin/calendar/dailyCalendar.ejs';
    }
    res.render(route, {
        calendarDivId: calendarDivId
    });
});

//일정 전체 가져오기
router.get('/', async (req, res) => {
    try {
        // var projectId = req.query.projectId == undefined ? "" : req.query.projectId;
        var calendarDivId = req.query.calendarDivId;
        const sql = "select *, date_add(end, interval 1 day) as end from calendar where calendarDivId = ?";
        // if (projectId != "") {
        //     sql += " and projectId = " + projectId + " \n";
        // }
        connection.query(sql, calendarDivId, (err, results) => {
            if (err) {
                throw err;
            }
            res.send({results});
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
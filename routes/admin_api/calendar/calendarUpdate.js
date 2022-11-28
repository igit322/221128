var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;
var moment = require('moment');

//일정 수정
router.post('/', async (req, res) => {
    try {
        // console.log(req.body.obj)
        const data = req.body.obj;
        const sql = "update calendar set title = ?, start = ?, end = ?, subDiv = ? where calendarId = ?";
        const param = [data.title, data.start, data.end, data.subDiv, data.calendarId];
        // console.log(data.start)
        connection.query(sql, param, (err) => {
            if (err) {
                throw err;
            }
            res.send({msg: "success"});
        });

    } catch (error) {
        res.send(error.message);
    }
});

//일정 날짜 이동
router.get('/date', async (req, res) => {
    const start = moment(req.query.start);
    const end = moment(req.query.end);
    console.log(end)
    try {
        const sql = "update calendar set start = ?, end = ? where calendarId = ?";
        const param = [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), req.query.calendarId];
        connection.query(sql, param, (err) => {
            if (err) {
                throw err;
            }
            res.send({msg: "success"});
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
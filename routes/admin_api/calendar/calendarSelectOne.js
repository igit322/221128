var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//일정 상세보기
router.get('/', async (req, res) => {
    try {
        const param = req.query.calendarId;
        // console.log(param)
        const sql1 = "select *, date_format(start, '%Y-%m-%d') as start,\
                             date_format(date_add(end, interval 1 second), '%Y-%m-%d') as end\
                        from calendar where calendarId = ?;";
        connection.query(sql1, param, (err, results) => {
            if (err) {
                throw err;
            }
            res.send({
                results: results, adminNick: req.session.user.id
            });
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
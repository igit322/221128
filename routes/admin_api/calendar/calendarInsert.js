var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//일정 추가
router.post('/', async (req, res) => {
    try {
        // console.log(req.body.obj)
        const data = req.body.obj;
        const adminNick = req.session.user.id;
        // console.log(data)
        const sql = "insert into calendar (title, start, end, subDiv, writer, calendarDivId) values(?, ?, date_format(date_add(?, interval 1 second), '%Y-%m-%d'), ?, ?, ?)";
        const param = [data.title, data.start, data.end, data.subDiv, adminNick, data.calendarDivId];
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
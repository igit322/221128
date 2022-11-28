var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//일정 삭제
router.get('/', async (req, res) => {
    try {
        const param = req.query.calendarId;
        const sql = "delete from calendar where calendarId = ?";
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
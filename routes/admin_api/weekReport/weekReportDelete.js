var express = require('express');
var router = express.Router();
const models = require('../../../models');
var connection = require('../../../config/db').conn;

//주간업무일지 삭제
router.get('/', async (req, res) => {
    var sql = "delete from weekReport where weekReportId = ?";
    const param = req.query.weekReportId;
    try {
        connection.query(sql, param, function (err) {

            if (err) {
                console.log(err);
            }
            res.send('<script>alert("주간업무일지가 삭제되었습니다."); location.href="/admin/weekReport?page=1";</script>');
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;
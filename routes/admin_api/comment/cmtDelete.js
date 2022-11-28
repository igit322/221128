var express = require('express');
var router = express.Router();
const fs = require('fs');

const multer = require("multer");
const path = require('path');
const sharp = require('sharp');

// DB 커넥션 생성\              
var connection = require('../../../config/db').conn;

//댓글 삭제
router.get('/', async (req, res) => {
    try {
        const param = req.query.cmtId;
        const sql = "delete from comment where cmtId = ?;";
        connection.query(sql, param, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('back');
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
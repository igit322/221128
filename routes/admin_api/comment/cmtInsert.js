var express = require('express');
var router = express.Router();
const fs = require('fs');

const multer = require("multer");
const path = require('path');
const sharp = require('sharp');

// DB 커넥션 생성\              
var connection = require('../../../config/db').conn;

//댓글 입력
router.get('/', async (req, res) => {
    try {
        const boardId = req.query.boardId;
        const adminNick = req.query.adminNick;
        const cmtContent = req.query.cmtContent;
        const cmtBr = cmtContent.toString().replaceAll("\r\n", "<br>");

        const sql = "insert into comment (boardId, cmtContent, adminId) \
                        values(?,?,(select adminId from admin where adminNick = ?)); ";
        
        connection.query(sql, [boardId, cmtBr, adminNick], (err) => {
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
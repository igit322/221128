var express = require('express');
var router = express.Router();
const models = require('../../../models');
var connection = require('../../../config/db').conn;
const fs = require('fs');

//첨부파일 삭제
router.get('/img', (req, res) => {
    const fileRoute = req.query.fileRoute;
    // console.log(req.body)
    // console.log(req.query)
    // console.log(fileRoute)
    try {
        const sql = "delete from file where fileRoute = ?";
        connection.query(sql, fileRoute, (err, row) => {
            if (err) {
                console.log(err)
            }
            fs.unlinkSync(fileRoute.toString(), (err) => {
                if (err) {
                    console.log(err);
                }
                return;
            });
        })
    } catch (error) {
        if (error.code == "ENOENT") {
            console.log("프로젝트 첨부파일 삭제 에러 발생");
        }
    }
    res.redirect('/admin/projectUpdate?projectId=' + req.query.projectId);
});

//클라이언트 삭제
router.get('/client', (req, res) => {
    const clientId = req.query.clientId;
    try {
        const sql = "delete from client where clientId = ?";
        connection.query(sql, clientId, (err, row) => {
            if (err) {
                console.log(err)
            }
            res.redirect('/admin/projectOne?projectId=' + req.query.projectId);
        })
    } catch (error) {
        console.log("클라이언트 삭제 에러 발생");
    }
});

//히스토리 삭제
router.get('/history', (req, res) => {
    const historyId = req.query.historyId;
    try {
        const sql = "delete from history where historyId = ?";
        connection.query(sql, historyId, (err, row) => {
            if (err) {
                console.log(err)
            }
            res.redirect('/admin/projectOne?projectId=' + req.query.projectId);
        })
    } catch (error) {
        console.log("히스토리 삭제 에러 발생");
    }
});

//관련자료 삭제
router.get('/board', (req, res) => {
    const boardId = req.query.boardId;
    try {
        const sql = "delete from board where boardId = ?;\
                     select fileRoute from file where boardId = ?";
        connection.query(sql, [boardId, boardId], (err, results) => {
            if (err) {
                console.log(err)
            }
            // console.log(results)
            // console.log(results[1].length);
            // console.log(results[1][0].fileRoute)
            for(i=0; i<results[1].length; i++) {
                fs.unlinkSync(results[1][i].fileRoute, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    return;
                });
            }
            res.redirect('/admin/projectOne?projectId=' + req.query.projectId);
        })
    } catch (error) {
        console.log("관련자료 삭제 에러 발생");
    }
});

//프로젝트 삭제
router.post('/project', (req, res) => {
    const projectId = req.body.projectId;
    // console.log(req.body.fileRoute)
    // console.log(req.body)
    try {
        const sql = "delete from projectAdmin where projectId = ?";
        connection.query(sql, projectId, (err, row) => {
            if (err) {
                console.log(err)
            }
            connection.query(sql, projectId, (err, row) => {
                if (err) {
                    console.log(err)
                }
                if (req.body.fileRoute != undefined) {
                    //파일이 하나일 경우 배열로 만들어주기
                    if (Array.isArray(req.body.fileRoute) == false) {
                        req.body.fileRoute = [req.body.fileRoute];
                    }
                    for (let i = 0; i < req.body.fileRoute.length; i++) {
                        fs.unlinkSync(req.body.fileRoute[i], (err) => {
                            if (err) {
                                console.log(err);
                            }
                            return;
                        });
                    }
                }
                res.redirect('/admin/project');
            })
        })
    } catch (error) {
        console.log("프로젝트 삭제 에러 발생");
    }
});

module.exports = router;
var express = require('express');
var router = express.Router();
const models = require('../../../models');
var connection = require('../../../config/db').conn;

//프로젝트 상세보기
router.get('/test', async (req, res) => {
    var sql = "select * from projectAdmin where projectId=?";
    var clientSql = "select * from client where projectId = ?"
    // console.log("adadad")
    const param = req.query.projectId;
    g_projectId = param;
    // console.log(g_projectId)
    try {
        let project;
        let client;
        connection.query(sql, param, function (err, result) {
            if (err) {
                console.log(err);
            }
            project = result;
            connection.query(clientSql, param, function (err, result) {
                if (err) {
                    console.log(err);
                }
                client = result;
                let route = req.app.get('views') + '/ejs/admin/project/project_viewForm.ejs';
                // console.log(project[0].projectName)
                // console.log(client[0].clientName)
                // res.send('<script> alert="aa"; location.href="/admin/projectOne/view"</script>', {
                //     project: project,
                //     client: client
                // })
                res.render(route, {
                    project: {
                        project
                    },
                    client: {
                        client
                    }
                });
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//클라이언트 ajax
// router.get('/client', async (req, res) => {
//     const param = req.query.projectId
    
//     try {
//         var clientSql = "select * from client where projectId = ?"
//         connection.query(clientSql, param, function (err, result) {
//             if (err) {
//                 console.log(err);
//             }
//             let phone = [];
//             let splitphone;
//             // console.log(clientPhone.length)
//             for (i = 0; i < result.length; i++) {
//                 const clientPhone = result[i].clientPhone;
//                 if (result[i].clientPhone.length == 11) {
//                     // console.log("휴대번호")
//                     splitphone = clientPhone.substring(0, 3) + '-' + clientPhone.substring(3, 7) + '-' + clientPhone.substring(7, 11);
//                 } else {
//                     // console.log("전화번호")
//                     splitphone = clientPhone.substring(0, 3) + '-' + clientPhone.substring(3, 6) + '-' + clientPhone.substring(6, 10);
//                 }
//                 phone.push(splitphone)
//             }
//             // console.log(phone)
//             res.send({
//                 ajaxSearch: result,
//                 clientPhone: phone
//             });
//         });
//     } catch (error) {
//         res.status(401).send(error.message);
//     }
// });

//클라이언트 ajax 페이징 테스트
router.get('/client', async (req, res) => {
    // const param = req.query.projectId
    // const lastPage = req.query.lastPage
    // console.log(req.query.lastPage)
    // console.log(req.query.lastPage == undefined)
    try {
        var clientSql;
        var param;
        if(req.query.lastPage == undefined) {
            clientSql = "select * from client where projectId = ?  order by clientId desc limit 3"
            param = [req.query.projectId];
        } else {
            clientSql = "select * from client where projectId = ? and clientId < ? order by clientId desc limit 3"
            param = [req.query.projectId, req.query.lastPage];
        }
        connection.query(clientSql, param, function (err, result) {
            if (err) {
                console.log(err);
            }
            let phone = [];
            let splitphone;
            // console.log(clientPhone.length)
            for (i = 0; i < result.length; i++) {
                const clientPhone = result[i].clientPhone;
                if (result[i].clientPhone.length == 11) {
                    // console.log("휴대번호")
                    splitphone = clientPhone.substring(0, 3) + '-' + clientPhone.substring(3, 7) + '-' + clientPhone.substring(7, 11);
                } else {
                    // console.log("전화번호")
                    splitphone = clientPhone.substring(0, 3) + '-' + clientPhone.substring(3, 6) + '-' + clientPhone.substring(6, 10);
                }
                phone.push(splitphone)
            }
            // console.log(phone)
            res.send({
                ajaxSearch: result,
                clientPhone: phone
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//히스토리 ajax
router.get('/history', async (req, res) => {
    try {
        var clientSql;
        var param;
        if(req.query.lastPage == undefined) {
            clientSql = "select *, date_format(historyReqDate, '%Y-%m-%d %H:%i') as historyReqDateFmt\
                           from history where projectId = ? order by field(historyStatus, '대기중', '처리중','보류', '처리완료'), historyId desc limit 3;"
            param = [req.query.projectId];
        } else {
            clientSql = "select *, date_format(historyReqDate, '%Y-%m-%d %H:%i') as historyReqDateFmt\
                           from history where projectId = ? and historyId < ? order by field(historyStatus, '대기중', '처리중','보류', '처리완료'), historyId desc limit 3;"
            param = [req.query.projectId, req.query.lastPage];
        }
        connection.query(clientSql, param, function (err, result) {
            if (err) {
                console.log(err);
            }
            res.send({
                ajaxSearch: result
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//관련 자료 및 참고사항 ajax
router.get('/board', async (req, res) => {
    try {
        var clientSql;
        var param;
        if(req.query.lastPage == undefined) {
            clientSql = "select b.*, a.adminNick, date_format(boardDate, '%Y-%m-%d') as boardDateFmt\
                           from board b\
                      left join admin a on a.adminId = b.adminId\
                          where projectId = ? order by boardId desc limit 3;"
            param = [req.query.projectId];
        } else {
            clientSql = "select b.*, a.adminNick, date_format(boardDate, '%Y-%m-%d') as boardDateFmt\
                           from board b\
                      left join admin a on a.adminId = b.adminId\
                          where projectId = ? and boardId < ? order by boardId desc limit 3;"
            param = [req.query.projectId, req.query.lastPage];
        }
        connection.query(clientSql, param, function (err, result) {
            if (err) {
                console.log(err);
            }
            res.send({
                ajaxSearch: result
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//프로젝트 상세보기
router.get('/', async (req, res) => {
    var sql = "SELECT p.*, b.*, p.projectId FROM projectAdmin p left join file b on b.projectId = p.projectId where p.projectId = ?;";
    // var clientSql = "select * from client where projectId = ?"
    // console.log("adadad")
    const param = req.query.projectId;
    g_projectId = param;
    // console.log(g_projectId)
    try {
        let project;
        let client;
        connection.query(sql, param, function (err, result) {
            if (err) {
                console.log(err);
            }
            // project = result;
            // connection.query(clientSql, param, function (err, result) {
            //     if (err) {
            //         console.log(err);
            //     }
            //     client = result;
            // console.log(result[0].projectContent==null||result[0].projectContent=='')
            // console.log(result[0].projectContent==null)
            // console.log(result[0].projectContent==' ')
            // console.log(result[0].projectContent)
            let route = req.app.get('views') + '/ejs/admin/project/project_viewForm.ejs';
            res.render(route, {
                result: result
            });
            // });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//히스토리 상세보기
router.get('/historyOne', async (req, res) => {
    var sql = "SELECT *, date_format(historyReqDate, '%Y-%m-%dT%H:%i') as historyReqDateFmt,\
                      date_format(historyDoneDate, '%Y-%m-%dT%H:%i') as historyDoneDateFmt\
                 FROM history where historyId = ?;";
    const param = req.query.historyId;
    try {
        connection.query(sql, param, function (err, result) {
            if (err) {
                console.log(err);
            }
            let route = req.app.get('views') + '/ejs/admin/project/history/history_viewForm.ejs';
            res.render(route, {
                result: result
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//관련 자료 및 참고사항 상세보기
router.get('/historyOne', async (req, res) => {
    var sql = "SELECT *, date_format(historyReqDate, '%Y-%m-%dT%H:%i') as historyReqDateFmt,\
                      date_format(historyDoneDate, '%Y-%m-%dT%H:%i') as historyDoneDateFmt\
                 FROM history where historyId = ?;";
    const param = req.query.historyId;
    try {
        connection.query(sql, param, function (err, result) {
            if (err) {
                console.log(err);
            }
            let route = req.app.get('views') + '/ejs/admin/project/history/history_viewForm.ejs';
            res.render(route, {
                result: result
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;
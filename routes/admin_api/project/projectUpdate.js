var express = require('express');
var router = express.Router();
const fs = require('fs');

const multer = require("multer");
const path = require('path');
const sharp = require('sharp');

// DB 커넥션 생성\              
var connection = require('../../../config/db').conn;

//파일업로드 모듈
var upload = multer({ //multer안에 storage정보  
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            fs.mkdir('uploads/project', function (err) {
                if (err && err.code != 'EEXIST') {
                    // console.log("already exist")
                } else {
                    callback(null, 'uploads/project');
                }
            })
        },
        //파일이름 설정
        filename: (req, file, done) => {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    //파일 개수, 파일사이즈 제한
    limits: {
        files: 10,
    },
});

//프로젝트 수정 폼 이동
router.get('/', async (req, res) => {
    try {
        const projectId = req.query.projectId;
        const sql = "SELECT * FROM projectAdmin p left join file b on b.projectId = p.projectId where p.projectId = ?;"
        connection.query(sql, projectId, (err, result) => {
            if (err) {
                console.error(err);
            }
            let route = req.app.get('views') + '/ejs/admin/project/project_udtForm.ejs';
            res.render(route, {
                result: result,
                projectId: projectId
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//프로젝트수정
router.post('/update', upload.array('file'), (req, res) => {
    const paths = req.files.map(data => data.path);
    const orgName = req.files.map(data => data.originalname);
    const projectId = req.body.projectId;
    // console.log(req.body);
    // console.log(paths)
    try {
        for (let i = 0; i < paths.length; i++) {
            if (req.files[i].mimetype == "image/jpeg" || req.files[i].mimetype == "image/jpg" || req.files[i].mimetype == "image/png") {
                if (req.files[i].size > 1000000) {
                    sharp(paths[i]).resize({
                            width: 2000
                        }).withMetadata() //이미지 방향 유지
                        .toBuffer((err, buffer) => {
                            if (err) {
                                throw err;
                            }
                            fs.writeFileSync(paths[i], buffer, (err) => {
                                if (err) {
                                    throw err
                                }
                            });
                        });
                }
            }
        }
        const param = [req.body.projectName, req.body.projectClient, req.body.projectManager, req.body.projectIp, req.body.projectDomain, req.body.projectTools, req.body.projectWeb, req.body.projectDB, req.body.projectContent, projectId];
        const sql = "update projectAdmin set projectName = ?, projectClient = ?, projectManager = ?, projectIp = ?, projectDomain = ?, projectTools = ?, projectWeb = ?, projectDB = ?, projectContent = ? where projectId = ?";

        connection.query(sql, param, (err) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < paths.length; i++) {
                const sql2 = "insert into file(fileRoute, fileOrgName, projectId, fileType) values (?, ?, ?, ?)";
                const param2 = [paths[i], orgName[i], projectId, path.extname(paths[i])];
                connection.query(sql2, param2, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            };
            res.send('<script>alert("수정이 완료되었습니다."); opener.parent.location.reload(); window.close(); </script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

//클라이언트 정보 수정 폼 이동
router.get('/client', async (req, res) => {
    try {
        const clientId = req.query.clientId;
        const sql = "SELECT * FROM client where clientId = ?;"
        connection.query(sql, clientId, (err, result) => {
            if (err) {
                console.error(err);
            }
            let phone = [];
            let splitphone;
            for (i = 0; i < result.length; i++) {
                const clientPhone = result[i].clientPhone;
                if (result[i].clientPhone.length == 11) {
                    splitphone = clientPhone.substring(0, 3) + '-' + clientPhone.substring(3, 7) + '-' + clientPhone.substring(7, 11);
                } else {
                    splitphone = clientPhone.substring(0, 3) + '-' + clientPhone.substring(3, 6) + '-' + clientPhone.substring(6, 10);
                }
                phone.push(splitphone)
            }
            let route = req.app.get('views') + '/ejs/admin/project/client/client_udtForm.ejs';
            res.render(route, {
                result: result,
                clientId: clientId,
                clientPhone: phone
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//클라이언트 수정
router.post('/clientUpdate', (req, res) => {
    const clientId = req.body.clientId;
    // console.log(req.body);
    // console.log(paths)
    try {
        const param = [req.body.clientComName, req.body.clientBelong, req.body.clientName, req.body.clientPosition, req.body.clientPhone, clientId];
        const sql = "update client set clientComName = ?, clientBelong = ?, clientName = ?, clientPosition = ?, clientPhone = ? where clientId = ?";
        connection.query(sql, param, (err) => {
            if (err) {
                console.error(err);
            }
            res.send('<script>alert("수정이 완료되었습니다."); opener.parent.location.reload(); window.close(); </script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

//히스토리 수정 폼 이동
router.get('/history', async (req, res) => {
    try {
        const historyId = req.query.historyId;
        const sql = "SELECT *, date_format(historyReqDate, '%Y-%m-%dT%H:%i') as historyReqDateFmt,\
                            date_format(historyDoneDate, '%Y-%m-%dT%H:%i') as historyDoneDateFmt\
                       FROM history where historyId = ?;"
        connection.query(sql, historyId, (err, result) => {
            if (err) {
                console.error(err);
            }
            let route = req.app.get('views') + '/ejs/admin/project/history/history_udtForm.ejs';
            res.render(route, {
                result: result,
                historyId: historyId
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//히스토리 수정
router.post('/historyUpdate', (req, res) => {
    const historyId = req.body.historyId;
    // console.log(req.body);
    try {
        const param = [req.body.historyStatus, req.body.historyReqDate, req.body.historyRequester, req.body.historyTitle, req.body.historyReqContent, req.body.historyManager, req.body.historyDoneDate, req.body.historyDoneContent, historyId];
        // console.log(param)
        const sql = "update history set historyStatus = ?, historyReqDate = ?, historyRequester = ?, historyTitle = ?, historyReqContent = ?, historyManager = ?, historyDoneDate = ?, historyDoneContent = ? where historyId = ?";
        connection.query(sql, param, (err) => {
            if (err) {
                console.error(err);
            }
            res.send('<script>alert("수정이 완료되었습니다."); opener.parent.location.reload(); window.close(); </script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
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

//프로젝트 등록 폼 이동
router.get('/', (req, res) => {
    let route = req.app.get('views') + '/ejs/admin/project/project_writForm.ejs';
    res.render(route);
});

//프로젝트 등록
router.post('/project', upload.array('file'), (req, res) => {
    const paths = req.files.map(data => data.path);
    const orgName = req.files.map(data => data.originalname);
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
        const param = [req.body.projectName, req.body.projectClient, req.body.projectManager, req.body.projectIp, req.body.projectDomain, req.body.projectTools, req.body.projectWeb, req.body.projectDB, req.body.projectContent];
        const sql = "insert into projectAdmin (projectName, projectClient, projectManager, projectIp, projectDomain, projectTools, projectWeb, projectDB, projectContent) values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        connection.query(sql, param, (err) => {
            if (err) {
                console.error(err);
            }
            const projectIdSql = "select max(projectId) as projectId from projectAdmin;"
            connection.query(projectIdSql, (err, result) => {
                if (err) {
                    console.error(err);
                }
                // console.log(result)
                // console.log(result[0].projectId)
                for (let i = 0; i < paths.length; i++) {
                    const sql2 = "insert into file(fileRoute, fileOrgName, projectId, fileType) values (?, ?, ?, ?)";
                    const param2 = [paths[i], orgName[i], result[0].projectId, path.extname(paths[i])];
                    connection.query(sql2, param2, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                };
                res.send('<script>alert("등록이 완료되었습니다."); opener.parent.location.reload(); window.close(); </script>');
            });
        });
    } catch (error) {
        res.send(error.message);
    }
});

//클라이언트 정보 등록 폼 이동
router.get('/client', (req, res) => {
    let route = req.app.get('views') + '/ejs/admin/project/client/client_writForm.ejs';
    res.render(route, {
        projectId: req.query.projectId
    });
});

//클라이언트 등록
router.post('/clientInsert', (req, res) => {
    // console.log(req.body);
    try {
        const param = [req.body.clientComName, req.body.clientBelong, req.body.clientName, req.body.clientPosition, req.body.clientPhone, req.body.projectId];
        const sql = "insert into client(clientComName, clientBelong, clientName, clientPosition, clientPhone, projectId) values(?, ?, ?, ?, ?, ?)";
        connection.query(sql, param, (err) => {
            if (err) {
                console.error(err);
            }
            res.send('<script>alert("등록이 완료되었습니다."); opener.parent.location.reload(); window.close(); </script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

//히스토리 등록 폼 이동
router.get('/history', (req, res) => {
    let route = req.app.get('views') + '/ejs/admin/project/history/history_writForm.ejs';
    res.render(route, {
        projectId: req.query.projectId
    });
});

//히스토리 등록
router.post('/historyInsert', (req, res) => {
    try {
        const param = [req.body.historyStatus, req.body.historyReqDate, req.body.historyRequester, req.body.historyTitle, req.body.historyReqContent, req.body.historyManager, req.body.historyDoneDate, req.body.historyDoneContent, req.body.projectId];
        // console.log(param)
        const sql = "insert into history(historyStatus, historyReqDate, historyRequester, historyTitle, historyReqContent, historyManager, historyDoneDate, historyDoneContent, projectId) values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        connection.query(sql, param, (err) => {
            if (err) {
                console.error(err);
            }
            res.send('<script>alert("등록이 완료되었습니다."); opener.parent.location.reload(); window.close(); </script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
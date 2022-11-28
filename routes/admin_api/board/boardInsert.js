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
            //파일이 이미지 파일이면
            if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png" || file.mimetype == "application/octet-stream") {
                // console.log("이미지 파일입니다.");
                fs.mkdir('uploads/boardImgs', function (err) {
                    if (err && err.code != 'EEXIST') {
                        // console.log("already exist")
                    } else {
                        callback(null, 'uploads/boardImgs');
                    }
                })
                //텍스트 파일이면
            } else {
                // console.log("텍스트 파일입니다.");
                fs.mkdir('uploads/boardTexts', function (err) {
                    if (err && err.code != 'EEXIST') {
                        // console.log("already exist")
                    } else {
                        callback(null, 'uploads/boardTexts');
                    }
                })

            }
        },
        //파일이름 설정
        filename: (req, file, done) => {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    //파일 개수, 파일사이즈 제한
    limits: {
        files: 5,
        // fileSize: 1024 * 1024 * 1024 //1기가
    },

});

//게시글 등록 폼 이동
router.get('/', async (req, res) => {
    let route = req.app.get('views') + '/ejs/admin/board/brd_writForm.ejs';
    var boardDivId = req.query.boardDivId == undefined ? '' : req.query.boardDivId;
    var boardName = req.query.boardName == undefined ? '' : req.query.boardName;
    var projectId = req.query.projectId == undefined ? null : req.query.projectId;
    res.render(route, {
        boardDivId: boardDivId,
        boardName: boardName,
        projectId: projectId
    });
});

//공지사항 작성
router.post('/', upload.array('file'), async (req, res, next) => {
    try {
        var boardFix = req.body.boardFix == undefined ? "0" : req.body.boardFix;
        const paths = req.files.map(data => data.path);
        const orgName = req.files.map(data => data.originalname);
        const boardDivId = req.body.boardDivId;
        const projectId = req.body.projectId;
        const adminNick = req.session.user.id;
        let sql;
        let param;

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

        const sql3 = "select adminId from admin where adminNick = ?";
        connection.query(sql3, adminNick, (err, result) => {
            if (err) {
                throw err;
            }
            const adminId = result[0].adminId;
            if (boardDivId != '') {
                sql = "call insertBoard(?,?,?,?,?);\
                    select max(boardId) as boardId from board;";
                param = [boardDivId, req.body.boardTitle, req.body.boardContent, adminId, boardFix];
            } else {
                sql = "insert into board(boardTitle, boardContent, adminId, projectId) values(?, ?, ?, ?);\
                       select max(boardId) as boardId from board;"
                param = [req.body.boardTitle, req.body.boardContent, adminId, projectId]
            }

            connection.query(sql, param, (err, results) => {
                if (err) {
                    throw err;
                }
                const boardId = results[1][0].boardId;
                for (let i = 0; i < paths.length; i++) {
                    const param2 = [boardId, paths[i], orgName[i], path.extname(paths[i])];
                    const sql2 = "insert into file(boardId, fileRoute, fileOrgName, fileType) values (?, ?, ?, ?)";
                    connection.query(sql2, param2, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                };
            });
        });
        if (boardDivId != '') {
            res.send('<script>alert("공지사항이 등록되었습니다."); location.href="/admin/boardMain?boardDivId=' + boardDivId + '&page=1";</script>');
        } else {
            res.send('<script>alert("등록이 완료되었습니다."); opener.parent.location.reload(); window.close(); </script>');
        }
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
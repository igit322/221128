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

//새로운 소식 수정 폼 이동
router.get('/', async (req, res) => {
    try {
        const page = req.query.page;
        const newsId = req.query.newsId;
        const sql = "select * from news where newsId = ?"
        let route = req.app.get('views') + '/ejs/admin/news/news_udtForm.ejs';
        connection.query(sql, newsId, (err, result) => {
            if (err) {
                console.error(err);
            }
            res.render(route, {
                result: result,
                page: page
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//새로운 소식 수정
router.post('/', upload.array('file'), (req, res) => {
    const paths = req.files.map(data => data.path);
    var searchText = req.body.searchText == undefined ? "" : req.body.searchText;
    const page = req.body.page;
    try {
        for (let i = 0; i < paths.length; i++) {
            if (req.files[i].mimetype == "image/jpeg" || req.files[i].mimetype == "image/jpg" || req.files[i].mimetype == "image/png") {
                if (req.files[i].size > 1000000) {
                    sharp(paths[i]).resize({
                            width: 1500
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
        const param = [req.body.newsTitle, req.body.newsContent, paths[0], paths[1], req.body.newsId];
        console.log(req.body.newsId)
        const sql = "update news set newsTitle = ?, newsContent = ?, newsImage = ?, newsThumbnail = ? where newsId = ?";

        connection.query(sql, param, (err) => {
            if (err) {
                console.error(err);
            }

                res.redirect('newsSelectOne?newsId=' +
                    req.body.newsId + '&page=' + page + '&searchText=' + searchText);
            
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
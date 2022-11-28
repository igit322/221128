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

//새로운 소식 등록 폼 이동
router.get('/', async (req, res) => {
    let route = req.app.get('views') + '/ejs/admin/news/news_writForm.ejs';
    res.render(route);
});

//새로운 소식 작성
router.post('/', upload.array('file'), async (req, res, next) => {
    try {
        const paths = req.files.map(data => data.path);
        let sql;
        let param;
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

        sql = " insert into news (newsTitle, newsContent, newsImage, newsThumbnail) \
        values(?,?,?,?); ";
        param = [req.body.newsTitle, req.body.newsContent, paths[0], paths[1]];
        // console.log(param)
        
        connection.query(sql, param, (err, result) => {
            if (err) {
                throw err;
            }
            res.send('<script>alert("공지사항이 등록되었습니다."); location.href="/admin/newsMain?page=1";</script>');
        });
        
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
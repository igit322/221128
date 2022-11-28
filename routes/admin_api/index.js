const express = require('express');
const router = express.Router();
// var session = require('express-session');

const login = require('./login.js');
const main = require('./main.js');

const weekReport = require('./weekReport/weekReport.js');
const weekReportInsert = require('./weekReport/weekReportInsert.js');
const weekReportOne = require('./weekReport/weekReportOne.js');
const weekReportUpdate = require('./weekReport/weekReportUpdate.js');
const weekReportDelete = require('./weekReport/weekReportDelete.js');

const boardMain = require('./board/boardMain.js');
const boardSearch = require('./board/boardSearch.js');
const boardSelectOne = require('./board/boardSelectOne.js');
const boardInsert = require('./board/boardInsert.js');
const boardUpdate = require('./board/boardUpdate.js');
const boardDelete = require('./board/boardDelete.js');

const calendarSelect = require('./calendar/calendarSelect.js');
const calendarSelectOne = require('./calendar/calendarSelectOne.js');
const calendarInsert = require('./calendar/calendarInsert.js');
const calendarUpdate = require('./calendar/calendarUpdate.js');
const calendarDelete = require('./calendar/calendarDelete.js');

const project = require('./project/project.js');
const projectOne = require('./project/projectOne.js');
const projectInsert = require('./project/projectInsert.js');
const projectUpdate = require('./project/projectUpdate.js');
const projectDelete = require('./project/projectDelete.js');

const cmtInsert = require('./comment/cmtInsert.js');
const cmtDelete = require('./comment/cmtDelete.js');

// 리소프트 홈페이지 관리자

const newsMain = require('./news/newsMain.js');
const newsSearch = require('./news/newsSearch.js');
const newsSelectOne = require('./news/newsSelectOne.js');
const newsInsert = require('./news/newsInsert.js');
const newsUpdate = require('./news/newsUpdate.js');
const newsDelete = require('./news/newsDelete.js');

const certiMain = require('./certification/certiMain.js');
const certiSearch = require('./certification/certiSearch.js');
const certiSelectOne = require('./certification/certiSelectOne.js');
const certiInsert = require('./certification/certiInsert.js');
const certiUpdate = require('./certification/certiUpdate.js');
const certiDelete = require('./certification/certiDelete.js');

router.use('/', (req, res, next) => {
    if (req.url == '/' || req.url == '/login') {
        // console.log("세션 검사 하지않고 로그인페이지로")
        next();
    } else { // 로그인 페이지 이외의 페이지에 진입하려고 하는 경우
        if (req.session.user) {
            // console.log("세션이 있다.")
            next();
            // if(req.session.user.isAdmin) {
            //     next();
            // } else {
            //     res.send("<script>alert('어드민 계정으로 로그인 해주세요');location.href='/admin'</script>");
            // }                            // user와 admin이 같은 페이지를 이용할 때 구분해줘야 할 때
        } else {
            // console.log("세션이 없다.")
            res.send("<script>alert('로그인이 필요합니다.');location.href='/admin'</script>");
        }
    }
});

router.use('/', login);
// router.use('/', (req, res, next) => {
//     const sql = "select * from projectAdmin;";
//     connection.query(sql, (err, results) => {
//         if (err) {
//             throw err;
//         }
//         let route = req.app.get('views') + '/ejs/admin/main.ejs';
//         res.render(route, {
//             results: results
//         });
//     });
// });
router.use('/main', main);

router.use('/weekReport', weekReport);
router.use('/weekReportInsert', weekReportInsert);
router.use('/weekReportOne', weekReportOne);
router.use('/weekReportUpdate', weekReportUpdate);
router.use('/weekReportDelete', weekReportDelete);

router.use('/boardMain', boardMain);
router.use('/boardSearch', boardSearch);
router.use('/boardSelectOne', boardSelectOne);
router.use('/boardInsert', boardInsert);
router.use('/boardUpdate', boardUpdate);
router.use('/boardDelete', boardDelete);

router.use('/calendarSelect', calendarSelect);
router.use('/calendarSelectOne', calendarSelectOne);
router.use('/calendarInsert', calendarInsert);
router.use('/calendarUpdate', calendarUpdate);
router.use('/calendarDelete', calendarDelete);

router.use('/project', project);
router.use('/projectOne', projectOne);
router.use('/projectInsert', projectInsert);
router.use('/projectUpdate', projectUpdate);
router.use('/projectDelete', projectDelete);

router.use('/cmtInsert', cmtInsert);
router.use('/cmtDelete', cmtDelete);

router.use('/newsMain', newsMain);
router.use('/newsSearch', newsSearch);
router.use('/newsSelectOne', newsSelectOne);
router.use('/newsInsert', newsInsert);
router.use('/newsUpdate', newsUpdate);
router.use('/newsDelete', newsDelete);

router.use('/certiMain', certiMain);
router.use('/certiSearch', certiSearch);
router.use('/certiSelectOne', certiSelectOne);
router.use('/certiInsert', certiInsert);
router.use('/certiUpdate', certiUpdate);
router.use('/certiDelete', certiDelete);

module.exports = router;
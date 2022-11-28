var express = require('express');
var router = express.Router();

//다운로드
router.get('/', async (req, res) => {

    let route = req.app.get('views') + '/ejs/knuDownload';
    res.render(route,
        {
            layout:false
        });
});
module.exports = router;
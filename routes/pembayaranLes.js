var express = require('express');
var router = express.Router();

let db = require('../config/database');

/* GET home page. */
router.get('/api/pembayaranLes', function (req, res, next) {
    db.query()
});

router.post('/api/pembayaranLes', async function (req, res, next) {
    //console.log(req.body);
    
    try {
        let querySiswa = await db.query(`INSERT INTO les VALUES ("${req.body.nis}","${req.body.status}")`);
        res.json("berhasil");
    }
    catch (err) {
        req.json("gagal");
    }
});

// router.delete();

// router.put();

module.exports = router;
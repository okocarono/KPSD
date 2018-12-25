var express = require('express');
var router = express.Router();

let db = require('../config/database');

/* GET home page. */
router.get('/api/les', async function (req, res, next) {
    let lesQuery = await db.query(`SELECT * FROM les`);
    res.json(lesQuery);
});

router.post('/api/les', async function (req, res, next) {
    let string = "INSERT INTO les VALUES ";
    if (req.body.data.length > 1) {
        for (let i = 0; i < req.body.data.length; i++) {
            if(req.body.data.length === i + 1){
                string += `("${req.body.data[i].nis}", "${req.body.data[i].status}", ${req.body.data[0].harga})`;
            } else {
                string += `("${req.body.data[i].nis}", "${req.body.data[i].status}", ${req.body.data[0].harga}),`;
            }
        }
    }
    else {
        string += `("${req.body.data[0].nis}","${req.body.data[0].status}", ${req.body.data[0].harga})`;
    }
    console.log(string);
    db.query(string);
    res.send("berhasil");
});

// router.delete();

// router.put();

module.exports = router;
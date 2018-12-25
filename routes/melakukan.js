var express = require('express');
var router = express.Router();

let db = require('../config/database');

/* GET home page. */
router.get('/api/melakukan', async function (req, res, next) {
    let extraQuery = await db.query('SELECT * FROM melakukan');
    res.json(extraQuery);
 });


// router.delete();

// router.put();

module.exports = router;
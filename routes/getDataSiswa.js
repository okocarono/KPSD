let express = require('express');
let router = express.Router();

let db = require('../config/database');

router.get('/api/datasiswa',async (req, res, next) => {
    console.log(req.params.kelas)
    let dbQuery = await db.query(`SELECT * FROM siswa`);
    res.json(dbQuery);
})

router.post('/api/datasiswa', async function (req, res, next) {
    console.log(req.body);
    try{
        let querySiswa = await db.query(`INSERT INTO siswa(nis, nama_siswa, kelas) VALUES ("${req.body.nis}","${req.body.nama_siswa}","${req.body.kelas}")`);
        res.json("berhasil");
    }
    catch(err) {
        res.json("gagal");
    }
});

router.delete('/api/datasiswa/:nis', async function (req, res, next) {
    console.log(req.body);
    try{
        let querySiswa = await db.query(`DELETE FROM siswa WHERE nis = "${req.params.nis}"`);
        res.json("berhasil");
    }
    catch(err) {
        res.json("gagal");
    }
});

router.put('/api/datasiswa/:nis', async function (req, res, next) {
    console.log(req.body);
    try{
        let querySiswa = await db.query(`UPDATE siswa SET nama_siswa = "${req.body.nama_siswa}",kelas = "${req.body.kelas}" WHERE nis = "${req.params.nis}" `);
        res.json("berhasil");
    }
    catch(err) {
        res.json("gagal");
    }
});


module.exports = router;
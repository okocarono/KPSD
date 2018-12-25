var express = require('express');
var router = express.Router();

let db = require('../config/database');

/* GET home page. */
router.get('/api/buku', async function (req, res, next) {
    // db.query(`SELECT * FROM siswa, beli, buku WHERE siswa.nis = beli.nis and beli.kode_buku = buku.kode_buku`)
    let bukuQuery = await db.query(`SELECT * FROM buku`);
    res.json(bukuQuery);
});

router.post('/api/buku', async function (req, res, next) {
    console.log(req.body);
    try{
        let querySiswa = await db.query(`INSERT INTO buku(kode_buku, nama_buku, harga) VALUES ("${req.body.kode_buku}","${req.body.nama_buku}",${req.body.harga})`);
        res.json("berhasil");
    }
    catch(err) {
        res.json("gagal");
    }
});

router.delete('/api/buku', async function (req, res, next) {
    console.log(req.body);
    try{
        let querySiswa = await db.query(`DELETE FROM buku WHERE kode_buku = "${req.body.kode_buku}"`);
        res.json("berhasil");
    }
    catch(err) {
        res.json("gagal");
    }
});

router.put('/api/buku/:kode_buku', async function (req, res, next) {
    console.log(req.body);
    try{
        let querySiswa = await db.query(`UPDATE buku SET nama_buku = "${req.body.nama_buku}",harga = ${req.body.harga} WHERE kode_buku = "${req.params.kode_buku}"`);
        res.json("berhasil");
    }
    catch(err) {
        res.json("gagal");
    }
});

module.exports = router;
var express = require('express');
var router = express.Router();

let db = require('../config/database');

/* GET home page. */
router.get('/api/pembayaranBuku', async function (req, res, next) {
    let bukuQuery = await db.query(`select * from buku, beli, siswa where buku.kode_buku = beli.kode_buku and siswa.nis = beli.nis`);
    res.json(bukuQuery);
})

router.post('/api/pembayaranBuku', async function (req, res, next) {
    let querySiswa;
    console.log(req.body);
    let string = "INSERT INTO beli VALUES ";
  
    console.log(req.body.data[0].length);

    if(req.body.data.length > 1){
        for(let i = 0; i < req.body.data.length; i++){
            if(req.body.data.length === i + 1){
                if(req.body.data[i].kode_buku.length > 1){
                    for (let j = 0; j < req.body.data[i].kode_buku.length; j++) {
                        if(req.body.data[i].kode_buku.length === j - 1){
                            string += `("${req.body.data[i].nis}", "${req.body.data[i].kode_buku[j]}")`;
                        } else {
                            string += `("${req.body.data[i].nis}", "${req.body.data[i].kode_buku[j]}"),`;
                        }
                    }
                }
                else{
                    string += `("${req.body.data[i].nis}", "${req.body.data[i].kode_buku[0]}")`;
                }
            }
            else {
                if(req.body.data[i].kode_buku.length > 1){
                    for (let j = 0; j < req.body.data[i].kode_buku.length; j++) {
                        string += `("${req.body.data[i].nis}", "${req.body.data[i].kode_buku[j]}"),`;
                    }
                }
                else{
                    string += `("${req.body.data[i].nis}", "${req.body.data[i].kode_buku[0]}"),`;
                }
            }
        }
    }
    else{
        if (req.body.data[0].kode_buku.length > 1) {
            for (let j = 0; j < req.body.data[0].kode_buku.length; j++) {
                string += `("${req.body.data[0].nis}", "${req.body.data[0].kode_buku[j]}"),`;
            }
        }
        else {
            string += `("${req.body.data[0].nis}","${req.body.data[0].kode_buku}")`;
        }
    }
    console.log(string);
    db.query(string);
    res.send("berhasil");
    
});

// router.delete();

// router.put();

module.exports = router;
var express = require('express');
var router = express.Router();

let db = require('../config/database');

/* GET home page. */
router.get('/api/extra', async function (req, res, next) {
   let extraQuery = await db.query('select * from ekstrakulikuler, ambil_extra, siswa where ekstrakulikuler.id_ekstra = ambil_extra.id_ekstra and siswa.nis = ambil_extra.nis');
   //let extraQuery = await db.query('SELECT nis, id_ekstra, nama_ekstra, harga_ekstra FROM ekstrakulikuler, ambil_extra');
   res.json(extraQuery);
});

// router.post('/api/extra', async function (req, res, next) {
//     console.log(req.body);
//   let string = "INSERT INTO ambil_extra VALUES ";

//     if (req.body.data.length > 1) {
//         for (let i = 0; i < req.body.data.length; i++) {
//             if(req.body.data.length === i + 1){
//                 string += `("${req.body.data[i].nis}", "${req.body.data[i].id_extra}")`;
//             } else {
//                 string += `("${req.body.data[i].nis}", "${req.body.data[i].id_extra}"),`;
//             }
//         }
//     }
//     else {
//         string += `("${req.body.data[0].nis}","${req.body.data[0].id_extra}")`;
//     }

router.post('/api/extra', async function (req, res, next) {
    let querySiswa;
    console.log(req.body);
    let string = "INSERT INTO ambil_extra VALUES ";
  
    console.log(req.body.data[0].length);

    if(req.body.data.length > 1){
        for(let i = 0; i < req.body.data.length; i++){
            if(req.body.data.length === i + 1){
                if(req.body.data[i].id_ekstra.length > 1){
                    for (let j = 0; j < req.body.data[i].id_ekstra.length; j++) {
                        if(req.body.data[i].id_ekstra.length === j - 1){
                            string += `("${req.body.data[i].nis}", "${req.body.data[i].id_ekstra[j]}")`;
                        } else {
                            string += `("${req.body.data[i].nis}", "${req.body.data[i].id_ekstra[j]}"),`;
                        }
                    }
                }
                else{
                    string += `("${req.body.data[i].nis}", "${req.body.data[i].id_ekstra[0]}")`;
                }
            }
            else {
                if(req.body.data[i].id_ekstra.length > 1){
                    for (let j = 0; j < req.body.data[i].id_ekstra.length; j++) {
                        string += `("${req.body.data[i].nis}", "${req.body.data[i].id_ekstra[j]}"),`;
                    }
                }
                else{
                    string += `("${req.body.data[i].nis}", "${req.body.data[i].id_ekstra[0]}"),`;
                }
            }
        }
    }
    else{
        if (req.body.data[0].id_ekstra.length > 1) {
            for (let j = 0; j < req.body.data[0].id_ekstra.length; j++) {
                string += `("${req.body.data[0].nis}", "${req.body.data[0].id_ekstra[j]}"),`;
            }
        }
        else {
            string += `("${req.body.data[0].nis}","${req.body.data[0].id_ekstra}")`;
        }
    }

    // string += '("","")';
    console.log(string);
    db.query(string);
    res.send("berhasil");
});

// router.delete();

// router.put();

module.exports = router;
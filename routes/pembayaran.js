var express = require('express');
var router = express.Router();

let db = require('../config/database');

let randomString = require('randomstring');
let moment = require('moment');

router.get('/api/pembayaran/', async (req, res, next) => {
    let siswa = new Array();
    // let Siswa = new Object();
    siswa.bayar = new Array();
    // siswa.bayar = new Object();
    try {
        let querySiswa = await db.query('SELECT * FROM siswa');
        let queryTagih = await db.query('SELECT * FROM melakukan, pembayaran, siswa where melakukan.id_pembayaran = pembayaran.id_pembayaran and melakukan.nis = siswa.nis');
        let tagihanBulan = 0;
        for(var i in querySiswa){
            siswa.push({ siswa: querySiswa[i], tagih: new Array(), tagihanBulan: new Array()})
            for(var j in queryTagih){
                if (querySiswa[i].nis == queryTagih[j].nis) {
                    tagihanBulan = queryTagih[j].donatur + queryTagih[j].pengembangan + queryTagih[j].pembelajaran_quran + queryTagih[j].buku + queryTagih[j].extra + queryTagih[j].les;
                    siswa[i].tagih.push(queryTagih[j]);
                    siswa[i].tagihanBulan.push({ bulan: queryTagih[j].bulanBayar , total : tagihanBulan});

                    console.log(tagihanBulan)
                }
                else{
                    // siswa.push(querySiswa[i]);
                }
            }
        }
        // console.log(siswa);
        res.json(siswa);
    } catch (err) {
        throw new Error(err)
    }
    
    // console.log(row);
    // res.JSON(row);
});

router.get('/api/tagihan', async (req, res, next) => {
    let tagihBuku = await db.query('SELECT * FROM beli, buku, siswa where buku.kode_buku = beli.kode_buku and beli.nis = siswa.bis');
    let tagihLes = await db.query('SELECT * FROM les, siswa WHERE les.nis = siswa.nis');
    let tagihExtra = await db.query('SELECT * FROM extra, ambil_extra, siswa WHERE extra.id_extra = ambil_extra.id_extra and ambil_extra.nis = siswa.nis');

    let tagihan = new Array();

    for(let i in tagihBuku){
        for(let j in tagihLes){
            if(tagihBuku[i].nis == tagihLes[j].nis){
                tagihan.push({ nis: tagihBuku[i].nis, kode: tagihBuku[i].kode_buku, tagihanBuku: tagihBuku[i].harga, tagihanLes : tagihLes[j].harga});
            }
            else {
                tagihan.push({ nis: tagihBuku[i].nis, kode: tagihBuku[i].kode_buku, tagihanBuku: tagihBuku[i].harga});
                tagihan.push({ nis: tagihBuku[i].nis, kode: tagihBuku[i].kode_buku, tagihanLes: tagihLes[j].harga });
            }
        }
    }

    let tagihanSiswa = new Array();
    for (let i in tagihan) {
        for (let j in tagihExtra) {
            if (tagihan[i].nis == tagihExtra[j].nis) {
                tagihanSiswa.push({ nis: tagihan[i].nis, kode: tagihan[i].kode_buku, tagihanBuku: tagihan[i].tagihanBuku, tagihanLes: tagihan[j].tagihanLes, tagihanExtra: tagihExtra[j].harga_extra});
            }
            else {
                tagihanSiswa.push({ nis: tagihan[i].nis, kode: tagihan[i].kode_buku, tagihanBuku: tagihan[i].tagihanBuku });
                tagihanSiswa.push({ nis: tagihan[i].nis, kode: tagihan[i].kode_buku, tagihanLes: tagihan[i].tagihanBuku });
            }
        }
    }
    res.json(tagihanSiswa);
})

router.get('/api/pembayaran/:nis', async function (req, res, next) {
    let siswaNis = new Array();
    let count = 0;
    try {
        let querySiswa = await db.query('SELECT * FROM siswa');
        let queryTagih = await db.query(`SELECT * FROM melakukan, pembayaran, siswa where melakukan.id_pembayaran = pembayaran.id_pembayaran and melakukan.nis = siswa.nis and siswa.nis = "${req.params.nis}"`);
        let querySum = await db.query(`SELECT SUM(pembayaran.donatur + pembayaran.pengembangan + pembayaran.pembelajaran_quran + pembayaran.buku + pembayaran.extra + pembayaran.les) as total_biaya FROM melakukan, pembayaran, siswa where melakukan.id_pembayaran = pembayaran.id_pembayaran and melakukan.nis = siswa.nis and siswa.nis = "${req.params.nis}"`)
        let tagihanBulan = 0;
        for (var i in querySiswa) {
            
            for (var j in queryTagih) {
                if (querySiswa[i].nis == queryTagih[j].nis) {
                    siswaNis.push({ siswa: querySiswa[i], tagih: queryTagih[j], total_biaya:querySum[0].total_biaya})
                    count++;
                    console.log(tagihanBulan)
                }
                else {
                    // siswa.push(query Siswa[i]);
                }
            }
            
        }
        // console.log(siswa);
        res.json(siswaNis);
    } catch (err) {
        throw new Error(err)
    }
});

router.post('/api/pembayaran/:nis', async function (req, res, next) {
    let string = randomString.generate(10);
    
    console.log(req.body);
    try{
        let querySiswa = await db.query(`INSERT INTO pembayaran (nis, donatur, pengembangan, pembelajaran_quran, buku, extra, les, tanggal_transaksi) VALUES ("${req.params.nis}",${req.body.donatur},${req.body.pengembangan},${req.body.ngaji},${req.body.buku},${req.body.extra},${req.body.les}, "${moment().format()}")`);
        let id = await db.query('SELECT LAST_INSERT_ID() AS id');
        console.log(id[0].id);
        let queryMelakukan = await db.query(`INSERT INTO melakukan VALUES ("${req.params.nis}",${id[0].id},${req.body.bulanBayar})`);
        res.json("berhasil");
    }
    catch(err) {
        res.json("gagal");
    }
});

router.delete('/api/pembayaran/:nis', async function (req, res, next) {
    console.log(req.body);
    try{
        let queryMelakukan = await db.query(`DELETE FROM melakukan WHERE id_pembayaran = ${req.body.id_pembayaran}`);
        let querySiswa = await db.query(`DELETE FROM pembayaran WHERE id_pembayaran = ${req.body.id_pembayaran}`);
        res.json("berhasil");
    }
    catch(err) {
        res.json("gagal");
    }
});

router.put('/api/pembayaran/:nis', async function (req, res, next) {
    console.log(req.body);
    try{
        let querySiswa = await db.query(`UPDATE pembayaran SET donatur = ${req.body.donatur},pengembangan = ${req.body.pengembangan},pembelajaran_quran = ${req.body.ngaji},buku = ${req.body.buku},extra = ${req.body.extra},les = ${req.body.les} WHERE id_pembayaran = ${req.body.id_pembayaran} and nis = "${req.params.nis}"`);
        res.json("berhasil");
    }
    catch(err) {
        res.json("gagal");
    }
});

module.exports = router;
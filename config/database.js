
// // get the client
// const mysql = require('mysql2/promise');

// // get the promise implementation, we will use bluebird
// const bluebird = require('bluebird');

// // create the connection, specify bluebird as Promise
// const connection = mysql.createConnection({ host: 'localhost', user: 'root', database: 'kp_sd', Promise: bluebird });

// if(connection) console.log("Database Berhasil terhubung %s", connection);
// else console.log("Database Gagal terhubung %s", connection);

// let query = connection.execute('SELECT * FROM siswa');
// console.log(query)

var mysql = require('mysql')
var util = require('util');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kpsd'
})

if(pool) console.log("Berhasil terhubung")

pool.query = util.promisify(pool.query);

module.exports = pool;

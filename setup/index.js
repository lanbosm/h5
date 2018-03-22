var mysql=require('../node_modules/mysql');
var config=require('../config/db');

var db=mysql.createConnection(config);

db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' +db.threadId);
});


db.query('CREATE DATABASE IF NOT EXISTS `h5-card-game` DEFAULT CHARSET utf8 COLLATE utf8_general_ci;', function (error, results, fields) {
    if (error) throw error;
    console.log('created OK');
});

db.query('USE `h5-card-game`', function (error, results, fields) {
    if (error) throw error;
});


db.query('DROP TABLE IF EXISTS `game`');

db.query(`CREATE TABLE game (gid INT(12) AUTO_INCREMENT ,cards_max INT(2) , cards_now INT(2) , cards VARCHAR(255) , created DATETIME, PRIMARY KEY (gid))` , function (error, results, fields) {
    if (error) throw error;
    console.log('created game table OK');
});

// gid  cards_max cards_now  created     cards
//  1    17        17      20:20201   {a:4,b:4,c:3,d:4}


//openid  card    gameid
// 张三    a        1
// 哈哈    b        1
// 露娜    a        1

db.query(`DROP TABLE IF EXISTS player`);

db.query(`CREATE TABLE player (openId INT(64) NOT NULL ,gid INT(12) , card_now VARCHAR(4)  , joinTime DATETIME, PRIMARY KEY (openId))` , function (error, results, fields) {
    if (error) throw error;
    console.log('created player table OK');
});

db.end(function () {
    console.log('db close');
});
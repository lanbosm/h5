var mysql=require('../node_modules/mysql');
var config=require('../config/db');
var db;
exports.init = function () {

    return new Promise((resolve, reject) => {

        db=mysql.createConnection(config);

        db.connect(function(err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                reject(err);
            }
        });


        db.query('USE `h5-card-game`', function (error, results, fields) {
            if (error) reject(error);
            resolve(db.threadId);
        });

        db.on('error', handleError);

        function handleError (err) {
            if (err) {
                // 如果是连接断开，自动重新连接
                console.error('mysql error ');
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('准备重连');
                    connect();
                } else {
                    console.error(err.stack || err);
                }
            }
        }

        // 连接数据库
        function connect () {
            db=mysql.createConnection(config);
            db.connect(handleError);
            db.on('error', handleError);
        }

    });
}

/**
 * 游戏配置
 * @param config
 * @returns promise
 */
exports.createGame= function (config) {

    if(!config || typeof config.card!='object' && typeof config.card!='string'){ return Promise.reject(new Error('配置出错'))}

    if(typeof config.card=='object'){
        config.card=JSON.stringify(config.card);
    }

    return new Promise((resolve, reject) => {

            db.query(`INSERT INTO game SET cards_max = ? ,cards_now = ? , cards = ? ` ,[
                config.cardMax,config.cardNow,config.card
            ],function (error, results, fields) {
               // throw  error;
                if (error) reject(error);
                resolve(results,fields);

            });
    });
}

exports.getGame= function (gid=null){

    //如果gid没有那么取最新的
    var condition='order by gid desc limit 1';
    if(gid){
        condition = 'where gid = ?';
    }

    var sql= ` select * from game  ${condition} `;

    return new Promise((resolve, reject) => {
        db.query(sql,[gid],function (error, results, fields) {
                // throw  error;
                if (error) reject(error);
                resolve(results,fields);

            });
    });
}


exports.getGameHistory= function (gid,openId){

    var condition = `where gid = ? and openId = ?`;

    var sql= ` select * from player  ${condition} `;

    return new Promise((resolve, reject) => {
        db.query(sql,[gid,openId],function (error, results, fields) {
            // throw  error;
            if (error) reject(error);
            resolve(results,fields);

        });
    });
}


exports.playGame= function (openId,gid,card,cards,cardsLen) {

    var condition = `WHERE gid = ?`;


    //'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)'
    //var sql = `INSERT INTO game SET cards_max = ? ,cards_now = ? , cards = ? `;
    //db.query(`INSERT INTO game SET cards_max = ? ,cards_now = ? , cards = ? ` ,[
    var sql1=`INSERT INTO player(openId,gid,card_now) VALUES(?,?,?)`;

    var sql2=` UPDATE game SET cards_now = ? , cards = ? ${condition} `;


    return new Promise((resolve, reject) => {

            db.beginTransaction(function(err) {
                if (err) { reject(err); }
                db.query(sql1, [openId, gid, card], function (error, results, fields) {
                    if (error) {
                         db.rollback(function() {
                             reject(error);
                        });
                    }
                    else {
                        db.query(sql2, [cardsLen, cards, gid], function (error, results, fields) {
                            if (error) {
                                db.rollback(function () {
                                    reject(error);
                                });
                            }

                            db.commit(function (error) {
                                if (error) {
                                    db.rollback(function () {
                                        reject(error);
                                    });
                                }
                                resolve(card);
                            });

                        });
                    }
                });
            });
    });
}
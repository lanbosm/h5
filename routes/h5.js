const path=require('path');
const fs = require('fs');

const express= require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser=require('body-parser');
const router = express.Router();

const util = require('../util');
const resCode=require('../code');

const db=require('../db');
const gameConfig=require('../config/game.json');




/**
 *
 * @param  lotteryCard {obj}
 * @returns {{card: {string}, cards: {obj}}}
 */
function lotteryCard(cards) {
    let tmpBox=[];
    let newCards=Object({},cards);

    for(let card in cards){

        for(let i =0; i < cards[card]; i++) {
            tmpBox.push(card)
        }
        newCards[card]=0;
    }

    let rindex = Math.floor((Math.random()*tmpBox.length));
    let mycard=tmpBox.splice(rindex,1)[0];
    let len=tmpBox.length;

    tmpBox.forEach((ele,index)=> {

        for (let card in newCards) {

            if (card == ele) {
                newCards[card]++;
            }
        }
    })


    return {card :mycard,cards:newCards,cardsLen:len};
}


//请求主体解析
//router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));//extended:true

db.init().then(res=>{
    console.log('数据库链接成功');
}).catch(res=>{
    console.log('数据库链接失败');
});



router.get('/card/admin', function(req, res,next){
    //  env NODE_ENV=production
    let items=["Jack","Rose","Alice","Ave"];


    let data={};
    //
    data.ip=req.ip;
    data.items=items;

    res.render('index',{data});
});

//创建游戏
router.route('/card/createGame')
    .get(function(req, res, next) {
        res.sendStatus(405);
    })
    .post(function(req, res, next) {

        if(2>1){    //身份认证
            db.createGame(gameConfig).then((result,fields)=>{
                res.status(200).send(resCode.getCodeRes(2000));
            }).catch(err=>{
                res.status(500).send(resCode.getCodeRes(5000));
            });
        }
    })

//获取游戏
router.route('/card/getGame')
    .get(function(req, res, next) {
        let gid=req.query.gid;
        let openId=req.query.openId;

        if(!openId){
            res.status(400).send(resCode.getCodeRes(4000,"需要openId"));
            return;
        }

        let game={},mine={};
        db.getGame(gid)
            .then(result=>{
                if(!result || result.length==0) {
                    return Promise.reject(new Error('no game'));
                }else{
                    game=result[0];
                    delete game.created;
                    return game.gid
                }
             })
            .then(gid=>{
               return db.getGameHistory(gid,openId);
            })
            .then(result=>{

                if(result && result.length>0){
                    mine=result[0];
                    delete mine.openId;
                    delete mine.joinTime;
                    mine.played=true;
                }else{
                    mine.played=false;
                }

                res.status(200).send(resCode.getCodeRes(2000,{game,mine}));
            })
            .catch(err=>{
                if(err.message=='no game'){
                    res.status(200).send(resCode.getCodeRes(2030,err.message));
                }else {
                    res.status(500).send(resCode.getCodeRes(5000, err.message));
                }
             });
    })


//游戏
router.route('/card/playGame')
    .get(function(req, res, next) {
        res.sendStatus(405);
    })
    .post(function(req, res, next) {
        var openId=req.body.openId;
        var gid=req.body.gid;
        var game;
        if(!openId){
            res.status(400).send(resCode.getCodeRes(4000,"需要openId"));
            return;
        }
        db.getGame(gid)
            .then(result=>{
                game=result[0];
                return game;
             })
            .then(game=>{

                if(game.cards_now==0) {
                    return Promise.reject(new Error('no card'));
                }else {
                    return db.getGameHistory(game.gid, openId);
                }
            })
            .then(result=>{
                if(result && result.length>0){
                    return Promise.reject(new Error('played'));
                }else{
                    return Promise.resolve(game);
                }
            })
            .then(game=>{
                var {card,cards,cardsLen}=lotteryCard(JSON.parse(game.cards));
                return db.playGame(openId, game.gid, card, JSON.stringify(cards), cardsLen);

            })
            .then(card=>{
                res.status(200).send(resCode.getCodeRes(2000,{card:card}));
            })
            .catch(err=>{
                if(err.message=='played' || err.message=='no card'){
                    res.status(200).send(resCode.getCodeRes(2030,err.message));
                }else{
                    res.status(500).send(resCode.getCodeRes(5000, err.message));
                }
            });


    });
// //error
// router.use(function(req, res, next) {
//     //  res.send('404');
//     console.log('haha');
//     next(new Error('not define'));
// });
//
//
//
// router.use(function(err,req, res, next) {
//     //  res.send('404');
//     if(err.message==='not define'){
//         res.status(404).end('Sorry, we cannot find that!');
//         // res.send('haha no file');
//     }
// });

module.exports=router;

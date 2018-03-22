const path=require('path');
const fs = require('fs');

const express= require('express');
const cookieParser = require('cookie-parser');
const bodyParser=require('body-parser');
const router = express.Router();

const util = require('../util');
const resCode=require('../code');


//router.use(cookieParser(secret));

//请求主体解析
//router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));//extended:true


var testDomain='http://lanbosm.free.ngrok.cc';
var prodDomain='http://wechat.billboardpr.com';


router.get('/card/admin', function(req, res,next){
    //  env NODE_ENV=production
    let items=["Jack","Rose","Alice","Ave"];


    let data={};
    //
    data.ip=req.ip;
    data.items=items;


    // res.locals.items=items;
    // //res.cookie('lanbo', 'caicaiwo', { signed: true });
    //
    // if (req.session.user) {
    //
    //     if (req.session.isVisit) {
    //
    //         req.session.isVisit++;
    //     } else {
    //         req.session.isVisit = 1;
    //
    //     }
    //
    //     data.isLogin=req.session.user.isLogin;
    //     data.username=req.session.user.name;
    //     data.isVisit=req.session.isVisit;
    //     //{name:'sss', welcome:req.cookies.uname||null,count:count||null}
    //     // res.sendFile('./');
    //     //   res.sendFile(path.resolve(__dirname , '../public/test.html'));
    //
    //
    //     //   res.render('test', {name:'sss', welcome:req.cookies.uname,count:count});
    //     // res.clearCookie("isVisit");
    // }


    res.render('index',{data});
    // else {
    //     //res.cookie('isVisit', 1, {maxAge: 10 * 60 * 1000,httpOnly:false});
    //     //  res.send("欢迎第一次访问");
    //     res.render('test', {name:'sss'});
    //
    // }
    //res.send('hello world');
    //next();
});

router.route('/login')
    .get(function(req, res, next) {
        res.render('login');
    })
    .post(function(req, res, next) {

        let codeData;
        let un=req.body.username;
        let pw=req.body.password;
        let dpw=util.md5(pw);

        if(dpw==='e10adc3949ba59abbe56e057f20f883e'){ //123456


            req.session.regenerate(function(err) {
                // will have a new session here
                req.session.user={};
                req.session.user.isLogin=true;
                req.session.user.name=un;
            })
            codeData=code.getCodeRes(1000);
        }else{
            codeData=code.getCodeRes(1001);
        }

        res.render('login',{codeData});
        return;
    })


router.route('/loginout')
    .get(function(req, res, next) {
        req.session.destroy(function(err){
            if(err){
                let codeData=code.getCodeRes(0);
                res.json({codeData});
            }else{

                res.clearCookie(ck);
                res.redirect('/test/home');
            }

        });
    })
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

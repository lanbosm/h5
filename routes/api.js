const path=require('path');
const fs = require('fs');

const express= require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser=require('body-parser');
const router = express.Router();

const util = require('../util');
const wxSignature = require('../util/wx_signature');
const wxAuth = require('../util/wx_auth');


const resCode=require('../code');


const secret='expressnodewechat';
const ck='wechatkey';

// 按照上面的解释，设置 session 的可选参数
router.use(session({
    name :ck,
    resave:false,
    secret: secret, // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 60 * 1000 *3 },
    saveUninitialized:true
    //rolling:true,
}));

router.use(cookieParser(secret));

//请求主体解析
//router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));//extended:true


//var saveDomain='http://lanbosm.free.ngrok.cc';
var saveDomain='http://wechat.billboardpr.com';


//微信2小时刷新(动态获取access_token以及jsapi_ticket)
wxSignature.getTokenAndTicket(); //第一次初始化
setInterval(function(){
    wxSignature.getTokenAndTicket();
},1000 * 60 * 60*  2);


router.get('/code',function(req,res){

    let redUrl = saveDomain+'/api/oAuth2';
    wxAuth.getCode(req,res,redUrl);

})


//获取当前用户微信的信息
router.get('/oAuth2',function(req,res) {
   // delete  req.headers['x-requested-with'];

    if(!req.session.accessTime){
        req.session.accessTime=0;
    }
    if(req.session.accessTime>2){
		
        req.session.destroy(function(err){
                res.clearCookie(ck);
                res.redirect(req.app.locals.reqUrl);
        });
        return;
    }
    if(!req.query.code && req.headers.referer){
            req.app.locals.reqUrl=req.headers.referer;
            req.session.accessTime++;
            res.redirect(`/api/code?oauth=2`);
    }else if(req.query.code){
        wxAuth.getWxUserInfor(req, res);
    }
    else{ //不允许
        res.sendStatus(403);
    }
})


//获取当前用户(上传当前完整路径)
router.get('/wxSign',function(req,res,next){ // #返回jsonp

    let currentUrl = req.query.currentUrl;
    var sign=wxSignature.wxSignature(req,res,currentUrl) //签名

   // res.set("Access-Control-Allow-Origin","*") //设置解决跨域问题
    res.jsonp({sign});

    //res.jsonp({status:'jsonp'});
});


//文件上传服务
router.post('/upload',  function (req, res, next)  {

    let responseData; //响应的数据

    var upload=myMulter('file1',1);

    upload(req, res, function (err) {

           try {
                 if (err) throw err;
                 if(req.files.length==0) throw new  Error("不能上传空文件");

                 responseData=resCode.getCodeRes(2000);
                 responseData.url=req.files[0].url;
                 res.json(responseData);


           }
           catch (err) {
                 responseData=resCode.getCodeRes(4000);
                 responseData.error=err.message||err.Message;
                 res.status(500).json(responseData);
           }
     });
});

router.post('/upload2', async(req, res , next)=>{

    //接收前台POST过来的base64
    let imgData = req.body.base64data;

    //过滤data:URL
    let base64Data = imgData.replace(/^data:image\/\w+;base64,/, '');
    let dataBuffer = new Buffer(base64Data, 'base64');

    let photoName=`photo-${ +new Date() }.png`;

    // (async ()=>{
    try {

        var done=await util.saveFileWithStream(path.resolve(__dirname,'../upload',photoName), dataBuffer );
        if(done){
            res.send({code:1002,imgPath:'/upload/'+photoName});
        }else{
            throw new Error("error");
          //  row new TypeError('Bad arguments');
        }
    } catch (err) {
        console.log(err);
        res.send('error');
    }
});

router.get('/', function(req, res,next){



    res.sendStatus(403);

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

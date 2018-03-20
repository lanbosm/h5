let express= require('express');
let cookieParser = require('cookie-parser');
let bodyParser=require('body-parser');
let router = express.Router();
let path=require('path');

let resCode=require('../code');
let fs = require('fs');

let util = require('../util');
let config = require('../code/config');





const secret='lanbodaren';
const ck='lanbokey';
router.use(cookieParser(secret));




//var cpUpload = upload.fields([{ name: 'file1', maxCount: 1 }]);
//getAuth();

//getService();
// getBucket();
//getBucketAcl();

// 创建实例
// var cos = new COS({
//     // AppId: '1251987790',
//     SecretId: 'AKIDyFygbiN0dSFWoAK92H2je5GvUDILOni1',
//     SecretKey: '9mXB5cT9knz5AfrIVZgpC0Mm9iDj7dG0',
// });
// // 分片上传
// cos.sliceUploadFile({
//     Bucket: 'dorodorolab-bucket-1251987790',
//     Region: 'ap-shanghai',
//     Key: 'lancher.png',
//     FilePath: path.resolve(__dirname , '../upload/lancher.png')
// }, function (err, data) {
//     console.log(err, data);
// });


//router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));//extended:true

// var crypto = require('crypto');
//
//
// crypto.randomBytes(128,function(ex,buf){
//     var token = buf.toString('hex');
//     console.log(token);
// });
// router.use(function(req, res, next) {
// });

// router.get('/test', function(req, res, next) {
//     res.send('Hello World');
// })
// this will only be invoked if the path starts with /bar from the mount point

router.get('/imgupload', function(req, res,next){
    //  env NODE_ENV=production
    let data={};

    res.render('cos/imgUpload',{data});
});

router.get('/dropupload', function(req, res,next){
    //  env NODE_ENV=production

    let data={};
    res.render('cos/dropUpload',{data});
});


//var upload = require('./fileupload');

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

    // })();

    //
    // var stream= fs.createWriteStream("./upload/out3.png",'utf-8');
    // stream.write(dataBuffer);
    // stream.end();
    // console.log('end');
    // stream.on('finish', () => { console.log('finish'); });
    // stream.on('error', (err) => { console.log(err); });
    // console.log('last');
    // res.send('保存成功');
    // fs.writeFile("./upload/out.png", dataBuffer, function(err) {
    //     if(err){
    //         console.log(err);
    //         res.send(err);
    //     }else{
    //         console.log('suc');
    //         res.send("保存成功！");
    //     }
    // });
});

router.get('/', function(req, res,next){
    //  env NODE_ENV=production
    let items=["Jack","Rose","Alice","Ave"];



    //console.log(app.locals);
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

let express= require('express');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let RedisStore = require('connect-redis')(session);
let bodyParser=require('body-parser');
let router = express.Router();
let path=require('path');
let util=require('../util');
let code=require('../code');


const secret='lanbodaren';
const ck='lanbokey';
router.use(cookieParser(secret));




//router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

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
router.use('/bar', function(req, res, next) {
    // ... maybe some additional /bar logging ...
    res.send('Hello World3');
    next();
});



//error
// router.use(function(req, res, next) {
//     //  res.send('404');
//     console.log('haha');
//     next(new Error('not define'));
// });

// router.error(function(req, res, next) {
//     res.send('404')
// });


// router.use(function(err,req, res, next) {
//     //  res.send('404');
//     if(err.message==='not define'){
//         res.status(404).end('Sorry, we cannot find that!');
//         // res.send('haha no file');
//     }
// });
module.exports=router;

// module.exports={
//     people:people
// };
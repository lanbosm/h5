

const express= require('express');
const path = require('path');
const consolidate = require('consolidate');



// 允许跨域访问
// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

// 创建一个express实例 s
let app = express();
//app.use(bodyParser.urlencoded({extended:true}));

app.locals.toy = '这是一个APP';
//app.enable('view cache');

let env = process.env.NODE_ENV || 'development';
if ('development' === env) {
    // configure stuff here
    // app.enable("view cache");
}else{

}

//var a=app.enabled('view cache');
// .listen(3000,function(){
//     console.log('ok its running');
// });

let server = require('http').Server(app);



// require('./routes/chat2').bb.attach(server);
// app.set('view cache', true);
app.use('/api', require('./routes/api'));



app.set('view engine', 'html');
app.engine('html', consolidate.ejs);
//app.engine('html', require('ejs').renderFile);


app.set('views', path.resolve(__dirname, 'views'));
app.set('view cache', false);
app.set('trust proxy', true);


app.use('/public',express.static(__dirname+'/public'));
app.use('/static',express.static(__dirname+'/dist'));
app.use('/upload',express.static(__dirname+'/upload'));
server.listen(3000,function(){
    console.log('ok its run in port 3000 and env in ' +env  );
});

// var options = {
//     hostname: 'www.qq.com',
//     port: 80,
//     path: '/',
//     method: 'GET'
// };
// var req = http.request(options, function (res) {
//     console.log('STATUS: ' + res.statusCode);
//     console.log('HEADERS: ' + JSON.stringify(res.headers));
//     res.setEncoding('utf8');
//     res.on('data', function (chunk) {
//         console.log('BODY: ' + chunk);
//     });
// });


//app.set('view cache',false);


//server
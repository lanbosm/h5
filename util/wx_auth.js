
'use strict'
const async = require('async'),
    request = require('request'),
    config = require('../config'),
    qs= require('qs');



//获取code
exports.getCode=function(req,res,url){
    //console.log("oauth - login")
    // 第一步：用户同意授权，获取code

    var scope = 'snsapi_base'; //'snsapi_userinfo'

    var return_uri = encodeURI(`${url}?scope=${scope}`);
    //var scope = ; //

    res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.wxConfig.appId}&redirect_uri=${return_uri}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`);

    return false;

}




//http://blog.csdn.net/fansongy/article/details/42156109
//获取微信用户信息
exports.getWxUserInfor = function(req,res){

    //res.send({sss:12});
    async.waterfall([

        function(){ //获取code的access_token
            let code = req.query.code,
                getTokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.wxConfig.appId}&secret=${config.wxConfig.appSecret}&code=${code}&grant_type=authorization_code`;
            request(getTokenUrl,function (error,response,body) {
                if (!error && response.statusCode == 200) {
                    let tokenData = JSON.parse(body);
                    if(req.query.scope == 'snsapi_base'){
                        // res.set("Access-Control-Allow-Origin","*") //设置解决跨域问题
                        res.send(tokenData)
                    } else {
                        callback(null,tokenData);
                    }
                }
             })
        },function(tokenData,callback){ //获取微信用户信息
            let getInforUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${tokenData.access_token}&openid=${tokenData.openid}&lang=zh_CN`;
            request(getInforUrl,function (error,response,body) {
                if (!error && response.statusCode == 200) {
                    let userData = JSON.parse(body);
                    res.set("Access-Control-Allow-Origin","*") //设置解决跨域问题
                    res.send(userData)
                }
            })
        }],function(err,result){
        if(err) throw err
    })

}
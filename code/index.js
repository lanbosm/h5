let codelist={
    0:'未知错误 请稍后再试',
    1000:'登录成功',
    1001:'密码错误',
    1002:'该账号未注册',
    2000:'响应成功',
    2030:'响应成功 操作错误',
    4000:'参数错误',
    5000:'响应失败'
}

/**
 * Loads a module.
 * See code
 * @param {Number} code {string,todoStr}
 * returns {Object} {code, message}
 */
exports.getCodeRes=function(code,data){
    var res={code,message:codelist[code]};
    if(code==2000){
            res=Object.assign(res,data);
    }else {
        if (data){
            res.reason = data;
        }
    }
    return res;
}
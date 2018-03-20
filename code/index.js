let codelist={
    1000:'登录成功',
    1001:'密码错误',
    1002:'该账号未注册',
    0:'未知错误 请稍后再试',
    2000:'操作成功',
    4000:'操作失败'




}

/**
 * Loads a module.
 * See code
 * @param {Number} code
 * returns {Object} {code, message}
 */
exports.getCodeRes=function(code){
    return {code,message:codelist[code]};
}
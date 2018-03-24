 /*
 	wechat jssdk文档 http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115&token=&lang=zh_CN

   * 注意：
   * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
   * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
   * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
   *
   * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
   * 邮箱地址：weixin-open@qq.com
   * 邮件主题：【微信JS-SDK反馈】具体问题
 	 * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
  */
var shareData={
         needWxJsSDK:true,
         title:window.title,
         desc:"ss",
         signlink:window.location.href.indexOf('#') == -1 ? window.location.href : encodeURIComponent(window.location.href.substring(0, window.location.href.indexOf('#'))),
         sharelink:window.location.href.indexOf('#') == -1 ? window.location.href : encodeURIComponent(window.location.href.substring(0, window.location.href.indexOf('#'))),
         imgUrl: "", //200 *200
         async: true, //是否启用每次分享都重置分享内容
         debug: false, //是否开启debug模式
         ShareCallBack: function(){

         }
 }


var  weChatShare=function(package){

        window.shareData.title=package.shareTitle;
        window.shareData.desc=package.shareDesc;
        window.shareData.imgUrl=package.shareImgUrl;
        window.shareData.sharelink=package.shareLink;
        window.shareData.ShareCallBack=package.ShareCallBack;
        window.shareData.debug=package.debug;

}

 

//生成签名
 window.onload = function () {

        if (shareData.needWxJsSDK) {
            $.ajax({
                type: 'get',
                url: '/api/wxSign',
                dataType: 'jsonp',
                async: false,
                data: { currentUrl: shareData.signlink, r: Math.random() },
                success: window.WeChatSDKjsonpCallback
                       
            });
            
        } else {
            wx.hideOptionMenu();
            alert("生成签名失败");
            return false;
        }
    };

 
//配置config
function WeChatSDKjsonpCallback(json) {


    var json=json.sign||{};

    prostate="state="+json.state;
    wx.config({
        debug: shareData.debug,
        appId: json.appId,
        timestamp: json.timestamp,
        nonceStr: json.nonceStr,
        signature: json.signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ]
    });
}

 //config信息验证后会自动执行ready方法
wx.ready(function () {
    wx.hideMenuItems({
        menuList: [
            "menuItem:share:appMessage",
            "menuItem:share:timeline",
            "menuItem:share:qq",
            "menuItem:share:weiboApp",
            "menuItem:share:QZone"
        ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
    });
    //页面一进入就调用的API
     //分享到朋友圈
    wx.onMenuShareTimeline({
        title: shareData.title ,  // 分享标题
        link: shareData.sharelink, // 分享链接
        imgUrl: shareData.imgUrl,  // 分享图标
      
        success: function () {
            shareData.ShareCallBack("success");
        },
        cancel: function () {
            shareData.ShareCallBack("cancel");
        }
    });
    //发送给好友
    wx.onMenuShareAppMessage({
        title: shareData.title, // 分享标题
        desc: shareData.desc, // 分享描述
        link: shareData.sharelink, // 分享链接
        imgUrl: shareData.imgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () { 
            // 用户确认分享后执行的回调函数
            shareData.ShareCallBack("success");
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            shareData.ShareCallBack("cancel");
        }
    });
    //分享到QQ
    wx.onMenuShareQQ({
        title: shareData.title, // 分享标题
        desc: shareData.desc, // 分享描述
        link: shareData.sharelink, // 分享链接
        imgUrl: shareData.imgUrl, // 分享图标
        success: function () { 
           // 用户确认分享后执行的回调函数
            shareData.ShareCallBack("success");
        },
        cancel: function () { 
           // 用户取消分享后执行的回调函数
            shareData.ShareCallBack("cancel");
        }
    });
    //分享到腾讯微博
    wx.onMenuShareWeibo({
        title:shareData.title, // 分享标题
        desc:shareData.desc, // 分享描述
        link:shareData.sharelink, // 分享链接
        imgUrl: shareData.imgUrl, // 分享图标
        success: function () { 
           // 用户确认分享后执行的回调函数
           shareData.ShareCallBack("success");
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            shareData.ShareCallBack("cancel");
        }
    });
    //获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
    wx.onMenuShareQZone({
        title: shareData.title, // 分享标题
        desc: shareData.desc, // 分享描述
        link: shareData.sharelink, // 分享链接
        imgUrl: shareData.imgUrl, // 分享图标
        success: function () { 
           // 用户确认分享后执行的回调函数
           shareData.ShareCallBack("success");
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
             shareData.ShareCallBack("cancel");
        }
    });
});


//此api 是隐藏的
 // trigger: function (res) {
 //     if (wxData.async) {
 //         this.title = wxData.title;
 //         this.desc = wxData.desc;
 //         this.link = wxData.url;
 //         this.imgUrl = wxData.img_url;
 //     }
 // },
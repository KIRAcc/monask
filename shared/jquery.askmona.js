jQuery.askmona = {
  endpoint:"http://askmona.org/v1/",
  topics:function(opts,callback){
    jQuery.getJSON(this.endpoint+'topics/list?callback=?',opts,callback);
  },
  topicsAll:function(opts,callback){
    var list=[],
    get = function(off){
      opts.limit=1000; opts.offset=off;
      jQuery.askmona.topics(opts, function(json){
        Array.prototype.push.apply(list, json.topics);
        if(json.topics.length === 1000)get(off+1000,callback);  else callback(list);
      });
    }; get(0);
  },
  responses:function(authInfo,callback){
    opts.to=1000;
    jQuery.getJSON(this.endpoint+'responses/list?callback=?',opts,callback);
  },
  verify:function(authInfo,callback){
    jQuery.post(this.endpoint+'auth/verify',
      jQuery.askmona.authKey(authInfo),callback,"json"
      );
  },
  authKey:function(info){
    var nonce = window.nonce(30);
    var time = window.time();
    var hashObj = new jsSHA("SHA-256","TEXT",1);
    hashObj.update(info.app_secretkey+nonce+time+info.secretkey);
    return {auth_key:hashObj.getHash("B64"),nonce:nonce,time:time,app_id:info.app_id,u_id:info.u_id};
  },
  unixtime:function(str){
    var objDate = new Date(str * 1000);
    var nowDate = new Date();
    myHour = Math.floor((nowDate.getTime()-objDate.getTime()) / (1000*60*60)) + 1; //åªç›éûä‘Ç∆ÇÃç∑
    var year = objDate.getFullYear();
    var month = objDate.getMonth() + 1;
    var date = objDate.getDate();
    var hours = objDate.getHours();
    var minutes = objDate.getMinutes();
    var seconds = objDate.getSeconds();
    if ( month < 10 ) { month = "0" + month; }
    if ( date < 10 ) { date = "0" + date; }
    if ( hours < 10 ) { hours = "0" + hours; }
    if ( minutes < 10 ) { minutes = "0" + minutes; }
    if ( seconds < 10 ) { seconds = "0" + seconds; }
    rtnValue = year + '/' + month + '/' + date + ' ' + hours + ':' + minutes + ':' + seconds;
    return rtnValue;
}
};

window.time = function(){return Math.floor( new Date().getTime() / 1000 )};
window.nonce = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
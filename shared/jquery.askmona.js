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
    };  get(0);

  },
  responses:function(opts,callback){
    opts.to=1000;
    jQuery.getJSON(this.endpoint+'responses/list?callback=?',opts,callback);
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
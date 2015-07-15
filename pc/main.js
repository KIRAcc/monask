//var _$ = jQuery.noConflict(true);
//include("jquery.resizableColumns.min.js");include("../info.js");include("lib/func.js");include("lib/pagectrl.js"); //ライブラリ呼び出し

$(function(){
  var $ = jQuery = jQuery.noConflict().extend(true, $);
  $.askmona.topicsAll({},function(data){
    window.topics = data;
    for(i=0,catList=[]; i<data.length; i++) catList[ data[i].cat_id ] = data[i].category;
    showTopics(data);
  });
});

//function toggleMain(){$("#main_wrapper>div, .btns").toggle();}

function showTopics(data){
  window.dTopics = data;
  var columns = [
    {id: "rank", name: "No.", field: "rank", sortable: true, cssClass: "cell-textRight"},
    {id: "cat", name: "カテゴリ", field: "category", sortable: true, cssClass: ""},
    {id: "title", name: "トピック ", field: "title", sortable: true, cssClass: ""},
    {id: "count", name: "ﾚｽ数", field: "count", sortable: true, cssClass: "cell-textRight"},
    {id: "modified", name: "ﾄﾋﾟ立", field: "created", sortable: true, cssClass: "cell-textRight"},
    {id: "updated", name: "更新", field: "updated", sortable: true, cssClass: "cell-textRight"},
    {id: "lead", name: "リード ", field: "lead", sortable: true, cssClass: ""}
  ];
  var options = {
    enableCellNavigation: false,
     //自動Height調整はcssframe.jsに
    //enableColumnReorder: false
  };
  grid = new Slick.Grid("#myGrid", dTopics, columns, options);
  $("#status").val("（ ´∀｀）Thread list loaded!");

  grid.onClick.subscribe(function(e, args) {
    var item = args.row;
    getResponses(window.dTopics[item]);
   });
    $('#myGrid').css('overflow-y','auto');
}

function getResponses(th_obj){console.log(th_obj);
  var html = '<div id="th_title">' + th_obj.title + '</div>';
  $('#myB').html(html);
  $("#status").val("（ ・～・）Responses LOADING... : "  + th_obj.title);
  var th_id = th_obj.t_id;
  $.askmona.responses({t_id:th_id},function(data){console.log(data);
  window.responses = data.responses;
  for(i=0; i<responses.length; i++){
    var res = responses[i];
    html += '<p id="res_' +(i+1)+ '" style="margin-left:10px;"><span class="rh">' +(i+1)+ '</span> ：<a href="#" class="ru">' +res.u_name+res.u_dan+ '</a>： <span class="rm">+' +(res.receive/100000000)+ 'MONA/' +res.rec_count+ '人</span></p><p class="res lv' +res.res_lv+ '">' +res.response.replace(/\n/g,"<br />").replace(/(https?:\/\/[^ <]+)/g,'<a target="_blank" rel="nofollow" href="$1">$1</a>').replace(/<a target="_blank" rel="nofollow" href="[^"]+">(http:\/\/i.imgur.com\/[A-Za-z0-9]+)(\.[^<]+)</g,'<a class="thumbnail" href="$1$2" target="_blank"><img src="$1l$2"><');//.replace(/"\/\//g,'"http://')+ '</p>';
	$('#myB').html(html);
  }
	$("#status").val("（ ・∀・）Responses loaded! : "  + th_obj.title);

  grid.onClick.subscribe(function(e, args) {
    var item = args.row;
    getResponses(window.topics[item]);
   });
});
}

function include(astrFile){var script = document.createElement('script');script.src = astrFile;script.type = 'text/javascript';script.defer = true;document.getElementsByTagName('head').item(0).appendChild(script);}

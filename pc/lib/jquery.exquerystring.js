/*
 * 	exQueryString 1.0.1 - jQuery plugin
 *	written by Cyokodog	
 *
 *	Copyright (c) 2009 Cyokodog (http://d.hatena.ne.jp/cyokodog/)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
(function($j){

	$j.ex = $j.ex||{};
	$j.ex.queryString = function(cfg){
		if(typeof cfg == 'string'){
			cfg = {script:cfg};
		}
		var p = $j.ex.queryString.param;
		var c = $j.extend({
			script : '',
			url : window.location.href
		},cfg);
		if(c.script){
			var script = p.src[c.script]?p.src[c.script]:{csr:0,src:[]};
			var r = new RegExp('(^'+c.script+'$)|(/'+c.script+'$)|(^'+c.script+'\\?)|(/'+c.script+'\\?)','i');
			var sc = $j('script');
			var match = 0;
			sc.each(function(idx){
				var src = sc[idx].src;
				if (r.test(src)) {
					if (match == script.csr) {
						script.src[script.src.length] = src;
					}
					match++;
				}
			})
			c.url = script.src[match-1];
			script.csr = match;
			p.src[c.script] = script;
		}
		if(c.url.indexOf('?') < 0) return false;
		var params = c.url.replace(/.+\?/, '').split('&');
		var ret={};
		for(var i=0; i<params.length; i++ ){
			var param = params[i].split('=');
			ret[ param[0] ] = decodeURIComponent(param[1]);
		}
		return ret;
	};
	$j.fn.exQueryString = function(cfg){
		var target = this;
		if(target.size() == 0)return false;
		return $j.ex.queryString(
			$j.extend(cfg,{
				url : target[0]['src'] || target[0]['href'] || ''
			})		
		);
	};
	$j.ex.queryString.param = {
		src:{}
	}
})(jQuery);


/**
 * This JavaScript provide 'Frame-like Page(CSS Frame)'.
 * require : jQuery v1.5 or higher
 *           and jQuery UI 1.8.9 or higher
 *           and ex.queryString (http://d.hatena.ne.jp/cyokodog/20090526/jQueryExQueryString01)
 * Copyright 2011, Project Feelgood
 * http://ek-pro.com/
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: 2011-02-22 v0.0.1
 * Date: 2011-04-25 v0.0.2
 */

/**
 * Create Master Object
 * This contains all objects used in this script.
 */
var CSF = {};

/*
 * Several ID,class
 * setting the value of each ID.
 */
//header
CSF.headerId = '#header_wrapper';
//main
CSF.mainId = '#main_wrapper';
CSF.mainAId = '#mainA_wrapper';
CSF.mainBId = '#mainB_wrapper';
//footer
CSF.footerId = '#footer_wrapper';
//menu
CSF.menuId = '#menu_wrapper';
//the element id to resize
CSF.resizerId = '#resizer';
CSF.resizer2Id = '#resizer2';
//the element id that starts the removal event of cssframe.
CSF.csfRemoverId = '#csf-remove';
//the element id that restart the cssframe.
CSF.csfStarterId = '#csf-start';
//create a hyperlink to a print page in this class
CSF.csfPrintCls = '.cframe-print';

//The class value used in "jQuery Resizable".(Not need to change, probably)
CSF.uiResizableE = '.ui-resizable-e';
CSF.uiResizableS = '.ui-resizable-s';
//Identify the elements to avoid conflict with other "jQuery Resizable".
CSF.targetRisizeBar = CSF.resizerId + ' ' + CSF.uiResizableE;
CSF.targetRisizeBar2 = CSF.resizer2Id + ' ' + CSF.uiResizableS;

/*
 * Several Element Size(px)
 */
//header height
CSF.headerHeight = 25;
//menu width
CSF.menuWidth = 156;
//footer height
CSF.footerHeight = 30;
//resizebar width
CSF.resizeBarWidth = 2;

/*
 * each html element's css
 */
//html
CSF.htmlElementCss = {
	'overflow' : 'hidden', 
	'margin' : '0px',
	'border' : '0px',
	'padding' : '0px',
	'width' : '100%',
	'height' : '100%'
};
//body
CSF.bodyElementCss = {
	'display' : 'block',
	'margin' : '0px',
	'border' : '0px',
	'padding' : '0px',
	'width' : '100%',
	'height' : '100%'
};
//header
CSF.headerCss = {
	'position' : 'absolute',
	'top' : '0',
	'left' : '0',
	'margin' : '0px',
	'padding' : '0px',
	'width' : '100%',
	'height' : CSF.headerHeight
}
//main
CSF.mainCss = {
	'overflow' : 'auto',
	'position' : 'absolute',
	'top' : CSF.headerHeight,/*same as header height*/
	'left' : CSF.menuWidth,/*same as menu width*/
	'bottom' : '0px',
	'margin' : '0px',
	'padding' : '0px'
}
//footer
CSF.footerCss = {
	'overflow' : 'hidden', 
	'position' : 'absolute',
	'left' : '0px',
	'margin' : '0px',
	'padding' : '0px',
	'width' : '100%',
	'height' : CSF.footerHeight
}
//menu
CSF.menuCss = {
	'overflow' : 'auto',
	'position' : 'absolute',
	'left' : '0px',
	'top' : CSF.headerHeight,/*same as header height*/
	'bottom' : '0px',
	'margin' : '0px',
	'padding' : '0px',
	'width' : CSF.menuWidth
}

/**
 * getCookie
 *
 * Get the value set in the cookie.
 * Notice: NOT validate the argument value.
 * @param String name  cookie name
 * @return String cookie value
 */
CSF.getCookie = function (name){
	var match = ('; ' + document.cookie + ';').match('; ' + name + '=(.*?);');
	return match ? decodeURIComponent(match[1]) : '';
};

/**
 * setCookie
 *
 * Set the value set in the cookie.
 * Notice: NOT validate the argument value.
 * @param String name  cookie name
 * @param String value cookie value 
 * @param String expires  If you set no expiration date on a cookie, it expires when the browser closes.
                          If you set an expiration date, the cookie is saved across browser sessions.
                          If you set an expiration date in the past, the cookie is deleted.
                          Use Greenwich Mean Time (GMT) format to specify the date.
 * @param String domain  If you set the domain of the cookie, documents on a domain made up of more than
                         one server can share cookie information. 
 * @param String path  If you set a path for the cookie, the current document can share cookie information
                       with other documents within the same domain--that is, if the path is set to /thispathname,
                       all documents in /thispathname and all documents in subfolders of /thispathname can access
                       the same cookie information.
 * @param Boolean secure  If you set a cookie as secure, the stored cookie information
                          can be accessed only from HTTPS.
 */
CSF.setCookie = function (name, value, expires, domain, path, secure) {
        var buffer = name + '=' + encodeURIComponent(value);
        if (expires != 'undefined') buffer += '; expires=' + new Date(expires).toUTCString();
        if (typeof domain != 'undefined') buffer += '; domain=' + domain;
        if (typeof path != 'undefined') buffer += '; path=' + path;
        if (secure) buffer += '; secure';
        document.cookie = buffer;
};

/**
 * main
 *
 * The cssframe runs by executed this function.
 * On IE6-IE8, This calls "location.reload" function when cssframe is disable.
 * Therefore, the second argument will NOT be called.
 * @param Function restartFunc  this function is called when cssframe restarts. 
 * @param Function removeFunc  this function is called when cssframe removes. 
 */
CSF.main = function(restartFunc,removeFunc){
	//Check whether css frame is enabled or disabled from the cookie value.
	//if enable, cssframe is let to run.
	if (CSF.getCookie('csf') != '0'){
		//Set the style of each element
		jQuery('html').css(CSF.htmlElementCss);
		jQuery('body').css(CSF.bodyElementCss);
		jQuery(CSF.headerId).css(CSF.headerCss);
		jQuery(CSF.mainId).css(CSF.mainCss);
		jQuery(CSF.footerId).css(CSF.footerCss);
		jQuery(CSF.menuId).css(CSF.menuCss);
		
		//On the menu, its width can be resized using "jQuery UI resizable".
		//Not to show a horizontal scrollbar, the child element of "menu_Warapper" can be resizale (NOT "menu_Warapper" element).
		//But when that child elemen is resized, "menu_Warapper" element is also automatically resized.
		//And, that child element's width make to be equal to the length which is that "menu_Warapper"'s width minus the resizebar's width.
		jQuery(CSF.resizerId).resizable({
			handles: "e",
			//autoHide: true,
			alsoResize : CSF.menuId,
			resize: function(){//Content in the resize operation
				//get the inside dimension of the browser
				CSF.browserWidth = jQuery('body').outerWidth(true);
				CSF.browserHeight = jQuery('body').outerHeight(true);
				//get the "menu" width when this function is called because it can be resized.
				CSF.menuWidth = jQuery(CSF.menuId).outerWidth(true);
				//change the width of "main" element, and its left position.
				jQuery(CSF.mainId).width(CSF.browserWidth-CSF.menuWidth).css("left",CSF.menuWidth);
                                grid.resizeCanvas();
			}
		});
		jQuery(CSF.resizer2Id).resizable({
			handles: "s",
			//autoHide: true,
			alsoResize : CSF.mainAId,
			resize: function(){//Content in the resize operation
				//get the inside dimension of the browser
				CSF.browserWidth = jQuery('body').outerWidth(true);
				CSF.browserHeight = jQuery('body').outerHeight(true);
				//get the "menu" width when this function is called because it can be resized.
				CSF.mainAHeight = jQuery(CSF.mainAId).outerHeight(true);
				//change the width of "main" element, and its left position.
				jQuery(CSF.mainBId).height(jQuery(CSF.mainId).height()-CSF.mainAHeight);//.css("top",CSF.mainAHeight);
                                grid.resizeCanvas();//grid.init();//jQuery('#myGrid .slick-viewport').height(CSF.mainAHeight - jQuery('#myGrid .slick-header').outerHeight(true) - 1);
			}
		});
		
		//Set the widht of resizebar. Do this after the "resizable" operation.
		jQuery(CSF.targetRisizeBar).width(CSF.resizeBarWidth);
		jQuery(CSF.targetRisizeBar2).height(CSF.resizeBarWidth);
			
		//jQuery(CSF.resizerId).width is as follows:
		//If "menu" has a vertical scroll......minus both resizebar widht and scroll bar width.
		//If "menu" has NO vertical scroll......minus resizebar widht only.
		//(Do this after the "resizable" operation.)
		var scrollBarWidth = jQuery(CSF.menuId).attr('offsetWidth') - jQuery(CSF.menuId).attr('clientWidth');
		jQuery(CSF.resizerId).width(CSF.menuWidth - scrollBarWidth - jQuery(CSF.targetRisizeBar).width());
		var scrollBar2Height = jQuery(CSF.mainAId).attr('offsetHeight') - jQuery(CSF.mainAId).attr('clientHeight');
		jQuery(CSF.resizer2Id).height(CSF.mainAHeight - scrollBar2Height - jQuery(CSF.targetRisizeBar2).height());
		
		//Move resizebar to the left by its overflowing.
		jQuery(CSF.targetRisizeBar).css('right', '-' + jQuery(CSF.targetRisizeBar).css('width'));
		jQuery(CSF.targetRisizeBar2).css('bottom', '-' + jQuery(CSF.targetRisizeBar2).css('height'));
		
		//Set the size of each part.
		_setSeveralElementSize();
		
		//Measures against that the resizebar would break at the height of the appearance of the menu.
		//Set the longer height value which "menu_Wrapper"'s height or its child element's.
		//(Do this after the "resizable" operation and setting the size of each part.)
		jQuery(CSF.resizerId).height((function(){
			var m = jQuery(CSF.menuId).height();
			var n = jQuery(CSF.resizerId).attr('scrollHeight');
			return (m > n) ? m : n ;
		}()));
		/*jQuery(CSF.resizer2Id).width((function(){
			var m = jQuery(CSF.mainAId).width();
			var n = jQuery(CSF.resizer2Id).attr('scrollWidth');
			return (m > n) ? m : n ;
		}()));*/

		//Make a hyperlink to a print page.
		if (jQuery(CSF.csfPrintCls).size() > 0){
			var printString = jQuery(CSF.csfPrintCls).html();
			if(!(printString)){
				printString = 'Print Page';
			}
			if (location.search){
				jQuery(CSF.csfPrintCls).html( '<a href="' + location.pathname + location.search + '&cflame=print" target="_blank">' + printString + '</a>' );
			}else{
				jQuery(CSF.csfPrintCls).html( '<a href="' + location.pathname + '?cflame=print" target="_blank">' + printString + '</a>' );
			}
		}

		//Resize Event
		//Set the size of each part when a brower resizes.
		jQuery(window).resize(function(){
			_setSeveralElementSize();
			//If "CSF.resizerId" make to be higher than original, its height becomes invalid when a browser resizes so that a scrollbar appears.
			//->Get and set "CSF.resizerId"'s width to a temporary variable, its style does "removeAttr" and set its height and width again.
			var tempWidth = jQuery(CSF.resizerId).width();
			jQuery(CSF.resizerId).removeAttr('style');
			jQuery(CSF.resizerId).height((function(){
				var m = jQuery(CSF.menuId).height();
				var n = jQuery(CSF.resizerId).attr('scrollHeight');
				return (m > n) ? m : n ;
			}())).width(tempWidth);
			var temp2Height = jQuery(CSF.resizer2Id).height();
			jQuery(CSF.resizer2Id).removeAttr('style');
			jQuery(CSF.resizer2Id).width((function(){
				var m = jQuery(CSF.mainAId).width();
				var n = jQuery(CSF.resizer2Id).attr('scrollWidth');
				return (m > n) ? m : n ;
			}())).height(temp2Height);
		});
	}
	
	//Click Event
	//Disable cssframe.
	//notice:
	//This function makes all style attributes deleted so that values which not only cssframe but others were added are deleted.
	//If you need to reset those styles when cssframe restarts, set a reset function you made to the first argument of "CSF.main" function.
	jQuery(CSF.csfRemoverId).click(function(){
		if(jQuery(CSF.targetRisizeBar).size() > 0){
			//IE6-8 behaves improperly so in IE this function sets required values to the cookie and figures a screen again.
			var exp = new Date();
			exp.setMonth(exp.getMonth() + 2);
			CSF.setCookie('csf', '0', exp, undefined, undefined);
			if(jQuery.support.opacity){ 
				jQuery(CSF.resizerId).resizable('destroy').removeAttr('style');
				jQuery(CSF.headerId).removeAttr('style');
				jQuery(CSF.mainId).removeAttr('style');
				jQuery(CSF.footerId).removeAttr('style');
				jQuery(CSF.menuId).removeAttr('style');
				jQuery(CSF.targetRisizeBar).remove();
				jQuery('body').removeAttr('style');
				jQuery('html').removeAttr('style');
				if (typeof removeFunc == 'function'){
					removeFunc();
				}
				jQuery(this).unbind();
			} else {
				location.reload();
			}
		}
	});
	
	//Click Event
	//Enable cssframe.
	//This function runs only when cssframe is disable.
	jQuery(CSF.csfStarterId).click(function(){
		if(jQuery(CSF.targetRisizeBar).size() < 1){
			var exp = new Date();
			exp.setMonth(exp.getMonth() + 2);
			CSF.setCookie('csf', '1', exp, undefined, undefined);
			CSF.main(restartFunc,removeFunc);
			if (typeof restartFunc == 'function'){
				restartFunc();
			}
		}
	});

	//
	//Inner function
	//Set the size of each element based on an innerWidth and an innerHeight of the browser.
	function _setSeveralElementSize(){
		//Get an innerWidth and an innerHeight of the browser.
		CSF.browserWidth = jQuery('body').outerWidth(true);
		CSF.browserHeight = jQuery('body').outerHeight(true);

		//Get the size of the menu when this function is called because the menu can be resized.
		CSF.menuWidth = jQuery(CSF.menuId).outerWidth(true);
		CSF.mainAHeight = jQuery(CSF.mainAId).outerHeight(true);

		//Set each value as follows.
		//header width
		jQuery(CSF.headerId).width(CSF.browserWidth);
		
		//menu height
		jQuery(CSF.menuId).height(CSF.browserHeight-CSF.headerHeight-CSF.footerHeight);
		
		//the main part's size, position
		jQuery(CSF.mainId).width(CSF.browserWidth-CSF.menuWidth).height(CSF.browserHeight-CSF.headerHeight-CSF.footerHeight).css("left",CSF.menuWidth);
		jQuery(CSF.mainBId).height(jQuery(CSF.mainId).height()-CSF.mainAHeight).css("top",CSF.mainAHeight);

		//footer position
		jQuery(CSF.footerId).css('top', CSF.browserHeight-CSF.footerHeight);

		//The innerWidth of "CSF.resizerId" changes
		//beceuse a horizontal scrollbar is appeared in the menu part when resizebar appears.
		var scrollBarWidth = jQuery(CSF.menuId).attr('offsetWidth') - jQuery(CSF.menuId).attr('clientWidth');
		jQuery(CSF.resizerId).width(CSF.menuWidth - scrollBarWidth - jQuery(CSF.targetRisizeBar).width());
		var scrollBar2Height = jQuery(CSF.mainAId).attr('offsetHeight') - jQuery(CSF.mainAId).attr('clientHeight');
		jQuery(CSF.resizer2Id).height(CSF.mainAHeight - scrollBar2Height - jQuery(CSF.targetRisizeBar2).height());
	};
};

jQuery(function(){
	//Get "queryString"
	var param = jQuery.ex.queryString();

	//cssframe runs.
	if(param.cflame != 'print'){
		CSF.main(function(){
			alert('restart');
		},function(){
			alert('removed');
		});
	}
});

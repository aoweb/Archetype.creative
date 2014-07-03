// JavaScript Document

function removeSelection(){
	if (document.selection) { document.selection.empty() } else { getSelection().removeAllRanges(); }
};

function getRand(min, max){
	return Math.round(Math.random()*(max-min))+min;
};

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;
    var temp = new obj.constructor(); 
    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
};

(function(){
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++ x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	
	if(window.requestAnimationFrame === undefined){
		window.requestAnimationFrame = function(callback){
			var currTime = Date.now(), timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function(){ callback(currTime + timeToCall); }, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}
	
	window.cancelAnimationFrame = window.cancelAnimationFrame || function(id){ window.clearTimeout(id) };
}());

function getCSSFeature(featurename){
  var result = false,
      name = featurename,
      domPrefixes = 'O Webkit Moz ms'.split(' '),
      elm = document.createElement('div'),
      featurenameCapital = null;
  
  featurename = featurename.toLowerCase();

  if( elm.style[featurename] ) {
    result = name;
  } 

  if( result === false ) {
    featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);
    for( var i = 0; i < domPrefixes.length; i++ ) {
      if( elm.style[domPrefixes[i] + featurenameCapital ] !== undefined ) {
        result = '-' + domPrefixes[i].toLowerCase() + '-' + name;
        break;
      }
    }
  }
  
  return result;
};

function log(e){ $("#log").text(e.toString()) };

function ModernCSSFeatures(callback){
  this.transform = getCSSFeature('transform');
  this.transition = getCSSFeature('transition');
  this.has3d = $(document.createElement('div')).css(this.transform, 'translate3d(1px,1px,1px)').css(this.transform);
  this.has3d = this.has3d == 'none' ? false : !!this.has3d;
  this.translate = this.has3d ? 'translate3d' : 'translate';
  
  callback.call(this);
};

var css3 = new ModernCSSFeatures(function(){
  if (!this.has3d)
    jQuery(function($){
      $('body').addClass('no3d');
    });
});

function setCookie(name, value, options) {
  options = options || {};
 
  var expires = options.expires;
 
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires*1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }
 
  value = encodeURIComponent(value);
 
  var updatedCookie = name + "=" + value;
 
  for(var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];   
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
     }
  }
 
  document.cookie = updatedCookie;
};

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

function deleteCookie(name) {
  setCookie(name, "", { expires: -1 })
};

var isMobile = (function() {
	var check = false;
	
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	
	return check; 
})();

function DOMBoundObject(name, proto){
	this.relatedElement = null;
	this.name = name || "";
	this.proto = proto || DOMBoundObject;
	
	this.alreadyExist = function(DOMElement){
		return DOMElement && DOMElement[this.name] instanceof this.proto;
	};
	
	this.bindTo = function(DOMElement){
		if (!this.initialized) {
			this.relatedElement = DOMElement;
			DOMElement[this.name] = this;
		}
	};
};

DOMBoundObject.prototype = new DOMBoundObject();

/*(function(){
  var time = new Date();

	var loop = function(){
	  log(Math.round(1000 / (new Date() - time)));
    time = new Date();
    
    requestAnimationFrame(loop);
  };
  
  loop();
})();*/
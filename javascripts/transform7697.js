jQuery.fn.position = function() {
	if ( !this[ 0 ] ) {
		return;
	}

	var offsetParent, offset,
		parentOffset = { top: 0, left: 0 },
		elem = this[ 0 ];

	// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
	if ( jQuery.css( elem, "position" ) === "fixed" ) {
		// we assume that getBoundingClientRect is available when computed position is fixed
		offset = elem.getBoundingClientRect();
	} else {
		// Get *real* offsetParent
		offsetParent = this.offsetParent();

		// Get correct offsets
		offset = this.offset();
		if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
			parentOffset = offsetParent.offset();
		}

		// Add offsetParent borders
		parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
		parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
	}

	// Subtract parent offsets and element margins *disabled
	// note: when an element has margin: auto the offsetLeft and marginLeft
	// are the same in Safari causing offset.left to incorrectly be 0
	return {
		top:  offset.top  - parentOffset.top,
		left: offset.left - parentOffset.left
	};
}

var transformAnimation = (function(){
  return function(_elem, x, y, _time){
    var elem = $(_elem),
        time = typeof _time != 'undefined' ? _time : 400,
        left = typeof x != 'string' ? x + 'px' : x,
        top = typeof y != 'string' ? y + 'px' : y;
    
    clearTimeout(elem[0].transitionTimer);
    
    if (css3.transition) {
      if (!time)
        elem.css(css3.transition, css3.transform + ' 0ms');
      else
        elem.css(css3.transition, css3.transform + ' ' + time + 'ms');
      
      elem.css(css3.transform, css3.translate + '(' + left + ', ' + top + (css3.has3d ? ', 0' : '') + ')');
      
      elem[0].transitionTimer = setTimeout(function(){
        elem.css(css3.transition, '');
      }, time);
    } else {
      elem.stop().animate({
        marginTop: top,
        marginLeft: left
      }, time);
    }
  }
})();
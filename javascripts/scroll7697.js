function _Scroll(target, rel, axisX){
	this.initialized = false;
	
	this.disabled = false;
	this.needScroll = false;
	this.scrollTop = 0;
	this.scrollLeft = 0;
	this.scrollWheel = false;
	this.instantScroll = false;
	this.useNativeScroll = true;
	this.stopPropagation = false;
	this.instantScroll = false;
	this.touchMove = false;
	
	this.element = target && target.length ? target[0] : target;
	this.$element = $(target);
	this.$relative = $(rel);
	
	if (this.alreadyExist(this.element))
		return this.element.scrollObject;
	
	this.useAxisX = !!axisX;
	
	this.setScroll = function(value){
		this[this.useAxisX ? 'scrollLeft' : 'scrollTop'] = value;
	};
  
	this.rqAnimFrame = null;
	var loop = function(){
		if (this.needScroll && !this.inAnimation) {
			var currScroll = this.useNativeScroll ? this.getElemScroll() : -this.$relative.getPosition(),
					diff = this.getScroll() - currScroll,
					pos = null;
			
			this.scrollWheel = true;
			
			if (Math.abs(diff) < 1) {
				pos = this.getScroll();
				this.needScroll = false;
			} else
				pos = currScroll + Math[diff > 0 ? "ceil" : "floor"](diff * (this.instantScroll ? 1 : 0.2));
			
			this.launchCustomHandlers(pos);
			
			if (!this.useNativeScroll)
				transformAnimation(this.$relative, this.useAxisX ? -pos : 0, this.useAxisX ? 0 : -pos, 0);
			else
				this.$element[this.useAxisX ? 'scrollLeft' : 'scrollTop'](pos);
			
			var scrollEvent = $.Event("scroll");
  	  scrollEvent.scrollTop = pos;
  	  scrollEvent.doubleScroll = true;
  	  
  	  this.$element.trigger(scrollEvent);
		}
		
		this.rqAnimFrame = requestAnimationFrame(loop.bind(this));
	};
	
	this.stopRqAnimFrame = function(){
	  cancelAnimationFrame(this.rqAnimFrame);
	};
	
	this.startRqAnimFrame = function(){
	  loop.call(this);
			
		var rqFrameIndex = this.rqAnimFrame;
		var self = this;
		var initFrameInterval = setInterval(function(){
		  
		  if (rqFrameIndex != self.rqAnimFrame)
		    clearInterval(initFrameInterval);
		  else {
		    cancelAnimationFrame(rqFrameIndex);
		    
		    loop.call(self);
		    rqFrameIndex = self.rqAnimFrame;
		  }
		  
		}, 500); 
	};
	
	this.launchCustomHandlers = function(scroll){
		var self = this;
		
		$(this.customHandlers).each(function(){
			this.call(self, scroll);
		});
	};
	
	this.wheelHandler = function(self){
	  var wheelDelay = null;
	  
		return function(e){
			e.stopPropagation();
			e.preventDefault();
			
			if (self.inAnimation || wheelDelay) {
			  clearTimeout(wheelDelay);
			  
			  wheelDelay = setTimeout(function(){
			    wheelDelay = null;
			  }, 25);
			  
			  return;
			}
			
			var delta = 0;
				
			if (e.originalEvent)
				e = e.originalEvent;
					
			if (e.wheelDelta) {
				delta = -e.wheelDelta;
			} else if (e.detail) {
				delta = e.detail;
			}
			
			self.scrollTo(delta);
		}
	};
	
	this.touchHandler = function(self){
		return function(e){
			if (self.stopPropagation)
			  e.stopPropagation();
			e = e.originalEvent;
			
			self.instantScroll = true;
			
			var start = self.useAxisX ? e.touches[0].pageX : e.touches[0].pageY,
					startScroll = self.$relative.getPosition(),
					step = 0,
					delta = 0,
					stepTime = new Date(),
					deltaTime = 0;
			
			$("body").on('touchmove'/*'touchmove MSPointerMove'*/, function(e){
				e.preventDefault();
				
				e = e.originalEvent;
				
				deltaTime = stepTime - new Date();
				stepTime = new Date();
				delta = ((self.useAxisX ? e.touches[0].pageX : e.touches[0].pageY) - start) - step;
				step = (self.useAxisX ? e.touches[0].pageX : e.touches[0].pageY) - start;
				
				var to = startScroll + step;
				
				to = to > 0 ? to/2 : to;
				to = -to > self.getScrollMax() ? -self.getScrollMax() + (to + self.getScrollMax()) / 2 : to;
				
				self.touchMove = true;
				
				self.scrollTo(-to, true);
			});
			
			$("body").on('touchend'/*'touchend MSPointerUp'*/, function(){
				$(this).unbind('touchmove touchend'/*'touchmove touchend MSPointerMove MSPointerUp'*/);
				
				self.instantScroll = false;
				
				deltaTime = stepTime - new Date();
				
				var to = self.$relative.getPosition();
				
				if (Math.abs(delta) > 20 && deltaTime < 100)
					to -= ((delta / 2) / deltaTime) * 50;
				
				to = Math.max(Math.min(to, 0), -self.getScrollMax());
				
				self.touchMove = false;
				
				self.scrollTo(-to, true);
			});
		}
	};
	
	this.scrollHandler = function(self){
		return function(e){
			if (self.stopPropagation)
			  e.stopPropagation();
			
			if (!e.doubleScroll) {
  			if (self.scrollWheel) {
  				self.scrollWheel = false;
  			} else {
  				self.needScroll = false;
  				self.setScroll(self.getElemScroll());
  				
  				self.launchCustomHandlers(self.getScroll());
  			}
			}
		}
	};
  
  this.keyHandler = function(self){
    var keyTimeout = null;
    
    function handler(e){
      var key = e.which,
          time = 0;
      
      if(key == 38 || key == 40 || key == 33 || key == 34) {
        clearTimeout(keyTimeout);
        
        var scrollValue = self.getScroll(),
            dir = 0;
        
        switch(key) {
          case 38:
            dir = -2;
            break;
          case 40:
            dir = 2;
            break;
          case 33:
            dir = -1 * (self.$element.getDemension() / 40) / 100 * 80;
            break;
          case 34:
            dir = (self.$element.getDemension() / 40) / 100 * 80;
            break;
        };
        
        self.scrollTo(scrollValue + 40 * dir, true);
        
        keyTimeout = setTimeout(function(){ time++; handler(e) }, time ? 100 : 1000);
        
        $(this).off('keyup').on('keyup', handler.removeRepeat); 
      }
    };
    
    handler.removeRepeat = function(target){
      var target = target.currentTarget || target;
      
      time = 0;
      clearTimeout(keyTimeout);
      
      $(target).off('keyup');
    };
    
    return handler;
  };
	
	this.bindEvents = function(){
		this.$element.on('mousewheel DOMMouseScroll', this.wheelHandler(this));
		this.$element.on('touchstart'/*'touchstart MSPointerDown'*/, this.touchHandler(this));
		
		var keyHandler = this.keyHandler(this);
		
		this.$element.on('mouseover', function(){
		  $('body').on('keydown', keyHandler);
		});
		this.$element.on('mouseout', function(){
		  $('body').off('keydown', keyHandler);
		  
		  keyHandler.removeRepeat($('body'));
		});
		
		this.$element.on("scroll", this.scrollHandler(this));
	};
	
	this.disable = function(){
		this.disabled = true;
		this.scrollWheel = true;
		this.$element.css({overflow: "hidden"});
	};
	
	this.enable = function(){
		this.disabled = false;
		this.scrollWheel = true;
		this.$element.css({overflow: "auto"});
	};
	
	this.scrollTo = function(_delta, absolute){
		if (!this.disabled && !this.inAnimation) { 
      var delta = _delta * (/firefox/i.test(navigator.userAgent) && Math.abs(_delta) < 120 ? 40 : 1);
			var pos = this.getScroll();
			
			if (absolute)
				pos = _delta;
			else
				pos += delta;
			
			if (!isMobile)
	      pos = Math.min(Math.max(0, pos), this.getScrollMax());
			
			if (this.useAxisX)
				this.scrollLeft = pos;
			else
				this.scrollTop = pos;
				
			this.needScroll = true;
    }
  };
	
	this._getDemension = function(self){
		return this[self.useAxisX ? 'outerWidth' : 'outerHeight']();
	};
	
	this._getPosition = function(self){
		return this.position()[self.useAxisX ? 'left' : 'top'];
	};
	
	this.getElemScroll = function(){
		return this.$element[this.useAxisX ? 'scrollLeft' : 'scrollTop']();
	};
	
	this.getScroll = function(){
		if (this.useAxisX)
			return this.scrollLeft || 0;
		else
			return this.scrollTop || 0;
	};
	
	this.getScrollMax = function(){
		return this.$relative.getDemension() - this.$element.getDemension();
	};
	
	this.customHandlers = [];
	
	this.init = function(){
		if (!this.initialized) {
			this.$element.getDemension = this._getDemension.bind(this.$element, this);
			this.$element.getPosition = this._getPosition.bind(this.$element, this);
			this.$relative.getDemension = this._getDemension.bind(this.$relative, this);
			this.$relative.getPosition = this._getPosition.bind(this.$relative, this);
			
			this.bindEvents();
			
			document.body.scroll = "no";
			
			this.startRqAnimFrame();
			
			this.bindTo(this.element);
			
			this.initialized = true;
		}
	};
};

_Scroll.prototype = new DOMBoundObject("scrollObject", _Scroll);


function _ScrollBar(target, rel, axisX){
	this.proto = _ScrollBar;
	
	this.scrollBarDisabled = false;
	this.useNativeScroll = false;
	
	this.element = target && target.length ? target[0] : target;
	this.$element = $(target);
	this.$relative = $(rel);
	
	if (this.alreadyExist(this.element))
		return this.element.scrollObject;
	
	this.useAxisX = !!axisX;
  
  this.barHandler = function(self){
    return function(e){
      e.preventDefault();
      removeSelection();
      
      var diff = e.pageY - self.scrollBarHand.position().top,
          delta = -self.scrollBarHand.height() * (diff / Math.abs(diff)),
          procDelta = delta / (self.scrollBar.height() / 100),
          pxDelta = procDelta * (self.$relative.outerHeight() / 100);
      
      self.scrollTo(-pxDelta);
    }
  };
  
  this.handHandler = function(self){
    return function(e){
      e.preventDefault();
      e.stopPropagation();
      
      removeSelection();
      
      var top = -self.$relative.position().top,
          startY = e.pageY;
      
      self.instantScroll = true;
      
      $('body').on("mousemove", function(e){
        var delta = e.pageY - startY,
            procDelta = -delta / (self.scrollBar.height() / 100),
            pxDelta = procDelta * (self.$relative.outerHeight() / 100);
        
        self.scrollTo(top + -pxDelta, true);
      });
      
      $('body').on("mouseup", function(){
        $(this).off("mousemove mouseup");
        
        self.instantScroll = false;
      });
    }
  };
  
  this.updateScrollBar = function(){
    var ratio =  this.$relative.outerHeight() / this.$element.outerHeight(),
        procTop = -this.$relative.position().top / (this.$relative.outerHeight() / 100),
        pxTop = procTop * (this.scrollBar.height() / 100)
    
    this.scrollBarHand.height(this.scrollBar.height() / ratio);
    
    if (ratio <= 1)
      this.scrollBar.hide();
    else
      this.scrollBar.show();
    
    transformAnimation(this.scrollBarHand[0], 0, pxTop, 0);
  };
  
  this.customHandlers.push(function(){
		if (!this.scrollBarDisabled)
			this.updateScrollBar();
	});
  
  var protoInit = this.init;
  
  this.init = function(){
    if (!this.initialized) {
      protoInit.call(this);
      
			this.scrollBarDisabled = !!this.$element.data().disableScrollBar;
			
			if (!this.scrollBarDisabled) {
				this.scrollBar = $(document.createElement("div")).addClass("scroll-bar"),
				this.scrollBarHand = $(document.createElement("a")).attr({class: "scroll-bar-hand", href: "#"});
				
				this.scrollBar.on("mousedown", this.barHandler(this));
				this.scrollBarHand.on("mousedown", this.handHandler(this));
				this.scrollBarHand.on("click", function(e){ e.preventDefault() });
						
				this.$relative.after(this.scrollBar.append(this.scrollBarHand));
				
				this.updateScrollBar();
			}
    };
  };
};

_ScrollBar.prototype = new _Scroll();
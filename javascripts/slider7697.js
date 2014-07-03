function Slider(target, axisX, options){
	this.options = $.extend({pages: true}, options);
	
	this.useNativeScroll = false;
	
	this.element = target && target.length ? target[0] : target;
	this.$element = $(target).addClass('slider');
	this.$relative = $(document.createElement('div')).addClass('slider-content inner');
	
	if (this.alreadyExist(this.element))
		return this.element.scrollObject;
	
	this.useAxisX = !!axisX;
	
	this.pointHandler = function(self){
		return function(e){
			e.preventDefault();
			
			self.scrollToPage(this.sliderPointObject.item.slideIndex);
		}
	};
	
	this.buttonHandler = function(self){
		return function(e){
			e.preventDefault();
			
			var dir = $(this).hasClass('slider-up') || $(this).hasClass('slider-left') ? -1 : 1;
			
			self.scrollToPage(self.active.slideIndex + dir);
		}
	};
	
	this._scrollHandler = function(self){
		return function(e){
			if (!self.touchMove && !self.inAnimation) {
				var scrollTop = e.scrollTop || 0,
						delta = 0;
				
				switch(true){
					case scrollTop < self.active.$.position().top - 1:
						delta = -1;
						break;
					case scrollTop + self.$element.height() > self.active.$.position().top + self.active.$.outerHeight() + 1:
						delta = 1;
						break;
				}
				
				if (delta) {
					var index = self.active.slideIndex + delta;
					
					if (index <= (self.sliderItems.length - 1) && index >= 0) {
						self.scrollToPage(index);
					}
				}
			}
		}
	};
	
	this.hideButton = function(button){
		button.$.stop().animate({opacity: 0}, 200, function(){ $(this).hide(); });
	};
	this.showButton = function(button){
		button.$.stop().show().animate({opacity: 1}, 200);
	}; 
	
	this.setActive = function(index){
		this.active.point.$.removeClass('slider-active-page');
		
		this.active = this.sliderItems[index];
		this.active.point.$.addClass('slider-active-page');
		
		var activePoint = this.active.point.$;
				offset = activePoint.position();
		offset = {
			top: (this.$pagerInner.height() / 2 - activePoint.outerHeight() / 2) - offset.top,
			left: (this.$pagerInner.width() / 2 - activePoint.outerWidth() / 2) - offset.left
		}
		transformAnimation(this.$pagerInner, offset.left, offset.top, 700); 
		
		if (index == 0) {
			this.hideButton(this.upButton);
			this.hideButton(this.leftButton);
		} else {
			this.showButton(this.upButton);
			this.showButton(this.leftButton);
		}
		if (index == this.sliderItems.length - 1) {
			this.hideButton(this.downButton);
			this.hideButton(this.rightButton);
		} else {
			this.showButton(this.downButton);
			this.showButton(this.rightButton);
		}
		
		$(this).trigger($.Event('changeslide'));
	};
	
	this.scrollToPage =  function(index){
		var self = this;
		
		this.needScroll = false;
		this.inAnimation = true;
		
		this.setActive(index);
		
		var offset = this.sliderItems[index].$.position();
		transformAnimation(this.$relative[0], -offset.left, -offset.top, 700);
		
		this.setScroll(this.sliderItems[index].$.position().top);
		
		this.scrollDelay = setTimeout(function(){ self.inAnimation = false; }, 700);
	};
	
	this.getScrollMax = function(){
			var $last = this.$items.filter(':last');
			return $last.position().top + $last.outerHeight() - this.$element.outerHeight();
	};
	
	var protoInit = this.init;
	
	this.init = function(){
		if (!this.initialized) {
			var self = this;
			
			this.$items = $("> *", this.$element);
			this.sliderItems = [];
			
			this.$element.append(this.$relative.append(this.$items));
			
			protoInit.call(this);
			
			this.$pagerInner = $(document.createElement('div')).addClass('inner');
			this.$pager = $(document.createElement('div')).addClass('slider-pages').append(this.$pagerInner);
			
			if (this.options.pages)
				this.$element.append(this.$pager);
			
			this.$items.each(function(){
				var item = new Slider.Item(this);
				
				self.$pagerInner.append(item.point.$);
				
				item.point.$.on('click', self.pointHandler(self));
				
				self.sliderItems.push(item);
			});
			
			this.upButton = new Slider.Button('up');
      this.downButton = new Slider.Button('down');
			this.leftButton = new Slider.Button('left');
      this.rightButton = new Slider.Button('right');
			
			if (this.$element.hasClass('vertical-slider'))
        this.$element.append(this.upButton.$.add(this.downButton.$));
      else
        this.$element.append(this.leftButton.$.add(this.rightButton.$));
				
			this.upButton.$.add(this.leftButton.$).add(this.downButton.$).add(this.rightButton.$).on('click', this.buttonHandler(this));
			
			this.$element.on('scroll', this._scrollHandler(this));
			
			this.active = this.sliderItems[0];
			this.setActive(0);
		}
	}
	
	if (this.element.length > 1)
    return (function(elements){
      var self = this;
			var ret = [];
			
			ret.init = function(){
				$(ret).each(function(){
					this.init();
				});
			};
      
      elements.each(function(){
        ret.push(new Slider(this, self.options));
      });
      
      return ret;
    })(this.element);
};

Slider.prototype = new _Scroll();



Slider.Item = function(content){
	this.DOMElement = content;
			
	this.$ = $(this.DOMElement).addClass('slider-item');
	this.slideIndex = Slider.Item.count;
	
	this.point = new Slider.Point(this);
	
	Slider.Item.count++;
	
	this.bindTo(this.DOMElement);
};

Slider.Item.prototype = new DOMBoundObject('sliderItemObject', Slider.Item);

Slider.Item.count = 0;

Slider.Point = function(item){
	this.DOMElement = document.createElement('a');
			
	this.$ = $(this.DOMElement).attr({class: 'slider-page', href: '#'});
	this.item = item;
	
	this.bindTo(this.DOMElement);
};

Slider.Point.prototype = new DOMBoundObject('sliderPointObject', Slider.Point);

Slider.Button = function(dir){
	this.DOMElement = document.createElement('a');
			
	this.$ = $(this.DOMElement).attr({class: 'slider-' + dir, href: '#'}).append('<span />');
	
	this.bindTo(this.DOMElement);
};

Slider.Button.prototype = new DOMBoundObject('sliderButtonObject', Slider.Button);
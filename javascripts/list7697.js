function List(listElement) {
  if (this.alreadyExist(listElement))
		return listElement.listObject;
		
	this.initialized = false;
	
	this.listElement = listElement;
	
	var reverse = Array.prototype.reverse;
  
  this.xhr = null;
  
  this.future = function(){
    if (this.visible.length)
      return this.els.filter(':gt(' + this.els.index(this.visible.filter(':last')) + ')');
    else
      return this.els;
  };
  
  this.past = function(){
    if (this.visible.length)
      return reverse.call(this.els.filter(':lt(' + this.els.index(this.visible.filter(':first')) + ')'));
    else
      return reverse.call($(this.els));
  };
  
  this.getPage = function(page){
    var self = this;
		
		this.xhr = $.get(this.list.data('path') + '?page=' + page, function(data){
      var pageContent = $(data),
          animation = self.lastPage.attr('class').match(/animation-./)[0],
          newPage = $(document.createElement('ul')).addClass('animated-list ' + animation + ' list-page list-page-' + page);
          
      newPage.append(pageContent);
      
      self.list.append(newPage);
      
      self.els = self.els.add($('> li', newPage));
      
      self.lastPage = newPage;
      self.xhr = null;
    });
  };
	
	this.init = function(){
		if (!this.initialized) {
			this.list = $('> .inner', this.listElement);
			this.lastPage = $('.list-page:last', this.list);
			
			this.els =  $('.animated-list > li', this.list);
			this.visible = this.els.filter('.animate-show');
			
			this.scroll =  new _ScrollBar(this.listElement, $('> .inner', this.listElement));
  	  this.scroll.init();
			
			this.bindTo(this.listElement);
			
			this.initialized = true;
		}
	};
};

List.prototype = new DOMBoundObject("listObject", List);


function ExtendedList(listElement) {
	if (this.alreadyExist(listElement))
		return listElement.listObject;
	
	this.proto = ExtendedList;
	
	this.listElement = listElement;
	
  this.scrollHandler = function(self){
		return function(e){
			var $this = $(this),
					list = self;
			
			var scTop = e.scrollTop || 0,
					noOne = true;
			
			function checkPos() {
				var el = $(this),
						elTop = el.position().top;
				
				var ret = elTop < maxTop && elTop + el.height() > scTop;
				
				if (ret) {
					el.addClass('animate-show');
					
					noOne = false;
				}
				
				return ret || noOne;
			};
			
			if (list.lastPage.length && !list.xhr && list.lastPage.position().top < scTop)
				list.getPage(parseInt(list.lastPage.attr('class').match(/list-page-(\d+)/)[1]) + 1);
			
			if ($('ul.animated-list', $this).length) {
				var maxTop = scTop + $this.offsetParent().height();
				
				list.visible.each(function(){
					var el = $(this),
							elTop = el.position().top;
					
					if (elTop > maxTop || elTop + el.height() < scTop)
						el.removeClass('animate-show');
				});
				
				noOne = true;
				list.future().each(checkPos);
				list.past().each(checkPos);
				
				list.visible = list.els.filter('.animate-show');
			}
		}
	};
  
	var protoInit = this.init;
	
  this.init = function(){
		if (!this.initialized) {
			protoInit.call(this);
			
			$(this.listElement).on('scroll', this.scrollHandler(this));
			
			$(this.listElement).trigger('scroll');
		}
  };
};

ExtendedList.prototype = new List();
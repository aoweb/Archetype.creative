function navigation(container){
  this.container = $(container);
  this.initialized = false;
  
  var showTimeout = null;
  
  function init(){
    var _this = this;
    
    $('> *', this.container).each(function(i){
      var prev = $(this).prev(),
          prevPos = prev.length ? prev.position().left / _this.container.width() * 100 : 0;
      
      $(this).css({left: prevPos + prev.outerWidth() / _this.container.width() * 100 + '%'});
    });
    
    this.active = $('> .screen', this.container);
    
    this.offset = 0;
    
    this.xhr = null;
    
    this.initialized = true;
  };
  
  
  this.addItem = function(content, _rel, pos, _callBack, half, sectionsCount){
    if (this.xhr) {
      this.xhr.abort();
      this.xhr = null;
    }
    
    var _this = this,
        callBack = typeof _callBack == 'function' ? _callBack : function(){};
    
    function push(data){
      var item = $(data),
          rel = _rel == 'active' ? this.active.filter(pos > 0 ? ':last' : ':first') : $(_rel);
      
      var relPos = rel.position().left / this.container.width() * 100;
      
      rel[pos > 0 ? 'after' : 'before'](item);
      
      item.css({left: relPos + (pos > 0 ? rel.outerWidth() / this.container.width() * 100 : -item.outerWidth() / this.container.width() * 100) + '%'});
    }
    
    if (typeof content == "string") {
      this.xhr = $.ajax(content + '?t=' + (new Date()).getTime(), {
                    headers: {'x-Sections-Count': sectionsCount || 1},
                    success: function(data){
                              var els = $(data).filter('.screen');
                              
                              if (half)
                                els = els.filter(pos > 0 ? ':last' : ':first');
                              
                              if (pos < 0)
                                Array.prototype.reverse.call(els);
                              
                              els.each(function(){
                                push.call(_this, this);
                                
                                var list = new ExtendedList(this);
                                list.init();
                                
                                _rel = this;
                              });
                              
                              if (pos < 0)
                                Array.prototype.reverse.call(els);
                              
                              callBack(els);
                              
                              _this.xhr = null;
                            }
                });
    }/* else {
      var els = $(content).filter('.screen').show();
      els.each(function(){
        push.call(_this, this);
        
        _rel = this;
      });
      
      callBack(els);
    }*/
  };
  
  this.goTo = function(dir){
    var pos = dir;
    
    transformAnimation(this.container, pos + '%', 0);
    
    this.offset = pos;
  }
  
  this.show = function(_item){
    if(_item[0] != this.active[0]) {
      clearTimeout(showTimeout);
      
      var _this = this,
          item = $(_item),
          items = $('> *', this.container);
         
      this.goTo(-item.position().left / this.container.width() * 100);
      
      showTimeout = setTimeout(function(){
        items.not(item).hide().remove();
        
        transformAnimation(_this.container, 0, 0, 0);
        
        $(window).resize();
      }, 400);
      
      this.active = item;
    }
  }
  
  this.replace = function(_item, _rel){
    clearTimeout(showTimeout);
    
    var _this = this,
        rel = $(_rel),
        item = $(_item),
        items = $('> *', this.container);
    
    transformAnimation(item, (item.position().left - (rel.position().left + rel.outerWidth())) / (css3.transition ? item.outerWidth() : item.offsetParent().outerWidth()) * -100 + '%', 0);
    
    showTimeout = setTimeout(function(){
      items.not(item.add(rel)).hide().remove();
      
      transformAnimation(item, 0, 0, 0);
      
      $(window).resize();
    }, 400);
    
    this.active = item.add(rel);
  }
  
  init.call(this);
}
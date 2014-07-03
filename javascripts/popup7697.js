function Popup(content, relative, autoshow){
  var self = this,
      initialized = false,
      timeout = null;
  
  self.content = $(content);
  self.relative = $(relative).length ? $(relative) : self.content.parent();
  
  self.show = function(){
    clearTimeout(timeout);
    
    self.$overlay.removeClass('hide');
    self.$overlay.addClass('show');
  };
  
  self.close = function(){
    self.$overlay.addClass('hide');
    
    timeout = setTimeout(function(){
      self.$overlay.removeClass('show');
      self.$overlay.removeClass('hide');
    }, 400);
  };
  
  function init(){
    if (!initialized) {
      var pInner = $(document.createElement('div')).addClass('popup-inner');
      var pClose = $(document.createElement('a')).addClass('popup-close');
      var pop = $(document.createElement('div')).addClass('popup');
      var pCell = $(document.createElement('div')).addClass('popup-cell');
      var oInner = $(document.createElement('div')).addClass('overlay-inner');
      var overlay = $(document.createElement('div')).addClass('overlay');
      
      self.$popup = pop;
      self.$overlay = overlay;
      
      overlay.append(oInner.append(pCell.append(pop.append(pInner.append(self.content).add(pClose)))));
      self.relative.append(overlay);
      
      pClose.attr('href', '#').on('click', function(e){
        e.preventDefault();
        
        self.close();
      });
      
      if (autoshow)
        self.show();
      
      initialized = true;
    }
  };
  
  init();
};
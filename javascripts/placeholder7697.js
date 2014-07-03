function _placeholder(element){
  var $element = $(element);
  
  $element.each(function(){
    var _this = this,
        $this = $(this);
    
    if (!this.placeholder && $this.attr('placeholder')) {
      var placeholder = $this.attr('placeholder');
      
      this.placeholder = placeholder;
      
      if ($this.attr('required'))
        this.required = $this.attr('required');
      
      $this.on('change blur', function(){
        var val = $this.val();
        
        if (!val || !(/\S/).test(val))
          $this.val(_this.placeholder);
      });
      
      $this.on('focus', function(){
        if ($this.val() == _this.placeholder)
          $this.val('');
      });
      
      $(this.form).on('submit', function(e){
        var val = $this.val();
        
        if (val == _this.placeholder)
          $this.val('');
        
        if (_this.required && (!val || val == _this.placeholder)) {
          e.preventDefault();
          
          $('input, textarea', this).change();
          
          $this.focus();
          
          return false;
        }
      });
      
      $this.change();
    } 
  });
}
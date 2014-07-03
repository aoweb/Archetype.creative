(function(path){
  if (path.length) {
    path = path.replace('#', '').split('/');
    
    if (path.length)
      window.location.pathname = path.join('/');
  }
})(window.location.hash);

function initHistory(){
  window.History = [];
  
  History.backPosition = null;
  History.state = {};
  History.position = 0;
  
  History.pushState = function(data, title, path){
    
    if (this.position < this.length - 1)
      this.splice(this.position + 1, this.length - 1, {state: data, title: title, path: path});
    else
      this.push({state: data, title: title, path: path});
    
    this.state = data;
    this.position = this.length - 1;
    
    if (history && history.pushState)
      history.pushState(data, title, path);
    /*else
      window.location.hash = path;*/
  };
  
  History.replaceState = function(data, title, path, preventOriginalAction){
    this[this.position] = {state: data, title: title, path: path};
    
    this.state = data;
    
    if (!preventOriginalAction)
      if (history && history.replaceState)
        history.replaceState(data, title, path);
      /*else
        window.location.hash = path;*/
  };
  
  History.back = function(preventOriginalAction){
    if (!preventOriginalAction) {
      if (history && history.back)
        history.back();
    } else {
      this.position = Math.max(this.position - 1, 0);
      
      var point = this[this.position];
      
      this.state = point.state;
      this.backPosition = point.state.back;
    }
  };
  
  History.forward = function(preventOriginalAction){
    if (!preventOriginalAction) {
      if (history && history.forward)
        history.forward();
    } else {
      this.position = Math.min(this.position + 1, this.length - 1);
      
      var point = this[this.position];
      
      this.state = point.state;
      this.backPosition = point.state.back;
    }
  };
  
  History.go = function(to, preventOriginalAction){
    if (!preventOriginalAction) {
      if (history && history.go)
        history.go(to);
    } else {
      this.position = Math.min(Math.max(this.position + to, 0), this.length - 1);
      
      var point = this[this.position];
      
      this.state = point.state;
      this.backPosition = point.state.back;
    }
  }
  
  History.preventPopstate = false;
};
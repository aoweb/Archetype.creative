// Put your application scripts here

jQuery(function($){
  _placeholder($('input, textarea'));
  
  window.nav = new navigation('#content > .inner');
  
  $('.scroll-layout:not(.slider)').each(function(){
    var list = new ExtendedList(this);
    list.init();
  });
  
  if (/chrome/i.test(navigator.userAgent))
    $('#main-menu').css("-webkit-transform-style", "preserve-3d");
  
  initHistory();
  History.replaceState({replace: false, half: false, position: History.length, back: History.backPosition}, '', window.location.pathname);
  
  $('.screen:first a.back').addClass('can-back');
  if ($('a.close-anchor').length)
    $('a.close-screen').addClass('can-close');
  
  $('a[href="' + window.location.pathname + '"]').addClass('active');
  
  $('#content').on('click', 'a:not([href=#])', function(e){
    if ($(this).data('transition') != 'reload') {
      e.preventDefault();
      
      var href = $(this).attr('href');
      
      if (window.location.pathname != href) {
        var page = $(this).attr('href'),
            active = $('a[href="' + page + '"]'),
            screen = $(this).closest('.screen'),
            half = $(this).data('size') == 'full' ? false : screen.hasClass('half'),
            replace = $(this).data('replace') ? true : false;
        
        $('a.active').removeClass('active');
        active.addClass('active');
        
        var dir = page == '.main' ? -1 : 1;
        replace = (replace || (screen.nextAll().length && half)) && $(window).width() > 767;
        
        nav.addItem(href, 'active', dir, function(item){
          if ($('a.back', screen).length && !replace && half)
            History.backPosition = History.position;
          
          History.pushState({replace: replace, half: half, position: History.position + 1, back: History.backPosition}, '', href);
          
          if (History.position > History.state.back)
            $('a.back', screen).addClass("can-back");
          
          if (replace) {
            nav.replace(item, screen);
            
            if (History.position > History.state.back && $('a.close-anchor', screen).length)
              $('a.close-screen').addClass('can-close');
          } else {
            nav.show(half ? screen.add(item) : item);
            
            $('a.close-screen').removeClass('can-close');
          }
          
          //setTimeout(function(){$('body > .layout').addClass('small-menu');}, 400);
        });
        
        
      } /*else if ($(this).data('page') && $(this).data('page') != 'mapico')
        $('body > .layout').toggleClass('small-menu');*/
    }
  });
  
  $(window).on('resize', function(){
    $('> *:visible', nav.container).each(function(i){
      var prev = $(this).prev(':visible'),
          prevPos = prev.length ? prev.position().left / nav.container.width() * 100 : 0;
      
      $(this).css({left: prevPos + prev.outerWidth() / nav.container.width() * 100 + '%'});
    });
  });
  
  $(window).on('popstate', function(e){
    if (window.history && window.history.state !== null && e.originalEvent.state !== null && window.history.state.position !== History.position)
      if (!history.preventPopstate) {
        var event = e.originalEvent,
            eventState = event.state || {position: 0, replace: false, half: false},
            dir = eventState.position < History.position ? -1 : 1,
            state = dir < 0 ? (History[eventState.position + 1].state || {position: 0, replace: false, half: false}) : eventState;
        
        var path = window.location.pathname,
            screen = nav.active.filter(dir > 0 && !state.replace ? ':last' : ':first');
        
        nav.addItem(path, 'active', state.replace ? 1 : dir, function(item){
          var active = $('a[href="' + path + '"]');
          
          $('a.active').removeClass('active');
          active.addClass('active');
          
          if (!state.replace && state.back !== null) {
            if (state.position > state.back)
              $('a.back', dir < 0 ? item : screen).eq(0).addClass("can-back");
            
            if (state.position <= state.back + 1)
              $('a.back', dir > 0 ? item : screen).eq(0).removeClass("can-back");
          }
          
          if ($('a.close-anchor', screen.add(item)).length)
              $('a.close-screen', screen.add(item)).addClass("can-close");
          
          if (state.replace  && $(window).width() > 767)
            nav.replace(item, screen);
          else
            nav.show(state.half ? screen.add(item) : item);
          
          setTimeout(function(){$('body > .layout').addClass('small-menu');}, 400);
        }, state.half, dir < 0 && !state.replace ? 2 : 1);
      
        History.go(eventState.position - History.position, true);
      }
  });
  
  $('body').on('click', 'a.back, a.close-screen', function(e){
    e.preventDefault();
  });
  
  $('body').on('click', 'a.can-back, a.close-anchor', function(e){
    e.preventDefault();
    
    if (History.state.back !== null) {
      var to = History.state.back - History.position;
      
      if (to < 0)
        History.go(to);
      
      $(this).removeClass('can-back active');
    } else {
      var dir = e.dir || -1,
          replace = e.replace || false,
          half = e.half || false;
    
      nav.addItem('/best-of-newyork', 'active', dir, function(item){
        History.pushState({replace: replace, half: half, position: History.position + 1, back: History.backPosition}, '', '/best-of-newyork');
        
        var screen = nav.active.filter(dir > 0 && !replace ? ':last' : ':first');
        var item = half ? item.filter(dir > 0 ? ':last' : ':first') : item;
        
        if (replace  && $(window).width() > 767)
          nav.replace(item, screen);
        else
          nav.show(half ? screen.add(item) : item);
      });
    }
  });
  
  $('body').on('click', 'a.can-close', function(e){
    e.preventDefault();
    
    var click = $.Event('click');
    
    if (History.state.back == null) {
      click.replace = true;
      click.half = true;
      click.dir = 1;
    }
    
    $('a.close-anchor').trigger(click);
  });
  
  $('body').on('click', 'a.button.fbico', function(e){
    e.preventDefault();
    
    var url = $(this).data('url') ? "http://" + location.host + $(this).data('url') : location.href;
    
    window.open(
      "https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url), 
      "facebook-share-dialog", 
      "width=626,height=436");
  });
  
  $('body').on('click', 'a.button.twitterico', function(e){
    e.preventDefault();
    
    var url = $(this).data('url') ? "http://" + location.host + $(this).data('url') : location.href;
    
    window.open(
      "https://twitter.com/intent/tweet?" + 
        "via=TriplAgent" + 
        "&text=" + 
          encodeURIComponent($(this).data('title') + ' -') +
        "&url="+encodeURIComponent(url), 
      "", 
      "width=626,height=436"
     );
  });
})
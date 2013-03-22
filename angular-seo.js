angular.module('seo', []).run(function($rootScope) {
  $rootScope.htmlReady = function() {
    $rootScope.$evalAsync(function() {
      setTimeout(function() {
        var evt = document.createEvent('Event');
        evt.initEvent('_htmlReady', true, true);
        document.dispatchEvent(evt);
      }, 0);
    });
  };
});
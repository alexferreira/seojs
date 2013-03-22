var system = require('system')
  , args = system.args
  , os = require('system').os;

if (args.length < 3) {
  console.log("Missing arguments.");
  phantom.exit();
}

var server = require('webserver').create();
var port = parseInt(args[1]) || 8888;
var urlPrefix = args[2];
var noEscape = args[3] || false;

var parse_qs = function(s) {
  var queryString = {};
  var a = document.createElement("a");
  a.href = s;
  a.search.replace(
    /([^?=&]+)(=([^&]*))?/g,
    function($0, $1, $2, $3) { queryString[$1] = $3; }
  );
  return queryString;
};

var renderHtml = function(url, cb) {
  var page = require('webpage').create();
  page.settings.loadImages = false;
  page.settings.localToRemoteUrlAccessEnabled = true;
  page.onInitialized = function() {
    page.evaluate(function() {
      document.addEventListener('_htmlReady', function() {
        window.callPhantom();
      }, false);
    });
  };
  page.onCallback = function() {
    page_content = noEscape ? page.content.replace(/#!/g, '') : page.content.replace(/#!/g, '/?_escaped_fragment_=');
    cb(page_content);
    page.close();
  };
  // page.onConsoleMessage = function(msg) {
    // console.log('CONSOLE: ' + msg);
  // };
  page.open(url);
};

server.listen(port, function (request, response) {
  var route, url;
  if(noEscape){
    url = urlPrefix + '#!' + request.url;
  } else {
    route = parse_qs(request.url)._escaped_fragment_;
    url = urlPrefix + request.url.slice(1, request.url.indexOf('?')) + '#!' + route;
  }
  renderHtml(url, function(html) {
    response.statusCode = 200;
    response.write(html);
    response.close();
  });
});

console.log('Listening on ' + port + ' OS: '+os.name + ' '+ os.version + ' ' + os.architecture);
console.log('Press Ctrl+C to stop.');

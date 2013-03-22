# Ajax-SEO

SEO for AngularJS apps made easy

## Requirements

You will need [PhantomJS](http://phantomjs.org/) to make this work, as it will render the application to HTML.


## Modifying your static HTML


Just add this to your `<head>` to enable AJAX indexing by the crawlers.
```
    <meta name="fragment" content="!" />
```
## EmberJs

Just add this to your `didInsertElement` the event to view in `ApplicationView`
```
var App.ApplicationView = Ember.View.extend({
  didInsertElement: function() {
    var evt = document.createEvent('Event');
    evt.initEvent('_htmlReady', true, true);
    document.dispatchEvent(evt);
  }
});
```
## AngularJS Module

Just include `ajax-seo.js` and then add the `seo` module to you app:
```
angular.module('app', ['ng', 'seo']);
```

Then you must call `$scope.htmlReady()` when you think the page is complete. This is nescessary because of the async nature of AngularJS (such as with AJAX calls).
```
function MyCtrl($scope) {
    Items.query({}, function(items) {
        $scope.items = items;
        $scope.htmlReady();
    });
}
```

And that's all there is to do on the app side.


## PhantomJS Module

For the app to be properly rendered, you will need to run the `seo-server-phantom.js` with PhantomJS.
Make sure to disable caching:
```
$ phantomjs --disk-cache=no seo-server-phantom.js [port] [URL prefix] [no Escape]
```

`URL prefix` is the URL that will be prepended to the path the crawlers will try to get.

Some examples:
```
$ phantomjs --disk-cache=no seo-server-phantom.js 8888 http://localhost:3000
$ phantomjs --disk-cache=no seo-server-phantom.js 8888 file:///full/path/to/index.html
```


## Testing

So say you app is running on `http://localhost:3000/` (works with `file://` URLs too).
First, run PhantomJS:

### With Escaped Fragment

Google and Bing replace `#!` (hashbang) with `?_escaped_fragment_=` so `htttp://localhost/#!/profile` becomes `htttp://localhost/?_escaped_fragment_=/profile`.

```
$ phantomjs --disk-cache=no seo-server-phantom.js 8888 http://localhost:3000/
Listening on 8888 OS: mac 10.8 (Mountain Lion) 32bit
Press Ctrl+C to stop.
```

Then try with cURL:
```
$ curl 'http://localhost:8888/?_escaped_fragment_=/profile'
```

Then try with Browser:
```
$ open 'http://localhost:8888/?_escaped_fragment_=/profile'
```


### Without Escaped Fragment
```
$ phantomjs --disk-cache=no seo-server-phantom.js 8888 http://localhost:3000/ --no-scape
Listening on 8888 OS: mac 10.8 (Mountain Lion) 32bit
Press Ctrl+C to stop.
```

Then try with cURL:
```
$ curl 'http://localhost:8888/profile'
```

Then try with Browser:
```
$ open 'http://localhost:8888/profile'
```




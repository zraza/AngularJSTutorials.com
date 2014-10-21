'use strict';
var YT = YT || {};
angular.module('zanbeelx', [])
    .run(function() {
        
    })
    .directive('youtube', ['youtubePlayer',
        function(youtubePlayer) {
            //alert('xxx');
            var tag = document.createElement('script');
            tag.src = 'http://www.youtube.com/iframe_api';
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var width = element[0].offsetWidth;
                    youtubePlayer.setDimension(width,parseInt(width*3/4,10)).init(attrs.id);
                    var _callBacks = {}; //attrs.events;
                    if (attrs.onReady) {
                        _callBacks.onReady = scope[attrs.onReady];
                    }
                    if (attrs.onStateChange) {
                        _callBacks.onStateChange = scope[attrs.onStateChange];
                    }
                    if (attrs.onError) {
                        _callBacks.onError = scope[attrs.onError];
                    }
                    youtubePlayer.setCallbacks(_callBacks);
                    scope.$on('$destroy', function() {
                        youtubePlayer.destroy();
                    });

                }
            };
        }
    ])
    .factory('youtubePlayer', function($window, $rootScope, $log) {
        var _api = {};
        var _ready = false;
        var _objPlayer = null;
        var _playerHolder = false;
        var _intWidth = null;
        var _intHeight = null;

        var _callBacks = {
            onReady: function() {
                $log.info('Youtube ready');
            },
            onError: function() {
                $log.info('Youtube error');
            },
            onStateChange: function() {
                $log.info('Youtube API state changed');
            }
        };

        var _setHolder = function(obj) {
            _playerHolder = obj;
        };
        var _setCallbacks = function(callBacks) {
            _callBacks = callBacks;
        };
        var _destroy = function() {
            if (_objPlayer !== null) {
                _objPlayer.destroy();
                _objPlayer = null;
            }
        };
        var _getPlayer = function() {
            return _objPlayer;
        };
        var _initPlayer = function() {
            _intWidth = _intWidth || document.getElementById(_playerHolder).offsetWidth;
            _intHeight = _intHeight || document.getElementById(_playerHolder).offsetHeight;
            _objPlayer = new YT.Player(_playerHolder, {
                height: _intHeight,
                width: _intWidth,
                playerVars: {
                    fs: 1,
                    rel: 0,
                    controls: 1,
                    html5: 1,
                    version: 3,
                    iv_load_policy: 3,
                    autohide: 1,
                    modestbranding: 1,
                    showinfo: 0,
                    enablejsapi: 1
                },
                events: _callBacks

            });
        };
        $window.onYouTubeIframeAPIReady = function() {
            $log.info('Youtube API is ready');
            _ready = true;
            _initPlayer();
        };

        var _setDimension = function(width,height){
            _intWidth = width;
            _intHeight = height;
            return _api;
        };
        var _init = function(obj) {
            if (_ready) {
                $window.onYouTubeIframeAPIReady();
            } else {
                _setHolder(obj);
            }

        };

        _api.init = _init;
        _api.setHolder = _setHolder;
        _api.setDimension = _setDimension;
        _api.setCallbacks = _setCallbacks;
        _api.destroy = _destroy;
        _api.getPlayer = _getPlayer;
        return _api;
    });

angular.module('app.default', ['zanbeel'])
   .config(function($stateProvider, $urlRouterProvider) {
      'use strict';

      $urlRouterProvider.otherwise('/404');

      $stateProvider
         .state('404', {
            url: '/404',
            templateUrl: '/app/modules/default/views/404.html',
            controller: 'ErrorCtrl',
         }).state('home', {
            url: '/',
            templateUrl: '/app/modules/default/views/home.html',
            controller: 'ListCtrl',
            pageTitle:' AngularJS Tutorials'
         })
         .state('list-videos', {
            url: '/list',
            templateUrl: '/app/modules/default/views/list.html',
            controller: 'ListCtrl'
         }).state('list-articles', {
            url: '/list',
            templateUrl: '/app/modules/default/views/list.html',
            controller: 'ListCtrl'
         }).state('list-modules', {
            url: '/list',
            templateUrl: '/app/modules/default/views/list.html',
            controller: 'ListCtrl'
         }).state('detail', {
            url: '/:id/:slug',
            templateUrl: '/app/modules/default/views/detail.html',
            controller: 'DetailCtrl'
         });

   });

angular.module('app.default').directive('itemList',
   function() {
      return {
         restrict: 'A',
         scope: {
            items: '=items'
         },
         link: function(scope, element, attrs) {},
         controller: function($scope, Slug) {
            $scope.slug = function(title) {
               return Slug.slugify(title);
            };
         },
         templateUrl: '/app/modules/default/directives/views/list.html'

      };
   }
);

angular.module('app.default')
	.controller('ListCtrl', function($scope,$http) {
		'use strict';

		$http.get('/assets/data/sessions.json').then(function(res){
			$scope.items = res.data;
		});

	});

angular.module('app.default')
	.controller('ErrorCtrl', function() {
		'use strict';

	}).directive('backButton', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    $window.history.back();
                });
            }
        };
    }]);

angular.module('app.default')
	.controller('DetailCtrl', function($scope,$http,Slug) {
		'use strict';

		$http.get('/assets/data/sessions.json').then(function(res){
			$scope.item = res.data[0];
			$rootScope.appPageTitle = $scope.item.title;
		});

		$scope.slug = function(title){
			return Slug.slugify(title);
		};


	});

angular.module('app', [
   'ui.router',
   'app.default',
   'zanbeel',
   'slugifier',
   'ngAnimate'
]).config(function($locationProvider /*, $provide*/ ) {
   'use strict';

   $locationProvider.html5Mode({
   enabled: true,
   requireBase: false
   });



}).run(function($rootScope) {
   'use strict';
   // This can be change in controller
   $rootScope.appPageTitle = 'App Title';
   // This will get page title from the defined routs
   $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) {

      if (toState.pageTitle !== '') {
         $rootScope.appPageTitle = toState.pageTitle;
      }
      // if (current.hasOwnProperty('$$route') && current.$$route.pageTitle) {
      //     $rootScope.appPageTitle = current.$$route.pageTitle;
      // }
   });

});

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/app/modules/default/views/404.html',
    'Page not found :)');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/app/modules/default/views/a.html',
    '<section class="introduction"><div class="introduction-inner"><div class="search"><h4>Learn to AngularJS to make Apps, Websites, and much more...</h4><div class="input-group"><input autofocus placeholder="What do you want to learn today?" class="form-control"> <span class="input-group-btn"><button class="btn btn-primary" type="button"><i class="icon-search"></i></button></span></div></div><div class="actions"><button class="btn btn-primary btn-lg btn-raised" type="button">Random Resource</button> <button class="btn btn-default btn-lg btn-raised" type="button">Submit a Resource</button></div></div></section><section id="listing"><ul><li ng-repeat="item in items"><a class="favourite" href="#"><span>53</span><i class="icon-heart"></i></a> <img src="http://i4.ytimg.com/vi/{{item.thumbnail}}/0.jpg"><div class="detail"><h3>{{item.title}}</h3><p>{{item.summery}}</p><ul class="speakers"><li ng-repeat="speaker in item.speakers"><img ng-src="{{speaker.avatar}}"> {{speaker.name}}</li></ul><ul class="tags"><li ng-repeat="item in item.topics">{{item}}</li></ul></div></li></ul></section>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/app/modules/default/views/b.html',
    '<div youtube></div>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>ssssb<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>b<br>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/app/modules/default/views/detail.html',
    '<div class="page-title"><a href="#" back-button><i class="icon-left-open-big"></i></a><h3>{{item.title}}</h3></div><section class="listing"><ul><li><div class="video-player"><iframe width="100%" height="100%" src="//www.youtube.com/embed/QETUuZ27N0w" frameborder="0" allowfullscreen></iframe></div><div class="item-detail video-detail"><p>{{item.detail}}</p><ul class="speakers"><li ng-repeat="speaker in item.speakers"><img ng-src="{{speaker.avatar}}">{{speaker.name}}</li></ul><ul class="tags"><li ng-repeat="item in item.topics">{{item}}</li></ul></div></li></ul><div id="disqus_thread" class="mt">xxx</div><script type="text/javascript">/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\n' +
    '    var disqus_shortname = \'pakistanistage\'; // required: replace example with your forum shortname\n' +
    '\n' +
    '    /* * * DON\'T EDIT BELOW THIS LINE * * */\n' +
    '    (function() {\n' +
    '        var dsq = document.createElement(\'script\'); dsq.type = \'text/javascript\'; dsq.async = true;\n' +
    '        dsq.src = \'http://\' + disqus_shortname + \'.disqus.com/embed.js\';\n' +
    '        (document.getElementsByTagName(\'head\')[0] || document.getElementsByTagName(\'body\')[0]).appendChild(dsq);\n' +
    '    })();</script></section>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/app/modules/default/views/home.html',
    '<section class="introduction"><div class="introduction-inner"><div class="search"><h3>Learn AngularJS to make Apps and Websites.</h3><h4>Hand picked Angular resources available on the Internet for beginner to experts.</h4><div class="input-group"><input autofocus placeholder="What do you want to learn today?" class="form-control"> <span class="input-group-btn"><button class="btn btn-primary" type="button"><i class="icon-search"></i></button></span></div></div><div class="actions"><button class="btn btn-primary btn-lg btn-raised" type="button">Random Resource</button> <button class="btn btn-default btn-lg btn-raised" type="button">Submit a Resource</button></div></div></section><section class="listing home" item-list items="items|limitTo:4" style="z-index:10"></section>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/app/modules/default/views/list.html',
    '<div class="page-title"><a href="#" back-button><i class="icon-left-open-big"></i></a><h3>{{item.title}}</h3><span>Showing 1-30 of 100</span></div><section class="listing" item-list items="items|limitTo:20"></section>');
}]);
})();

(function(module) {
try {
  module = angular.module('app');
} catch (e) {
  module = angular.module('app', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/app/modules/default/directives/views/list.html',
    '<ul><li ng-repeat="item in items"><a class="favourite" href="#"><i class="icon-heart"></i></a> <img ng-src="http://i4.ytimg.com/vi/{{item.thumbnail}}/0.jpg"><div class="item-detail"><a ui-sref="detail({id:item.id,slug:slug(item.title)})"><h3>{{item.title}}</h3><p>{{item.summery}}</p></a><ul class="speakers"><li ng-repeat="speaker in item.speakers"><a href="#"><img ng-src="{{speaker.avatar}}">{{speaker.name}}</a></li></ul><ul class="tags"><li ng-repeat="item in item.topics"><a href="#">{{item}}</a></li></ul></div></li></ul>');
}]);
})();

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

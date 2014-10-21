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

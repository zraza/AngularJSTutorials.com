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

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

angular.module('app.default')
	.controller('ListCtrl', function($scope,$http) {
		'use strict';

		$http.get('/assets/data/sessions.json').then(function(res){
			$scope.items = res.data;
		});

	});

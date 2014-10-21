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

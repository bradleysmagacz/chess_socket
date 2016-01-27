angular.module('chess').config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/chess', {
    templateUrl: 'chess/views/chess.client.view.html'
  }).otherwise({
    redirectTo: '/'
  });
}]);
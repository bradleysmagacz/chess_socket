var mainApplicationModuleName = 'chess_app';

var mainApplicationModule = angular.module(mainApplicationModuleName, [
	'ngResource', 
	'ngRoute', 
	'users',
	'index',
	'account',
	'chess'
]);

angular.element(document).ready(function() {
  angular.bootstrap(document, [mainApplicationModuleName]);
});

mainApplicationModule.config(['$locationProvider', 
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

if (window.location.hash === '#_=_') {
	window.location.hash = '#!';
}


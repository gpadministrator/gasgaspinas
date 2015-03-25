'use strict';

angular.module('gasgaspinas', 
    [ 'ngRoute',
      'ui.grid',
      'gasgaspinas.controllers'
      /*'gasgaspinas.filters', 'gasgaspinas.services', 'gasgaspinas.directives'*/]).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'graphs',
        controller: 'IndexCtrl'
      }).
      when('/users', {
        templateUrl: 'users',
        controller: 'UsersCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);
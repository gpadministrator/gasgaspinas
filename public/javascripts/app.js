'use strict';

angular.module('gasgaspinas', 
    [
      'ui.bootstrap',
      'ui.grid',
      'gasgaspinas.controllers',
      'gasgaspinas.services'
      /*'gasgaspinas.filters', 'gasgaspinas.services', 'gasgaspinas.directives'*/]).
  config(['$locationProvider', function($locationProvider) {
  }]);
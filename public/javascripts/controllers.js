'use strict';

angular.module('gasgaspinas.controllers', []).
  controller('AppCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    });

  }).
  controller('UsersCtrl', function ($scope, $http) {
    $scope.vehicles = [];/*= {
      columnDefs: [
        { field: 'vehicle_name', displayName: 'Name' },
        { field: 'vehicle_type', displayName: 'Type' },
        { field: 'fuel_type',    displayName: 'Fuel' },
        { field: 'brand',        displayName: 'Brand' },
        { field: 'model',        displayName: 'Model' }
      ],
      data: []
    };*/
    $http.get('/api/users').
      success(function(data, status, headers, config) {
      $scope.data = data.data;
      console.log("INFO: "+ JSON.stringify($scope.data));
    });

    $scope.showUsers = function(item) {
      console.log("show users");
      $scope.display = {};
      $scope.display.name = item.info.first_name + ' ' + item.info.last_name;
      $scope.display.email = item.info.email;
      $scope.display.username = "("+item.auth.username+")";

      //vehicles
      $http.get('/api/vehicles/'+item._id).
        success(function(data, status, headers, config) {
        console.log("VEHICLES: "+JSON.stringify(data.data));
        //$scope.vehicles ={data:  data.data};  
        $scope.vehicles = data.data;  

        console.log("INFO: "+ JSON.stringify($scope.vehicles));
      });
    }


  }).
  controller('IndexCtrl', function ($scope, $http) {
    // write Ctrl here

  });
'use strict';

angular.module('gasgaspinas.controllers', []).
  controller('AppCtrl', function ($scope, $http) {
    /*session start*/
    $http.post('/api/session').
      success(function(data, status, headers, config) {
        if(data.user != undefined) {
          $scope.user = data.user;
        }
        else {
          $scope.user = "";
        }
    });
    /*session end*/

  }).
  controller("ModalCtrl", ['$scope', '$modal', function ($scope, $modalInstance, items, modalOptions) {
      $scope.data = items;
      $scope.modalOptions = modalOptions;
      $scope.ok = function () {
          $modalInstance.close($scope.data);
      };
      $scope.close = function () {
          $modalInstance.dismiss('cancel');
      };

  }]).
  controller('UsersCtrl', ['$scope', '$modal', '$http', 'uiGridConstants', 'modalService',
    function ($scope, $modal, $http, uiGridConstants, modalService) {
    /*scope initialization start*/
    $scope.vehicles = {
      columnDefs: [
        { field: 'vehicle_name', name: 'Name' },
        { field: 'vehicle_type', name: 'Type' },
        { field: 'fuel_type',    name: 'Fuel' },
        { field: 'brand',        name: 'Brand' },
        { field: 'model',        name: 'Model' },
        { name: 'Actions', 
          cellTemplate: '<center> <div class="grid-action-cell">'+
                         '<div class="btn-group btn-group-sm" role="toolbar" aria-label="...">'+
                         '<button type="button" ng-click="$event.stopPropagation(); grid.appScope.editVehicle(row.entity);" data-toggle="tooltip" data-placement="top" title="logs" class="btn btn-default" aria-label="Edit">'+
                             '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>'+
                          '</button>'+
                          '<button type="button" ng-click="$event.stopPropagation(); grid.appScope.editVehicle(row.entity);" data-toggle="tooltip" data-placement="top" title="edit" class="btn btn-default" aria-label="Edit">'+
                             '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>'+
                          '</button>'+
                          '<button type="button" ng-click="$event.stopPropagation(); grid.appScope.deleteVehicle(row.entity);" data-toggle="tooltip" data-placement="top" title="delete vehicle" class="btn btn-default" aria-label="Edit">'+
                             '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>'+
                          '</button>'+
                        '</div></div></center>'
        }
      ],
      enableHorizontalScrollbar:  uiGridConstants.scrollbars.NEVER, 
      enableVerticalScrollbar:  uiGridConstants.scrollbars.ALWAYS,
      data: []
    };
    $scope.load = false;
    $scope.userinitial = false;
    /*scope initialization end*/

    /*page ajax start*/
    $http.post('/api/session').
      success(function(data, status, headers, config) {
        $scope.user = data.user;
    });

    $http.get('/api/users').
      success(function(data, status, headers, config) {
      $scope.data = data.data;
    });
    /*page ajax end*/

    /*scope functions start*/
    $scope.deleteVehicle = function(item) {

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Delete Vehicle',
            headerText: 'Delete ' + item.brand + ' ' + item.model + ' ' + item.vehicle_name + '?',
            bodyText: 'Are you sure you want to delete this customer?'
        };

        modalService.showModal({}, modalOptions).then(function (result) {
            $http.delete('/api/vehicles/'+item._id).
              success(function(data, status, headers, config) {
                $scope.loadUserVehicles(item.user_id);
            }); 
        });
    };

    $scope.editVehicle = function(item) {

      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Edit Vehicle',
        headerText: 'Edit ' + item.brand + ' ' + item.model + ' ' + item.vehicle_name + '?',
        bodyText: ''
      };
      var modalInstance = $modal.open({
          templateUrl: '/views/uservehicle.html',
          controller: 'ModalInstanceCtrl',
          size: 'sm',
          resolve: {
            items: function () {
              return angular.copy(item);
            },
            modalOptions: function() {
              return modalOptions;
            }
          }
        });

        modalInstance.result.then(function (modifiedItems) {
            delete modifiedItems._id;
          console.log("MODIFIED ITEMS: "+JSON.stringify(modifiedItems));

            $http.put('/api/vehicles/'+item._id, modifiedItems).
              success(function(data, status, headers, config) {
                $scope.loadUserVehicles(item.user_id);
            }).
            error(function(data, status, headers, config) {
                console.log("ERROR occurred");
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            }); 
        }, function (item) {
          console.log('Modal dismissed at: ' + new Date());
      });

    }
    $scope.showUsers = function(item, vehicles) {
      $scope.selectd = item._id;

      $scope.userinitial = true;
      console.log("show users");
      $scope.display = {};
      $scope.display.name = item.info.first_name + ' ' + item.info.last_name;
      $scope.display.email = item.info.email;
      $scope.display.username = "("+item.auth.username+")";
      $scope.display.dp = item.info.dp;

      vehicles(item._id);
    }

    $scope.loadUserVehicles = function(userid) {
      //vehicles

      $scope.load = true;
      $scope.vehicles = {data: []};
      $http.get('/api/vehicles/'+userid).
        success(function(data, status, headers, config) {
        $scope.vehicles ={data:  data.data};  
        $scope.load = false;
      }); 
    }
    /*scope functions end*/


  }]).
  controller('IndexCtrl', function ($scope, $http) {
    // write Ctrl here

  }).
  controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, modalOptions) {
    $scope.data = items;
    $scope.modalOptions = modalOptions;

    $scope.ok = function () {
      $modalInstance.close($scope.data);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss(items);
    };
});
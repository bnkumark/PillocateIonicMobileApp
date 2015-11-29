var myApp = angular.module('TrackOrderModule', [])
.controller('TrackOrderCtrl', ['$scope', 'config', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope, $config, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
    console.log('TrackOrderCtrl called');
    $scope.data = {
        "trackingId": '',
        "status": ''
    };

    $scope.getOrderDetails = function () {

        $ionicLoading.show({
            template: 'Getting Order details...'
        });

        $http.get($config.serverUrl + "webservice/showOrderCollectionDetails?trackingId=" + $scope.data.trackingId)
                      .success(function (data) {
                          $ionicLoading.hide();
                          console.log('order details fetched:' + data);
                          if (data != -2) {
                              $OrderDetailsService.setorderDetails(data);
                              $OrderDetailsService.setOrderMessage('Your order details!');
                              $state.go('app.ordercompletion');
                              $scope.data.status = "";
                          } else {
                              $scope.data.status = "Invalid Tracking Id";
                          }
                      })
                      .error(function (data) {
                          $ionicLoading.hide();
                          $CheckNetwork.check();
                      });

    }
}])
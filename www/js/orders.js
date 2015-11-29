var myApp = angular.module('ordersModule', [])
.controller('ordersCtrl', ['$scope', 'config', '$http', 'OrderDetailsService', '$state', 'CheckNetwork', function ($scope, $config, $http, $OrderDetailsService, $state, $CheckNetwork) {
    console.log("ordersCtrl");

    $scope.orders = $OrderDetailsService.getOrders();
    console.log("orders:" + $scope.orders);

    $scope.orderSelected = function (trackingId) {

        $http.get($config.serverUrl + "webservice/showOrderCollectionDetails?trackingId=" + trackingId)
            .success(function (data) {
                console.log('order details fetched:' + data);
                if (data != -2) {
                    $OrderDetailsService.setorderDetails(data);
                    $OrderDetailsService.setOrderMessage('Your order details!');
                    //$OrderDetailsService.setScreen('orderCompletion');
                    $state.go('app.ordercompletion');
                    return "";
                } else {
                    return "Invalid Tracking Id";
                }
            })
            .error(function (data) {
                $CheckNetwork.check();
            });

    }
}])
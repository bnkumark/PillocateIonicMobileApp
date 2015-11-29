var myApp = angular.module('OrderCompletionModule', [])
.controller('OrderCompletionCtrl', ['$scope', 'config', '$http', 'SelectedValues', '$ionicHistory', 'SelectedStore', 'OrderDetailsService', '$state', 'CheckNetwork', '$ionicLoading', function ($scope, $config, $http, $SelectedValues, $ionicHistory, $SelectedStore, $OrderDetailsService, $state, $CheckNetwork, $ionicLoading) {
    $ionicHistory.clearHistory();
    if ($OrderDetailsService.getReload() == false) {
        $state.go($state.current, {}, {
            reload: true
        });
        $OrderDetailsService.setReload(true);
        console.log('reloading order complete');
    } else {
        console.log('normally loading the order complete');
        $OrderDetailsService.setReload(false);
    }

    $scope.data = {
        "trackingId": '',
        "orderDetails": $OrderDetailsService.getorderDetails(),
        "cancelSuccess": '',
        "orderSuccess": $OrderDetailsService.getOrderMessage(),
        "enableCancel": false
    };

    $scope.goHome = function () {
        $state.go('app.home');
    };

    $scope.getStatusText = function (data) {
        console.log("getstatustext called with:" + data);
        if (data == "0") {
            $scope.data.disableCancel = true;
            return "Order Cancelled";
        }
        if (data == "1")
            return "Placed (Yet to be accepted)";

        if (data == "2")
            return "Accepted";

        if (data == "3")
            return "Dispatched";

        if (data == "4")
            return "Delivered";

        return '';
    };

    $scope.cancelOrder = function (trackingId) {

        $ionicLoading.show({
            template: 'Cancelling Order...'
        });


        var confirmed = confirm("Confirm cancel. Cancellation CANNOT be undone!");

        if (confirmed == true) {

            $http.get($config.serverUrl + "webservice/cancelOrder?trackingId=" + trackingId)
                .success(function (data) {
                    $ionicLoading.hide();
                    if (data == 'Success') {
                        for (i = 0; i < $scope.data.orderDetails.orderDetailsList.length; i++) {
                            $scope.data.orderDetails.orderDetailsList[i].orderStatus = "0";
                        }
                        $scope.data.disableCancel = true;
                        $scope.data.cancelSuccess = 'Your Order has been cancelled successfully!';
                    }
                    else {
                        $scope.data.cancelSuccess = data;
                        $scope.data.orderSuccess = '';
                    }
                    $scope.data.orderSuccess = '';
                    console.log('order cancelled:' + data);
                })
                .error(function (data) {
                    $ionicLoading.hide();
                    $CheckNetwork.check();
                    alert("There was some problem:" + data);

                });
        }

    };

}])
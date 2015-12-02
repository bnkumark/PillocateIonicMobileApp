var myApp = angular.module('BuyNowModule', [])
.controller('BuyNowCtrl', ['$scope', 'config', '$http', 'SelectedValues', 'SelectedStore', '$state', 'OrderDetailsService', '$ionicLoading', function ($scope, $config, $http, $SelectedValues, $SelectedStore, $state, $OrderDetailsService, $ionicLoading) {
    $scope.data = {
        message: '',
        items: $SelectedValues.getItems(),
        message2: '',
        totalprice: $SelectedValues.getTotalPrice()
    };


    $http.post($config.serverUrl + "webservice/checkAuthentication")
                        .success(function (data) {
                            alert('success: ' + data);
                        })
                        .error(function (data) {
                            alert('error: ' + data);
                        })

    //var req2 = {
    //    method: 'POST',
    //    url: 'http://demo.pillocate.com/webservice/getUserDetails()',
    //    headers: {
    //        'Content-Type': 'application/x-www-form-urlencoded'
    //    },
    //    withCredential: true
    //}

    //$http(req2).then(function (response) { alert('success' + response.data); }, function (response) { alert('failed' + response.data); });

    //// $scope.order.prescriptionChoice = 'A';

    $scope.$watch(function () {
        return $SelectedValues.getItems();
    }, function (value) {
        $scope.items = value;
    });

    function destroy(item) {
        var items = $SelectedValues.getItems();
        for (i = 0; i < items.length; i++) {
            if (items[i].inventoryid == item.inventoryid) {
                $SelectedValues.removeItems(items[i]);
            }
        }
        $scope.data.totalprice = $SelectedValues.getTotalPrice();
    }

    $scope.quantityChanged = function (item) {
        if (item.quantity > 0) {
            console.log("calling updateItem with:" + item.inventoryid + ":" + item.quantity);
            $SelectedValues.updateItem(item.inventoryid, item.quantity);
            $scope.data.message = '';
        }
        $scope.data.totalprice = $SelectedValues.getTotalPrice();
    }

    $scope.increaseQuantity = function (item) {
        // if (item.quantity > 0) {
        console.log("calling updateItem with:" + item.inventoryid + ":" + item.quantity);
        $SelectedValues.updateItem(item.inventoryid, item.quantity + 1);
        $scope.data.message = '';
        // }
        $scope.data.totalprice = $SelectedValues.getTotalPrice();
    }

    $scope.decreaseQuantity = function (item) {
        if (item.quantity > 1) {
            console.log("calling updateItem with:" + item.inventoryid + ":" + item.quantity);
            $SelectedValues.updateItem(item.inventoryid, item.quantity - 1);
            $scope.data.message = '';
        }
        else {
            destroy(item);
        }
        $scope.data.totalprice = $SelectedValues.getTotalPrice();
    }

    $scope.showSellerDetails = function () {
        var goAhead = true;
        for (i = 0; i < $scope.items.length; i++) {
            console.log("$scope.items[i].quantity:" + $scope.items[i].quantity);
            if ($scope.items[i].quantity <= 0 || $scope.items[i].quantity === undefined) {
                goAhead = false;
            }
        }

        if (goAhead == true) {
            $state.go('app.sellerdetails');
        } else {
            $scope.data.message = "Quantity should be greater than 0 for all items";
        }

    }
}])//end
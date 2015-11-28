var myApp = angular.module('selectaddressModule', [])
.controller('selectaddressCtrl', ['$scope', 'config', '$http', 'OrderDetailsService', '$state', 'CheckNetwork', function ($scope, $config, $http, $OrderDetailsService, $state, $CheckNetwork) {
    console.log("selectaddressCtrl");

    $scope.addresses = $OrderDetailsService.getAllAddressKey();
    console.log("addresses:" + $scope.addresses);


    $scope.addressSelected = function (address) {
        console.log("addressSelected:" + address);
        $OrderDetailsService.setaddressName(address);
        $state.go('app.orderdetails');
    }

    $scope.skip = function () {
        $OrderDetailsService.setaddressName('');
        $state.go('app.orderdetails');

    }
    $scope.destroy = function (address) {
        var index = $scope.addresses.indexOf(address);
        if (index > -1) {
            $scope.addresses.splice(index, 1);
        }

        $OrderDetailsService.removeAddressKey(address);
    }
}])
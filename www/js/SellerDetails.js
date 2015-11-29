var myApp = angular.module('SellerDetailsModule', [])
.controller('SellerDetailsCtrl', ['$scope', 'config', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope, $config, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
    console.log('SellerDetailsCtrl');
    $scope.data = {
        sellerChoice: 'A',
        totalprice: $SelectedValues.getTotalPrice()
    };

    $scope.choosePrescription = function () {
        $state.go('app.prescriptionchoice');
    }
}])
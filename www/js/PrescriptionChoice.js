var myApp = angular.module('PrescriptionChoiceModule', [])
.controller('PrescriptionChoiceCtrl', ['$scope', 'config', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope, $config, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
    console.log('PrescriptionChoiceCtrl');
    $scope.data = {
        prescriptionChoice: 'A',
    };

    $scope.placeorder = function () {
        if ($scope.data.prescriptionChoice == 'B') {
            if ($OrderDetailsService.getAllAddressKey().length > 0) {
                console.log('savedAddress');
                $state.go('app.selectaddress');
            }
            else {
                console.log('go to order details');
                $state.go('app.orderdetails');
            }
        } else {
            $state.go('app.uploadpage');
        }
    }
}])
//end PrescriptionChoiceCtrl
var myApp = angular.module('startModule', [])
.controller('startCtrl', ['$scope', 'config', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope, $config, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
    console.log('startCtrl');

    $scope.goToSearchMed = function () {
        $state.go('app.home');
    }
    $scope.goToUploadPrescrption = function () {
        $state.go('app.uploadpage');
    }
}])
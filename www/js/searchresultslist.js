var myApp = angular.module('searchresultslistModule', [])
.controller('searchresultslistCtrl', ['$scope', 'config', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope, $config, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
    console.log('searchresultslistCtrlcalled');
    $scope.data = {
        "search": $SelectedValues.getsearchTerm(),
        "autoSuggetions": [],
        selectedCircle: $SelectedValues.getSelectedCircle(),
        selectedCity: $SelectedValues.getSelectedCity()
    };

    $ionicLoading.show({
        template: 'Getting results...',
        hideOnStateChange: true
    });

    $http.get($config.serverUrl + "webservice/listOfBrandNameStartingWith?term=" + $scope.data.search + "&circle=" + $scope.data.selectedCircle + "&city=" + $scope.data.selectedCity)
                                .success(function (data) {
                                    $ionicLoading.hide();
                                    if (data.length > 0) {
                                        $scope.data.autoSuggetions = data.slice(0, 6);;
                                    }
                                    else {
                                        $scope.data.autoSuggetions = [{ label: $scope.data.search, id: null }]
                                    }
                                    searchGotFocus = true;
                                })
                                .error(function (data) {
                                    $ionicLoading.hide();
                                    console.log('getting auto suggestions failed');
                                    $CheckNetwork.check();
                                });

    $scope.brandSelected = function (item) {
        console.log('brandSelected method');
        $SelectedValues.setselectedBrandItem(item);
        $scope.data.search = ''; //clear the search box
        if (item.id == null) {
            console.log('item.id is null');
            $state.go('app.requestmedicine');
        } else {
            console.log('item.id is not null');
            $state.go('app.searchresults');
        }
    }
}])
var myApp = angular.module('SearchResultsModule', [])
.controller('SearchResultsCtrl', ['$scope', 'config', '$http', 'SelectedValues', '$ionicPopup', 'SelectedStore', 'CheckNetwork', '$state', '$ionicLoading', function ($scope, $config, $http, $SelectedValues, $ionicPopup, $SelectedStore, $CheckNetwork, $state, $ionicLoading) {
    console.log('searchResultsCtrl method');
    var selectedBrand = $SelectedValues.getselectedBrandItem();
    var selectedCircle = $SelectedValues.getSelectedCircle();
    var selectedCity = $SelectedValues.getSelectedCity();

    $scope.data = {
        "searchResults": [],
        //"items": [],
        "localBrand": selectedBrand.label,
        "storeId": '',
        quantity: 1,
        availabiltyFlag: '',
        message: ''
    };

    console.log($scope.data.items);

    $ionicLoading.show({
        template: 'Getting Medicine details...',
        hideOnStateChange: true
    });


    $http.get($config.serverUrl + "webservice/search?city=" + selectedCity + "&brandId=" + "&inventoryId=" + selectedBrand.id + "&brandName=" + selectedBrand.label + "&circle=" + selectedCircle)
        .success(function (data) {
            $ionicLoading.hide();
            console.log('searchResultsCtrl success');
            if (data.availabilityFlag == false) {
                console.log("Medicine not avaialble");
                $state.go('app.requestmedicine');
            }
            else {
                $scope.data.searchResults = data;
            }

        })
        .error(function (data) {
            $ionicLoading.hide();
            $CheckNetwork.check();
        });

    //Start
    $scope.storeSelected = function (item) {
        $SelectedStore.selectedStore = item;
        $SelectedStore.setselectedBrandItem($SelectedValues.getselectedBrandItem());
    }
    //end

    $scope.isDisabled = false;

    $scope.addtocart = function () {
        if ($SelectedValues.isItemPresentInCart($scope.data.searchResults.inventoryId) == false) {

            addtocartlocal();
        }
        else {
            alert("Item already there in cart!");
        }
    }

    $scope.checkout = function () {
        if ($SelectedValues.isItemPresentInCart($scope.data.searchResults.inventoryId) == false) {
            addtocartlocal();
        }
        $state.go('app.buynow');
    }

    function addtocartlocal() {


        if ($scope.data.quantity === undefined || $scope.data.quantity <= 0) {
            console.log("Quantity should be greater than 0");
            $scope.data.message = "Quantity should be greater than 0";
            return false;
        }
        else if ($scope.data.searchResults.storeId === undefined || $scope.data.searchResults.inventoryId === undefined) {
            $scope.data.message = "Something went wrong, please go back to home and search again";
            return false;
        }
        else {
            var item = {
                item: selectedBrand.label,
                quantity: $scope.data.quantity,
                storeid: $scope.data.searchResults.storeId,
                inventoryid: $scope.data.searchResults.inventoryId
            };

            $scope.count = true;
            $scope.isDisabled = true;
            $SelectedValues.setItems(item);
            $scope.data.message = "Item added to cart";
            return false;
        }
    }

}])
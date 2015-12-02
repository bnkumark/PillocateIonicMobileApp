var myApp = angular.module('homeModule', [])
.controller('HomeCtrl', ['$scope', 'config', '$http', '$state', 'SelectedValues', '$ionicHistory', '$ionicScrollDelegate', '$ionicNavBarDelegate', '$timeout', 'CheckNetwork', '$ionicPlatform', '$ionicLoading', function ($scope, $config, $http, $state, $SelectedValues, $ionicHistory, $ionicScrollDelegate, $ionicNavBarDelegate, $timeout, $CheckNetwork, $ionicPlatform, $ionicLoading) {

    // Disable BACK button on home
    /* $ionicPlatform.registerBackButtonAction(function (event) {
       if($state.current.name=="app.home"){
         var exit = confirm("Do you want to exit the app?");
         if(exit==true){
         navigator.app.exitApp();
         }
       }
       else {
         navigator.app.backHistory();
       }
     }, 100);
     
   */
    //$httpProvider.defaults.withCredentials = true;
    //$httpProvider.defaults.method = 'POST';
    //$httpProvider.defaults.headers.get = { 'Content-Type': 'application/x-www-form-urlencoded' };
    //$httpProvider.defaults.headers.Con = true;
    //var req = {
    //    method: 'POST',
    //    url: 'http://demo.pillocate.com/j_spring_security_check',
    //    headers: {
    //        'Content-Type': 'application/x-www-form-urlencoded',
    //        "Access-Control-Allow-Credentials" : true
    //    },
    //    data: 'j_username=gchandu27@gmail.com&j_password=chandu123',
    //    withCredential:true
    //}
    
    $http.post($config.serverUrl , "j_spring_security_check?j_username=gchandu27@gmail.com&j_password=chandu123")
                            .success(function (data) {
                                alert('success: ' + data);
                            })
                            .error(function (data) {
                                alert('error: ' + data);
                            })

    //$http(req).then(function (response) { alert('success' + response.data); }, function (response) { alert('failed' + response.data); });
    
  
    var circleValue = window.localStorage.getItem("circle");
    var cityValue = window.localStorage.getItem("city");
    console.log("Local circle storage state:" + circleValue + cityValue);
    if (circleValue != "true") {
        console.log("going to location page");
        $state.go('app.location');
    }
    else {
        $SelectedValues.retrieveCircleFromStorage();
    }
    if (cityValue != 'true') {
        console.log("going to location page");
        $state.go('app.location');
    }
    else {
        $SelectedValues.retrieveCityFromStorage();
    }

    $ionicHistory.clearHistory();

    var searchGotFocus = false;
    var timer;

    $scope.data = {
        "autoSuggetions": [],
        "search": '',
        "circleOptions": [],
        selectedCircle: '',
        'cityOptions': [],
        selectedCity: '',
        "localBrand": '',
        quantity: 1,
        "searchResults": [],
        "showItemSelected": false,
        message: '',
        mrp: 'NA'
    };

    $scope.$on('$ionicView.enter', function () {
        $scope.data.showItemSelected = false;
    })

    $scope.scrollToTop = function () {
        console.log('scrollToTop called');
        var el = document.querySelector("#searchbox");
        var top = el.getBoundingClientRect().top;
        var height = el.getBoundingClientRect().height;
        console.log("JS Top: " + top + "height:" + height);
        $ionicScrollDelegate.scrollTo(0, top - height, true);
    };

    $scope.clearAutoSuggestions = function () {
        if ($scope.data.autoSuggetions.length != 0) {
            $scope.data.autoSuggetions = [];
            searchGotFocus = false;
            console.log('clearing the auto suggestions');
        };
    };

    //Start of  $scope.search
    $scope.search = function () {
        var selectedCircle = $SelectedValues.getSelectedCircle();
        var selectedCity = $SelectedValues.getSelectedCity();

        console.log("selected circle:" + selectedCircle + "selected City:" + selectedCity);

        //Check for location, when the user starts typing medicine name.
        if (selectedCircle == '' && selectedCity == '') {
            alert("Please select your City & Circle to proceed!.");
            $state.go('app.location');
        }
        else if (selectedCity == '' || selectedCity === undefined) {
            alert("Please select your city to proceed!.");
            $state.go('app.location');
        }
        else if (selectedCircle == '' || selectedCircle == undefined) {
            alert("Please select your Circle to proceed!.");
            $state.go('app.location');
        }
        else {
            $timeout.cancel(timer);
            timer = $timeout(
                function () {
                    console.log('search method');
                    if ($scope.data.search != '') {

                        $http.get($config.serverUrl + "webservice/listOfBrandNameStartingWith?term=" + $scope.data.search + "&circle=" + selectedCircle + "&city=" + selectedCity)
                            .success(function (data) {
                                if (data.length > 0) {
                                    $scope.data.autoSuggetions = data.slice(0, 6);;
                                }
                                else {
                                    $scope.data.autoSuggetions = [{ label: $scope.data.search, id: null }]
                                }
                                searchGotFocus = true;
                            })
                            .error(function (data) {
                                console.log('getting auto suggestions failed');
                                $CheckNetwork.check();
                            })
                    } else {
                        $scope.data.autoSuggetions = [];
                    }
                },
                800
            );
            //Console will log 'Timer rejected!' if it is cancelled.
            timer.then(
                function () {
                    console.log("Timer resolved!" + Date());
                },
                function () {
                    console.log("Timer rejected!" + Date());
                }
            );
        }
    }
    //end of  $scope.search

    $scope.keyPressed = function (eventObject) {
        console.log("eventObject:" + eventObject);
        console.log("eventObject.which:" + eventObject.which);
        //13 is for enter key
        if (eventObject.which == 13) {
        }
    }

    //Start
    $scope.brandSelected = function (item) {

        console.log('brandSelected method');
        $SelectedValues.setselectedBrandItem(item);
        $scope.data.search = ''; //clear the search box
        $scope.data.autoSuggetions = [];

        //if (item.id == null) {
        //    console.log('item.id is null');
        //    $state.go('app.requestmedicine');
        //} else
        {
            console.log('item.id is not null');
            $ionicLoading.show({
                template: 'Getting Medicine details...',
                hideOnStateChange: true
            });

            $scope.data.localBrand = item.label;
            $scope.isDisabled = false;
            $scope.data.message = "";
            var selectedCircle = $SelectedValues.getSelectedCircle();
            var selectedCity = $SelectedValues.getSelectedCity();
            $scope.data.showItemSelected = true;
            $http.get($config.serverUrl + "webservice/search?city=" + selectedCity + "&brandId=" + item.name + "&inventoryId=" + item.name + "&brandName=" + item.label + "&circle=" + selectedCircle)
                .success(function (data) {
                    $ionicLoading.hide();

                    console.log('searchResultsCtrl success');
                    //if (data.availabilityFlag == false) {
                    //    console.log("Medicine not avaialble");
                    //    $state.go('app.requestmedicine');
                    //}
                    //else
                    {
                        if (data.mrp != null) {
                            $scope.data.mrp = data.mrp;
                        }
                        $scope.data.searchResults = data;
                    }
                })
                .error(function (data) {
                    $ionicLoading.hide();
                    $CheckNetwork.check();
                });
        }
    }

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
        $scope.data.showItemSelected = false;
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
                item: $scope.data.localBrand,
                quantity: $scope.data.quantity,
                storeid: $scope.data.searchResults.storeId,
                inventoryid: $scope.data.searchResults.inventoryId,
                mrp: $scope.data.searchResults.mrp
            };

            $scope.count = true;
            $scope.isDisabled = true;
            $SelectedValues.setItems(item);
            $scope.data.message = "Item added to cart";
            return false;
        }
    }

}]);
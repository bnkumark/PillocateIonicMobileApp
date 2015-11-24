var app = angular.module('starter.controllers', [])

//TODO: each controller can be moved to a seperate file?

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})

    //start startCtrl
.controller('startCtrl', ['$scope', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
    console.log('startCtrl');
    $scope.data = {
        //"search": $SelectedValues.getsearchTerm(),
        //"autoSuggetions": [],
        //selectedCircle: $SelectedValues.getSelectedCircle(),
        //selectedCity: $SelectedValues.getSelectedCity()
    };

    //$ionicLoading.show({
    //    template: 'Getting results...',
    //    hideOnStateChange: true
    //});



    $scope.goToSearchMed = function () {
        $state.go('app.home');
    }
    $scope.goToUploadPrescrption = function () {
        $state.go('app.uploadpage');
    }
}])
//end startCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
.controller('HomeCtrl', ['$scope', '$http', '$state', 'SelectedValues', '$ionicHistory', '$ionicScrollDelegate', '$ionicNavBarDelegate', '$timeout', 'CheckNetwork', '$ionicPlatform','$ionicLoading', function ($scope, $http, $state, $SelectedValues, $ionicHistory, $ionicScrollDelegate, $ionicNavBarDelegate, $timeout, $CheckNetwork, $ionicPlatform,$ionicLoading) {

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
     
   */  var circleValue = window.localStorage.getItem("circle");
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
        message: ''
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
                     
                        $http.get("http://localhost:8100/api/webservice/listOfBrandNameStartingWith?term=" + $scope.data.search + "&circle=" + selectedCircle + "&city=" + selectedCity)
                            .success(function (data) {
                                //console.log('setting auto suggestions ' + data);
                                if (data.length > 0) {
                                    $scope.data.autoSuggetions = data.slice(0, 6);;
                                    //$SelectedValues.setSelectedBrand(data);
                                    //$SelectedValues.setSelectedCircle(selectedCircle);
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
            //$scope.data.autoSuggetions = [];
            //$SelectedValues.setsearchTerm($scope.data.search);
            //$scope.data.search = '';
            //$state.go('app.searchresultslist');
        }
    }

    //Start
    $scope.brandSelected = function (item) {
        console.log('brandSelected method');
        $SelectedValues.setselectedBrandItem(item);
        $scope.data.search = ''; //clear the search box
        $scope.data.autoSuggetions = [];
        if (item.id == null) {
            console.log('item.id is null');
            $state.go('app.requestmedicine');
        } else {
            console.log('item.id is not null');
            // $state.go('app.searchresults');
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
            $http.get("http://localhost:8100/api/webservice/search?city=" + selectedCity + "&brandId=" + "&inventoryId=" + item.id + "&brandName=" + item.label + "&circle=" + selectedCircle)
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
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start searchresultslistCtrl
.controller('searchresultslistCtrl', ['$scope', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
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

    $http.get("http://localhost:8100/api/webservice/listOfBrandNameStartingWith?term=" + $scope.data.search + "&circle=" + $scope.data.selectedCircle + "&city=" + $scope.data.selectedCity)
                                .success(function (data) {
                                    $ionicLoading.hide();
                                    //console.log('setting auto suggestions ' + data);
                                    if (data.length > 0) {
                                        $scope.data.autoSuggetions = data.slice(0, 6);;
                                        //$SelectedValues.setSelectedBrand(data);
                                        //$SelectedValues.setSelectedCircle(selectedCircle);
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
//end searchresultslistCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start searchResultsCtrl
.controller('SearchResultsCtrl', ['$scope', '$http', 'SelectedValues', '$ionicPopup', 'SelectedStore', 'CheckNetwork', '$state', '$ionicLoading', function ($scope, $http, $SelectedValues, $ionicPopup, $SelectedStore, $CheckNetwork, $state, $ionicLoading) {
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


    $http.get("http://localhost:8100/api/webservice/search?city=" + selectedCity + "&brandId=" + "&inventoryId=" + selectedBrand.id + "&brandName=" + selectedBrand.label + "&circle=" + selectedCircle)
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
//end searchResultsCtrl

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start BuyNowCtrl
.controller('BuyNowCtrl', ['$scope', '$http', 'SelectedValues', 'SelectedStore', '$state', 'OrderDetailsService', '$ionicLoading', function ($scope, $http, $SelectedValues, $SelectedStore, $state, $OrderDetailsService, $ionicLoading) {
    $scope.data = {
        message: '',
        items: $SelectedValues.getItems(),
        message2: '',
        totalprice: $SelectedValues.getTotalPrice()
    };

    // $scope.order.prescriptionChoice = 'A';

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
            $SelectedValues.updateItem(item.inventoryid, item.quantity+1);
            $scope.data.message = '';
        // }
        $scope.data.totalprice = $SelectedValues.getTotalPrice();
    } 

    $scope.decreaseQuantity = function (item) {
        if (item.quantity > 1) {
            console.log("calling updateItem with:" + item.inventoryid + ":" + item.quantity);
            $SelectedValues.updateItem(item.inventoryid, item.quantity-1);
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

        //start SellerDetailsCtrl
.controller('SellerDetailsCtrl', ['$scope', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
    console.log('SellerDetailsCtrl');
    $scope.data = {
        sellerChoice: 'A',
        totalprice: $SelectedValues.getTotalPrice()
    };

     // $scope.choosePrescription = function () {
     //     if ($scope.data.prescriptionChoice == 'A') {
     //            if ($OrderDetailsService.getAllAddressKey().length > 0) {
     //                    console.log('savedAddress');
     //                    $state.go('app.selectaddress');
     //            }
     //            else {
     //                    console.log('go to order details');
     //                    $state.go('app.orderdetails');
     //            }
     //        } else {
     //                        //alert("choice B");
     //            $state.go('app.uploadpage');
     //        }
     //    }   

        $scope.choosePrescription = function () {
             $state.go('app.prescriptionchoice');
    }   
}])
//end SellerDetailsCtrl

        //start PrescriptionChoiceCtrl
.controller('PrescriptionChoiceCtrl', ['$scope', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
    console.log('PrescriptionChoiceCtrl');
    $scope.data = {
        prescriptionChoice: 'A',
        // totalprice: $SelectedValues.getTotalPrice()
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
                            //alert("choice B");
                $state.go('app.uploadpage');
            }
        }     
}])
//end PrescriptionChoiceCtrl

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start OrderDetailsCtrl
.controller('OrderDetailsCtrl', ['$scope', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService','ProfileService', 'CheckNetwork', '$ionicLoading', function ($scope, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $ProfileService, $CheckNetwork, $ionicLoading) {
    console.log('OrderDetailsCtrlmethod called');
    $scope.data = {
        "store": $SelectedStore.selectedStore,
        "brandName": $SelectedStore.getselectedBrandItem().label,
        "circle": $SelectedValues.getSelectedCircle(),
        "selectAddress": $OrderDetailsService.getaddressName()
    };
    /*$scope.order = {
        "quantity": 1,
        "offerstatus": ''
    };
*/
    $scope.$on('$ionicView.enter', function () {
        // Code you want executed every time view is opened
        console.log('Opened! on enter');
        $scope.data.circle = $SelectedValues.getSelectedCircle();
        console.log('Opened! on enter, $scope.data.selectAddress' + $OrderDetailsService.getaddressName());
        if ($OrderDetailsService.getaddressName() != '') {

            $scope.order = $OrderDetailsService.getAddress($OrderDetailsService.getaddressName());
            console.log("$scope.order" + $scope.order);
            // $scope.order.offerstatus = '';
            $scope.order.isTermsChecked = false;
        }
        else {
                $scope.profile = $ProfileService.getProfile();
                if($scope.profile != null)
                    $scope.order =  $scope.profile;
                else
                    $scope.order = null;
        }
    })

    //TODO hardcoding this for now
    $scope.data.store.country = 'India';

    var selectedBrand = $SelectedStore.getselectedBrandItem();
    var selectedStore = $scope.data.store;
    console.log('selected brand value in OrderDetailsCtrl:' + selectedBrand.label);
    console.log('store value in OrderDetailsCtrl:' + $scope.data.store.storename);

    $scope.submitorder = function (order) {

        if (selectedBrand.name == null) {
            selectedBrand.name = '';
            console.log('selectedBrand.name is null');
        }

        order.addressline2 = $CheckNetwork.UndefinedToEmpty(order.addressline2);
        order.offercode = $CheckNetwork.UndefinedToEmpty(order.offercode);

        var attachmentId = $SelectedValues.getAttachmentId();

        console.log('addressline2 ' + order.addressline2);

        if (order.isTermsChecked == false) {
            alert("Please accept the Terms and Conditions!");
        }
        else {

            var confirmed = confirm("Confirm the order? Order will be placed. You may get a confirmation call.");

            if (confirmed == true) {
                $ionicLoading.show({
                    template: 'Submitting Order...'
                });
                // $SelectedValues.addCartToServer();
                var cartItemsString = $SelectedValues.addItemsToServerString();

                //TODO do not hardcode contry and state
                $http.get("http://localhost:8100/api/webservice/addItemsToCartAndPlaceOrder?cartItemList=" + cartItemsString + "&circle=" + $SelectedValues.getSelectedCircle() + "&doctorname=" + order.doctorname + "&patientname=" + order.patientname + "&name=" + order.name + "&phoneNumber=" + order.phone + "&emailID=" + order.email + "&age=0" + "&addressLine1=" + order.addressline1 + "+&addressLine2=" + order.addressline2 + "&city=" + $SelectedValues.getSelectedCity() + "&state=Maharastra" + "&country=India" + "&attachmentid=" + attachmentId + "&offerCode=" + order.offercode)
                    .success(function (data) {
                        $ionicLoading.hide();
                        console.log("data:" + data);
                        console.log('data.orderDetailsList[0].trackingId:' + data.trackingId);
                        if (data == 'No items in the cart') {
                            alert("some error occured try again:" + data);
                        }
                        else {
                            if (data.trackingId != '') {
                                console.log('no errors in order');
                                $SelectedValues.emptyItems();
                                $OrderDetailsService.setorderDetails(data);
                                $OrderDetailsService.setOrderMessage('Your order has been placed!');
                                $OrderDetailsService.storeOrder(data);

                                console.log("$scope.data.selectAddress:" + $OrderDetailsService.getaddressName());
                                if ($OrderDetailsService.getaddressName() == '') {
                                    var addresses = $OrderDetailsService.getAllAddressKey();

                                    var address = prompt("Do you want to save delivery details?", "Address " + (addresses.length + 1));

                                    var itemPresent = true;

                                    while (itemPresent) {
                                        if (address != null) {
                                            if (addresses.indexOf(address) == -1) {
                                                itemPresent = false;
                                            }
                                            else {
                                                address = prompt("Address with that name already present, give another name", "Address " + (addresses.length + 1));
                                            }
                                        } else {
                                            itemPresent = false;
                                        }
                                    }

                                    if (address != null) {
                                        $OrderDetailsService.storeAddress(address, order);
                                    }
                                }

                                $state.go('app.ordercompletion');
                            } else {
                                alert("Could not submit order, please check if all fields filled properly." + data.orderDetailsList[0].errors.errors);
                            }
                            $scope.order = null;
                        }
                    })
                    .error(function (data) {
                        $ionicLoading.hide();
                        $CheckNetwork.check();
                        alert("some error occured:" + data);
                    });

            }
        }

    };

    $scope.applyOffer = function () {

        $http.get("http://localhost:8100/api/webservice/isValidOfferCode?offerCode=" + $scope.order.offercode)
            .success(function (data) {
                $scope.order.offerstatus = data;
            })
            .error(function (data) {
                $CheckNetwork.check();
                $scope.order.offerstatus = data;
            });

    }
}])    //end OrderDetailsCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start TrackOrderCtrl
.controller('TrackOrderCtrl', ['$scope', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
    console.log('TrackOrderCtrl called');
    $scope.data = {
        "trackingId": '',
        "status": ''
    };

    $scope.getOrderDetails = function () {

        $ionicLoading.show({
            template: 'Getting Order details...'
        });

        $http.get("http://localhost:8100/api/webservice/showOrderCollectionDetails?trackingId=" + $scope.data.trackingId)
                      .success(function (data) {
                          $ionicLoading.hide();
                          console.log('order details fetched:' + data);
                          if (data != -2) {
                              $OrderDetailsService.setorderDetails(data);
                              $OrderDetailsService.setOrderMessage('Your order details!');
                              //$OrderDetailsService.setScreen('orderCompletion');
                              $state.go('app.ordercompletion');
                              $scope.data.status = "";
                          } else {
                              $scope.data.status = "Invalid Tracking Id";
                          }
                      })
                      .error(function (data) {
                          $ionicLoading.hide();
                          $CheckNetwork.check();
                      });

    }
}])
    //end TrackOrderCtrl

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start OrderCompletionCtrl
.controller('OrderCompletionCtrl', ['$scope', '$http', 'SelectedValues', '$ionicHistory', 'SelectedStore', 'OrderDetailsService', '$state', 'CheckNetwork', '$ionicLoading', function ($scope, $http, $SelectedValues, $ionicHistory, $SelectedStore, $OrderDetailsService, $state, $CheckNetwork, $ionicLoading) {
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

            $http.get("http://localhost:8100/api/webservice/cancelOrder?trackingId=" + trackingId)
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
    //end OrdercompletionCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start FeedbackCtrl
.controller('FeedbackCtrl', ['$scope', '$http', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', '$state', 'CheckNetwork', function ($scope, $http, $SelectedValues, $SelectedStore, $OrderDetailsService, $state, $CheckNetwork) {

    $scope.data = {
        "feedbackstatus": ''
    };
    $scope.submitfeedback = function (feedback) {
        console.log("feedback name:" + feedback.name);

        if (feedback.message == '' || feedback.message === undefined) {
            alert("message can not be empty!");
        }
        else {
            $http.get("http://localhost:8100/api/webservice/sendFeedback?name=" + feedback.name + "&emailID=" + feedback.email + "&message=" + feedback.message)
                .success(function (data) {
                    $scope.data.feedbackstatus = data;
                    console.log('feedback submit success:' + data);
                    feedback.name = "";
                    feedback.email = "";
                    feedback.message = "";

                })
                .error(function (data) {
                    $CheckNetwork.check();
                });
        }
    }

}])
//end FeedbackCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start FooterCtrl
.controller('FooterCtrl', ['$scope', '$http', 'SelectedValues', 'SelectedStore', '$state', 'CheckNetwork', function ($scope, $http, $SelectedValues, $SelectedStore, $state, $CheckNetwork) {
    console.log("footer ctrl");
    $scope.cartItems;

    $scope.circle = $SelectedValues.getSelectedCircle();

    $scope.$watch(function () {
        return $SelectedValues.getItems().length;
    }, function (value) {
        $scope.cartItems = value;
    });

    $scope.$watch(function () {
        return $SelectedValues.getSelectedCircle();
    }, function (value) {
        $scope.circle = value;
    });


}])
//end FooterCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start ordersCtrl
.controller('ordersCtrl', ['$scope', '$http', 'OrderDetailsService', '$state', 'CheckNetwork', function ($scope, $http, $OrderDetailsService, $state, $CheckNetwork) {
    console.log("ordersCtrl");

    $scope.orders = $OrderDetailsService.getOrders();
    console.log("orders:" + $scope.orders);

    // $OrderDetailsService.getOrders(); 

    /*$scope.$watch(function() {
       return $OrderDetailsService.getOrders().length;
   }, function(value) {
       $scope.orders = value;
   });
*/
    $scope.orderSelected = function (trackingId) {

        $http.get("http://localhost:8100/api/webservice/showOrderCollectionDetails?trackingId=" + trackingId)
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
//end ordersCtrl
//start selectaddressCtrl
.controller('selectaddressCtrl', ['$scope', '$http', 'OrderDetailsService', '$state', 'CheckNetwork', function ($scope, $http, $OrderDetailsService, $state, $CheckNetwork) {
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
//end selectaddressCtrl

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start Requestmedicine
.controller('requestmedicineCtrl', ['$scope', '$http', 'SelectedValues', 'SelectedStore', '$state', 'CheckNetwork', function ($scope, $http, $SelectedValues, $SelectedStore, $state, $CheckNetwork) {

    $scope.data = {
        message: '',
        medicine: $SelectedValues.getselectedBrandItem().label
    };

    var selectedCircle = $SelectedValues.getSelectedCircle();
    console.log(selectedCircle);

    console.log('$scope.data.medicine :' + $scope.data.medicine);

    $scope.submitfeedback = function (feedback) {
        console.log(feedback.name);
        $http.get("http://localhost:8100/api/webservice/requestNewBrand?brandName=" + $scope.data.medicine + "&emailID=" + feedback.email + "&phoneNumber=" + feedback.phone + "&circle=" + selectedCircle)
            .success(function (data) {
                $scope.data.feedbackstatus = data;
                console.log('feedback submit success:' + data);
                $scope.data.message = data;
                $scope.data.medicine = '';
                feedback.email = '';
                feedback.phone = '';
            })
            .error(function (data) {
                $CheckNetwork.check();
            });
    }

}])
//end Requestmedicine

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start LoginCtrl
app.controller('LoginCtrl', ['$log', '$scope', '$state', '$http', function ($log, $scope, $state, $http) {
    $scope.signNew = function () {
        console.log("Go Worked!");
        $state.go('app.signup');
    };

    $scope.xxx = { 'user': '', 'pass': '' };

    var loadData1 = window.localStorage.getItem("data");
    console.log(loadData1);

    if (loadData1 != null) {
        $scope.xxx.user = loadData1;
        console.log($scope.xxx.user);
    };
    var loginState1 = true;
    console.log(loginState1);
    window.localStorage.setItem("login", loginState1);
    if (window.localStorage.getItem("login") == true) {
        $scope.loginState = true
    };


    $scope.loginNew = function (xxx) {

        $http.get("http://localhost:8100/api/webservice/Login?Username=" + xxx.user + "&Password=" + xxx.pass)
              .success(function () {
                  alert("Login was Successful.");
                  console.log("Login success");
                  window.localStorage.setItem("login");

              })
              .error(function () {
                  alert("Wrong Credentials!!Username or Password was Wrong.")
              });

    };
    $scope.saveUser = function (xxx) {
        console.log(xxx.user, "localstorage");
        window.localStorage.setItem("data", xxx.user);
    };



}])
//end LoginCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start SignupCtrl
.controller('SignupCtrl', ['$scope', function ($scope) {


}])
//end SignupCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start ProfileCtrl
.controller('ProfileCtrl', ['$scope', '$http', 'ProfileService', '$state', 'CheckNetwork', function ($scope, $http, $ProfileService, $state, $CheckNetwork) {

    $scope.data = {
        "profilestatus": false,
        "registerstatus": ''
    };

    $scope.$on('$ionicView.enter', function () {
        $scope.profile = $ProfileService.getProfile();
        if($scope.profile != null)
            $scope.data.profilestatus = true; 
    })


    $scope.registeruser = function (profile) {
        console.log("profile name:" + profile.name);
        //alert("Thank was Successful.");
        //window.localStorage.setItem("profile");
        $ProfileService.saveProfile(profile);   
        $scope.data.profilestatus = true; 
        $state.go('app.home');
    }
}])
//end ProfileCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start LocationCtrl
.controller('LocationCtrl', ['$scope', 'SelectedValues', '$http', 'CheckNetwork', '$state', function ($scope, $SelectedValues, $http, $CheckNetwork, $state) {

    var circleData = window.localStorage.getItem("circleData");
    var cityData = window.localStorage.getItem("cityData");

    $scope.data = {
        circleOptions: [],
        selectedCircle: circleData,
        cityOptions: [],
        selectedCity: cityData,
    };

    /*if ($scope.data.selectedCity != null) {
        console.log("scope.data.selectedCity:" + $scope.data.selectedCity);
        $SelectedValues.setSelectedCity($scope.data.selectedCity);
    }

    /*      if ($scope.data.selectedCircle != null) {
        console.log("$scope.data.selectedCircle:" + $scope.data.selectedCircle);
        //$SelectedValues.setSelectedCircle($scope.data.selectedCircle);
    }*/

    $http.get("http://localhost:8100/api/webservice/getCityArray")
        .success(function (cities) {

            console.log("getting city array:" + cities)
            $scope.data.cityOptions = cities;
            $scope.data.selectedCity = cityData;
        })
        .error(function () {
            $CheckNetwork.check();
        });

    if (cityData != null && cityData.length > 0) {
        console.log("If city selected is not empty, then get circles list!");
        //TODO this is repeat of below code
        console.log("$scope.data.selectedCity" + $scope.data.selectedCity);
        //window.localStorage.setItem("city", "true");
        $SelectedValues.setSelectedCity($scope.data.selectedCity);
        $http.get("http://localhost:8100/api/webservice/getCircleArray?city=" + $scope.data.selectedCity)
            .success(function (circles) {
                $scope.data.circleOptions = circles.circleArray;
                console.log(circles);
            })
            .error(function () {
                $CheckNetwork.check();
            });
    }

    function getCircles(city) {
        $http.get("http://localhost:8100/api/webservice/getCircleArray?city=" + city)
             .success(function (circles) {
                 $scope.data.circleOptions = circles.circleArray;
                 console.log(circles.circleArray);
             })
             .error(function () {
                 $CheckNetwork.check();
             });
    };

    $scope.citySelected = function () {
        console.log("City selected event fired!");
        console.log("$scope.data.selectedCity" + $scope.data.selectedCity);
        getCircles($scope.data.selectedCity);
    };

    $scope.circleSelected = function () {
        console.log("Circle selected event fired!");
    };

    $scope.setLocation = function () {
        if ($scope.data.selectedCity == '' || $scope.data.selectedCity === undefined || $scope.data.selectedCity == null) {
            alert("select city");
        }
        else if ($scope.data.selectedCircle == '' || $scope.data.selectedCircle === undefined || $scope.data.selectedCircle == null) {
            alert("select circle");
        }
        else {
            var items = $SelectedValues.getItems();
            var input = true;
            if (items.length > 0) {
                input = confirm("Setting location will clear cart items!");
            }

            if (input == true) {
                console.log("$scope.data.selectedCity" + $scope.data.selectedCity);

                console.log("$scope.data.setSelectedCircle" + $scope.data.selectedCircle);

                $SelectedValues.setSelectedCity($scope.data.selectedCity);
                $SelectedValues.setSelectedCircle($scope.data.selectedCircle);
                window.localStorage.setItem("circle", "true");
                window.localStorage.setItem("city", "true");
                $SelectedValues.emptyItems();
                $state.go('app.home');
            }
        }
    };
}]) //end LocationCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//start UploadpageCtrl
.controller('UploadpageCtrl', ['$scope', '$cordovaCamera', '$http', '$state', 'CheckNetwork', 'SelectedValues', 'OrderDetailsService', '$ionicLoading', function ($scope, $cordovaCamera, $http, $state, $CheckNetwork, $SelectedValues, $OrderDetailsService, $ionicLoading) {

    $scope.source = null;
    $scope.canGoToNext = false;
    
    // $scope.showSellerDetails = function () {
    //     if ($scope.canGoToNext == true) {
    //          $state.go('app.sellerdetails');
    //      }
    //      else {
    //         alert("Upload the prescription first!");
    //     }
    // }

    $scope.goToOrderDetails = function () {
        if ($scope.canGoToNext == true) {
            if ($OrderDetailsService.getAllAddressKey().length > 0) {
                $state.go('app.selectaddress');
            }
            else {
                $state.go('app.orderdetails');
            }

        } else {
            alert("Upload the prescription first!");
        }
    };

    $scope.imgUpload = function (sourceTypevalue) {
        $ionicLoading.show({
            template: 'Uploading prescription...'
        });
        document.addEventListener("deviceready", function () {
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: sourceTypevalue,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                $scope.source = imageURI;

                var fnSuccess = function (r) {
                    $ionicLoading.hide();
                    var parsedResponse = JSON.parse(r.response);

                    console.log("upload success:" + r.response);

                    $SelectedValues.setAttachmentId(parsedResponse.attachmentId);
                    $scope.canGoToNext = true;
                }

                var fnError = function (r) {
                    $ionicLoading.hide();
                    console.log("upload failed:" + r);
                    alert("upload failed:" + r);
                }

                var formURL = 'http://localhost:8100/api/webservice/uploadPrescriptionFile';
                var encodedURI = encodeURI(formURL);
                var fileURI = imageURI;
                var options = new FileUploadOptions();
                options.fileKey = "inputFile";
                options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
                //options.mimeType = "text/plain";
                var ft = new FileTransfer();
                ft.upload(fileURI, encodedURI, fnSuccess, fnError, options);

            }, function (err) {
                $ionicLoading.hide();
                // error
                alert("Sorry!No picture was selected");
            });

        }, false);

    };
}]);//end UploadpageCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start SelectValues service
//TODO: Probably we can move this to a seperate JS file
app.service('SelectedValues', function ($q, $http) {
    var selectedBrand = {};
    var selectedBrandItem = {};
    var selectedCircle = '';
    var selectedCity = '';
    var items = [];
    var attachmentId = '';
    var searchTerm = '';
    var totalprice = 0;
    return {

        retrieveCircleFromStorage: function () {
            selectedCircle = window.localStorage.getItem("circleData");
            console.log("circle data retreived from storage:" + selectedCircle);
        },

        retrieveCityFromStorage: function () {
            selectedCity = window.localStorage.getItem("cityData");
            console.log("city data retreived from storage:" + selectedCity);
        },

        /*  getSelectedBrand: function(id) {
              for (i = 0; i < selectedBrand.length; i++) {
                  if (selectedBrand[i].id == id) {
                      return selectedBrand[i];
                  }
              }
              return null;
          },
          setSelectedBrand: function(x) {
              selectedBrand = x;
          },
*/            getSelectedCircle: function () {
    return selectedCircle;
},
        setSelectedCircle: function (x) {
            console.log("setcircle:" + x);
            selectedCircle = x;
            window.localStorage.setItem("circleData", x);

        },

        getAttachmentId: function () {
            return attachmentId;
        },

        setAttachmentId: function (x) {
            console.log("set attachmentId:" + x);
            attachmentId = x;
        },

        getsearchTerm: function () {
            return searchTerm;
        },

        setsearchTerm: function (x) {
            console.log("set searchTerm :" + x);
            searchTerm = x;
        },

        getSelectedCity: function () {
            return selectedCity;
        },
        setSelectedCity: function (x) {
            console.log("setCity:" + x)
            selectedCity = x;
            window.localStorage.setItem("cityData", x);
        },
        getselectedBrandItem: function () {
            return selectedBrandItem;
        },
        setselectedBrandItem: function (x) {
            selectedBrandItem = x;
        },
        setItems: function (x) {
            items.push(x);
        },

        getItems: function () {
            console.log("get items:" + items);
            return items;
        },

        removeItems: function (x) {
            var index = items.indexOf(x);
            items.splice(index, 1);
        },

        emptyItems: function () {
            console.log("before empty items" + items.length);
            items = [];
            console.log("after empty items" + items.length);
        },

        updateItem: function (inventoryid, quantity) {
            for (i = 0; i < items.length; i++) {
                if (items[i].inventoryid == inventoryid) {
                    items[i].quantity = quantity;
                }

            }
        },

        isItemPresentInCart: function (inventoryid) {
            for (i = 0; i < items.length; i++) {
                if (items[i].inventoryid == inventoryid) {
                    return true;
                }
            }
            return false;
        },

        getTotalPrice: function () {
        totalprice = 0;
        for (i = 0; i < items.length; i++) {
            if (items[i].quantity > 0) {
                totalprice += 50*items[i].quantity;
                }
            }
        return totalprice;
        //$scope.data.totalprice = totalprice;
    },   
        addCartToServer: function () {
            var cartItemList = "[";
            for (i = 0; i < items.length; i++) {
                cartItemList = cartItemList + "{\"brandName\"\: \"" + items[i].item + "\", \"inventoryId\":\"" + items[i].inventoryid + "\", \"brandId\":\"\", \"storeId\":\"" + items[i].storeid + "\", \"quantity\":" + items[i].quantity + "},";
                console.log("making addTiItemCart" + items[i]);
            }
            cartItemList = cartItemList.substring(0, cartItemList.length - 1);
            cartItemList = cartItemList + "]'";
            console.log('cartItemList: ' + cartItemList);

            $http.get("http://localhost:8100/api/webservice/addItemsToCart?cartItemList=" + cartItemList)
                .success(function (data) {

                    console.log(data);
                })
                .error(function (data) {
                    alert("Sorry, there was in adding items to server" + data);
                    console.log("error");
                });
        },


        addItemsToServerString: function () {
            var cartItemList = "[";
            for (i = 0; i < items.length; i++) {
                cartItemList = cartItemList + "{\"brandName\"\: \"" + items[i].item + "\", \"inventoryId\":\"" + items[i].inventoryid + "\", \"brandId\":\"\", \"storeId\":\"" + items[i].storeid + "\", \"quantity\":" + items[i].quantity + "},";
                console.log("making addTiItemCart" + items[i]);
            }
            cartItemList = cartItemList.substring(0, cartItemList.length - 1);
            cartItemList = cartItemList + "]'";
            console.log('cartItemList: ' + cartItemList);

            return cartItemList;
        }



    }
})
//end SelectValues service
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start SelectStore service
//TODO: Probably we can move this to a seperate JS file
app.service('SelectedStore', function ($q) {
    var selectedBrandItem = {};
    return {
        selectedStore: '={}',
        getselectedBrandItem: function () {
            return selectedBrandItem;
        },
        setselectedBrandItem: function (x) {
            selectedBrandItem = x;
        },

    }
})
//end SelectValues service

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start SelectStore service
//TODO: Probably we can move this to a seperate JS file
//TODO change the name to utility
app.service('CheckNetwork', function ($q) {
    return {
        check: function () {
            if (window.Connection) {
                if (navigator.connection.type == Connection.NONE) {
                    console.log("No active internet connection!! Please check and try again");
                    alert("No active internet connection!!");
                }
            }
        },
        UndefinedToEmpty: function (data) {
            console.log("UndefinedToEmpty passed value:" + data);
            if (!data) {
                console.log("returned empty from UndefinedToEmpty");
                return '';
            }
            else {
                return data;
            }
        },

    }
})    //end SelectValues service

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start OrderDetailsService
//TODO: Probably we can move this to a seperate JS file
app.service('OrderDetailsService', ['CheckNetwork', '$state', '$http', function ($q, $CheckNetwork, $state, $http) {
    var orderDetails = {};
    var screen = {};
    var reloading = {};
    var message = '';
    var addressName = '';
    return {
        getorderDetails: function () {
            return orderDetails;
        },
        setorderDetails: function (x) {
            orderDetails = x;
        },

        getReload: function () {
            return reloading;
        },
        setReload: function (x) {
            reloading = x;
        },
        setOrderMessage: function (x) {
            message = x;
        },
        getOrderMessage: function () {
            return message;
        },
        setaddressName: function (x) {
            addressName = x;
        },
        getaddressName: function () {
            return addressName;
        },

        storeOrder: function (order) {

            var orders = window.localStorage.getItem("orders");

            var brandNames = '';
            for (i = 0; i < order.orderDetailsList.length; i++) {
                brandNames = brandNames + order.orderDetailsList[i].brandName;
                if (i < (order.orderDetailsList.length - 1)) {
                    brandNames = brandNames + ", ";
                }
            }

            var ordersToStore = { brandNames: brandNames, trackingId: order.trackingId };
            var ordersArray = [];
            if (orders != null) {
                var ordersArray = JSON.parse(orders);
                //if the orders list exceeds 10, delete the first item.
                if (ordersArray.length >= 10) {
                    ordersArray = ordersArray.shift();
                }
                console.log("ordersArray:" + ordersArray);
                //insert at 0 index
                ordersArray.unshift(ordersToStore);
            }
            else {
                //insert at 0 index
                ordersArray.unshift(ordersToStore);
            }
            window.localStorage.setItem("orders", JSON.stringify(ordersArray));
        },

        getOrders: function () {
            var orders = window.localStorage.getItem("orders");
            console.log("orders IN service before parse:" + orders);
            if (orders != null) {
                console.log("orders IN service after parse:" + (JSON.parse(orders)));

                return JSON.parse(orders);
            }
            else {
                return null;
            }
        },
        storeAddress: function (key, address) {
            address.isTermsChecked = false;
            key = key.replace(' ', '_');
            console.log("StoreAddress:" + "address" + key);
            window.localStorage.setItem("address" + key, JSON.stringify(address));
        },

        getAddress: function (key) {
            key = key.replace(' ', '_');
            return JSON.parse(window.localStorage.getItem("address" + key));
        },

        getAllAddressKey: function () {
            var keys = Object.keys(window.localStorage);
            var addressKeys = [];
            for (i = 0; i < keys.length; i++) {
                if (keys[i].indexOf("address") == 0) {
                    addressKeys.push(keys[i].replace("address", "").replace("_", " "));
                }
            }
            return addressKeys;
        },
        removeAddressKey: function (key) {
            window.localStorage.removeItem("address" + key.replace(" ", "_"));
        }

    }
}])
//end OrderDetailsService

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start ProfileService
//TODO: Probably we can move this to a seperate JS file
app.service('ProfileService', ['CheckNetwork', '$state', '$http', function ($q, $CheckNetwork, $state, $http) {
    return {
        saveProfile: function (profile) {
            window.localStorage.setItem("profile", JSON.stringify(profile));
        },

        getProfile: function () {
            //console.log("profile:" + JSON.parse(window.localStorage.getItem("profile")));
            return JSON.parse(window.localStorage.getItem("profile"));
        }
    }
}])
//end ProfileService
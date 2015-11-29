var app = angular.module('starter.controllers', [])

//TODO: each controller can be moved to a seperate file?

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    //$scope.loginData = {};

    // Create the login modal that we will use later
    //$ionicModal.fromTemplateUrl('templates/login.html', {
    //    scope: $scope
    //}).then(function (modal) {
    //    $scope.modal = modal;
    //});

    // Triggered in the login modal to close it
    //$scope.closeLogin = function () {
    //    $scope.modal.hide();
    //};

    // Open the login modal
    //$scope.login = function () {
    //    $scope.modal.show();
    //};

    // Perform the login action when the user submits the login form
    //$scope.doLogin = function () {
    //    console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
    //    $timeout(function () {
    //        $scope.closeLogin();
    //    }, 1000);
    //};
})

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start OrderDetailsCtrl
//.controller('OrderDetailsCtrl', ['$scope','config', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService','ProfileService', 'CheckNetwork', '$ionicLoading', function ($scope,$config, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $ProfileService, $CheckNetwork, $ionicLoading) {
//    console.log('OrderDetailsCtrlmethod called');
//    $scope.data = {
//        "store": $SelectedStore.selectedStore,
//        "brandName": $SelectedStore.getselectedBrandItem().label,
//        "circle": $SelectedValues.getSelectedCircle(),
//        "selectAddress": $OrderDetailsService.getaddressName()
//    };

//    $scope.$on('$ionicView.enter', function () {
//        // Code you want executed every time view is opened
//        console.log('Opened! on enter');
//        $scope.data.circle = $SelectedValues.getSelectedCircle();
//        console.log('Opened! on enter, $scope.data.selectAddress' + $OrderDetailsService.getaddressName());
//        if ($OrderDetailsService.getaddressName() != '') {

//            $scope.order = $OrderDetailsService.getAddress($OrderDetailsService.getaddressName());
//            console.log("$scope.order" + $scope.order);
//            // $scope.order.offerstatus = '';
//            $scope.order.isTermsChecked = false;
//        }
//        else {
//                $scope.profile = $ProfileService.getProfile();
//                if($scope.profile != null)
//                    $scope.order =  $scope.profile;
//                else
//                    $scope.order = null;
//        }
//    })

//    //TODO hardcoding this for now
//    $scope.data.store.country = 'India';

//    var selectedBrand = $SelectedStore.getselectedBrandItem();
//    var selectedStore = $scope.data.store;
//    console.log('selected brand value in OrderDetailsCtrl:' + selectedBrand.label);
//    console.log('store value in OrderDetailsCtrl:' + $scope.data.store.storename);

//    $scope.submitorder = function (order) {

//        if (selectedBrand.name == null) {
//            selectedBrand.name = '';
//            console.log('selectedBrand.name is null');
//        }

//        order.addressline2 = $CheckNetwork.UndefinedToEmpty(order.addressline2);
//        order.offercode = $CheckNetwork.UndefinedToEmpty(order.offercode);

//        var attachmentId = $SelectedValues.getAttachmentId();

//        console.log('addressline2 ' + order.addressline2);

//        if (order.isTermsChecked == false) {
//            alert("Please accept the Terms and Conditions!");
//        }
//        else {

//            var confirmed = confirm("Confirm the order? Order will be placed. You may get a confirmation call.");

//            if (confirmed == true) {
//                $ionicLoading.show({
//                    template: 'Submitting Order...'
//                });
//                // $SelectedValues.addCartToServer();
//                var cartItemsString = $SelectedValues.addItemsToServerString();

//                //TODO do not hardcode contry and state
//                $http.get($config.serverUrl+"webservice/addItemsToCartAndPlaceOrder?cartItemList=" + cartItemsString + "&circle=" + $SelectedValues.getSelectedCircle() + "&doctorname=" + order.doctorname + "&patientname=" + order.patientname + "&name=" + order.name + "&phoneNumber=" + order.phone + "&emailID=" + order.email + "&age=0" + "&addressLine1=" + order.addressline1 + "+&addressLine2=" + order.addressline2 + "&city=" + $SelectedValues.getSelectedCity() + "&state=Maharastra" + "&country=India" + "&attachmentid=" + attachmentId + "&offerCode=" + order.offercode)
//                    .success(function (data) {
//                        $ionicLoading.hide();
//                        console.log("data:" + data);
//                        console.log('data.orderDetailsList[0].trackingId:' + data.trackingId);
//                        if (data == 'No items in the cart') {
//                            alert("some error occured try again:" + data);
//                        }
//                        else {
//                            if (data.trackingId != '') {
//                                console.log('no errors in order');
//                                $SelectedValues.emptyItems();
//                                $OrderDetailsService.setorderDetails(data);
//                                $OrderDetailsService.setOrderMessage('Your order has been placed!');
//                                $OrderDetailsService.storeOrder(data);

//                                console.log("$scope.data.selectAddress:" + $OrderDetailsService.getaddressName());
//                                if ($OrderDetailsService.getaddressName() == '') {
//                                    var addresses = $OrderDetailsService.getAllAddressKey();

//                                    var address = prompt("Do you want to save delivery details?", "Home" );

//                                    var itemPresent = true;

//                                    while (itemPresent) {
//                                        if (address != null) {
//                                            if (addresses.indexOf(address) == -1) {
//                                                itemPresent = false;
//                                            }
//                                            else {
//                                                address = prompt("Address with that name already present, give another name", "Office " + (addresses.length));
//                                            }
//                                        } else {
//                                            itemPresent = false;
//                                        }
//                                    }

//                                    if (address != null) {
//                                        $OrderDetailsService.storeAddress(address, order);
//                                    }
//                                }

//                                $state.go('app.ordercompletion');
//                            } else {
//                                alert("Could not submit order, please check if all fields filled properly." + data.orderDetailsList[0].errors.errors);
//                            }
//                            $scope.order = null;
//                        }
//                    })
//                    .error(function (data) {
//                        $ionicLoading.hide();
//                        $CheckNetwork.check();
//                        alert("some error occured:" + data);
//                    });

//            }
//        }

//    };

//    $scope.applyOffer = function () {

//        $http.get($config.serverUrl+"webservice/isValidOfferCode?offerCode=" + $scope.order.offercode)
//            .success(function (data) {
//                $scope.order.offerstatus = data;
//            })
//            .error(function (data) {
//                $CheckNetwork.check();
//                $scope.order.offerstatus = data;
//            });

//    }
//}])    //end OrderDetailsCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start TrackOrderCtrl
//.controller('TrackOrderCtrl', ['$scope','config', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope,$config, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
//    console.log('TrackOrderCtrl called');
//    $scope.data = {
//        "trackingId": '',
//        "status": ''
//    };

//    $scope.getOrderDetails = function () {

//        $ionicLoading.show({
//            template: 'Getting Order details...'
//        });

//        $http.get($config.serverUrl+"webservice/showOrderCollectionDetails?trackingId=" + $scope.data.trackingId)
//                      .success(function (data) {
//                          $ionicLoading.hide();
//                          console.log('order details fetched:' + data);
//                          if (data != -2) {
//                              $OrderDetailsService.setorderDetails(data);
//                              $OrderDetailsService.setOrderMessage('Your order details!');
//                              $state.go('app.ordercompletion');
//                              $scope.data.status = "";
//                          } else {
//                              $scope.data.status = "Invalid Tracking Id";
//                          }
//                      })
//                      .error(function (data) {
//                          $ionicLoading.hide();
//                          $CheckNetwork.check();
//                      });

//    }
//}])
    //end TrackOrderCtrl

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start OrderCompletionCtrl
//.controller('OrderCompletionCtrl', ['$scope','config', '$http', 'SelectedValues', '$ionicHistory', 'SelectedStore', 'OrderDetailsService', '$state', 'CheckNetwork', '$ionicLoading', function ($scope,$config, $http, $SelectedValues, $ionicHistory, $SelectedStore, $OrderDetailsService, $state, $CheckNetwork, $ionicLoading) {
//    $ionicHistory.clearHistory();
//    if ($OrderDetailsService.getReload() == false) {
//        $state.go($state.current, {}, {
//            reload: true
//        });
//        $OrderDetailsService.setReload(true);
//        console.log('reloading order complete');
//    } else {
//        console.log('normally loading the order complete');
//        $OrderDetailsService.setReload(false);
//    }

//    $scope.data = {
//        "trackingId": '',
//        "orderDetails": $OrderDetailsService.getorderDetails(),
//        "cancelSuccess": '',
//        "orderSuccess": $OrderDetailsService.getOrderMessage(),
//        "enableCancel": false
//    };

//    $scope.goHome = function () {
//        $state.go('app.home');
//    };

//    $scope.getStatusText = function (data) {
//        console.log("getstatustext called with:" + data);
//        if (data == "0") {
//            $scope.data.disableCancel = true;
//            return "Order Cancelled";
//        }
//        if (data == "1")
//            return "Placed (Yet to be accepted)";

//        if (data == "2")
//            return "Accepted";

//        if (data == "3")
//            return "Dispatched";

//        if (data == "4")
//            return "Delivered";

//        return '';
//    };

//    $scope.cancelOrder = function (trackingId) {

//        $ionicLoading.show({
//            template: 'Cancelling Order...'
//        });


//        var confirmed = confirm("Confirm cancel. Cancellation CANNOT be undone!");

//        if (confirmed == true) {

//            $http.get($config.serverUrl+"webservice/cancelOrder?trackingId=" + trackingId)
//                .success(function (data) {
//                    $ionicLoading.hide();
//                    if (data == 'Success') {
//                        for (i = 0; i < $scope.data.orderDetails.orderDetailsList.length; i++) {
//                            $scope.data.orderDetails.orderDetailsList[i].orderStatus = "0";
//                        }
//                        $scope.data.disableCancel = true;
//                        $scope.data.cancelSuccess = 'Your Order has been cancelled successfully!';
//                    }
//                    else {
//                        $scope.data.cancelSuccess = data;
//                        $scope.data.orderSuccess = '';
//                    }
//                    $scope.data.orderSuccess = '';
//                    console.log('order cancelled:' + data);
//                })
//                .error(function (data) {
//                    $ionicLoading.hide();
//                    $CheckNetwork.check();
//                    alert("There was some problem:" + data);

//                });
//        }

//    };

//}])
    //end OrdercompletionCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start FeedbackCtrl
.controller('FeedbackCtrl', ['$scope','config', '$http', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', '$state', 'CheckNetwork', function ($scope,$config, $http, $SelectedValues, $SelectedStore, $OrderDetailsService, $state, $CheckNetwork) {

    $scope.data = {
        "feedbackstatus": ''
    };
    $scope.submitfeedback = function (feedback) {
        console.log("feedback name:" + feedback.name);

        if (feedback.message == '' || feedback.message === undefined) {
            alert("message can not be empty!");
        }
        else {
            $http.get($config.serverUrl+"webservice/sendFeedback?name=" + feedback.name + "&emailID=" + feedback.email + "&message=" + feedback.message)
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
.controller('FooterCtrl', ['$scope','config', '$http', 'SelectedValues', 'SelectedStore', '$state', 'CheckNetwork', function ($scope,$config, $http, $SelectedValues, $SelectedStore, $state, $CheckNetwork) {
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

//start Requestmedicine
.controller('requestmedicineCtrl', ['$scope','config', '$http', 'SelectedValues', 'SelectedStore', '$state', 'CheckNetwork', function ($scope,$config, $http, $SelectedValues, $SelectedStore, $state, $CheckNetwork) {

    $scope.data = {
        message: '',
        medicine: $SelectedValues.getselectedBrandItem().label
    };

    var selectedCircle = $SelectedValues.getSelectedCircle();
    console.log(selectedCircle);

    console.log('$scope.data.medicine :' + $scope.data.medicine);

    $scope.submitfeedback = function (feedback) {
        console.log(feedback.name);
        $http.get($config.serverUrl+"webservice/requestNewBrand?brandName=" + $scope.data.medicine + "&emailID=" + feedback.email + "&phoneNumber=" + feedback.phone + "&circle=" + selectedCircle)
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
app.controller('LoginCtrl', ['$log', '$scope','config', '$state', '$http', function ($log, $scope, $state, $http) {
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

        $http.get($config.serverUrl+"webservice/Login?Username=" + xxx.user + "&Password=" + xxx.pass)
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
.controller('SignupCtrl', ['$scope','config', function ($scope,$config) {


}])
//end SignupCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start ProfileCtrl
.controller('ProfileCtrl', ['$scope','config', '$http', 'ProfileService', '$state', 'CheckNetwork', function ($scope,$config, $http, $ProfileService, $state, $CheckNetwork) {

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

    getSelectedCircle: function () {
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
                totalprice += items[i].mrp*items[i].quantity;
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

            $http.get($config.serverUrl+"webservice/addItemsToCart?cartItemList=" + cartItemList)
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
            return JSON.parse(window.localStorage.getItem("profile"));
        }
    }
}])
//end ProfileService

app.constant('config', {
    serverUrl: 'http://localhost:8100/api/',
});

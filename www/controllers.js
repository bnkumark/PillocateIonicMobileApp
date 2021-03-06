﻿var app = angular.module('starter.controllers', [])

//TODO: each controller can be moved to a seperate file?

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $cordovaAppRate) {
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
	
	$scope.rateApplication = function() {
		console.log('Rating application');
		
		$cordovaAppRate.navigateToAppStore().then(function (result) {
			// success
		});
	};
})

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start BuyNowCtrl
.controller('BuyNowCtrl', ['$scope','config', '$http', 'SelectedValues', 'SelectedStore', '$state', 'OrderDetailsService', '$ionicLoading', function ($scope,$config, $http, $SelectedValues, $SelectedStore, $state, $OrderDetailsService, $ionicLoading) {
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
.controller('SellerDetailsCtrl', ['$scope','config', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope,$config, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
    console.log('SellerDetailsCtrl');
    $scope.data = {
        sellerChoice: 'A',
        totalprice: $SelectedValues.getTotalPrice()
    };

        $scope.choosePrescription = function () {
             //$state.go('app.prescriptionchoice');
			 $state.go('app.uploadpage');
    };

	// Select First seller of first brand id
	// Code will move to Actual select store module.
	$scope.$on('$ionicView.enter', function () {
        console.log('Searching Store info ');
		var items = $SelectedValues.getItems();
		if(items)
		{
			var brandId = items[0].brandId;
			var circle = $SelectedValues.getSelectedCircle();
			console.log('Brand id : '+brandId+' : Circle : '+circle);
			
			$ionicLoading.show({
                template: 'Getting Store details...',
                hideOnStateChange: true
            });
			
			$http.get($config.serverUrl + "webservice/getStoresWhereBrandIsAvailable?brandId=" + brandId + "&Circle="+ circle)
			.success(function (data) {
				$ionicLoading.hide();

				console.log('Store result success');
				if (data && data[0]) {
					var store = {};
					store.storeId = data[0].storeId;
					store.storeName = data[0].storeName;
					
					$SelectedStore.setSelectedStore(store);
				}
				
			})
			.error(function (data) {
				$ionicLoading.hide();
			});
		}
    })
}])
//end SellerDetailsCtrl

        //start PrescriptionChoiceCtrl
.controller('PrescriptionChoiceCtrl', ['$scope','config', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope,$config, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
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

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start OrderDetailsCtrl
.controller('OrderDetailsCtrl', ['$scope','config', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService','ProfileService', 'CheckNetwork', '$ionicLoading', function ($scope,$config, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $ProfileService, $CheckNetwork, $ionicLoading) {
    console.log('OrderDetailsCtrlmethod called');
    $scope.data = {
        "store": $SelectedStore.getSelectedStore(),
        "brandName": $SelectedStore.getselectedBrandItem().label,
        "circle": $SelectedValues.getSelectedCircle(),
        "selectAddress": $OrderDetailsService.getaddressName()
    };

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
    console.log('store value in OrderDetailsCtrl:' + $scope.data.store.storeName);

    $scope.submitorder = function (order) {
		
		$scope.data.store = $SelectedStore.getSelectedStore();
		$scope.data.store.country = 'India';
		
		console.log('Store id '+$scope.data.store.storeId+' : id : '+$scope.data.store.storeName);

		console.log('Brand name '+selectedBrand.name);
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
                $http.get($config.serverUrl+"webservice/addItemsToCartAndPlaceOrder?cartItemList=" + cartItemsString + "&circle=" + $SelectedValues.getSelectedCircle() + "&doctorName=" + order.doctorname + "&patientName=" + order.patientname + "&name=" + order.name + "&phoneNumber=" + order.phone + "&emailID=" + order.email + "&age=0" + "&addressLine1=" + order.addressline1 + "+&addressLine2=" + order.addressline2 + "&city=" + $SelectedValues.getSelectedCity() + "&state=Maharastra" + "&country=India" + "&attachmentid=" + attachmentId + "&offerCode=" + order.offercode)
                    .success(function (data) {
                        $ionicLoading.hide();
						data.store = $scope.data.store;
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
								$SelectedValues.clearAttachmentId();
								$SelectedStore.clearSelectedStore();

                                console.log("$scope.data.selectAddress:" + $OrderDetailsService.getaddressName());
                                if ($OrderDetailsService.getaddressName() == '') {
                                    var addresses = $OrderDetailsService.getAllAddressKey();

                                    var address = prompt("Do you want to save delivery details?", "Home" );

                                    var itemPresent = true;

                                    while (itemPresent) {
                                        if (address != null) {
                                            if (addresses.indexOf(address) == -1) {
                                                itemPresent = false;
                                            }
                                            else {
                                                address = prompt("Address with that name already present, give another name", "Office " + (addresses.length));
                                            }
                                        } else {
                                            itemPresent = false;
                                        }
                                    }

                                    if (address != null) {
                                        $OrderDetailsService.storeAddress(address, order);
                                    }
                                }else
								{
									console.log('Updating currrent address');
									$OrderDetailsService.storeAddress($OrderDetailsService.getaddressName(), order);
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

        $http.get($config.serverUrl+"webservice/isValidOfferCode?offerCode=" + $scope.order.offercode)
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
.controller('TrackOrderCtrl', ['$scope','config', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', '$ionicLoading', function ($scope,$config, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork, $ionicLoading) {
    console.log('TrackOrderCtrl called');
    $scope.data = {
        "trackingId": '',
        "status": ''
    };

    $scope.getOrderDetails = function () {

        $ionicLoading.show({
            template: 'Getting Order details...'
        });

        $http.get($config.serverUrl+"webservice/showOrderCollectionDetails?trackingId=" + $scope.data.trackingId)
                      .success(function (data) {
                          $ionicLoading.hide();
                          console.log('order details fetched:' + data);
                          if (data != -2) {
                              $OrderDetailsService.setorderDetails(data);
                              $OrderDetailsService.setOrderMessage('Your order details!');
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
.controller('OrderCompletionCtrl', ['$scope','config', '$http', 'SelectedValues', '$ionicHistory', 'SelectedStore', 'OrderDetailsService', '$state', 'CheckNetwork', '$ionicLoading', function ($scope,$config, $http, $SelectedValues, $ionicHistory, $SelectedStore, $OrderDetailsService, $state, $CheckNetwork, $ionicLoading) {
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

            $http.get($config.serverUrl+"webservice/cancelOrder?trackingId=" + trackingId)
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
//start ordersCtrl
.controller('ordersCtrl', ['$scope','config', '$http', 'OrderDetailsService', '$state', 'CheckNetwork', function ($scope,$config, $http, $OrderDetailsService, $state, $CheckNetwork) {
    console.log("ordersCtrl");

    $scope.orders = $OrderDetailsService.getOrders();
    console.log("orders:" + $scope.orders);

    $scope.orderSelected = function (trackingId) {

        $http.get($config.serverUrl+"webservice/showOrderCollectionDetails?trackingId=" + trackingId)
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

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

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
    var attachmentId = [];
	var attachmentFiles = [];
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
			if(attachmentId[0])
			{
				return attachmentId[0];
			}else{
				return '';
			}
        },
		
		clearAttachmentId: function(){
			attachmentId = [];
			attachmentFiles = [];
		},

        setAttachmentId: function (x) {
            console.log("set attachmentId:" + x);
            attachmentId.push(x);
        },
		
		setAttachmentFile: function (x) {
            attachmentFiles.push(x);
        },
		
		getAttachmentFiles: function() {
			return angular.copy(attachmentFiles);
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
            //console.log("get items:" + items);
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
                cartItemList = cartItemList + "{\"brandName\"\: \"" + items[i].item + "\", \"inventoryId\":\"\", \"brandId\":\"" + items[i].brandId + "\", \"storeId\":\"" + items[i].storeid + "\", \"quantity\":" + items[i].quantity + "},";
                console.log("making addTiItemCart" + items[i]);
            }
            cartItemList = cartItemList.substring(0, cartItemList.length - 1);
            cartItemList = cartItemList + "]'";
            console.log('cartItemList: ' + cartItemList);

            return cartItemList;
        },
		
		addRecentViewItem: function(viewedItem){
			
			var recentViewItems = JSON.parse(window.localStorage['RECENT_VIEW'] || null);
			if(!recentViewItems)
			{
				recentViewItems = [];
			}
			
			// Chek if item is already present in recent view list
			var alreadyContains = false;
			for(var i=0; i < recentViewItems.length; i++){
				if(recentViewItems[i].name == viewedItem.name){
					alreadyContains = true;
				}
			}
			console.log('Item found in list : '+alreadyContains);
			
			if(!alreadyContains)
			{
				recentViewItems.unshift(viewedItem);
				if(recentViewItems.length > 3)
				{
					recentViewItems.pop();
				}
			}
			
			window.localStorage['RECENT_VIEW'] = JSON.stringify(recentViewItems);
		},

		getRecentViewItems: function(){
			return JSON.parse(window.localStorage['RECENT_VIEW'] || null);
		}
    }
})
//end SelectValues service
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start SelectStore service
//TODO: Probably we can move this to a seperate JS file
app.service('SelectedStore', function ($q) {
    var selectedBrandItem = {};
	var selectedStore = {}; //  Store Selected store detail
    return {
        
        getselectedBrandItem: function () {
            return selectedBrandItem;
        },
        setselectedBrandItem: function (x) {
            selectedBrandItem = x;
        },
		getSelectedStore: function () {
            return selectedStore;
        },
        setSelectedStore: function (x) {
            selectedStore = x;
        },
		clearSelectedStore: function () {
			selectedBrandItem = {};
			selectedStore: {}; //
		}

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
app.service('OrderDetailsService', ['CheckNetwork', '$state', '$http','$q', function ($CheckNetwork, $state, $http, $q) {
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
			var storeId = order.store.storeId;
			var storeName = order.store.storeName;
            for (i = 0; i < order.orderDetailsList.length; i++) {
                brandNames = brandNames + order.orderDetailsList[i].brandName;
                if (i < (order.orderDetailsList.length - 1)) {
                    brandNames = brandNames + ", ";
                }
			}
			console.log('Store id : '+storeId+' : Store Name : '+storeName);
			
			var currDate = new Date();
			var currTime = currDate.getTime(); // Store date in milliseconds

			// Adding other details for Rate and Review
            var ordersToStore = { brandNames: brandNames, trackingId: order.trackingId, storeId: storeId, storeName: storeName, orderDate: currTime, reviewFlag: 'N'  };
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
		
		getOrdersForReview: function () {
			
			var deferred = $q.defer(); 
			
			var orders = this.getOrders();
			
			if(orders != null)
			{
				var found = false;
				var selectedOrder = null;
				angular.forEach(orders, function(orderDetail) {
   	     			
					console.log('Order detail : '+orderDetail.trackingId);
					if(orderDetail.reviewFlag == 'N')
					{
						var currDate = new Date();
						var gapMilliSeconds = 2 *  60 * 1000; //4 * 60 * 60 * 1000; // 4 hours
						var timePassed = currDate.getTime() - orderDetail.orderDate;
						console.log('Diff : '+timePassed+' : Gap : '+gapMilliSeconds);
						if(timePassed > gapMilliSeconds) 
						{			
							selectedOrder = orderDetail;
							found = true;
						}
					}					
				});
				
				if(found)
				{
					deferred.resolve(selectedOrder);
					
				}else
				{
					deferred.reject('No Orders found for Review');
				}
			}else{
				deferred.reject('No Orders found');
			}
			
			return deferred.promise;
		},
		
		markOrderReviewed: function (trackingId) {
			
			var deferred = $q.defer(); 
			
			var orders = this.getOrders();
			
			if(orders != null)
			{
				var found = false;
				angular.forEach(orders, function(orderDetail) {
   	     			
					console.log('Order detail : '+orderDetail.trackingId);
					if(orderDetail.trackingId == trackingId)
					{
						orderDetail.reviewFlag = 'Y';
					}
				});
				
			}			
			window.localStorage.setItem("orders", JSON.stringify(orders));
			deferred.resolve('Order reviewed');
			return deferred.promise;
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
		
		getAllAddresses: function () {
            var keys = Object.keys(window.localStorage);
            var addresses = [];
            for (i = 0; i < keys.length; i++) {
                if (keys[i].indexOf("address") == 0) {
					var key = keys[i].replace("address", "").replace("_", " ");
					var address = this.getAddress(key);
					if(address) 
					{
						address.key = key;
						addresses.push(address);
					}
				}
            }
            return addresses;
        },

        removeAddressKey: function (key) {
            window.localStorage.removeItem("address" + key.replace(" ", "_"));
        },
		
		addToFavoriteStore: function(storeId){
			
			var favoriteStores = JSON.parse(window.localStorage['FAVORITE_STORE'] || null);
			if(!favoriteStores)
			{
				favoriteStores = [];
			}
			
			// Chek if item is already present in favorite store list
			var alreadyContains = false;
			for(var i=0; i < favoriteStores.length; i++){
				if(favoriteStores[i] == storeId){
					alreadyContains = true;
				}
			}
			console.log('Item found in list : '+alreadyContains);
			
			if(!alreadyContains)
			{
				favoriteStores.unshift(storeId);
			}
			
			window.localStorage['FAVORITE_STORE'] = JSON.stringify(favoriteStores);
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
    //serverUrl: 'http://localhost:8100/api/',
	serverUrl: 'http://demo.pillocate.com/',
	photoUploadTimeout: 30000,  // Timeout to Prescription upload ( in milliseconds )
});

//app.constant('serverUrl', 'http://localhost:8100/api/');
//angular.module('constants', [])
//  .constant('serverUrl', 'http://localhost:8100/api/');
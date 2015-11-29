var myApp = angular.module('OrderDetailsModule', [])
.controller('OrderDetailsCtrl', ['$scope', 'config', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'ProfileService', 'CheckNetwork', '$ionicLoading', function ($scope, $config, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $ProfileService, $CheckNetwork, $ionicLoading) {
    console.log('OrderDetailsCtrlmethod called');
    $scope.data = {
        "store": $SelectedStore.selectedStore,
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
            if ($scope.profile != null)
                $scope.order = $scope.profile;
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
                $http.get($config.serverUrl + "webservice/addItemsToCartAndPlaceOrder?cartItemList=" + cartItemsString + "&circle=" + $SelectedValues.getSelectedCircle() + "&doctorname=" + order.doctorname + "&patientname=" + order.patientname + "&name=" + order.name + "&phoneNumber=" + order.phone + "&emailID=" + order.email + "&age=0" + "&addressLine1=" + order.addressline1 + "+&addressLine2=" + order.addressline2 + "&city=" + $SelectedValues.getSelectedCity() + "&state=Maharastra" + "&country=India" + "&attachmentid=" + attachmentId + "&offerCode=" + order.offercode)
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

                                    var address = prompt("Do you want to save delivery details?", "Home");

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

        $http.get($config.serverUrl + "webservice/isValidOfferCode?offerCode=" + $scope.order.offercode)
            .success(function (data) {
                $scope.order.offerstatus = data;
            })
            .error(function (data) {
                $CheckNetwork.check();
                $scope.order.offerstatus = data;
            });

    }
}])    //end OrderDetailsCtrl
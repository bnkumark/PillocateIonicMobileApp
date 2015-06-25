var app = angular.module('starter.controllers', [])

//TODO: each controller can be moved to a seperate file?

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    if (true) {
    console.log("localStorage -"+window.localStorage.getItem("data"));
    return window.localStorage.getItem("data");
    };
        // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    })
    .then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
.controller('HomeCtrl', ['$scope', '$http', '$state', 'SelectedValues', '$ionicHistory', '$ionicScrollDelegate', '$ionicNavBarDelegate', '$timeout','CheckNetwork', function($scope, $http, $state, $SelectedValues, $ionicHistory, $ionicScrollDelegate, $ionicNavBarDelegate, $timeout,$CheckNetwork) {

    $ionicHistory.clearHistory();

    var airlines;
    var searchTerm;




    var searchGotFocus = false;
     var timer;

    $scope.data = {
        "airlines": [],
        "search": '',
        "circleOptions": [],
        selectedCircle: 'Bandra(West)',
        'cityOptions': [],
        selectedCity: 'Mumbai'
    };
    //TODO get this from web service
    $scope.data.circleOptions = ["Bandra(West)","SantaCruz(West)","Khar(West)"];
    $scope.data.selectedCircle = 'Bandra(West)';
    $scope.data.cityOptions = ["Mumbai"];
    $scope.data.selectedCity = 'Mumbai';

    console.log('HomeCtrl method');


    $scope.scrollToTop = function() {
        console.log('scrollToTop called');
        var el = document.querySelector("#searchbox");
        var top = el.getBoundingClientRect().top;
        var height = el.getBoundingClientRect().height;
        console.log("JS Top: " + top + "height:" + height);
        $ionicScrollDelegate.scrollTo(0, top - height, true);
    };

    $scope.clearAutoSuggestions = function() {

        if ($scope.data.airlines.length != 0) {

            $scope.data.airlines = [];
            searchGotFocus = false;
            console.log('clearing the auto suggestions');
        };
    };

    //Start of  $scope.search
    $scope.search = function() {
     console.log('Char entered' + Date());
     $timeout.cancel( timer );
     timer = $timeout(
          function() {
            console.log('search method');
            if ($scope.data.search != '') {
                $http.get("http://localhost:8100/api/search/listOfBrandNameStartingWith?term=" + $scope.data.search + "&circle=" + $scope.data.selectedCircle)
                    .success(function(data) {
                        console.log('setting auto suggestions ' + data);
                        $scope.data.airlines = data; 
                        $SelectedValues.setSelectedBrand(data);
                        $SelectedValues.setSelectedCircle($scope.data.selectedCircle);
                        searchGotFocus = true;
                    })
                    .error(function(data) {
                    console.log('getting auto suggestions failed');
                     $CheckNetwork.check();
                    })
            } else {
                $scope.data.airlines = [];
            }          },
        1000
        );
         //Console will log 'Timer rejected!' if it is cancelled.
       timer.then(
          function() {
            console.log( "Timer resolved!"+Date());
          },
          function() {
            console.log( "Timer rejected!"+Date());
          }
       );   
        }
        //end of  $scope.search

    //Start
    $scope.brandSelected = function(item) {
        console.log('brandSelected method');
        $SelectedValues.setselectedBrandItem(item);
        $scope.data.search = ''; //clear the search box
    }
}])
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start searchResultsCtrl
.controller('SearchResultsCtrl', ['$scope', '$http', 'SelectedValues', '$ionicPopup', 'SelectedStore','CheckNetwork', function($scope, $http, $SelectedValues, $ionicPopup, $SelectedStore, $CheckNetwork,$localStorage) {
        console.log('searchResultsCtrl method');
        var selectedBrand = $SelectedValues.getselectedBrandItem();
		//		window.localStorage['brand']=selectedBrand;
        var selectedCircle = $SelectedValues.getSelectedCircle();
        $scope.data = {
        	"searchResults": [],
            "items": [],
            "localBrand": selectedBrand
        };
        console.log($scope.data.items);
								        $http.get("http://localhost:8100/api/webservice/search?brandName=" + selectedBrand.label + "&circle=" + selectedCircle + "&brandId="+selectedBrand.name+"&inventoryId=" + selectedBrand.id)
            .success(function(data) {
                console.log('searchResultsCtrl success');
                $scope.data.searchResults= data;
                //$scope.data.items = data.storesList;
	//							console.log(data.storesList);
								             })
            .error(function(data) {
            $CheckNetwork.check();
            });
					        //Start
        $scope.storeSelected = function(item) {
                $SelectedStore.selectedStore = item;
                $SelectedStore.setselectedBrandItem($SelectedValues.getselectedBrandItem());
            }
            //end


    }])
    //end searchResultsCtrl
    
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start OrderDetailsCtrl
.controller('BuyNowCtrl',['$scope','$http','SelectedValues','SelectedStore',function($scope,$http,$SelectedValues,$SelectedsStore,$localStorage){
	$scope.data={
		quantity:'1',
		message: '',
		itemlist:[],
		message2:''
	};
	var selectedBrand = $SelectedValues.getselectedBrandItem();
	$scope.item=selectedBrand.label;
//	var selectedStore =  $SelectedStore.selectedStore;
		$scope.qdata='';
//	$scope.disablebutton="false";
	$scope.cartdata=''
	$scope.addtocart=function(){
	//		$scope.disablebutton="true";
			window.localStorage['qdata']=$scope.data.quantity;
			var quantity =  window.localStorage['qdata'];
			 $http.get("http://demo.pillocate.com/webservice/addItemToCart?brandId="+selectedBrand.name+"&inventoryId=" + selectedBrand.id+ "&quantity=" + quantity)
						.success(function(data){
							$scope.data.message="Item added to cart";
							console.log($scope.data.message);
				})
						.error(function(data){
							$scope.data.message="Item couldn't be added to cart";
				});
			console.log($scope.data.message);
		};
	$scope.store=function(){
		window.localStorage['qdata']=$scope.data.quantity;
			};
	$scope.buynow=function(){
		$scope.qdata=window.localStorage['qdata'];
	};
		$scope.qdata1=window.localStorage['qdata'];
		$scope.display=function(){	
		$http.get("http://demo.pillocate.com/webservice/showCartItems")
			.success(function(data){	
				$scope.data.message2=data;
					console.log(data);
	//				for(d in data){
	//								console.log(1);
	//				}
				})
				.error(function(data){
					console.log("error");
			});
	};
	$scope.destroy=function(){
var quantity =  window.localStorage['qdata'];
		$http.get("http://demo.pillocate.com/webservice/removeItemFromCart?inventoryId=" + selectedBrand.id+ "&quantity=" + quantity)
      .success(function(data){
        $scope.data.message2=data;
				console.log(data);
        })
        .error(function(data){
          console.log(data);
      });

	};
}])

.controller('OrderDetailsCtrl', ['$scope', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService','CheckNetwork', function($scope, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork) {
        console.log('OrderDetailsCtrlmethod called');
        $scope.data = {
            "store": $SelectedStore.selectedStore,
            "brandName": $SelectedStore.getselectedBrandItem().label
        };
        $scope.order = {
            "quantity": 1,
            "offerstatus": ''
        };
        $scope.data.store.circle = $SelectedValues.getSelectedCircle();
        //TODO hardcoding this for now
        $scope.data.store.country = 'India';

        var selectedBrand = $SelectedStore.getselectedBrandItem();
        var selectedStore = $scope.data.store;
        console.log('selected brand value in OrderDetailsCtrl:' + selectedBrand.label);
        console.log('store value in OrderDetailsCtrl:' + $scope.data.store.storename);

        $scope.submitorder = function(order) {
        if(selectedBrand.name == null)
        {
        selectedBrand.name = '';
        console.log('selectedBrand.name is null');
        }
        
        //If address line2 is undefined make it empty
        console.log('addressline2 '+order.addressline2);
        if(!order.addressline2)
        {
        order.addressline2 = '';
        }
        console.log('addressline2 '+order.addressline2);
        
            $http.get("http://localhost:8100/api/webservice/saveOrder?circle=" + $SelectedValues.getSelectedCircle() + "&brandId="+selectedBrand.name+"&inventoryId=" + selectedBrand.id+ "&storeId=" + selectedStore.storeId + "&name=" + order.name + "&phoneNumber=" + order.phone + "&emailID=" + order.email + "&age=" + order.age + "&addressLine1=" + order.addressline1 + "+&addressLine2=" + order.addressline2 + "&city=" + selectedStore.city + "&state=" + selectedStore.state + "&country=India&quantity=" + order.quantity + "&offerCode=" + order.offercode)
                .success(function(data) {

                    console.log('submitorder success:' + data);
                    console.log('data.errors values:' + data.orderStatusCommand.errors.errors.length);

                    if (data.orderStatusCommand.errors.errors.length == 0) {
                        console.log('no errors in order');
                        $OrderDetailsService.setorderDetails(data.orderStatusCommand);
                        $OrderDetailsService.setScreen('orderCompletion');
                        $state.go('app.ordercompletion');
                    } else {}
                })
                .error(function(data) {
                $CheckNetwork.check();
                });

        };

        $scope.applyOffer = function() {
            $http.get("http://localhost:8100/api/webservice/isValidOfferCode?offerCode=" + $scope.order.offercode)
                .success(function(data) {
                    $scope.order.offerstatus = data;
                })
                .error(function(data) {
                  $CheckNetwork.check();
                    $scope.order.offerstatus = data;
                });
        }
    }])
    //end OrderDetailsCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start TrackOrderCtrl
.controller('TrackOrderCtrl', ['$scope', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService','CheckNetwork', function($scope, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork) {
        console.log('TrackOrderCtrl called');
        $scope.data = {
            "trackingId": '',
            "status": ''
        };

        $scope.getOrderDetails = function() {
            $http.get("http://localhost:8100/api/webservice/showTrackedOrderDetails?trackingId=" + $scope.data.trackingId)
                .success(function(data) {
                    console.log('order details fetched:' + data);
                    if (data != -2) {
                        $OrderDetailsService.setorderDetails(data.orderStatusCommand);
                        $OrderDetailsService.setScreen('orderCompletion');
                        $state.go('app.ordercompletion');
                        $scope.data.status = "";
                    } else {
                        $scope.data.status = "Invalid Tracking Id";
                    }
                })
                .error(function(data) {
                $CheckNetwork.check();
                });

        }
    }])
    //end TrackOrderCtrl

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start OrderDetailsCtrl
.controller('OrderCompletionCtrl', ['$scope', '$http', 'SelectedValues', '$ionicHistory', 'SelectedStore', 'OrderDetailsService', '$state','CheckNetwork', function($scope, $http, $SelectedValues, $ionicHistory, $SelectedStore, $OrderDetailsService, $state, $CheckNetwork) {
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
        console.log('OrdercompletionCtrl called with:' + $OrderDetailsService.getScreen());
        var screen = $OrderDetailsService.getScreen();
        $scope.data = {
            "trackingId": '',
            "orderDetails": $OrderDetailsService.getorderDetails(),
            "showTracking": (screen != 'orderCompletion'),
            "showOrderDetails": (screen == 'orderCompletion'),
            "cancelSuccess": ''
        };
        console.log('showTracking:' + $scope.data.showTracking + ' showOrderDetails:' + $scope.data.showOrderDetails);

        $scope.goHome = function() {
            $state.go('app.home');
        };

        $scope.cancelOrder = function(orderId) {
            $http.get("http://localhost:8100/api/webservice/cancelOrder?orderId=" + orderId)
                .success(function(data) {
                    $scope.data.cancelSuccess = "Your order has been cancelled!";
                    console.log('order cancelled:' + data);
                })
                .error(function(data) {
                $CheckNetwork.check();
                });

        };

    }])
    //end OrdercompletionCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start FeedbackCtrl
.controller('FeedbackCtrl', ['$scope', '$http', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', '$state','CheckNetwork', function($scope, $http, $SelectedValues, $SelectedStore, $OrderDetailsService, $state, $CheckNetwork) {
    
    $scope.data = {
        "feedbackstatus": ''
    };
    $scope.submitfeedback = function(feedback) {
        console.log(feedback.name);
        $http.get("http://localhost:8100/api/webservice/sendFeedback?name=" + feedback.name + "&emailID=" + feedback.email + "&message=" + feedback.message)
            .success(function(data) {
                $scope.data.feedbackstatus = data;
                console.log('feedback submit success:' + data);
            })
            .error(function(data) {
            $CheckNetwork.check();
            });
    }

}])
//end FeedbackCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start LoginCtrl
.controller('LoginCtrl', ['$log','$scope','$state','$http' , function($log,$scope,$state,$http) {
$scope.signNew=function(){
    console.log("Go Worked!");
    $state.go('app.signup');
};

$scope.xxx = {'user': '' , 'pass': ''};

var loadData1 =window.localStorage.getItem("data");
console.log(loadData1);

if (loadData1 != null){
   $scope.xxx.user = loadData1;
   console.log( $scope.xxx.user);
};
var loginState1 =true;
console.log(loginState1);
window.localStorage.setItem("login",loginState1);
if(window.localStorage.getItem("login") == true){
    $scope.loginState =true
};


 $scope.loginNew = function(xxx){

      $http.get("http://localhost:8100/api/webservice/Login?Username="+xxx.user+"&Password="+xxx.pass)
            .success(function() {    
            alert("Login was Successful.");
            console.log("Login success");
            window.localStorage.setItem("login");
            
            })
            .error(function() {
            alert("Wrong Credentials!!Username or Password was Wrong.")
            });

};
$scope.saveUser =function(xxx){
    console.log(xxx.user,"localstorage");
    window.localStorage.setItem("data",xxx.user);
};



}])
//end LoginCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start SignupCtrl
.controller('SignupCtrl', ['$scope',  function($scope) {


}]);
//end SignupCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start SelectValues service
//TODO: Probably we can move this to a seperate JS file
app.service('SelectedValues', function($q) {
        var selectedBrand = {};
        var selectedBrandItem = {};
        var selectedCircle = {};
        return {
            getSelectedBrand: function(id) {
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
            getSelectedCircle: function() {
                return selectedCircle;
            },
            setSelectedCircle: function(x) {
                selectedCircle = x;
            },
            getselectedBrandItem: function() {
                return selectedBrandItem;
            },
            setselectedBrandItem: function(x) {
                selectedBrandItem = x;
            },

        }
    })
    //end SelectValues service
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start SelectStore service
//TODO: Probably we can move this to a seperate JS file
app.service('SelectedStore', function($q) {
        var selectedBrandItem = {};
        return {
            selectedStore: '={}',
            getselectedBrandItem: function() {
                return selectedBrandItem;
            },
            setselectedBrandItem: function(x) {
                selectedBrandItem = x;
            },

        }
    })
    //end SelectValues service

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start SelectStore service
//TODO: Probably we can move this to a seperate JS file
app.service('CheckNetwork', function($q) {
        return {
            check: function() {
                                    if(window.Connection) {
   if(navigator.connection.type == Connection.NONE) {
   console.log("No active internet connection!! Please check and try again");
  alert("No active internet connection!!");
}
}
            },
        }
    })
    //end SelectValues service

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start OrderDetailsService
//TODO: Probably we can move this to a seperate JS file
app.service('OrderDetailsService', function($q) {
        var orderDetails = {};
        var screen = {};
        var reloading = {};
        return {
            getorderDetails: function() {
                return orderDetails;
            },
            setorderDetails: function(x) {
                orderDetails = x;
            },
            getScreen: function() {
                return screen;
            },
            setScreen: function(x) {
                screen = x;
            },
            getReload: function() {
                return reloading;
            },
            setReload: function(x) {
                reloading = x;
            },

        }
    })
    //end OrderDetailsService

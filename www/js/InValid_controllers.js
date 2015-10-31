var app = angular.module('starter.controllers', [])

//TODO: each controller can be moved to a seperate file?

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
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
.controller('HomeCtrl', ['$scope', '$http', '$state', 'SelectedValues', '$ionicHistory', '$ionicScrollDelegate', '$ionicNavBarDelegate', '$timeout', 'CheckNetwork', function($scope, $http, $state, $SelectedValues, $ionicHistory, $ionicScrollDelegate, $ionicNavBarDelegate, $timeout, $CheckNetwork) {
   
    var circleValue = window.localStorage.getItem("circle");
    var cityValue = window.localStorage.getItem("city");
    console.log("Local circle storage state:" + circleValue + cityValue);
    if (circleValue != "true") {
    console.log("going to location page");
        $state.go('app.location');
    }
    else
    {
		$SelectedValues.retrieveCircleFromStorage();    
    }
    if(cityValue != 'true')
    {
        console.log("going to location page");
    $state.go('app.location');
    }
    else
    {
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
        selectedCity: ''
    };

    $scope.scrollToTop = function() {
        console.log('scrollToTop called');
        var el = document.querySelector("#searchbox");
        var top = el.getBoundingClientRect().top;
        var height = el.getBoundingClientRect().height;
        console.log("JS Top: " + top + "height:" + height);
        $ionicScrollDelegate.scrollTo(0, top - height, true);
    };

    $scope.clearAutoSuggestions = function() {
        if ($scope.data.autoSuggetions.length != 0) {
            $scope.data.autoSuggetions = [];
            searchGotFocus = false;
            console.log('clearing the auto suggestions');
        };
    };
 
    //Start of  $scope.search
    $scope.search = function() {

          var selectedCircle = $SelectedValues.getSelectedCircle();
          var selectedCity = $SelectedValues.getSelectedCity();
    
            console.log("selected circle:"+selectedCircle +"selected City:"+selectedCity );            
            
			//Check for location, when the user starts typing medicine name.
            if (selectedCircle == '' || selectedCity == '') {
                alert("Please select your circle to proceed!.");
                $state.go('app.location');
            };

			if (selectedCity == '') {
                alert("Please select your city to proceed!.");
                $state.go('app.location');
            };


            $timeout.cancel(timer);
            timer = $timeout(
                function() {
                    console.log('search method');
                    if ($scope.data.search != '') {
                        //TODO do not hardcode city here
                        $http.get("http://localhost:8100/api/webservice/listOfBrandNameStartingWith?term=" + $scope.data.search + "&circle=" + selectedCircle + "&city="+selectedCity)
                            .success(function(data) {
                                //console.log('setting auto suggestions ' + data);
                                if(data.length > 0)
                                {
                               	 $scope.data.autoSuggetions = data.slice(0, 6);;
                               	 $SelectedValues.setSelectedBrand(data);
                               	 //$SelectedValues.setSelectedCircle(selectedCircle);
                                }
                                else
                                {
                                	$scope.data.autoSuggetions = [{label: $scope.data.search, id : null}]
                                }
                                searchGotFocus = true;
                            })
                            .error(function(data) {
                                console.log('getting auto suggestions failed');
                                $CheckNetwork.check();
                            })
                    } else {
                        $scope.data.autoSuggetions = [];
                    }
                },
                1000
            );
            //Console will log 'Timer rejected!' if it is cancelled.
            timer.then(
                function() {
                    console.log("Timer resolved!" + Date());
                },
                function() {
                    console.log("Timer rejected!" + Date());
                }
            );
        }
        //end of  $scope.search

    //Start
    $scope.brandSelected = function(item) {
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
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start searchResultsCtrl
.controller('SearchResultsCtrl', ['$scope', '$http', 'SelectedValues', '$ionicPopup', 'SelectedStore', 'CheckNetwork','$state', function($scope, $http, $SelectedValues, $ionicPopup, $SelectedStore, $CheckNetwork,$state) {
    console.log('searchResultsCtrl method');
    var selectedBrand = $SelectedValues.getselectedBrandItem();
    var selectedCircle = $SelectedValues.getSelectedCircle();
    var selectedCity = $SelectedValues.getSelectedCity();

    $scope.data = {
        "searchResults": [],
        "items": [],
        "localBrand": selectedBrand.label,
        "storeId": '',
        quantity: 1,
        availabiltyFlag: '',
        message: ''
    };
    
    console.log($scope.data.items);
    
    $http.get("http://localhost:8100/api/webservice/search?city=" + selectedCity + "&brandId=" + "&inventoryId=" + selectedBrand.id + "&brandName=" + selectedBrand.label + "&circle=" + selectedCircle)
        .success(function(data) {
            console.log('searchResultsCtrl success');
            if(data.availabilityFlag == false)
            {
            console.log("Medicine not avaialble");
               $state.go('app.requestmedicine');
            }
            else
            {
            $scope.data.searchResults = data;
            }

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
       
    $scope.isDisabled = false;
    
    $scope.addtocart = function() {
    if($SelectedValues.isItemPresentInCart($scope.data.searchResults.inventoryId) == false)
	{

        addtocartlocal();
        }
        else
        {
        alert("Item already there in cart!");
        }
    }
    
	$scope.checkout = function() {
	if($SelectedValues.isItemPresentInCart($scope.data.searchResults.inventoryId) == false)
	{
	 addtocartlocal();
	 }
	 $state.go('app.buynow');
	}
    
    function addtocartlocal()
    {
    var item = {
            item: selectedBrand.label,
            quantity: $scope.data.quantity,
            storeid: $scope.data.searchResults.storeId,
            inventoryid: $scope.data.searchResults.inventoryId
        };
				$scope.count=true;
				if( isNaN(item.quantity) || item.quantity == 0 )
				{
					$scope.count=true;
					$scope.data.message = "Item quantity is not defined";
					return false;
				}
				else
				{
					$scope.count=true;
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
.controller('BuyNowCtrl', ['$scope', '$http', 'SelectedValues', 'SelectedStore', '$state', function($scope, $http, $SelectedValues, $SelectedStore, $state) {
    $scope.data = {
        quantity: '1',
        message: '',
        items: [],
        message2: '',
        loopWait: true,
        prescriptionChoice : 'A'
    };
   
    $scope.items = $SelectedValues.getItems();

    $scope.$watch(function() {
        return $SelectedValues.getItems();
    }, function(value) {
        $scope.items = value;
    });
    
    $scope.destroy = function(item) {
        var items = $SelectedValues.getItems();
        for (i = 0; i < items.length; i++) {
            if (items[i].inventoryid == item.inventoryid) {
                $SelectedValues.removeItems(items[i]);
            }
        }
    }
    
    $scope.quantityChanged = function(item){
    console.log("calling updateItem with:"+item.inventoryid+":"+item.quantity);
    $SelectedValues.updateItem(item.inventoryid,item.quantity);
    }
    
    $scope.placeorder = function() {
        var items = $SelectedValues.getItems();

        var cartItemList = "[";

        for (i = 0; i < items.length; i++) {
            cartItemList = cartItemList + "{\"brandName\"\: \"" + items[i].item + "\", \"inventoryId\":\"" + items[i].inventoryid + "\", \"brandId\":\"\", \"storeId\":\"" + items[i].storeid + "\", \"quantity\":" + items[i].quantity + "},";
            console.log("making addTiItemCart" + items[i]);
        }
      
        cartItemList = cartItemList.substring(0, cartItemList.length - 1);
        cartItemList = cartItemList + "]'";
        console.log('cartItemList: ' + cartItemList);

        $http.get("http://localhost:8100/api/webservice/addItemsToCart?cartItemList=" + cartItemList)
            .success(function(data) {
            	if($scope.data.prescriptionChoice == 'A')
            	{
                $state.go('app.orderdetails');
                }
                else
                {
                 $state.go('app.uploadpage');
                }
                console.log(data);
            })
            .error(function(data) {
                alert("Sorry, there was an error placing" + items[i].item);
                console.log("error");

            });     
    }
}])
//end
//start OrderDetailsCtrl
.controller('OrderDetailsCtrl', ['$scope', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', 'CheckNetwork', function($scope, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork) {
    console.log('OrderDetailsCtrlmethod called');
    $scope.data = {
        "store": $SelectedStore.selectedStore,
        "brandName": $SelectedStore.getselectedBrandItem().label,
        "circle": $SelectedValues.getSelectedCircle()
    };
    $scope.order = {
        "quantity": 1,
        "offerstatus": ''
    };
    //TODO hardcoding this for now
    $scope.data.store.country = 'India';

    var selectedBrand = $SelectedStore.getselectedBrandItem();
    var selectedStore = $scope.data.store;
    console.log('selected brand value in OrderDetailsCtrl:' + selectedBrand.label);
    console.log('store value in OrderDetailsCtrl:' + $scope.data.store.storename);

    $scope.submitorder = function(order) {
    
        if (selectedBrand.name == null) {
            selectedBrand.name = '';
            console.log('selectedBrand.name is null');
        }

        order.addressline2 = $CheckNetwork.UndefinedToEmpty(order.addressline2);
        order.offercode = $CheckNetwork.UndefinedToEmpty(order.offercode);

        var attachmentId = $SelectedValues.getAttachmentId();

        console.log('addressline2 ' + order.addressline2);
        
        if(order.email == '' || order.email === undefined)
        {
        alert("Email can not be empty!");
        }
        else if(order.phone == '' || order.phone === undefined)
        {
        alert("Phone can not be empty!");
        }
        else if(order.addressline1 == '' || order.addressline1 === undefined)
        {
        alert("Address line 1 can not be empty!");
        }
		else if(order.isTermsChecked == false)
        {
        alert("Please accept the Terms and Conditions!");
        }
        else
        {
        //TODO do not hardcode city and state
        $http.get("http://localhost:8100/api/webservice/saveOrder?circle=" + $SelectedValues.getSelectedCircle() + "&name=" + order.name + "&phoneNumber=" + order.phone + "&emailID=" + order.email + "&age=0" + "&addressLine1=" + order.addressline1 + "+&addressLine2=" + order.addressline2 + "&city=Mumbai" + "&state=Maharastra" + "&country=India" + "&attachmentid=" + attachmentId + "&offerCode=" + order.offercode)
            .success(function(data) {

                console.log("data:" + data);
                console.log('data.orderDetailsList[0].errors.errors.length:' + data.orderDetailsList[0].errors.errors.length);
                console.log('data.orderDetailsList[0].trackingId:' + data.orderDetailsList[0].trackingId);
                console.log('data.patient:addressLine1:' + data.patient.addressLine1);

                if (data.orderDetailsList[0].errors.errors.length == 0) {
                    console.log('no errors in order');

                    $SelectedValues.emptyItems();
                    $OrderDetailsService.setorderDetails(data);
                    $OrderDetailsService.setScreen('orderCompletion');
                    $state.go('app.ordercompletion');
                } else {
                    alert("Could submit order, please check if all fields filled properly.");
                }
            })
            .error(function(data) {
                $CheckNetwork.check();
                alert("some error occured:" + data);
            });
         }

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
}])    //end OrderDetailsCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start TrackOrderCtrl
.controller('TrackOrderCtrl', ['$scope', '$http', '$state', 'SelectedValues', 'SelectedStore', 'OrderDetailsService','CheckNetwork', function($scope, $http, $state, $SelectedValues, $SelectedStore, $OrderDetailsService, $CheckNetwork) {
        console.log('TrackOrderCtrl called');
        $scope.data = {
            "trackingId": '',
            "status": ''
        };

        $scope.getOrderDetails = function() {
            $http.get("http://localhost:8100/api/webservice/showOrderCollectionDetails?trackingId=" + $scope.data.trackingId)
                .success(function(data) {
                    console.log('order details fetched:' + data);
                    if (data != -2) {
                        $OrderDetailsService.setorderDetails(data);
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
//start OrderCompletionCtrl
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

 $scope.getStatusText = function(data)
        {
        console.log("getstatustext called with:"+data);
         if(data == "1")
         return "Placed (Yet to be accepted)";

      if(data == "2")
         return "Accepted";

      if(data == "3")
         return "Dispatched";

      if(data == "4")
         return "Delivered";
         
         return '';
        };
        
        $scope.cancelOrder = function(orderId) {
            $http.get("http://localhost:8100/api/webservice/cancelOrder?orderId=" + orderId)
                .success(function(data) {
                    $scope.data.cancelSuccess = data;
                    console.log('order cancelled:' + data);
                })
                .error(function(data) {
                $CheckNetwork.check();
                alert("There was some problem:"+data);
                
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
        console.log("feedback name:"+feedback.name);
        
        if(feedback.message == '' || feedback.message === undefined)
        {
         alert("message can not be empty!");
        }
		else
		{
        $http.get("http://localhost:8100/api/webservice/sendFeedback?name=" + feedback.name + "&emailID=" + feedback.email + "&message=" + feedback.message)
            .success(function(data) {
                $scope.data.feedbackstatus = data;
                console.log('feedback submit success:' + data);
             	feedback.name="";
			    feedback.email="";
			    feedback.message="";
								
            })
            .error(function(data) {
            $CheckNetwork.check();
            });
            }
    }

}])
//end FeedbackCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start FooterCtrl
.controller('FooterCtrl', ['$scope', '$http', 'SelectedValues', 'SelectedStore', 'OrderDetailsService', '$state','CheckNetwork', function($scope, $http, $SelectedValues, $SelectedStore, $OrderDetailsService, $state, $CheckNetwork) {
    console.log("footer ctrl");
    $scope.cartItems; 
      
     $scope.$watch(function() {
        return $SelectedValues.getItems().length;
    }, function(value) {
        $scope.cartItems = value;
    });

  
}])
//end FooterCtrl

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start Requestmedicine
.controller('requestmedicineCtrl', ['$scope', '$http', 'SelectedValues', 'SelectedStore', '$state','CheckNetwork', function($scope, $http, $SelectedValues,$SelectedStore, $state, $CheckNetwork) {

  $scope.data = {
        message:'',
        medicine: $SelectedValues.getselectedBrandItem().label
    };
  
    var selectedCircle = $SelectedValues.getSelectedCircle();
    console.log(selectedCircle);
 
    console.log('$scope.data.medicine :'+$scope.data.medicine );
   
    $scope.submitfeedback = function(feedback) {
        console.log(feedback.name);
        $http.get("http://localhost:8100/api/webservice/requestNewBrand?brandName="+$scope.data.medicine+"&emailID=" + feedback.email + "&phoneNumber=" + feedback.phone + "&circle=" +selectedCircle )
            .success(function(data) {
                $scope.data.feedbackstatus = data;
                console.log('feedback submit success:' + data);      
				$scope.data.message = data;
				 $scope.data.medicine = '';
				 feedback.email ='';
				 feedback.phone = '';
            })
            .error(function(data) {
            $CheckNetwork.check();
            });
    }

}])
//end Requestmedicine

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start LoginCtrl
app.controller('LoginCtrl', ['$log','$scope','$state','$http' , function($log,$scope,$state,$http) {
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


}])
//end SignupCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start ProfileCtrl
.controller('ProfileCtrl', ['$scope',  function($scope) {


}])
//end ProfileCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//start LocationCtrl
.controller('LocationCtrl', ['$scope', 'SelectedValues', '$http', 'CheckNetwork', function($scope, $SelectedValues, $http, $CheckNetwork) {
console.log('------------------------------ 1.window.localStorage.getItem(---------------------------------------------');
        var circleData = window.localStorage.getItem("circleData");
        var cityData = window.localStorage.getItem("cityData");
console.log('------------------------------ 2.$scope.data = {---------------------------------------------');
        $scope.data = {
            circleOptions: ['Select City First!'],
            selectedCircle: circleData,
            cityOptions: [],
            selectedCity: cityData,
        };
console.log('------------------------------ 3.if ($scope.data.selectedCity != null) {---------------------------------------------');
        if ($scope.data.selectedCity != null) {
            console.log("scope.data.selectedCity:" + $scope.data.selectedCity);
            $SelectedValues.setSelectedCity($scope.data.selectedCity);
        }
console.log('----------------------------  4.if ($scope.data.selectedCircle != null) {-----------------------------------------------');
        if ($scope.data.selectedCircle != null) {
            console.log("$scope.data.selectedCircle:" + $scope.data.selectedCircle);
            $SelectedValues.setSelectedCircle($scope.data.selectedCircle);
        }
console.log('------------------------------5.http://localhost:8100/api/webservice/getCityArray---------------------------------------------');
        $http.get("http://localhost:8100/api/webservice/getCityArray")
            .success(function(cities) {
                $scope.data.cityOptions = cities;
                $scope.data.selectedCity = cityData;
            })
            .error(function() {
                $CheckNetwork.check();
            });
console.log('--------------------------------6.cityData != null && cityData.length-------------------------------------------');
        if (cityData != null && cityData.length > 0) {
            console.log("If city selected is not empty, then get circles list!");
            //TODO this is repeat of below code
            console.log("$scope.data.selectedCity" + $scope.data.selectedCity);
            window.localStorage.setItem("city", "true");
            $SelectedValues.setSelectedCity($scope.data.selectedCity);
            $http.get("http://localhost:8100/api/webservice/getCircleArray?city=" + $scope.data.selectedCity)
                .success(function(circles) {
                    $scope.data.circleOptions = circles.circleArray;
                    console.log(circles);
                })
                .error(function() {
                    $CheckNetwork.check();
                });
        }
console.log('-----------------------------7.$scope.citySelected = function()----------------------------------------------');
        $scope.citySelected = function() {
        	console.log("City selected event fired!");
            console.log("$scope.data.selectedCity" + $scope.data.selectedCity);
            window.localStorage.setItem("city", "true");
            $SelectedValues.setSelectedCity($scope.data.selectedCity);
            $http.get("http://localhost:8100/api/webservice/getCircleArray?city=" + $scope.data.selectedCity)
                .success(function(circles) {
                    $scope.data.circleOptions = circles.circleArray;
                    console.log(circles.circleArray);

                })
                .error(function() {
                    $CheckNetwork.check();
                });
        };
console.log('------------------------------ 8.$scope.circleSelected = function()---------------------------------------------');
        $scope.circleSelected = function() {
            console.log("Circle selected event fired!");
            $SelectedValues.setSelectedCity($scope.data.selectedCity);
            $SelectedValues.setSelectedCircle($scope.data.selectedCircle);
            window.localStorage.setItem("circle", "true");
        };
    }]) //end LocationCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//start UploadpageCtrl
.controller('UploadpageCtrl', ['$scope','$cordovaCamera','$http','CheckNetwork', 'SelectedValues',function($scope,$cordovaCamera,$http, $CheckNetwork, $SelectedValues) {
$scope.source = {};
$scope.imgUpload = function(sourceTypevalue){
  document.addEventListener("deviceready", function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: sourceTypevalue,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageURI) {
      var image = document.getElementById('myImage');
      image.src = imageURI;
      alert("imageURI: "+ imageURI);
      $scope.source=image.src;
      $http.get("http://localhost:8100/api/webservice/uploadPrescriptionFile?inputFilePath="+ imageURI)
            .success(function(id) {    
            alert("Successfully Uploaded:"+id);
            $SelectedValues.setAttachmentId(id);
            })
            .error(function(error) {
            alert("Fail.due to "+error);
            $CheckNetwork.check();
            });
    }, function(err) {
      // error
      alert("Sorry!No picture was selected");
    });

  }, false);
};
}]);
//end UploadpageCtrl
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//start SelectValues service
//TODO: Probably we can move this to a seperate JS file
app.service('SelectedValues', function($q) {
        var selectedBrand = {};
        var selectedBrandItem = {};
        var selectedCircle = '';
        var selectedCity='';
		var items=[];
		var attachmentId='';
        return {
        
        	retrieveCircleFromStorage: function() {
        	selectedCircle = window.localStorage.getItem("circleData");
       		console.log("circle data retreived from storage:"+selectedCircle);
        	},
		
			retrieveCityFromStorage: function() {
        	selectedCity = window.localStorage.getItem("cityData");
        	console.log("city data retreived from storage:"+selectedCity);
        	},
        	
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
            console.log("setcircle:"+x);
                selectedCircle = x;
                window.localStorage.setItem("circleData",x);
                
            },
            
			getAttachmentId: function() {
                return attachmentId;
            },
            
            setAttachmentId: function(x) {
            console.log("set attachmentId:"+x);
                attachmentId= x;              
            },
            
            getSelectedCity: function() {
                return selectedCity;
            },
            setSelectedCity: function(x) {
            console.log("setCity:"+x)
                selectedCity = x;
                window.localStorage.setItem("cityData",x);
            },
            getselectedBrandItem: function() {
                return selectedBrandItem;
            },
            setselectedBrandItem: function(x) {
                selectedBrandItem = x;
            },
						setItems: function(x) {
                items.push(x);
            },
            
			getItems: function(){
			console.log("get items:"+items);
								return items;
			},
			
			removeItems:function(x){
								var index=items.indexOf(x);
								items.splice(index,1);
			},
			
			emptyItems:function(){
			console.log("before empty items"+items.length);
				items=[];
				console.log("after empty items"+items.length);
			},
			
			updateItem: function(inventoryid, quantity) {
			    for (i = 0; i < items.length; i++) {
        			if (items[i].inventoryid == inventoryid) {
            		items[i].quantity = quantity;
        			}

    			}
			},
			
			isItemPresentInCart: function(inventoryid) {
			    for (i = 0; i < items.length; i++) {
        			if (items[i].inventoryid == inventoryid) {
            		return true;
        			}
    			}
    			return false;
			}
       
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
//TODO change the name to utility
app.service('CheckNetwork', function($q) {
    return {
        check: function() {
            if (window.Connection) {
                if (navigator.connection.type == Connection.NONE) {
                    console.log("No active internet connection!! Please check and try again");
                    alert("No active internet connection!!");
                }
            }
        },
        UndefinedToEmpty: function(data) {
        console.log("UndefinedToEmpty passed value:"+data);
            if (!data) {
            console.log("returned empty from UndefinedToEmpty");
                return '';
            }
            else
            {
            return data;
            }
        },

    }
})    //end SelectValues service

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

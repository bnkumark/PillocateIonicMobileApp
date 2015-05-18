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

.controller('PlaylistsCtrl', ['$scope','$http','$state','SelectedValues','$ionicHistory','$ionicScrollDelegate','$ionicNavBarDelegate','$timeout', function($scope,$http,$state,$SelectedValues,$ionicHistory,$ionicScrollDelegate,$ionicNavBarDelegate, $timeout) {
  
  $ionicHistory.clearHistory();
  var airlines;
  var searchTerm;
  var searchGotFocus = false;
  $scope.data = { "airlines" : [], "search" : '', "circleOptions": [], selectedCircle : 'Thiruvanmiyur', 'cityOptions':[], selectedCity : 'Chennai' };
  //TODO get this from web service
  $scope.data.circleOptions = ["Adyar","Besant Nagar","Kandanchavadi","Kottivakkam","Thiruvanmiyur"];
  $scope.data.selectedCircle = 'Thiruvanmiyur';
    $scope.data.cityOptions = ["Chennai"];
  $scope.data.selectedCity = 'Chennai';

  console.log('PlaylistsCtrl method');

   
  $scope.scrollToTop = function()
  {
	  console.log('scrollToTop called');
	  var el = document.querySelector("#searchbox");
	  var top = el.getBoundingClientRect().top;	
	  var height = el.getBoundingClientRect().height;
	  console.log("JS Top: "+top+"height:"+height);
	  $ionicScrollDelegate.scrollTo(0,top-height,true);
  };
   
     $scope.clearAutoSuggestions = function() {
     
      if($scope.data.airlines.length != 0)
      {

      $scope.data.airlines = [];
      searchGotFocus = false;
       console.log('clearing the auto suggestions');
      };
     };
     
     //Start of  $scope.search
  $scope.search = function() {
  console.log($ionicScrollDelegate.getScrollPosition());
  console.log($ionicScrollDelegate.getScrollPosition());
  console.log('search method');
  if($scope.data.search != '')
  {
          $http.get("http://demo.pillocate.com/search/listOfBrandNameStartingWith?term="+$scope.data.search+"&circle="+$scope.data.selectedCircle)
    		.success(function(data) {
    		console.log('setting auto suggestions '+data);
																	                   $scope.data.airlines = data;
																	                    $SelectedValues.setSelectedBrand(data);
																	                     $SelectedValues.setSelectedCircle($scope.data.selectedCircle);
																	                     searchGotFocus = true ;
																		                })
																		                }
																		                else
																		                {
																		                console.log('setting auto suggestions failed');

																		                $scope.data.airlines = [];
																		                }
    		
							                	
    } 
    //end of  $scope.search
    
    //Start
    $scope.brandSelected = function(item) {
     console.log('brandSelected method');
    $SelectedValues.setselectedBrandItem (item);
}])

//start searchResultsCtrl
.controller('SearchResultsCtrl',['$scope','$http','SelectedValues','$ionicPopup','SelectedStore', function($scope, $http, $SelectedValues, $ionicPopup, $SelectedStore) {
console.log('searchResultsCtrl method');
var selectedBrand = $SelectedValues.getselectedBrandItem();

var selectedCircle = $SelectedValues.getSelectedCircle();
 $scope.data = { "items" : [], "localBrand" : selectedBrand};
 console.log($scope.data.items);

 
       $http.get("http://demo.pillocate.com/webservice/search?brandName="+selectedBrand.label+"&circle="+ selectedCircle +"&brandId="+selectedBrand.id+"&inventoryId="+selectedBrand.selectedInventoryId)
    	.success(function(data) {
    	console.log('searchResultsCtrl success');
																	                   $scope.data.items = data.storesList;
																		                });
																		                
	//Start
    $scope.storeSelected = function(item) {
    $SelectedStore.selectedStore =item;
    $SelectedStore.setselectedBrandItem($SelectedValues.getselectedBrandItem());
    }
    //end


}])
//end searchResultsCtrl

//start OrderDetailsCtrl
.controller('OrderDetailsCtrl',['$scope','$http','$state','SelectedValues','SelectedStore','OrderDetailsService', function($scope, $http,$state, $SelectedValues, $SelectedStore,$OrderDetailsService) {
	console.log('OrderDetailsCtrlmethod called');
	$scope.data = { "store" : $SelectedStore.selectedStore, "brandName" : $SelectedStore.getselectedBrandItem().label};
	$scope.order = { "quantity": 1, "offerstatus":''};
	$scope.data.store.circle = $SelectedValues.getSelectedCircle();
	var selectedBrand = $SelectedStore.getselectedBrandItem();
	var selectedStore = $scope.data.store;
		console.log('selected brand value in OrderDetailsCtrl:'+selectedBrand.label );
	console.log('store value in OrderDetailsCtrl:'+$scope.data.store.storename);
	
	$scope.submitorder = function(order)
	{
       $http.get("http://demo.pillocate.com/webservice/saveOrder?circle="+$SelectedValues.getSelectedCircle()+"&brandId="+selectedBrand.id+"&inventoryId="+selectedBrand.id+"&storeId="+selectedStore.storeId+"&name="+order.name+"&phoneNumber="+order.phone+"&emailID="+order.email+"&age="+order.age+"&addressLine1="+order.addressline1+"+&addressLine2="+order.addressline2+"&city="+selectedStore.city+"&state="+selectedStore.state+"&country=India&quantity="+order.quantity+"&offerCode="+order.offercode)
    	.success(function(data) {
    	console.log('submitorder success:'+data);
    	console.log('data.errors values:' + data.orderStatusCommand.errors.errors.length);
    	if(data.orderStatusCommand.errors.errors.length == 0)
    	{
    	console.log('no errors in order');
    	$OrderDetailsService.setorderDetails(data.orderStatusCommand);
    	$OrderDetailsService.setScreen('orderCompletion'); 
         $state.go('app.ordercompletion');
    	}
    	else
    	{
    	}
    	             
	});

	};
	
	$scope.applyOffer = function()
	{
	$http.get("http://demo.pillocate.com/webservice/isValidOfferCode?offerCode="+$scope.order.offercode)
	.success(function(data) {
	$scope.order.offerstatus= data;
	})
	.error(function(data) {
		$scope.order.offerstatus= data;
	});
	}
}])
//end OrderDetailsCtrl

//start TrackOrderCtrl
.controller('TrackOrderCtrl',['$scope','$http','$state','SelectedValues','SelectedStore','OrderDetailsService', function($scope, $http,$state, $SelectedValues, $SelectedStore,$OrderDetailsService) {
	console.log('TrackOrderCtrl called');
	$scope.data = { "trackingId" : '', "status" : ''};
	
	$scope.getOrderDetails= function()
	{
	$http.get("http://demo.pillocate.com/webservice/showTrackedOrderDetails?trackingId="+$scope.data.trackingId)
    	.success(function(data) {
    	console.log('order details fetched:'+data); 
    	if(data != -2)
    	{
    	  	$OrderDetailsService.setorderDetails(data.orderStatusCommand); 
    	  	    	$OrderDetailsService.setScreen('orderCompletion'); 
         $state.go('app.ordercompletion');   
                  $scope.data.status = "";
         } 	  
         else
         {
         $scope.data.status = "Invalid Tracking Id";
         }           
	});

	}
}])
//end TrackOrderCtrl


//start OrderDetailsCtrl
.controller('OrderCompletionCtrl',['$scope','$http','SelectedValues','$ionicHistory','SelectedStore','OrderDetailsService','$state', function($scope, $http, $SelectedValues, $ionicHistory, $SelectedStore,$OrderDetailsService,$state) {
$ionicHistory.clearHistory();
if($OrderDetailsService.getReload() == false)
{
$state.go($state.current, {}, {reload: true});
$OrderDetailsService.setReload(true);
console.log('reloading order complete');
}
else
{
console.log('normally loading the order complete');
$OrderDetailsService.setReload(false);
}
	console.log('OrdercompletionCtrl called with:' + $OrderDetailsService.getScreen());
	var screen = $OrderDetailsService.getScreen();
	$scope.data = { "trackingId":'',"orderDetails" : $OrderDetailsService.getorderDetails(), "showTracking":(screen != 'orderCompletion'), "showOrderDetails": (screen == 'orderCompletion'), "canceSuccess":''};
	console.log('showTracking:'+$scope.data.showTracking+' showOrderDetails:'+$scope.data.showOrderDetails);
	
	$scope.goHome = function()
	{
	$state.go('app.playlists');
	};
	
	$scope.cancelOrder = function(orderId)
	{
	$http.get("http://demo.pillocate.com/webservice/cancelOrder?orderId="+orderId)
    	.success(function(data) {
    	$scope.data.canceSuccess = "Your order has been cancelled!";
    	console.log('order cancelled:'+data);   	             
	});

	};
		
}])
//end OrdercompletionCtrl

//start FeedbackCtrl
.controller('FeedbackCtrl',['$scope','$http','SelectedValues','SelectedStore','OrderDetailsService','$state', function($scope, $http, $SelectedValues, $SelectedStore,$OrderDetailsService,$state) {
	
	$scope.data = {"feedbackstatus" : ''};
	$scope.submitfeedback = function(feedback)
	{
	$http.get("http://demo.pillocate.com/webservice/sendFeedback?name="+feedback.name+"&emailID="+feedback.email+"&message="+feedback.message)
    	.success(function(data) {
    	$scope.data.feedbackstatus = data;
    	console.log('feedback submit success:'+data);   	             
	});
}

}]);
//end FeedbackCtrl


//start SelectValues service
//TODO: Probably we can move this to a seperate JS file
app.service('SelectedValues', function($q) {
var selectedBrand = {};
var selectedBrandItem = {};
var selectedCircle ={};
  return {
  getSelectedBrand : function(id) {
  for(i=0;i<selectedBrand.length;i++){
				if(selectedBrand[i].id == id){
					return selectedBrand[i];
				}
				}
  return null;
  },
  setSelectedBrand : function(x) {
  selectedBrand = x;
  },
  getSelectedCircle : function() {
    return selectedCircle;
  },
  setSelectedCircle : function(x) {
  selectedCircle = x;
  },
 getselectedBrandItem : function() {
    return selectedBrandItem ;
  },
  setselectedBrandItem : function(x) {
  selectedBrandItem = x;
  },

  }
})
//end SelectValues service

//start SelectStore service
//TODO: Probably we can move this to a seperate JS file
app.service('SelectedStore', function($q) {
var selectedBrandItem = {};
  return {
  selectedStore : '={}',
getselectedBrandItem : function() {
    return selectedBrandItem ;
  },
  setselectedBrandItem : function(x) {
  selectedBrandItem = x;
  },

  }
})
//end SelectValues service


//start OrderDetailsService
//TODO: Probably we can move this to a seperate JS file
app.service('OrderDetailsService', function($q) {
var orderDetails = {};
var screen = {};
var reloading = {};
  return {
getorderDetails : function() {
    return orderDetails ;
  },
  setorderDetails : function(x) {
  orderDetails = x;
  },
getScreen : function() {
    return screen;
  },
  setScreen : function(x) {
  screen = x;
  },
getReload : function() {
    return reloading ;
  },
  setReload : function(x) {
  reloading = x;
  },

  }
})
//end OrderDetailsService
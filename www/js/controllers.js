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

.controller('PlaylistsCtrl', ['$scope','$http','$state','SelectedValues','$ionicPopup','$ionicScrollDelegate', function($scope,$http,$state,$SelectedValues,$ionicPopup,$ionicScrollDelegate) {

  var airlines;
  var searchTerm;
  var searchGotFocus = false;
  $scope.data = { "airlines" : [], "search" : '', "circleOptions": [], selectedCircle : 'Thiruvanmiyur', 'cityOptions':[], selectedCity : 'Chennai' };
  $scope.data.circleOptions = ["Kandanchavadi","Kottivakkam","Thiruvanmiyur"];
  $scope.data.selectedCircle = 'Thiruvanmiyur';
    $scope.data.cityOptions = ["Chennai"];
  $scope.data.selectedCity = 'Chennai';

// $state.go('app.searchresults');
   console.log('PlaylistsCtrl method');

   
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
//          $ionicScrollDelegate.$getByHandle('searchbox').scrollTop();
 console.log('search method');
if($scope.data.search != '')
{
		//$http.get("http://192.168.49.1:8100/api/search/listOfBrandNameStartingWith?term="+$scope.data.search+"&circle="+$scope.data.selectedCircle)
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
   /* var alertPopup = $ionicPopup.alert({
     title: 'brandSelected method!',
     template: 'It might taste good'
   });
*/
 console.log('brandSelected method');
    $SelectedValues.setselectedBrandItem (item);
  /*  $SelectedValues.selectedBrandId =item.id;
        $SelectedValues.selectedBrandName=item.label;
        $SelectedValues.selectedCircle = 'Thiruvanmiyur';
        $SelectedValues.selectedInventoryId = item.id;
*/         // $state.go('app.searchresults');

    }
    //end
  
  
  
  
}])

//start searchResultsCtrl
/*.controller('SearchResultsCtrl',['$scope','$http','SelectedValues','$ionicPopup','SelectedStore','$stateParams', function($scope, $http, $SelectedValues, $ionicPopup, $SelectedStore,$stateParams) {
console.log('searchResultsCtrl method'+$stateParams.id);
*/
.controller('SearchResultsCtrl',['$scope','$http','SelectedValues','$ionicPopup','SelectedStore', function($scope, $http, $SelectedValues, $ionicPopup, $SelectedStore) {
console.log('searchResultsCtrl method');
var selectedBrand = $SelectedValues.getselectedBrandItem();

var selectedCircle = $SelectedValues.getSelectedCircle();
 /*$scope.data = { "items" : [{"storeName":"Demo Thiruvanmiyur Pharma"},{"storeName":"Demo Thiruvanmiyur Pharma"}] };*/
 $scope.data = { "items" : [], "localBrand" : selectedBrand};
 console.log($scope.data.items);

 
//$http.get("http://demo.pillocate.com/webservice/search?brandName=T.T-0.5ML&circle=Thiruvanmiyur&brandId=1828&inventoryId=1828")
//TODO we need to read the combobox values
      //$http.get("http://192.168.49.1:8100/api/webservice/search?brandName="+selectedBrand.label+"&circle="+ selectedCircle +"&brandId="+selectedBrand.id+"&inventoryId="+selectedBrand.selectedInventoryId)
       $http.get("http://demo.pillocate.com/webservice/search?brandName="+selectedBrand.label+"&circle="+ selectedCircle +"&brandId="+selectedBrand.id+"&inventoryId="+selectedBrand.selectedInventoryId)
    	.success(function(data) {
    	console.log('searchResultsCtrl success');
																	                   $scope.data.items = data.storesList;
																		                });
																		                
	//Start
    $scope.storeSelected = function(item) {
    
    $SelectedStore.selectedStore =item;
    $SelectedStore.setselectedBrandItem($SelectedValues.getselectedBrandItem());
     //$state.go('app.orderdetails'); //TODO comment
    }
    //end


}])
//end searchResultsCtrl

//start OrderDetailsCtrl
.controller('OrderDetailsCtrl',['$scope','$http','$state','SelectedValues','SelectedStore','OrderDetailsService', function($scope, $http,$state, $SelectedValues, $SelectedStore,$OrderDetailsService) {
	console.log('OrderDetailsCtrlmethod called');
	$scope.data = { "store" : $SelectedStore.selectedStore, "brandName" : $SelectedStore.getselectedBrandItem().label};
	var selectedBrand = $SelectedStore.getselectedBrandItem();
	var selectedStore = $scope.data.store;
		console.log('selected brand value in OrderDetailsCtrl:'+selectedBrand.label );
	console.log('store value in OrderDetailsCtrl:'+$scope.data.store.storename);
	
	$scope.submitorder = function(order)
	{
     	//$http.get("http://192.168.49.1:8100/api/webservice/saveOrder?brandName="+selectedBrand.label+"&circle="+$SelectedValues.getSelectedCircle()+"&brandId="+selectedBrand.id+"&inventoryId="+selectedBrand.id+"&storeId="+selectedStore.storeId+"&name="+order.name+"&phoneNumber="+order.phone+"&emailID="+order.email+"&age="+order.age+"&addressLine1="+order.addressline1+"+&addressLine2="+order.addressline2+"&city="+selectedStore.city+"&state="+selectedStore.state+"&country=India&quantity="+order.quantity)
		$http.get("http://demo.pillocate.com/webservice/saveOrder?brandName="+selectedBrand.label+"&circle="+$SelectedValues.getSelectedCircle()+"&brandId="+selectedBrand.id+"&inventoryId="+selectedBrand.id+"&storeId="+selectedStore.storeId+"&name="+order.name+"&phoneNumber="+order.phone+"&emailID="+order.email+"&age="+order.age+"&addressLine1="+order.addressline1+"+&addressLine2="+order.addressline2+"&city="+selectedStore.city+"&state="+selectedStore.state+"&country=India&quantity="+order.quantity)
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

	}
}])
//end OrderDetailsCtrl

//start OrderDetailsCtrl
.controller('OrderCompletionCtrl',['$scope','$http','SelectedValues','SelectedStore','OrderDetailsService','$state', function($scope, $http, $SelectedValues, $SelectedStore,$OrderDetailsService,$state) {
if($OrderDetailsService.getReload() == false)
{
$state.go($state.current, {}, {reload: true});
$OrderDetailsService.setReload(true);
}
else
{
$OrderDetailsService.setReload(false);
}
	console.log('OrdercompletionCtrl called with:' + $OrderDetailsService.getScreen());
	var screen = $OrderDetailsService.getScreen();
	$scope.data = { "orderDetails" : $OrderDetailsService.getorderDetails(), "showTracking":(screen != 'orderCompletion'), "showOrderDetails": (screen == 'orderCompletion'), "canceSuccess":''};
	console.log('showTracking:'+$scope.data.showTracking+' showOrderDetails:'+$scope.data.showOrderDetails);
	
	$scope.getOrderDetails = function(trackingId)
	{
	//$http.get("http://192.168.49.1:8100/api/webservice/showTrackedOrderDetails?trackingId="+trackingId)
	$http.get("http://demo.pillocate.com/webservice/cancelOrder?orderId="+orderId)
    	.success(function(data) {
    	console.log('order details fetched:'+data); 
    	  	$OrderDetailsService.setorderDetails(data.orderStatusCommand); 
    	  	    	$OrderDetailsService.setScreen('orderCompletion'); 
					$state.go($state.current, {}, {reload: true});         
	});
	};
	
	$scope.goHome = function()
	{
	$state.go('app.playlists');
	};
	
	$scope.cancelOrder = function(orderId)
	{
	//$http.get("http://192.168.49.1:8100/api/webservice/cancelOrder?orderId="+orderId)
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
	//$http.get("http://192.168.49.1:8100/api/webservice/sendFeedback?name="+feedback.name+"&emailID="+feedback.email+"&message="+feedback.message)
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
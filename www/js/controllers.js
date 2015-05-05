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

.controller('PlaylistsCtrl', ['$scope','$http','$state','SelectedValues','$ionicPopup', function($scope,$http,$state,$SelectedValues,$ionicPopup) {

  var airlines;
  var searchTerm;
  var searchGotFocus = false;
  $scope.data = { "airlines" : [], "search" : '', "circleOptions": [], selectedCircle : 'Thiruvanmiyur' };
  $scope.data.circleOptions = ["Kandanchavadi","Kottivakkam","Thiruvanmiyur"];
  $scope.data.selectedCircle = 'Thiruvanmiyur';
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
    $SelectedStore.selectedBrand = $scope.data.localBrand;
     //$state.go('app.orderdetails'); //TODO comment
    }
    //end


}])
//end searchResultsCtrl

//start OrderDetailsCtrl
.controller('OrderDetailsCtrl',['$scope','$http','SelectedValues','SelectedStore', function($scope, $http, SelectedValues, $SelectedStore) {
	console.log('OrderDetailsCtrlmethod');
	$scope.data = { "store" : $SelectedStore.selectedStore, "brandName" : SelectedValues.getselectedBrandItem().label};
	var selectedBrand = SelectedValues.getselectedBrandItem();
	var selectedStore = $scope.data.store;
		console.log('selected brand value in OrderDetailsCtrl'+selectedBrand.label );
	console.log('store value in OrderDetailsCtrl'+$scope.data.store.storename);
	
	$scope.submitorder = function(order)
	{
     	$http.get("http://192.168.49.1:8100/api/webservice/saveOrder?brandName="+selectedBrand.label+"&circle="+SelectedValues.getSelectedCircle()+"&brandId="+selectedBrand.id+"&inventoryId="+selectedBrand.id+"&storeId="+selectedStore.storeId+"&name="+order.name+"&phoneNumber="+$scope.phone+"&emailID="+$scope.email+"&age="+$scope.age+"&addressLine1="+$scope.addressline1+"+&addressLine2="+$scope.addressline2+"&city="+selectedStore.city+"&state="+selectedStore.state+"&country=India&quantity="+$scope.quantity)
//    	$http.get("http://192.168.49.1:8100/api/webservice/saveOrder?brandName="+$SelectedStore.selectedBrandName+"&circle="+$SelectedValues.getSelectedCircle() +"&brandId="+$SelectedValues.selectedBrand.id+"&inventoryId="+$SelectedValues.selectedInventoryId)
		//$http.get("http://demo.pillocate.com/webservice/saveOrder?brandName="+$SelectedStore.selectedBrandName+"&circle="+$SelectedValues.selectedCircle +"&brandId="+$SelectedValues.selectedBrand.id+"&inventoryId="+$SelectedValues.selectedInventoryId)
    	.success(function(data) {
    	console.log('searchResultsCtrl success'+data);
																	                   
																		                });

	}
}]);
//end searchResultsCtrl

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

  return {
  selectedStore : '={}',

  }
})
//end SelectValues service
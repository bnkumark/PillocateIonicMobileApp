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

.controller('PlaylistsCtrl', ['$scope','$http','$state','SelectedValues', function($scope,$http,$state,$SelectedValues) {

  var airlines;
  var searchTerm;
  var searchGotFocus = false;
  $scope.data = { "airlines" : [], "search" : '' };
// $state.go('app.searchresults');
   console.log('PlaylistsCtrl method');

   
     $scope.clearAutoSuggestions = function() {
      console.log('clearAutoSuggestions called');
      if($scope.data.airlines.length != 0)
      {
      $scope.data.airlines = [];
      searchGotFocus = false;
      };
     };
     
     //Start of  $scope.search
  $scope.search = function() {
   
 console.log('search method');
if($scope.data.search != '')
{
    	$http.get("http://demo.pillocate.com/search/listOfBrandNameStartingWith?term="+$scope.data.search+"&circle=Thiruvanmiyur")
    	.success(function(data) {
																	                   $scope.data.airlines = data;
																	                     searchGotFocus = true ;
																		                })
																		                }
																		                else
																		                {
																		                $scope.data.airlines = [];
																		                }
    		
							                	
    } 
    //end of  $scope.search
    
    //Start
    $scope.brandSelected = function(item) {
    
    $SelectedValues.selectedBrandId =item.id;
        $SelectedValues.selectedBrandName=item.label;
        $SelectedValues.selectedCircle = 'Thiruvanmiyur';
        $SelectedValues.selectedInventoryId = item.id;
//    $state.go('app.searchresults');
    }
    //end
  
  
  
  
}])

//start searchResultsCtrl
.controller('SearchResultsCtrl',['$scope','$http','SelectedValues', function($scope, $http, $SelectedValues) {
console.log('searchResultsCtrl method');
 /*$scope.data = { "items" : [{"storeName":"Demo Thiruvanmiyur Pharma"},{"storeName":"Demo Thiruvanmiyur Pharma"}] };*/
 $scope.data = { "items" : [] };
 console.log($scope.data.items);


  
//$http.get("http://demo.pillocate.com/webservice/search?brandName=T.T-0.5ML&circle=Thiruvanmiyur&brandId=1828&inventoryId=1828")
  	$http.get("http://demo.pillocate.com/webservice/search?brandName="+$SelectedValues.selectedBrandName+"&circle="+$SelectedValues.selectedCircle +"&brandId="+$SelectedValues.selectedBrandId+"&inventoryId="+$SelectedValues.selectedInventoryId)
    	.success(function(data) {
    	console.log('searchResultsCtrl success');
																	                   $scope.data.items = data.storesList;

																		                })

}]);
//end searchResultsCtrl

//TODO: Probably we can move this to a seperate JS file
app.service('SelectedValues', function($q) {
  return {
  selectedCircle : '=test',
  selectedCity : '=',
  selectedBrandId :'=',
  selectedBrandName: '=',
  selectedInventoryId :'=',
  }
})
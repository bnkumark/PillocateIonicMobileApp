var myApp = angular.module('RateSellerModule', [])
.directive('ionicRatings', function () {
    return {
      restrict: 'AE',
      replace: true,
      template: '<div class="text-center ionic_ratings">' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(1)" ng-show="rating < 1" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(1)" ng-show="rating > 0" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(2)" ng-show="rating < 2" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(2)" ng-show="rating > 1" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(3)" ng-show="rating < 3" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(3)" ng-show="rating > 2" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(4)" ng-show="rating < 4" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(4)" ng-show="rating > 3" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(5)" ng-show="rating < 5" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(5)" ng-show="rating > 4" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '</div>',
      scope: {
        ratingsObj: '=ratingsobj'
      },
      link: function(scope, element, attrs) {

        //Setting the default values, if they are not passed
        scope.iconOn = scope.ratingsObj.iconOn || 'ion-ios-star';
        scope.iconOff = scope.ratingsObj.iconOff || 'ion-ios-star-outline';
        scope.iconOnColor = scope.ratingsObj.iconOnColor || 'rgb(200, 200, 100)';
        scope.iconOffColor = scope.ratingsObj.iconOffColor || 'rgb(200, 100, 100)';
        scope.rating = scope.ratingsObj.rating || 1;
        scope.minRating = scope.ratingsObj.minRating || 1;
        scope.readOnly = scope.ratingsObj.readOnly || false;

        //Setting the color for the icon, when it is active
        scope.iconOnColor = {
          color: scope.iconOnColor
        };

        //Setting the color for the icon, when it is not active
        scope.iconOffColor = {
          color: scope.iconOffColor
        };

        //Setting the rating
        scope.rating = (scope.rating > scope.minRating) ? scope.rating : scope.minRating;

        //Setting the previously selected rating
        scope.prevRating = 0;

        //Called when he user clicks on the rating
        scope.ratingsClicked = function(val) {
          if (scope.minRating !== 0 && val < scope.minRating) {
            scope.rating = scope.minRating;
          } else {
            scope.rating = val;
          }
          scope.prevRating = val;
          scope.ratingsObj.callback(scope.rating);
        };

        //Called when he user un clicks on the rating
        scope.ratingsUnClicked = function(val) {
          if (scope.minRating !== 0 && val < scope.minRating) {
            scope.rating = scope.minRating;
          } else {
            scope.rating = val;
          }
          if (scope.prevRating == val) {
            if (scope.minRating !== 0) {
              scope.rating = scope.minRating;
            } else {
              scope.rating = 0;
            }
          }
          scope.prevRating = val;
          scope.ratingsObj.callback(scope.rating);
        };
      }
    }
  })
  
.controller('RateSellerCtrl', ['$scope', 'config', '$http', 'OrderDetailsService', '$state', '$rootScope','$ionicLoading', function ($scope, $config, $http, $OrderDetailsService, $state, $rootScope, $ionicLoading) {
    console.log("selectaddressCtrl");

    $scope.data = {};
	$scope.data.addToFavorite = true;
	$scope.data.rating = 4;
	$rootScope.hideTabFooterCls = 'hide-tab-footer';

	$scope.ratingsObject = {
		iconOn: 'ion-ios-star',
		iconOff: 'ion-ios-star-outline',
		iconOnColor: '#33cd5f',
		iconOffColor: 'rgb(200, 100, 100)',
		rating: 4,
		minRating: 1,
		readOnly:false,
		callback: function(rating) {
		  $scope.ratingsCallback(rating);
		}
	};

	$scope.ratingsCallback = function(rating) {
		$scope.data.rating = rating;
	};

	var loadOrderDetail = function () {
		
		$OrderDetailsService.getOrdersForReview().then(function(orderDetail) {
			console.log('Order detail found for review '+orderDetail.brandNames);
			
			$scope.data.order = orderDetail;
			
			
		},function(errorStatus){
			console.log('Order detail not found for review');
			$rootScope.hideTabFooterCls = '';
			$state.go('app.start');
		});
	};
	
	$scope.$on('$ionicView.enter', function() {
		$scope.data.addToFavorite = false;
		$scope.data.note = '';
    	loadOrderDetail();
    });
	
	$scope.rateSeller = function(){
		
		console.log('Selected rating is : '+ $scope.data.rating);
		console.log('Order Detail '+$scope.data.order.trackingId+' : '+$scope.data.order.storeId+' : '+$scope.data.order.storeName);
		
		$ionicLoading.show({
			template: 'Please wait...',
			hideOnStateChange: true
		});
		
		// Reviewing 
		$http.get($config.serverUrl + "webservice/rateSeller?storeId=" + $scope.data.order.storeId + "&rating=" + $scope.data.rating + "&orderId="+ $scope.data.order.trackingId)
		.success(function (data) {
			
			var ratingSuccess = true;
			
			if($scope.data.addToFavorite )
			{
				/*$http.get($config.serverUrl + "webservice/setFavourite?storeId=" + $scope.data.order.storeId + "&orderId="+ $scope.data.order.trackingId)
				.success(function (data) {
					
					ratingSuccess = true;
					
				})
				.error(function (data) {
					alert("Error to add favorites, try again later.");
					ratingSuccess = false;
					
				}); */
				var storeId = $scope.data.order.storeId;
				if(!storeId)
				{
					storeId = "0";
				}
				
				$OrderDetailsService.addToFavoriteStore(storeId);
			}
			
			$ionicLoading.hide();
			
			if(ratingSuccess)
			{
				$OrderDetailsService.markOrderReviewed($scope.data.order.trackingId).then(function(orderDetail) {
					console.log('Order detail reviewed successfully ');
					
					$scope.data.addToFavorite = false;
					$scope.data.note = '';
					
					loadOrderDetail();
					
					
				},function(errorStatus){
					$rootScope.hideTabFooterCls = '';
					$state.go('app.start');
				}); 
			}else{
				$rootScope.hideTabFooterCls = '';
				$state.go('app.start');
			}
					
			
		})
		.error(function (data) {
			alert("Error to rate seller, try again later.");
			$ionicLoading.hide();
			$rootScope.hideTabFooterCls = '';
			$state.go('app.start');
		});
						
	};
    
}])
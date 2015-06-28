// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
  
  if(window.Connection) {
   if(navigator.connection.type == Connection.NONE) {
  alert("No active internet connection!! Please check and try again");
   ionic.Platform.exitApp();
  }
/*  $ionicPopup.confirm({
                        title: "Internet Disconnected",
                        content: "The internet is disconnected on your device."
                    })
                    .then(function(result) {
                        if(!result) {
                            ionic.Platform.exitApp();
                        }
                    });
*/  
}
  
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.feedback', {
    url: "/feedback",
    views: {
      'menuContent': {
        templateUrl: "templates/feedback.html",
        controller: 'FeedbackCtrl'
      }
    }
  })

.state('app.login', {
    url: "/login",
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('app.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/signup.html',
        controller: 'SignupCtrl'
      }
    }
  })
      .state('app.uploadpage', {
    url: '/uploadpage',
    views: {
      'menuContent': {
        templateUrl: 'templates/uploadpage.html',
        controller: 'UploadpageCtrl'
      }
    }
  })
    .state('app.location', {
    url: '/location',
    views: {
      'menuContent': {
        templateUrl: 'templates/location.html',
        controller: 'LocationCtrl'
      }
    }
  })
    .state('app.home', {
      url: "/home",
      views: {
        'menuContent': {
          templateUrl: "templates/home.html",
          controller: 'HomeCtrl'
        }
      }
    })

 .state('app.searchresults', {
      url: "/searchresults",
      views: {
        'menuContent': {
          templateUrl: "templates/searchresults.html",
          controller: 'SearchResultsCtrl'
        }
      }
    })
	.state('app.buynow', {
      url: "/buynow",
      views: {
        'menuContent': {
          templateUrl: "templates/buynow.html",
          controller: 'BuyNowCtrl'
        }
      }
    })

 .state('app.ordercompletion', {
      url: "/ordercompletion",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "templates/ordercompletion.html",
          controller: 'OrderCompletionCtrl'
        }
      }
    })
 .state('app.trackorder', {
      url: "/trackorder",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "templates/trackorder.html",
          controller: 'TrackOrderCtrl'
        }
      }
    })

 .state('app.orderdetails', {
      url: "/orderdetails",
      views: {
        'menuContent': {
          templateUrl: "templates/orderdetails.html",
          controller: 'OrderDetailsCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});


/* var appi=angular.module('starter',['ngRoute']);
appi.config(function($routeProvider){
//set up routes
$routeProvider
.when('/signup',{
  templateUrl:'templates/signup.html',
  controller:'SignupCtrl'
});

}); */
/*angular.module('login', ['ionic', 'starter.controllers'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('ap', {
    url: "/ap",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
  .state('ap.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/signup.html',
        controller: 'SignupCtrl'
      }
    }
  })
});*/

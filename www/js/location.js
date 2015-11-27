var myApp = angular.module('locationModule', [])
.controller('LocationCtrl', ['$scope', 'config', 'SelectedValues', '$http', 'CheckNetwork', '$state', function ($scope, $config, $SelectedValues, $http, $CheckNetwork, $state) {

    var circleData = window.localStorage.getItem("circleData");
    var cityData = window.localStorage.getItem("cityData");

    $scope.data = {
        circleOptions: [],
        selectedCircle: circleData,
        cityOptions: [],
        selectedCity: cityData,
    };

    //$http.get($config.serverUrl+"webservice/getCityArray")
    $http.get($config.serverUrl + "webservice/getCityArray")
        .success(function (cities) {

            console.log("getting city array:" + cities)
            $scope.data.cityOptions = cities;
            $scope.data.selectedCity = cityData;
        })
        .error(function () {
            $CheckNetwork.check();
        });

    if (cityData != null && cityData.length > 0) {
        console.log("If city selected is not empty, then get circles list!");
        //TODO this is repeat of below code
        console.log("$scope.data.selectedCity" + $scope.data.selectedCity);

        $SelectedValues.setSelectedCity($scope.data.selectedCity);
        $http.get($config.serverUrl + "webservice/getCircleArray?city=" + $scope.data.selectedCity)
            .success(function (circles) {
                $scope.data.circleOptions = circles.circleArray;
                console.log(circles);
            })
            .error(function () {
                $CheckNetwork.check();
            });
    }

    function getCircles(city) {
        $http.get($config.serverUrl + "webservice/getCircleArray?city=" + city)
             .success(function (circles) {
                 $scope.data.circleOptions = circles.circleArray;
                 console.log(circles.circleArray);
             })
             .error(function () {
                 $CheckNetwork.check();
             });
    };

    $scope.citySelected = function () {
        console.log("City selected event fired!");
        console.log("$scope.data.selectedCity" + $scope.data.selectedCity);
        getCircles($scope.data.selectedCity);
    };

    $scope.circleSelected = function () {
        console.log("Circle selected event fired!");
    };

    $scope.setLocation = function () {
        if ($scope.data.selectedCity == '' || $scope.data.selectedCity === undefined || $scope.data.selectedCity == null) {
            alert("select city");
        }
        else if ($scope.data.selectedCircle == '' || $scope.data.selectedCircle === undefined || $scope.data.selectedCircle == null) {
            alert("select circle");
        }
        else {
            var items = $SelectedValues.getItems();
            var input = true;
            if (items.length > 0) {
                input = confirm("Setting location will clear cart items!");
            }

            if (input == true) {
                console.log("$scope.data.selectedCity" + $scope.data.selectedCity);

                console.log("$scope.data.setSelectedCircle" + $scope.data.selectedCircle);

                $SelectedValues.setSelectedCity($scope.data.selectedCity);
                $SelectedValues.setSelectedCircle($scope.data.selectedCircle);
                window.localStorage.setItem("circle", "true");
                window.localStorage.setItem("city", "true");
                $SelectedValues.emptyItems();
                $state.go('app.home');
            }
        }
    };
}]); //end LocationCtrl
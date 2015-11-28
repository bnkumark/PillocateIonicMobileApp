var myApp = angular.module('UploadpageModule', [])
.controller('UploadpageCtrl', ['$scope', 'config', '$cordovaCamera', '$http', '$state', 'CheckNetwork', 'SelectedValues', 'OrderDetailsService', '$ionicLoading', function ($scope, $config, $cordovaCamera, $http, $state, $CheckNetwork, $SelectedValues, $OrderDetailsService, $ionicLoading) {

    $scope.source = null;
    $scope.canGoToNext = false;

    $scope.goToOrderDetails = function () {
        if ($scope.canGoToNext == true) {
            if ($OrderDetailsService.getAllAddressKey().length > 0) {
                $state.go('app.selectaddress');
            }
            else {
                $state.go('app.orderdetails');
            }

        } else {
            alert("Upload the prescription first!");
        }
    };

    $scope.imgUpload = function (sourceTypevalue) {

        document.addEventListener("deviceready", function () {
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: sourceTypevalue,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                $scope.source = imageURI;

                var fnSuccess = function (r) {
                    $ionicLoading.hide();
                    var parsedResponse = JSON.parse(r.response);

                    console.log("upload success:" + r.response);

                    $SelectedValues.setAttachmentId(parsedResponse.attachmentId);
                    $scope.canGoToNext = true;
                }

                var fnError = function (r) {
                    $ionicLoading.hide();
                    console.log("upload failed:" + r);
                    alert("upload failed:" + r);
                }

                $ionicLoading.show({
                    template: 'Uploading prescription...'
                });

                var formURL = 'http://localhost:8100/api/webservice/uploadPrescriptionFile';
                var encodedURI = encodeURI(formURL);
                var fileURI = imageURI;
                var options = new FileUploadOptions();
                options.fileKey = "inputFile";
                options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
                //options.mimeType = "text/plain";
                var ft = new FileTransfer();
                ft.upload(fileURI, encodedURI, fnSuccess, fnError, options);
                $ionicLoading.hide();

            }, function (err) {
                // error
                alert("Sorry!No picture was selected");
            });

        }, false);

    };
}]);//end UploadpageCtrl
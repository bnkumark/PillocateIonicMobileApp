var myApp = angular.module('UploadpageModule', [])
.controller('UploadpageCtrl', ['$scope', 'config', '$cordovaCamera', '$http', '$state', 'CheckNetwork', 'SelectedValues', 'OrderDetailsService', '$ionicLoading','$timeout', function ($scope, $config, $cordovaCamera, $http, $state, $CheckNetwork, $SelectedValues, $OrderDetailsService, $ionicLoading, $timeout) {

    $scope.source = [];
    $scope.canGoToNext = false;
	$scope.data = {};
	$scope.data.note = '';
	
	$scope.source = $SelectedValues.getAttachmentFiles();
	
	//alert(' File '+$scope.source[0]);
	
	if($scope.source && $scope.source.length > 0)
	{
		$scope.canGoToNext = true;
	}
		
	$scope.clearAllAttachment = function () {
		console.log('Clearing attachments');
		$scope.source = [];
		$SelectedValues.clearAttachmentId();
		$scope.canGoToNext = false;
	};
	
	
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
	
	$scope.imgUpload1 = function (sourceTypevalue) {
	
		var fileUrl = 'file:///C:/Users/kamlesh/Pictures/'+sourceTypevalue+'.jpg';
		$scope.source.push(fileUrl);
		$SelectedValues.setAttachmentId(1745);
		$SelectedValues.setAttachmentFile(fileUrl);
		
		$ionicLoading.show({
			template: 'Uploading prescription...'
		});
		
		
				
		$timeout(function () {
			$ionicLoading.hide();
			alert("Network error, please try again");
		}, 1000);
		$scope.canGoToNext = true;
	};

    $scope.imgUpload = function (sourceTypevalue) {

        document.addEventListener("deviceready", function () {
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: sourceTypevalue,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true
            };

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                $scope.source.push(imageURI);

                var fnSuccess = function (r) {
                    $ionicLoading.hide();
                    var parsedResponse = JSON.parse(r.response);

                    console.log("upload success:" + r.response);
					//alert('Upload success ');
					//alert('Attachment id '+parsedResponse.attachmentId);

                    $SelectedValues.setAttachmentId(parsedResponse.attachmentId);
					$SelectedValues.setAttachmentFile(imageURI);
					//alert(' File '+imageURI);
                    $scope.canGoToNext = true;
					$ionicLoading.hide();
                }

                var fnError = function (r) {
					$scope.source.pop();
                    $ionicLoading.hide();
                    console.log("upload failed:" + r);
                    //alert("Upload failed, try again");
					alert("Network error, please try again");
					$ionicLoading.hide();
                }

                $ionicLoading.show({
                    template: 'Uploading prescription...'
                });

                var formURL = $config.serverUrl+'webservice/uploadPrescriptionFile';
                var encodedURI = encodeURI(formURL);
                var fileURI = imageURI;
                var options = new FileUploadOptions();
                options.fileKey = "inputFile";
                options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
                //options.mimeType = "text/plain";
                var ft = new FileTransfer();
                ft.upload(fileURI, encodedURI, fnSuccess, fnError, options);
				
				$timeout(function () {
					ft.abort();
				}, $config.photoUploadTimeout);
                
            }, function (err) {
                // error
                alert("Sorry!No picture was selected");
            });

        }, false);

    };
}]);//end UploadpageCtrl
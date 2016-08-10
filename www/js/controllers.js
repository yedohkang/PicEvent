angular.module('app.controllers', [])

.controller('homeCtrl', function($scope, Camera, ParsedText, OCR, $state, $ionicLoading) {

	   $scope.takePicture = function (options) {

	      var options = {
	         quality : 75,
	         targetWidth: 200,
	         targetHeight: 200,
	         sourceType: 1,
			     destinationType: 0
	      };

				$ionicLoading.show();
	      Camera.getPicture(options).then(function(imageData) {
					 $ionicLoading.show();
	         $scope.picture = imageData;
			  	 var imageURI = "data:image/jpeg;base64," + imageData;
			     var promise = OCR.parseImage(OCR.dataURItoBlob(imageURI), ParsedText);
			     promise.then(function success (response){
						 $ionicLoading.show();
				     ParsedText.setPageText(response);
				     $state.go('addEvent');
					   $ionicLoading.hide();
			     });
	      }, function(err) {
	         console.log(err);
	      });
	   };

	   $scope.getPicture = function (options) {

	      var options = {
	         quality : 75,
	         targetWidth: 200,
	         targetHeight: 200,
	         sourceType: 0,
				 	 destinationType: 0
	      };

				$ionicLoading.show();
	      Camera.getPicture(options).then(function(imageData) {
	         $scope.picture = imageData;
		  		 var imageURI = "data:image/jpeg;base64," + imageData;
				   var promise = OCR.parseImage(OCR.dataURItoBlob(imageURI), ParsedText);
				   promise.then(function success (response){
					   ParsedText.setPageText(response);
					   $state.go('addEvent');
					   $ionicLoading.hide();
			     });
	      }, function(err) {
	         console.log(err);
	      });
	   };

})

.controller('addEventCtrl', function($scope, $cordovaCalendar, $ionicPopup, ParsedText) {
	$scope.$on("$ionicView.beforeEnter", function(){
	var pageText = ParsedText.getPageText();
	console.log("in addevent ctrl: " + pageText);
	$scope.title = "";
	$scope.location1 = parseLocation(pageText);
	$scope.notes = makeDescription(pageText);
	$scope.startdate = new Date(parseYear(pageText), parseMonth(pageText) - 1, parseDay(pageText));
	$scope.starttime = new Date();
	$scope.starttime.setHours(parseHour(pageText), parseMinute(pageText));
	$scope.enddate = new Date(parseYear(pageText), parseMonth(pageText) - 1, parseDay(pageText));
	$scope.endtime = new Date();
	$scope.endtime.setHours(parseEndTime(pageText), parseMinute(pageText));

	console.log($scope.location1);
	console.log($scope.startdate);
	console.log($scope.starttime);
	console.log($scope.enddate);
	console.log($scope.endtime);


	/*
		$scope.createEvent = function(){
			var startDate = new Date($scope.startdate.getFullYear() ...)
	}

	*/

	$scope.createEvent = function(title, location1, notes, startdate, starttime, enddate, endtime){
		var startDate = new Date(startdate.getFullYear(), startdate.getMonth(), startdate.getDate(), starttime.getHours(), starttime.getMinutes());
		var endDate = new Date(enddate.getFullYear(), enddate.getMonth(), enddate.getDate(), endtime.getHours(), endtime.getMinutes());
		$cordovaCalendar.createEvent({
	      title: title,
	      location: location1,
	      notes: notes,
		  	startDate: startDate,
	      endDate: endDate
	    }).then(function (result) {
	      // success
	    }, function (err) {
			$ionicPopup.alert({
			     title: 'Error: ',
			     template: err
			});
	      // error
	    });
	}
});

})


.controller('eventAddedCtrl', function($scope) {

})

.controller('loggedOutCtrl', function($scope) {

})

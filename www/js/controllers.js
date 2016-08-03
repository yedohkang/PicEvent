angular.module('app.controllers', [])

.controller('homeCtrl', function($scope, Camera, ParsedText, OCR, $state) {

	   $scope.takePicture = function (options) {

	      var options = {
	         quality : 75,
	         targetWidth: 200,
	         targetHeight: 200,
	         sourceType: 1,
			  destinationType: 0
	      };

	      Camera.getPicture(options).then(function(imageData) {
	         $scope.picture = imageData;
			 var imageURI = "data:image/jpeg;base64," + imageData;
			 var promise = OCR.parseImage(OCR.dataURItoBlob(imageURI), ParsedText);
			 promise.then(function success (response){
				 ParsedText.setPageText(response);
				 $state.go('addEvent');
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

	         Camera.getPicture(options).then(function(imageData) {
	            $scope.picture = imageData;;
				var imageURI = "data:image/jpeg;base64," + imageData;
				var promise = OCR.parseImage(OCR.dataURItoBlob(imageURI), ParsedText);
				promise.then(function success (response){
					ParsedText.setPageText(response);
					$state.go('addEvent');
				}
			);
	         }, function(err) {
	            console.log(err);
	         });
	      };

		 // $scope.parseImage = parseImage;

		  //$scope.gotocalendar = handleAuthClick;


})

.controller('addEventCtrl', function($scope, $cordovaCalendar, $ionicPopup, ParsedText) {
	$scope.$on("$ionicView.beforeEnter", function(){
	var pageText = ParsedText.getPageText();
	console.log("in addevent ctrl" + pageText);
	$scope.title = "";
	$scope.location1 = parseLocation (pageText);
	$scope.notes = "";
	$scope.startdate = new Date(parseYear(pageText), parseMonth(pageText), parseDay(pageText));
	$scope.starttime = new Date(parseHour(pageText), parseMinute(pageText));
	$scope.enddate = new Date(parseYear(pageText), parseMonth(pageText), parseDay(pageText));
	$scope.endtime = new Date(parseHour(pageText) + 1, parseMinute(pageText));

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

.controller('loginCtrl', function($scope, $cordovaOauth) {


})

.controller('loggedOutCtrl', function($scope) {

})

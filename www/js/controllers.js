angular.module('app.controllers', [])
  
.controller('homeCtrl', function($scope, Camera) {

	   $scope.takePicture = function (options) {
	
	      var options = {
	         quality : 75,
	         targetWidth: 200,
	         targetHeight: 200,
	         sourceType: 1
	      };

	      Camera.getPicture(options).then(function(imageData) {
	         $scope.picture = imageData;;
	      }, function(err) {
	         console.log(err);
	      });
		
	   };
	   
	   $scope.getPicture = function (options) {
	
	         var options = {
	            quality : 75,
	            targetWidth: 200,
	            targetHeight: 200,
	            sourceType: 0
	         };

	         Camera.getPicture(options).then(function(imageData) {
	            $scope.picture = imageData;;
	         }, function(err) {
	            console.log(err);
	         });
	      }; 
	  
})
   
.controller('addEventCtrl', function($scope) {

})
  
   
.controller('eventAddedCtrl', function($scope) {

})
   
.controller('loginCtrl', function($scope) {

})
   
.controller('loggedOutCtrl', function($scope) {

})
 
angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('home', {
    url: '/page1',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('addEvent', {
    url: '/page5',
    templateUrl: 'templates/addEvent.html',
    controller: 'addEventCtrl'
  })

  .state('eventAdded', {
    url: '/page9',
    templateUrl: 'templates/eventAdded.html',
    controller: 'eventAddedCtrl'
  })

  .state('loggedOut', {
    url: '/page13',
    templateUrl: 'templates/loggedOut.html',
    controller: 'loggedOutCtrl'
  })

$urlRouterProvider.otherwise('/page1')

  

});
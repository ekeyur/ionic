// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'fabular' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'fabular.services' is found in services.js
// 'fabular.controllers' is found in controllers.js

//Function for voice
function textToSpeak(msg, idx) {
	if (typeof msg !== 'string') {
		throw new TypeError('Expected to say a string.');
	}
	var y = window.speechSynthesis;
	if (!y) {
		return console.warn('Your browser does not support `speechSynthesis` yet.');
	}
	var s = new SpeechSynthesisUtterance(msg);
	s.voice = y.getVoices()[idx || 0];
	y.speak(s);
}
// Initializing some variables
var app = angular.module('fabular', []);
var chelevel = 1;
var resultLink = [];
//Holds reward items in basket array
var basket = [];

angular.module('fabular', ['ionic', 'fabular.controllers', 'fabular.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state({
  name : 'things',
  url : '/things/{category}',
  templateUrl : 'templates/things.html',
  controller : 'fabularController'
});
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/things/{category}');

});

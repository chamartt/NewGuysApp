// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ui.router', 'backand'])

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
.config(function(BackandProvider) {
  BackandProvider.setAppName('newguysmovie');
  BackandProvider.setAnonymousToken('8f360da8-090e-44f5-b864-d1c3a5a743d1');
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('login', {
     url: '/login',
     templateUrl: './templates/login.html',
     controller: 'LoginCtrl'
  })
  .state('create-account', {
    url: '/create-account',
    templateUrl: './templates/create-account.html',
    controller: 'CreateAccountCtrl'
  })
  .state('movies-list', {
    url: '/movies-list',
    templateUrl: './templates/movies-list.html',
    controller: 'MoviesListCtrl'
  })
  .state('search', {
    url: '/search',
    templateUrl: 'templates/search.html',
    controller: 'SearchCtrl'
  })
  .state('movie-details', {
    url: '/movie-details/:id',
    templateUrl: './templates/movie-details.html',
    controller: 'MovieDetailsCtrl'
  })
  .state('favoris-list', {
    url: '/favoris',
    templateUrl: './templates/favoris-list.html',
    controller: 'FavorisListCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});

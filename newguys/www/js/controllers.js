angular.module('starter.controllers', ['ui.router'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('LoginCtrl', function($scope, $state, $http, $timeout) {
  $scope.data = {
    password: null,
    username: null
  };
  $scope.errorUsername = false;
  $scope.errorPassword = false;
  $scope.errorUnexpected = false;

  $scope.login = function() {
    $http({
      method: 'GET',
      url: 'UrlGetUserFromLogin' + $scope.username,
    }).then(
      function success(response) {
        if (response.data.length === 0) {
          $scope.errorUsername = true;
          $timeout(function () { $scope.errorUsername = false; }, 3000);
        }
        else {
          if ($scope.password === reponse.data.password) {
            console.log("Enregistrer les infos utilisateur en cookie");
            $state.go('/tab/dash');
          }
          else {
            $scope.errorPassword = true;
            $timeout(function () { $scope.errorPassword = false; }, 3000);
          }
        }
      },
      function error(reponse) {
        $scope.errorUnexpected = true;
        $timeout(function () { $scope.errorUnexpected = false; }, 3000);
      }
    );
  }

  $scope.goToCreate = function() {
    $state.go('create-account');
  }
})
.controller('CreateAccountCtrl', function($scope, $state, $timeout, $http) {
  $scope.data = {
    password: null,
    username: null,
    confirmPassword: null
  };
  $scope.errorPassword = false;
  $scope.errorUnexpected = false;
  $scope.errorUsername = false;
  $scope.errorCreate = false;

  $scope.saveAccount = function(userData) {
    $http({
      method: 'POST',
      url: 'UrlPostUser',
      data: userData
    }).then(
      function success(response) {
        console.log("Sauvegarder username / password dans un cookie");
        $state.go('/tab/dash');
      },
      function error(reponse) {
        $scope.errorCreate = true;
        $timeout(function () { $scope.errorCreate = false; }, 3000);
      }
    );
  }
  $scope.save = function() {
    if ($scope.data.password !== $scope.data.confirmPassword) {
      $scope.errorPassword = true;
      $timeout(function () { $scope.errorPassword = false; }, 3000);
    }
    else {
      $http({
        method: 'GET',
        url: 'UrlGetUserFromLogin/' + $scope.data.username
      }).then(
        function success(response) {
          if (reponse.data.length !== 0) {
            $scope.saveAccount($scope.data);
          }
          else {
            $scope.errorUsername = true;
            $timeout(function () { $scope.errorUsername = false; }, 3000);
          }
        },
        function error(response) {
          $scope.errorUnexpected = true;
          $timeout(function () { $scope.errorUnexpected = false; }, 3000);
        }
      );

    }
  }
})
.controller('MoviesListCtrl', function($scope, $state, $http) {
	$scope.movies = null;
  	$http({
        method : "GET",
        url : "https://api.themoviedb.org/3/discover/movie?api_key=a4be1c58f768114375aab83155e56d6a&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
    }).then(function success(response) {
    	$scope.movies = response.data.results;
    }, function error(error) {
        console.log(error);
    });

  	$scope.movieDetails = function(id) {
		$state.go('movie-details', {"id":id});
  	};
})
.controller('MovieDetailsCtrl', function($scope, $stateParams, $http) {
	var id = $stateParams.id
  	console.log("Récupérer ID du film onclick sur la liste, et utiliser l'ID pour récupérer les détails");
});

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
.controller('LoginCtrl', function($scope, $state) {
  $scope.login = function() {
    console.log("Faire l'appel et la connexion");
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
});

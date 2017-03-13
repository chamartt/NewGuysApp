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
.controller('LoginCtrl', function($scope, $state, $http, $timeout, UserService) {
  $scope.data = {
    password: null,
    username: null
  };
  $scope.errorLogin = false;
  $scope.errorUnexpected = false;
  var found = false;

  $scope.login = function() {
    UserService.all().then(
      function success(response) {
        var data = response.data.data;
        for (var i = 0; i < data.length; i++) {
          if ($scope.data.username === data[i].username) {
            if ($scope.data.password === data[i].password) {
              $state.go('tab.dash');
              found = true;
            }
          }
        }
        if (!found) {
          $scope.errorLogin = true;
          $timeout(function () { $scope.errorLogin = false; found = false;}, 3000);
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
.controller('CreateAccountCtrl', function($scope, $state, $timeout, $http, UserService) {
  $scope.data = {
    password: null,
    username: null,
    confirmPassword: null
  };
  $scope.errorPassword = false;
  $scope.errorUnexpected = false;
  $scope.errorUsername = false;
  $scope.errorCreate = false;

  $scope.save = function() {
    if ($scope.data.password !== $scope.data.confirmPassword) {
      $scope.errorPassword = true;
      $timeout(function () { $scope.errorPassword = false; }, 3000);
    }
    else {
      UserService.all().then(
        function success(response) {
          var userFound = false;
          var data = response.data.data;
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            if (data[i].username == $scope.data.username) {
              userFound = true;
            }
          }
          if (!userFound) {
            UserService.create($scope.data).then(
              function success(response) {
                $state.go('tab.dash');
              },
              function error(response) {
                 $scope.errorCreate = true;
                 $timeout(function () { $scope.errorCreate = false; }, 3000);
              });
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

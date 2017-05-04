angular.module('starter.controllers', ['ui.router', 'ionic'])

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
.controller('LoginCtrl', function($scope, $state, $http, $timeout, UserService, SessionService) {
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
              SessionService.set('userInfo', data[i]);
              $state.go('movies-list');
              $scope.data = {
                password: null,
                username: null
              };
              found = true;
              break;
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
.controller('CreateAccountCtrl', function($scope, $state, $timeout, $http, UserService, SessionService) {
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
          for (var i = 0; i < data.length; i++) {
            if (data[i].username == $scope.data.username) {
              userFound = true;
            }
          }
          if (!userFound) {
            UserService.create($scope.data).then(
              function success(response) {
                SessionService.set('userInfo', response.data);
                $state.go('movies-list');
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
})
.controller('MoviesListCtrl', function($scope, $state, $http, $ionicScrollDelegate, SessionService, $ionicPopup) {
	$scope.movies = null;
	$scope.currentPage = 1;
	$scope.user = SessionService.get('userInfo');
	$scope.alertPopup = null;

  $scope.goToFavoris = function() {
  };

  $scope.goToSuggestions = function() {
    $state.go("movies-list");
  };

  $scope.disconnect = function() {
    $scope.alertPopup.close();
    SessionService.destroy("userInfo");
    $state.go("login");
  };

  $scope.showAlert = function() {
    $scope.alertPopup = $ionicPopup.alert({
      title: '<div class="popup-title">Utilisateur</div>',
      scope: $scope,
      template: '<ul class="list"><li class="item popup-item" ng-click="disconnect()">Deconnexion</li></ul>'
    });
  };

	$scope.previousPage = function() {
	  if ($scope.currentPage > 1) {
	    $scope.currentPage--;
	    $scope.getMovies();
	  }
	};

	$scope.nextPage = function() {
	    $scope.currentPage++;
	    $scope.getMovies();
	};

  $scope.goToSearch = function() {
    $state.go('search');
  };

	$scope.getMovies = function() {
	    $ionicScrollDelegate.scrollTop();
	    $http({
         method : "GET",
         url : "https://api.themoviedb.org/3/discover/movie?api_key=a4be1c58f768114375aab83155e56d6a&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=" + $scope.currentPage
      }).then(function success(response) {
        $scope.movies = response.data.results;
      }, function error(error) {
        console.log(error);
      });
	  };


  	$scope.movieDetails = function(id) {
		  $state.go('movie-details', {"id":id});
  	};

  	$scope.getMovies();
})
.controller('SearchCtrl', function($scope, $state, $stateParams, $http, $ionicScrollDelegate, SessionService, $ionicPopup) {
  /*
      REQUETE RECHERCHE PAR TITRE
      https://api.themoviedb.org/3/search/movie?query=FILM_NAME&api_key=a4be1c58f768114375aab83155e56d6a&language=fr-FR&page=1&include_adult=false

      REQUETE RECHERCHE PAR GENRE
      https://api.themoviedb.org/3/discover/movie?api_key=###&with_genres=10751&sort_by=popularity.desc&include_adult=false
      http://api.themoviedb.org/3/genre/10751/movies?api_key=a4be1c58f768114375aab83155e56d6a&language=fr-FR&page=1&include_adult=false



  */
  $scope.genres = null;
  $scope.user = SessionService.get('userInfo');
  $scope.alertPopup = null;
  $scope.selectedGenre = null;
  $scope.selectedTitle = {};
  $scope.selectedTitle.title = "";
  $scope.currentPage = 1;
  $scope.searchType = null;
  $scope.movies = null;

  $scope.goToFavoris = function() {
  };

  $scope.goToSuggestions = function() {
    $state.go("movies-list");
  };
  $scope.disconnect = function() {
    $scope.alertPopup.close();
    SessionService.destroy("userInfo");
    $state.go("login");
  };

  $scope.showAlert = function() {
    $scope.alertPopup = $ionicPopup.alert({
      title: '<div class="popup-title">Utilisateur</div>',
      scope: $scope,
      template: '<ul class="list"><li class="item popup-item" ng-click="disconnect()">Deconnexion</li></ul>'
    });
  };

  $scope.goToSearch = function() {
    $state.go('search');
  };

  $scope.movieDetails = function(id) {
    $state.go('movie-details', {"id":id});
  };

  $scope.previousPage = function() {
    if ($scope.currentPage > 1) {
      $scope.currentPage--;
      if ($scope.searchType == 1)
        $scope.searchWithTitle();
      else
        $scope.searchWithGenre();
    }
  };

  $scope.nextPage = function() {
      $scope.currentPage++;
      if ($scope.searchType == 1)
        $scope.searchWithTitle();
      else
        $scope.searchWithGenre();
  };

  $scope.changedValue = function(item) {
    $scope.selectedGenre = item;
  };

  $scope.launchSearchGenre = function() {
    $scope.currentPage = 1;
    $scope.searchWithGenre();
  };

  $scope.launchSearchTitle = function() {
    $scope.currentPage = 1;
    $scope.searchWithTitle();
  };

  $scope.searchWithTitle = function() {
    $ionicScrollDelegate.scrollTop();
    $http({
       method : "GET",
       url : "https://api.themoviedb.org/3/search/movie?query=" + $scope.selectedTitle.title + "&api_key=a4be1c58f768114375aab83155e56d6a&language=fr-FR&include_adult=false&page=" + $scope.currentPage
    }).then(function success(response) {
      $scope.movies = response.data.results;
      $scope.searchType = 1;
    }, function error(error) {
      console.log(error);
    });
  };

  $scope.searchWithGenre = function() {
    $ionicScrollDelegate.scrollTop();
    $http({
       method : "GET",
       url : "https://api.themoviedb.org/3/discover/movie?api_key=a4be1c58f768114375aab83155e56d6a&with_genres=" + $scope.selectedGenre.id + "&sort_by=popularity.desc&include_adult=false&page=" + $scope.currentPage
    }).then(function success(response) {
      $scope.movies = response.data.results;
      $scope.searchType = 2;
    }, function error(error) {
      console.log(error);
    });
  };

  $scope.getGenres = function() {
    $http({
       method : "GET",
       url : "https://api.themoviedb.org/3/genre/movie/list?api_key=a4be1c58f768114375aab83155e56d6a&language=fr-FR"
    }).then(function success(response) {
      $scope.genres = response.data.genres;
      $scope.selectedGenre = $scope.genres[0];
      $scope.searchWithGenre();
    }, function error(error) {
      console.log(error);
    });
  };

  $scope.getGenres();
})
.controller('MovieDetailsCtrl', function($scope, $state, $stateParams, $http, $ionicScrollDelegate, SessionService, $ionicPopup) {
  $scope.movieDetails = null;
  $scope.genres = null;
  $scope.user = SessionService.get('userInfo');
  $scope.alertPopup = null;

  $scope.goToFavoris = function() {
  };

  $scope.goToSuggestions = function() {
    $state.go("movies-list");
  };

  $scope.disconnect = function() {
    $scope.alertPopup.close();
    SessionService.destroy("userInfo");
    $state.go("login");
  };

  $scope.showAlert = function() {
    $scope.alertPopup = $ionicPopup.alert({
      title: '<div class="popup-title">Utilisateur</div>',
      scope: $scope,
      template: '<ul class="list"><li class="item popup-item" ng-click="disconnect()">Deconnexion</li></ul>'
    });
  };

  $scope.goToSearch = function() {
    $state.go('search');
  };

  $scope.getGenres = function() {
    $http({
       method : "GET",
       url : "https://api.themoviedb.org/3/genre/movie/list?api_key=a4be1c58f768114375aab83155e56d6a&language=fr-FR"
    }).then(function success(response) {
      $scope.genres = response.data.genres;
    }, function error(error) {
      console.log(error);
    });
  };

  $scope.getDetails = function() {
    $ionicScrollDelegate.scrollTop();
    $http({
       method : "GET",
       url : "https://api.themoviedb.org/3/movie/" + $stateParams.id + "?api_key=a4be1c58f768114375aab83155e56d6a&language=fr-FR"
    }).then(function success(response) {
      $scope.movieDetails = response.data;
    }, function error(error) {
      console.log(error);
    });
  };

  $scope.getGenres();
  $scope.getDetails();
});

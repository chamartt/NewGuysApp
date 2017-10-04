angular.module('starter.controllers', ['ui.router', 'ionic'])

.controller('LoginCtrl', function($scope, $state, $http, $timeout, UserService, SessionService) {
  $scope.data = {
    password: null,
    username: null
  };
  $scope.errorLogin = false;
  $scope.errorUnexpected = false;
  var found = false;

  $scope.login = function() {
     $http({
        method : "POST",
        url : "http://localhost:8080/api/user/" + $scope.data.username + "/" + $scope.data.password
     }).then(function mySuccess(response) {
        console.log(response);
        SessionService.set('userInfo', response.data);
        $state.go('movies-list');
        $scope.data = {
          password: null,
          username: null
        };
     }, function myError(response) {
        $scope.errorLogin = true;
        console.log(response);
        $timeout(function () { $scope.errorLogin = false; }, 3000);
    });
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
      $http({
          method : "POST",
          url : "http://localhost:8080/api/user/create",
                           data : JSON.stringify({
            "username" : $scope.data.username,
            "password" : $scope.data.password
          })
       }).then(function mySuccess(response) {
          if (response.status == 226) {
            $scope.errorUsername = true;
            $timeout(function () { $scope.errorUsername = false; }, 3000);
          }
          else {
            SessionService.set('userInfo', response.data);
            $state.go('movies-list');
          }
       }, function myError(response) {
           $scope.errorCreate = true;
           $timeout(function () { $scope.errorCreate = false; }, 3000);
      });
    }
  }
})
.controller('MoviesListCtrl', function($scope, $state, $http, $ionicScrollDelegate, SessionService, $ionicPopup) {
	$scope.movies = null;
	$scope.currentPage = 1;
	$scope.user = SessionService.get('userInfo');
	$scope.alertPopup = null;

  $scope.goToFavoris = function() {
    $scope.alertPopup.close();
    $state.go("favoris-list");
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
      template: '<ul class="list"><li class="item popup-item" ng-click="disconnect()">Deconnexion</li><li class="item popup-item" ng-click="goToFavoris()">Favoris</li></ul>'
    });
  };

	$scope.previousPage = function() {
	  if ($scope.currentPage > 1) {
	    $scope.currentPage--;
	    $scope.getMovies();
	  }
	};

	$scope.addFavoris = function(movie) {
	  $http({
	    method : "POST",
      url : "http://localhost:8080/api/favoris",
      data : JSON.stringify({
        "movieid" : movie.id,
        "titre" : movie.title,
        "userid" : $scope.user.id,
        "image" : "https://image.tmdb.org/t/p/w75" + movie.poster_path,
        "dtsortie" : movie.release_date,
        "note" : movie.vote_average
      })
    }).then(function mySuccess(response) {
      if (response.status == 226) {
        // afficher tooltip "Ce favoris est deja dans votre liste"
      }
      else {
        // afficher tooltip "Favoris ajouté"
      }
      console.log(response);
     }, function myError(response) {
      console.log(response);
    });
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
    $scope.alertPopup.close();
    $state.go("favoris-list");
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
      template: '<ul class="list"><li class="item popup-item" ng-click="disconnect()">Deconnexion</li><li class="item popup-item" ng-click="goToFavoris()">Favoris</li></ul>'
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

  $scope.addFavoris = function(movie) {
    $http({
      method : "POST",
      url : "http://localhost:8080/api/favoris",
      data : JSON.stringify({
        "movieid" : movie.id,
        "titre" : movie.title,
        "userid" : $scope.user.id,
        "image" : "https://image.tmdb.org/t/p/w75" + movie.poster_path,
        "dtsortie" : movie.release_date,
        "note" : movie.vote_average
      })
    }).then(function mySuccess(response) {
      if (response.status == 226) {
        // afficher tooltip "Ce favoris est deja dans votre liste"
      }
      else {
        // afficher tooltip "Favoris ajouté"
      }
      console.log(response);
     }, function myError(response) {
      console.log(response);
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
    $scope.alertPopup.close();
    $state.go("favoris-list");
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
      template: '<ul class="list"><li class="item popup-item" ng-click="disconnect()">Deconnexion</li><li class="item popup-item" ng-click="goToFavoris()">Favoris</li></ul>'
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
})
.controller('FavorisListCtrl', function($scope, $state, $http, $ionicScrollDelegate, SessionService, $ionicPopup) {
	$scope.favoris = null;
	$scope.user = SessionService.get('userInfo');
	$scope.alertPopup = null;

  $scope.goToFavoris = function() {
    $scope.alertPopup.close();
    $state.go("favoris-list");
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
      template: '<ul class="list"><li class="item popup-item" ng-click="disconnect()">Deconnexion</li><li class="item popup-item" ng-click="goToFavoris()">Favoris</li></ul>'
    });
  };

  $scope.goToSearch = function() {
    $state.go('search');
  };

  $scope.movieDetails = function(id) {
    $state.go('movie-details', {"id":id});
  };

  $scope.getFavoris = function() {
    $http({
       method : "GET",
       url : "http://localhost:8080/api/favoris/" + $scope.user.id
    }).then(function mySuccess(response) {
       $scope.favoris = response.data;
    }, function myError(error) {
      console.log(error);
    });
  };

  $scope.removeFavoris = function(favorisId) {
    $http({
       method : "DELETE",
       url : "http://localhost:8080/api/favoris/" + favorisId
    }).then(function mySuccess(response) {
       for (var i = 0; i < $scope.favoris.length; i++) {
        if ($scope.favoris[i].id == favorisId) {
          $scope.favoris.splice(i, 1);
        }
       }
    }, function myError(error) {
      console.log(error);
    });
  }

  $scope.getFavoris();
});

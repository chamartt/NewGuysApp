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
.controller('CreateAccountCtrl', function($scope, $state) {
  $scope.save = function() {
    console.log("Enregistrer les données");
  }
})
.controller('MoviesListCtrl', function($scope, $state, $http) {
  $scope.save = function() {
  	$http({
        method : "GET",
        url : "https://api.themoviedb.org/3/discover/movie?api_key=a4be1c58f768114375aab83155e56d6a&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
    }).then(function success(response) {
    	console.log(response);
    	var movies = response.data.results;
    	var html = "";
    	html += "<ul><li><span class='movie-title-header'>Titre</span><span class='movie-vote-average-header'>Note</span></li>"
    	for(var i = 0; i < movies.length; i++) {
    		html += "<li><span class='movie-title'>"+movies[i].title+"</span><span class='movie-vote-average'>"+movies[i].vote_average+"</span></li>";
    	}
    	document.getElementById('movies-list').innerHTML = html;
    }, function error(error) {
        console.log(error);
    });
  }
  $scope.save();
});

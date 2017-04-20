angular.module('starter.services', [])
.service('UserService', function ($http, Backand) {
    var service = this,
        baseUrl = '/1/objects/',
        objectName = 'users/';

    function getUrl() {
        return Backand.getApiUrl() + baseUrl + objectName;
    }

    function getUrlForId(id) {
        return getUrl() + id;
    }

    service.getUserByLogin = function (userLogin) {
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/objects/users/',
        parameters: {
          username: userLogin
        }
      });
     };

    service.all = function () {
        return $http.get(getUrl());
    };

    service.get = function (id) {
        return $http.get(getUrlForId(id));
    };

    service.create = function (object) {
        return $http.post(getUrl(), object);
    };

    service.update = function (id, object) {
        return $http.put(getUrlForId(id), object);
    };

    service.delete = function (id) {
        return $http.delete(getUrlForId(id));
    };
})
.factory('SessionService',function($http){
return {
   set:function(key,value){
      return localStorage.setItem(key,JSON.stringify(value));
   },
   get:function(key){
     return JSON.parse(localStorage.getItem(key));
   },
   destroy:function(key){
     return localStorage.removeItem(key);
   },
 };
})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

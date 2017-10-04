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
});

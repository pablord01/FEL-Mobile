var felServices = angular.module('starter');
 // servicio de login, provee las funcionalidades para el inicio de sesion
felServices.service('AuthService', function($q, $http,$ionicLoading,$ionicPopup, $state) {
  var LOCAL_TOKEN = '';
  var LOCAL_USER = '';
  var username = '';
  var isAuthenticated = false;
  var authToken = '';

  function loadUserCredentials() {
    authToken = window.localStorage.getItem(LOCAL_TOKEN);
    if (authToken) {
      useCredentials(authToken);
    }
  }
 
  function storeUserCredentials(token) {
    authToken = token;
    window.localStorage.setItem(LOCAL_TOKEN, token);
    isAuthenticated = true;
    useCredentials(token);
  }
 
  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    window.localStorage.removeItem(LOCAL_TOKEN);
  }
  
  var login = function(name, pw) {
    $ionicLoading.show({
        template: 'Iniciando sesión'
      });
    return $q(function(resolve, reject) {
       var settings = {
         "async": true,
         "crossDomain": true,
         "url": "http://54.200.26.254/api2/token",
         "method": "POST",
         "headers": {
             "content-type": "application/x-www-form-urlencoded"
         },
         "data": {
             "grant_type": "password",
             "username": name,
             "password": pw
         }
       }
 
       $.ajax(settings).done(function (data) {
         received = data["token_type"]+' '+data["access_token"];
          storeUserCredentials(received);
          $ionicLoading.hide();
          resolve('login success');
       }).error(function(){
      var alertPopup = $ionicPopup.alert({
          title: '¡Error!',
          template: 'Por favor verifica tu información'
        });
        $ionicLoading.hide();
      });
     });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    logout: logout,
    isAuthenticated: isAuthenticated,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    token: function() {return authToken;},
  };
});

felServices.factory('getData', function($q) {
   return{
    getDash : function(token,callback){
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://54.200.26.254/api2/Dashboard?idExternalEnterprise=ENT1",
          "method": "GET",
          "headers": {
            "access-control-allow-origin": "*",
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": token
          }
        };
        $.ajax(settings).done(function (response) {
          callback(response);
        }).error(function(){
          callback(0);
        });
    },
    getDocuments: function(token,callback){
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://54.200.26.254/api2/Document/All?idExternalEnterprise=ENT2",
        "method": "GET",
        "headers": {
          "access-control-allow-origin": "*",
          "accept": "application/json",
          "content-type": "application/json",
          "authorization": token
        }
      };
      $.ajax(settings).done(function (response) {
        callback(response);
      }).error(function(err){
        callback(0);
      });
    },
    sendRequest: function(token,id,callback){
      var url = '';
      var i = 0;
      while(id[i]){
        url = '&documents='+id[i];
        i = i+1;
      }
     var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://54.200.26.254/api2/FinancialRequest/Create?idExternalEnterprise=ENT2"+url,
        "method": "GET",
        "headers": {
          "access-control-allow-origin": "*",
          "accept": "application/json",
          "content-type": "application/json",
          "authorization": token
        }
      };
      $.ajax(settings).done(function (response) {
        callback(response);
      }).error(function(err){
        callback(0);
      }); 
    }
  }
});
var felServices = angular.module('starter');
 // servicio de login, provee las funcionalidades para el inicio de sesion
felServices.service('AuthService', function(getData, $q, $http,$ionicLoading,$ionicPopup, $state, WEBSERVICE) {
  var LOCAL_TOKEN = '';
  var LOCAL_USER = '';
  var username = '';
  var isAuthenticated = false;
  var authToken = '';
  var ROLE = '';
  var roleUser = '';

  function loadUserCredentials() {
    authToken = window.localStorage.getItem(LOCAL_TOKEN);
    roleUser = window.localStorage.getItem(ROLE);
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
  this.storeRole = function(role){
    roleUser = role;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    window.localStorage.removeItem(LOCAL_TOKEN);
  }
  
  var login = function(name, pw, callback) {
    $ionicLoading.show({
        template: 'Iniciando sesión'
      });
       var settings = {
         "async": true,
         "crossDomain": true,
         "url": WEBSERVICE.url+"token",
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
          callback(received);
       }).error(function(){
      var alertPopup = $ionicPopup.alert({
          title: '¡Error!',
          template: 'Por favor verifica tu información'
        });
        $ionicLoading.hide();
        callback(0);
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
    role: function() {return roleUser;},
    setRole: function(role) {roleUser = role;},
  };
});


felServices.factory('passingData', function () {
var data = '';
return {
    getData: function () {
        return data;
    },
    setData: function (received) {
        data = received;
    }
};
});

felServices.factory('saveAmmount', function () {
var data = '';
return {
    getAmmount: function () {
        return data;
    },
    setAmmount: function (received) {
        data = received;
    }
};
});


felServices.factory('getData', function($q, WEBSERVICE) {
   return{
    getClaims : function(token,callback){
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": WEBSERVICE.url+"Account/GetClaims",
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
    getDash : function(token,callback){
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": WEBSERVICE.url+"Dashboard?idExternalEnterprise=ENT1",
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
        "url": WEBSERVICE.url+"Document/All?idExternalEnterprise=ENT2",
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
        "url": WEBSERVICE.url+"FinancialRequest/Create?idExternalEnterprise=ENT2"+url,
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
    getOffers: function(token,callback){
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": WEBSERVICE.url+"FinancialRequest/Offered?idExternalEnterprise=ENT1",
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
    getOffersPending: function(token,callback){
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": WEBSERVICE.url+"FinancialRequest/PendingFinance?idExternalEnterprise=ENT1",
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
    getOfferOne: function(token,id,callback){
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": WEBSERVICE.url+"FinancialRequest/Offers?idExternalEnterprise=ENT1&idFinancialRequest="+id,
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
    getPendingSignature: function(token,callback){
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": WEBSERVICE.url+"FinancialRequest/PendingSignature?idExternalEnterprise=ENT1",
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
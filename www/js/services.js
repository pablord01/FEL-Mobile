angular.module('starter')
 // servicio de login, provee las funcionalidades para el inicio de sesion
.service('AuthService', function($q, $http) {
  var username = '';
  var isAuthenticated = false;
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(authToken);
    var user = window.localStorage.getItem(username);
    if (token & user) {
      useCredentials(token,user);
    }
  }
 
  function storeUserCredentials(token,user) {
    window.localStorage.setItem(authToken, token);
    window.localStorage.setItem(username, user);
    isAuthenticated = true;
    useCredentials(token,user);
  }
 
  function useCredentials(token,user) {
    username = user;
    isAuthenticated = true;
    authToken = token;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    window.localStorage.removeItem(authToken);
  }
 
  var login = function(name, pw) {
    return $q(function(resolve, reject) {
      $.post( "http://financiaenlinea.defontana.com/api/token",{grant_type:'password', 
        username: name,
        password: pw},function( data ) {
        // console.log(data["access_token"]); aca imprime el token por la consola del navegador,
        // descomenta para que veas que esta bien
        storeUserCredentials(data["token_type"]+" "+data["access_token"],name);
        resolve('login success');
        return data;
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
})

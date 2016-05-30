angular.module('starter')
 // servicio de login, provee las funcionalidades para el inicio de sesion
.service('AuthService', function($q, $http,$ionicLoading,$ionicPopup, $state) {
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
      $.post( "http://financiaenlinea.defontana.com/api/token",{grant_type:'password', 
        username: name,
        password: pw}, function( data ) { 
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
})

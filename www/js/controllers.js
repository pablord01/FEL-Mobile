angular.module('starter')

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS,webService) {
  $scope.username = AuthService.username();
  $scope.prueba = webService.getData('api/token/',{
    grant_type: 'password', 
    username:'usuario@defontana.com',
    password:'awesomepassword'
  },  $scope.prueba2);
  $scope.prueba2 = function(json,datos){
    console.log(json);
  };
  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
})
//controlador del login
.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
  $scope.data = {};
 
  $scope.login = function(data) {
    AuthService.login(data.username, data.password).then(function(authenticated) {
      $state.go('dashboard', {}, {reload: true});
      $scope.setCurrentUsername(data.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '¡Error!',
        template: 'Por favor verifica tu información'
      });
    });
  };
})
//controlador del dashboard, con las acciones para cada boton
.controller('DashCtrl', function($scope, $state, $http, $ionicPopup, AuthService,webService) {
  
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
});
angular.module('starter')

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService) {

})
//controlador del login
.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
  $scope.data = {};
 
  $scope.login = function(data) {
    AuthService.login(data.username, data.password).then(function(authenticated) {
      $state.go('dashboard', {}, {reload: true});
      /*var alertPopup = $ionicPopup.alert({
        title: '¡Error!',
        template: AuthService.username()
      });*/ //aca imprime el nombre de usuario una vez que loguea, descomentalo y podras verlo
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '¡Error!',
        template: 'Por favor verifica tu información'
      });
    });
  };
})

.controller('DashCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
  
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
});
angular.module('starter')

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService) {

})
//controlador del login
.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicLoading, AuthService) {
  $scope.data = {};
 
  $scope.login = function(data) {
    $ionicLoading.show({
        template: 'Iniciando sesión'
      });
    AuthService.login(data.username, data.password).then(function(authenticated) {
      $state.go('tabs.home', {}, {reload: true});
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '¡Error!',
        template: 'Por favor verifica tu información'
      });
    });
  };
})


.controller('Tabs', function($scope, $state, $http, $ionicPopup, AuthService) {
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
});
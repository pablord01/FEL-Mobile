
angular.module('starter', ['ionic'])
//inicializacion
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

//ruteo entre los diferentes templates, con sus correspondientes controladores
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('tabs',{
    url: '/tab',
    templateUrl: 'templates/tabs.html',
    controller: 'Tabs'
  })
  
  .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
  .state('tabs.ofertas', {
      url: "/ofertas",
      views: {
        'ofertas-tab': {
          templateUrl: "templates/ofertas.html",
          controller: 'ofertasCtrl'
        }
      }
    })
    .state('tabs.solicitud', {
      url: "/solicitud",
      views: {
        'solicitud-tab': {
          templateUrl: "templates/solicitud.html",
          controller: 'solicitudCtrl'
        }
      }
    })

    .state('tabs.pendientes', {
      url: "/pendientes",
      views: {
        'pendientes-tab': {
          templateUrl: "templates/pendientes.html",
          controller: 'pendientesCtrl'
        }
      }

    }) 
    .state('tabs.revisar', {
      url: "/revisar",
      views: {
        'ofertas-tab': {          
          templateUrl: "templates/verofertas.html",
          controller: 'showOffers'
        }
      }
    })
    .state('tabs.solicitar', {
      url: "/solicitar",
            
      views: {
        'solicitud-tab': {          
          templateUrl: "templates/confirmacionsolicitud.html",
          controller: 'solicitudCtrl'
          }
      }
    })
      .state('tabs.detalleoferta', {
      url: "/detalleoferta",            
      views: {
        'ofertas-tab': {          
          templateUrl: "templates/detalleoferta.html",
          controller: 'showOffers'
          }
      }
    });

  


  
  
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go('tabs.home', {}, {reload: true});
  });
})
.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showRightMenu = function () {
    $ionicSideMenuDelegate.toggleRight();
  };
})
.controller('HomeTabCtrl', function($scope) {
  
})

// con esto cuando comienza la app verifica si estas logueado, en caso contrario te
// redirecciona al login y no entra directamente al dashboard
.run(function ($rootScope, $state, AuthService) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) { 
    if (!AuthService.isAuthenticated()) {
      if (next.name !== 'login') {
        event.preventDefault();
        $state.go('login');
      }
    }});
});

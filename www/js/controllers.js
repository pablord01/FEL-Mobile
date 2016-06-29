angular.module('starter')

.controller('AppCtrl', function(getData, AuthService,  $scope, $state, $ionicPopup, $ionicModal, AuthService) {
  $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Solicitud exitosa!',
     template: 'Enseguida recibirás un email con los detalles de la solicitud realizada.'
   });
   
   alertPopup.then(function(res) {
     console.log('Thank you for advice.');    
   });
 }
})
//controlador del login
.controller('LoginCtrl', function(getData, $scope, $state, $ionicPopup, $ionicLoading, AuthService) {
  $scope.data = {};
 
  $scope.login = function(data) {
    $ionicLoading.show({
        template: 'Iniciando sesión'
      });
    AuthService.login(data.username, data.password, function(token) {
      $state.go('tabs', {}, {reload: true});
    });
  };
})


.controller('Tabs', function(getData, AuthService, $scope, $state, $http, $ionicPopup, AuthService) {
  getData.getClaims(AuthService.token(),function(response){
    $scope.signer = function(){
      if (response[1].value == "signer-user") {
        return "ng-show";
      }
      else{
        return "ng-hide";
      }
    };
  });
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
})

.controller('HomeTabCtrl', function(saveAmmount, $scope, $state, $rootScope, $http, $q, $ionicLoading, $sce, $ionicPopup, AuthService, getData) {
  $scope.available = "$0";
  $scope.offers = 0;
  $scope.offerspending = 0;
  $scope.$on('dash:updated', function(event,response) {
    if(response!= 0){ 
      var Format = wNumb({
         prefix: '$',
        decimals: 0,
        thousand: '.'
      });
      $scope.available = Format.to(response["ammountAvailable"]);
      $scope.offers = response["offersAvailable"];
      $scope.offerspending = response["offersPendingSignature"];
      saveAmmount.setAmmount($scope.available);
      }
    });

  getData.getDash(AuthService.token(),function(response){
    $rootScope.$broadcast('dash:updated',response);
  });
})

.controller('solicitudCtrl',function(saveAmmount, getData,AuthService,$state, $rootScope, $ionicModal, $ionicPopup, $scope, $ionicLoading){
  $scope.Ammount = saveAmmount.getAmmount();
  $scope.checkItems = { };
  $scope.pesos = function(monto){
    var Format = wNumb({
      prefix: '$',
      decimals: 0,
      thousand: '.'
    });
    return Format.to(monto);
  };

  $scope.print = function() {
    console.log($scope.checkItems);
  }

  $scope.save = function() {
    var array = [];
    for(i in $scope.checkItems) {
        console.log($scope.checkItems[i]);
        if($scope.checkItems[i] == true) {
            array.push(i);
        }
    }
    console.log(array);
  }
  var solicitudes = '';
  $ionicModal.fromTemplateUrl('templates/modal.html',function($ionicModal) {
    $scope.modal = $ionicModal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.openModal = function(nombre, monto, folio,emision,expira,erp,receiver,issuing) {
    var Format = wNumb({
      prefix: '$',
      decimals: 0,
      thousand: '.'
    });
    $scope.selectedNombre = nombre;
    $scope.selectedMonto = Format.to(monto);
    $scope.selectedFolio = folio;
    $scope.selectedEmision = emision;
    $scope.selectedExpira= expira;
    $scope.selectedErp= erp;
    $scope.selectedReceiver= receiver;
    $scope.selectedIssuing= issuing;
    $scope.modal.show();
  }
  $scope.closeModal = function(id) {
    $scope.selectedId = id;
    $scope.modal.hide();
  }
  $scope.$on('request:updated', function(event,response) {
    $scope.documentos  = response;
    $state.go($state.current, {}, {reload: true});
  });
  getData.getDocuments(AuthService.token(),function(response){
    $rootScope.$broadcast('request:updated',response);
  });
  $scope.solicitar= function(){
    var selected = [];
    $('#facturas input:checked').each(function() {
      selected.push($(this).attr('name'));
    });
    if(selected.length!= 0){
      getData.sendRequest(AuthService.token(),selected,function(response){
        $('input:checkbox').removeAttr('checked');
        var alertPopup = $ionicPopup.alert({
          title: 'Confirmación',
          template: 'Solicitud de financiamiento enviada con éxito. Número de solicitud: '+response["idRequest"]
        }); 
      });
    }
    else{
      var alertPopup = $ionicPopup.alert({
        title: '¡Error!',
        template: 'Selecciona al menos un documento'
      });
    }
  }
})

.controller('ofertasCtrl',function(passingData, getData,AuthService,$state, $rootScope, $ionicModal, $ionicPopup, $scope, $ionicLoading){
  $scope.offers = '';
  $scope.offerspending = '';
  $scope.$on('offers:updated', function(event,response,response2) {
    $scope.offers  = response;
    $scope.offerspending = response2;
    $state.go($state.current, {}, {reload: true});
  });
  // este trae las que tienen ofertas
  getData.getOffers(AuthService.token(),function(response){
    // este trae las que no tienen ofertas
    getData.getOffersPending(AuthService.token(),function(response2){
      $rootScope.$broadcast('offers:updated',response,response2);
    });
  });
  
  $scope.verOfertas = function(index){
    $rootScope.$broadcast('showoff:updated',$scope.offers[index].offers);
    passingData.setData($scope.offers[index].offers);
    $state.go('tabs.revisar', {}, {reload: true});
  }
})

.controller('pendientesCtrl',function(getData,AuthService,$state, $rootScope, $ionicModal, $ionicPopup, $scope, $ionicLoading){
  $scope.pendings = '';
  $scope.$on('pending:updated', function(event,response) {
    $scope.pendings  = response;
    $state.go($state.current, {}, {reload: true});
  });
  getData.getPendingSignature(AuthService.token(),function(response){
    $rootScope.$broadcast('pending:updated',response);
  });
})

.controller('showOffers',function($ionicHistory,  passingData, getData,AuthService,$state, $rootScope, $ionicModal, $ionicPopup, $scope, $ionicLoading){
  $scope.$on('showoff:updated', function(event,response) {
    $scope.recibido  = response;
    $state.go($state.current, {}, {reload: true});
  });
  $rootScope.$broadcast('showoff:updated',passingData.getData());

  $scope.retornar = function(){
    passingData.setData({});
    $state.go('tabs.ofertas', {}, {reload: true});
  }
})
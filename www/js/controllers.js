angular.module('starter')
.controller('AppCtrl', function($scope, $state, $ionicPopup, $ionicModal, AuthService) {
  $ionicModal.fromTemplateUrl('templates/modal.html', {
      id: '1', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal1 = modal;
    });
    $ionicModal.fromTemplateUrl('templates/modal2_confirmacion.html', {
      id: '2', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });


  
  $scope.openModal = function(index) {
      if (index == 1) $scope.oModal1.show();
      else $scope.oModal2.show();
    };

    $scope.closeModal = function(index) {
      if (index == 1) $scope.oModal1.hide();
      else $scope.oModal2.hide();
    };
    $scope.$on('$destroy', function() {
      console.log('Destroying modals...');
      $scope.oModal1.remove();
      $scope.oModal2.remove();
    });

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
.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicLoading, AuthService) {
  $scope.data = {};
 
  $scope.login = function(data) {
    $ionicLoading.show({
        template: 'Iniciando sesión'
      });
    AuthService.login(data.username, data.password).then(function(authenticated) {
      $state.go('tabs', {}, {reload: true});
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
})

.controller('HomeTabCtrl', function($scope, $state, $http, $q, $ionicLoading, $sce, $ionicPopup, AuthService, getData) {
  $scope.available = "$0";
  $scope.offers = 0;
  $scope.offerspending = 0;

  getData.getDash(AuthService.token(),function(response){
    if(response!= 0){ 
      var Format = wNumb({
         prefix: '$',
        decimals: 0,
        thousand: '.'
      });
      $scope.available = Format.to(response["ammountAvailable"]);
      $scope.offers = response["offersAvailable"];
      $scope.offerspending = response["offersPendingSignature"];
    }
  });
})

.controller('solicitudCtrl',function(getData,AuthService, $ionicModal, $ionicPopup, $scope, $ionicLoading){
  var solicitudes = '';
  $ionicModal.fromTemplateUrl('templates/modal.html',function($ionicModal) {
    $scope.modal = $ionicModal;
  }, {
    // Use our scope for the scope of the modal to keep it simple
    scope: $scope,
    // The animation we want to use for the modal entrance
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
  getData.getDocuments(AuthService.token(),function(response){
    var Format = wNumb({
      prefix: '$',
      decimals: 0,
      thousand: '.'
    });
    var botoncito = '';
    var i = 0;
    var aux = '';
    $scope.documentos  = response;
  });
  $scope.solicitar= function(){
    var selected = [];
    $('#facturas input:checked').each(function() {
      selected.push($(this).attr('name'));
    });
    if(selected.length!= 0){
      getData.sendRequest(AuthService.token(),selected,function(response){
      var alertPopup = $ionicPopup.alert({
        title: 'Confirmación',
        template: 'Solicitud de financiamiento enviada con éxito. Número de solicitud: '+response["idRequest"]
      });
      })
    }
    else{
      var alertPopup = $ionicPopup.alert({
        title: '¡Error!',
        template: 'Selecciona al menos un documento'
      });
    }
  }
})

/* esto sirve para el pdf, hay que afinarlo
    $.ajax(settings).done(function (response) {
        var file = new Blob([response], {type: 'application/pdf'});
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
    }).error(function(err){
      var alertPopup = $ionicPopup.alert({
          title: '¡Error!',
          template: 'Verifica tu conexión a internet'
        });
    });*/

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
  $scope.index = '';
  $scope.selected = [];
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
    $scope.selectedEmision = new Date(emision).toUTCString();
    $scope.selectedExpira = new Date(expira).toUTCString();
    $scope.selectedErp= erp;
    $scope.selectedReceiver= receiver;
    $scope.selectedIssuing= issuing;
    $scope.modal.show();
  }
  $scope.closeModal = function(id) {
    $scope.selectedId = id;
    $scope.modal.hide();
  }
  $scope.$on('solicitar:updated', function(event,response) {
    $scope.index  = response;
    $state.go($state.current, {}, {reload: true});
  });
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
    $scope.selected = selected;
    if($scope.selected.length!= 0){
      $rootScope.$broadcast('solicitar:updated',$scope.selected);
      $state.go('tabs.solicitar', {}, {reload: true});    
    }   
    else{
      var alertPopup = $ionicPopup.alert({
        title: '¡Petición incorrecta!',
        template: 'Selecciona al menos un documento'
      });
    }
  };
  $scope.mostrarmodal = function(index){
    var doc = $scope.documentos[index];
    $scope.openModal(doc.socialReasonReceiver,doc.ammount,doc.folio,new Date(doc.emissionDate).toUTCString(),new Date(doc.expirationDate).toUTCString(),doc.erpType,doc.receiverRUT,doc.rutIssuing)
  };
    $scope.solicitardefinitivo = function(){ 
      getData.sendRequest(AuthService.token(),$scope.index,function(response){
        var alertPopup = $ionicPopup.alert({
          title: 'Confirmación',
          template: 'Solicitud de financiamiento enviada con éxito. Número de solicitud: '+response["idRequest"]
        });
        $state.go('tabs.solicitud', {}, {reload: true});
      })
    };


    $(":checkbox").on("change", function() {
  //change input #grandtotal value according check/uncheck checkboxes
  $("#grandtotal").val(function() {
    //declare a variable to keep the sum of the values
    var sum = 0;
    //using an iterator find and sum the values of checked checkboxes
    $(":checkbox:checked").each(function() {
      sum += ~~$(this).val();
    });
    $rootScope.$broadcast('suma:updated',sum);
    $scope.suma = sum;
  });
});  


//here change the value according on checked checkboxes on DOM ready event
$("#grandtotal").val(function() {
  var sum = 0;
  $(":checkbox:checked").each(function() {
    sum += ~~$(this).val();
  });
});
})

.controller('ofertasCtrl',function(passingData, getData,AuthService,$state, $rootScope, $ionicModal, $ionicPopup, $scope, $ionicLoading){
  $scope.pesos = function(monto){
    var Format = wNumb({
      prefix: '$',
      decimals: 0,
      thousand: '.'
    });
    return Format.to(monto);
  };
  $scope.fecha = function(date){
    return new Date(date).toUTCString()
  };

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
  };

    var solicitudes = '';
  $ionicModal.fromTemplateUrl('templates/modalofertas.html',function($ionicModal) {
    $scope.modal = $ionicModal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.openModal = function(doc2) {
    var Format = wNumb({
      prefix: '$',
      decimals: 0,
      thousand: '.'
    });
    //MODIFICAR
    $scope.documento = doc2[0].socialReasonReceiver;
    $scope.folio = doc2[0].folio;
    $scope.monto = doc2[0].ammount;

    $scope.documento1 = doc2[1].socialReasonReceiver;
    $scope.folio1 = doc2[1].folio;
    $scope.monto1 = doc2[1].ammount;

    $scope.documento2 = doc2[2].socialReasonReceiver;
    $scope.folio2 = doc2[2].folio;
    $scope.monto2 = doc2[2].ammount;

    $scope.emision= doc2[0].emissionDate;
    $scope.rutemisor= doc2[0].rutIssuing;

 



    
    
  
    $scope.modal.show();
  }
  $scope.closeModal = function(id) {
    $scope.selectedId = id;
    $scope.modal.hide();
  }
})

.controller('pendientesCtrl',function(getData,AuthService,$state, $rootScope, $ionicModal, $ionicPopup, $scope, $ionicLoading){
  $scope.pesos = function(monto){
    var Format = wNumb({
      prefix: '$',
      decimals: 0,
      thousand: '.'
    });
    return Format.to(monto);
  };
  $scope.fecha = function(date){
    return new Date(date).toUTCString()
  };
  $scope.pendings = '';
  $scope.$on('pending:updated', function(event,response) {
    $scope.pendings  = response;
    $state.go($state.current, {}, {reload: true});
  });
  getData.getPendingSignature(AuthService.token(),function(response){
    $rootScope.$broadcast('pending:updated',response);
  });
  var solicitudes = '';
  $ionicModal.fromTemplateUrl('templates/modalpendiente.html',function($ionicModal) {
    $scope.modal = $ionicModal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.openModal = function(doc, doc2) {
    var Format = wNumb({
      prefix: '$',
      decimals: 0,
      thousand: '.'
    });
    //MODIFICAR
    $scope.selectedNombre = doc[0].id;
    $scope.monto = doc[0].ammountSend;
    $scope.expira = doc[0].expire;
    $scope.nombrefirmante = doc[0].userName;
    $scope.correofirmante = doc[0].userEmail;
    $scope.factoring = doc[0].factoringName;
    $scope.factoring = doc[0].factoringName;
    $scope.documento = doc2[0].socialReasonReceiver;
    $scope.idDoc = doc2[0].idDocument;
    $scope.montodoc = doc2[0].ammount;
    $scope.erp = doc2[0].erpType;
    $scope.emision= doc2[0].emissionDate;
    $scope.fechaexpiracion= doc2[0].expirationDate;
    $scope.rutreceptor= doc2[0].receiverRUT;
    $scope.rutemisor= doc2[0].rutIssuing;

    



    
    
  
    $scope.modal.show();
  }
  $scope.closeModal = function(id) {
    $scope.selectedId = id;
    $scope.modal.hide();
  }

})

.controller('showOffers',function($ionicHistory,  passingData, getData,AuthService,$state, $rootScope, $ionicModal, $ionicPopup, $scope, $ionicLoading){
  $scope.detalle = function(index){
    passingData.setData($scope.recibido[index]);
    $rootScope.$broadcast('detalle:updated',$scope.recibido[index]);
    $state.go('tabs.detalleoferta');
  };
  $scope.$on('showoff:updated', function(event,response) {
    $scope.recibido  = response;
    $state.go($state.current, {}, {reload: true});
  });

  $rootScope.$broadcast('showoff:updated',passingData.getData());
  $scope.retornar = function(){
    passingData.setData({});
    $state.go('tabs.ofertas', {}, {reload: true});
  };


})

.controller('offerDetails',function($ionicHistory,  passingData, getData,AuthService,$state, $rootScope, $ionicModal, $ionicPopup, $scope, $ionicLoading){
  $scope.fecha = function(date){
    return new Date(date).toUTCString()
  }
  $scope.pesos = function(monto){
    var Format = wNumb({
      prefix: '$',
      decimals: 0,
      thousand: '.'
    });
    return Format.to(monto);
  };
  $scope.oferta = passingData.getData();
  $scope.$on('detalle:updated', function(event,response) {
    $scope.oferta = response;
  });
  $scope.aceptar = function(){
    var alertPopup = $ionicPopup.alert({
      title: 'Confirmación',
      template: 'Oferta aceptada! Ahora quedará pendiente de firma'
    });
    $state.go('tabs.ofertas', {}, {reload: true});
  };
  $scope.rechazar = function(){
    var alertPopup = $ionicPopup.alert({
      title: 'Confirmación',
      template: 'Oferta Rechazada!'
    });
    $state.go('tabs.ofertas', {}, {reload: true});
  };
  $scope.retornar = function(){
    passingData.setData({});
    $state.go('tabs.revisar');
  };
})
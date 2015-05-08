angular.module('starter.controllers', [])


.controller('TabCtrl', function($scope, $ionicModal, $timeout, $stateParams, $rootScope,  Restangular) {

  $scope.appUser = null;

  //inizializzo il vettore dei tweet
  $scope.tweet = [];

  // variabile di stato per l'aggiornamento dei dataset
  $scope.updatigTweet = false;

  // Inserisco il numero pagna in locale perchè con next mi ritorna url e non id pagina
  $scope.metadata = {};
  $scope.metadata.number = 0;
  $scope.pagina = 0;

  // inizializzo il dizionario dei filtri
  $scope.filters = {
    nonevento :false,
    eventiOggi : true,
    chiusuraevento : false
  };

  $scope.linee = {};

  var filtro = function(t){
      var ora = new Date();
      var dataevento = new Date(t.stamp);
      var result = true;
      if($scope.filters.nonevento && t.tipo==0){
         return false;
      }
      if($scope.filters.eventiOggi && (ora.getTime()- dataevento.getTime()) > (25*60*60*1000)  
        )
      {
        return false;
      }
      return true;
  };

  $scope.filtraTweet = function(){
    return function(t){
      return filtro(t);
    }
  }

  $scope.filtraLineeVuote = function(){
    return function(t){
      if (t.linea== 'null' ){return false;}
      var risposta = 0;
      angular.forEach(t.tweets, function(value, key){ 
        if (filtro(value)){risposta = 1;}
      });
      if (risposta == 0) {return false;}
      return true;
    }
  };


  var newupdateFromServer = function(){
    $scope.updatigTweet = true;
    var params = angular.copy($scope.filters);
    params.last_pk = $scope.tweet[0].id;
    Restangular.all('tweet').getList(params)
      .then(function(data){
          $scope.tweet = data.concat($scope.tweet);
          $scope.metadata = data.metadata;
          $scope.linee = _.map(_.groupBy($scope.tweet, 'linea'), 
               function(item, key){
                return {linea:key, tweets:item};
          });
          $scope.updatigTweet = false;
      });
  }

  $scope.updatenewTweet = function(){
      if($scope.updating){return;}
      newupdateFromServer();
      $scope.$broadcast('scroll.refreshComplete');
  };


  var updateFromServer = function(page){
      $scope.updatigTweet = true;
      var params = angular.copy($scope.filters);
      params.page = page;
      if(page == 1){
          $scope.tweet = [];
      }
      Restangular.all('tweet').getList(params)
      .then(function(data){
          $scope.tweet = $scope.tweet.concat(data);
          $scope.metadata = data.metadata;
          //console.log($scope.tweet);
          // Estraggo la lista delle chiavi per poter creare un filtro
          //$rootScope.linee = _.keys(_.groupBy($scope.tweet, 'linea'));
          $scope.linee = _.map(_.groupBy($scope.tweet, 'linea'), 
               function(item, key){
                return {linea:key, tweets:item, stato:false};

          });
          $scope.updatigTweet = false;          
          //console.log($rootScope.linee);
      });
  };

  $scope.updateTweet = function(){
//    console.log('richiesta update');
      if($scope.updating || $scope.filters.eventiOggi){ $scope.$broadcast('scroll.infiniteScrollComplete'); return;}
      if($scope.metadata && $scope.metadata.next){
        $scope.pagina = $scope.pagina + 1;
        updateFromServer($scope.pagina);
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
  };




  // avvia la richiesta della prima pagina al server 
  updateFromServer(1);
  


})

.controller('LineeCtrl', function($scope, $ionicModal, $timeout, $rootScope, Restangular) {

 $scope.aperto = function(l){
  if (l.stato){
    return true;
  }
  return false;
 };

 $scope.openDettaglioLinea = function(l){
  $scope.linee[_.findKey($scope.linee, linea=l)].stato = true;
 };
  $scope.closeDettaglioLinea = function(l){
  $scope.linee[_.findKey($scope.linee, linea=l)].stato = false;
 };

 $scope.stileEvento = function(t){
		var res = {};
//		res.background-color = t.tipo == 1 ? '#ef473a' : t.tipo == 2 ? 'orange' : t.tipo == 3 ? '#33cd5f' : 'blue';
//		res.color = 'white';
	 	
	 	if(new Date(t.stamp).getDate() != new Date().getDate())
	 		res.opacity = 0.4;
	 	
	 	return res;
	}

 $scope.coloreEvento = function(t, tipologia){
  console.log(t, tipologia);
  if (t.tipo==0){
      return ''+tipologia+'-stable';
    }
  if (t.tipo==1){
      return ''+tipologia+'-assertive';
    }
  if (t.tipo==2){
      return ''+tipologia+'-energized';
    }    
    return ''+tipologia+'-balanced';
   };  
 
//console.log(t);
})


.controller('ChatsCtrl', function($scope, $timeout, $stateParams, Restangular, $rootScope, $filter) {
console.log($scope.tweet);
})



.controller('ChatDetailCtrl', function($scope, $timeout, $stateParams, Restangular) {
 Restangular.all('tweet').get($stateParams.chatId)
  .then(function(tweet){
    $scope.tt = tweet;
  }); 
})

.controller('AccountCtrl', function($scope, $ionicModal, $timeout, Restangular, $rootScope) {
  console.log($scope.filters.nonevento);
  console.log($scope.linee);

  $ionicModal.fromTemplateUrl('templates/my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

});

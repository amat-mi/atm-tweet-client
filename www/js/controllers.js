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


  $scope.filtraTweet = function(){
    return function(t){
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
    }
  }


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
                return {linea:key, tweets:item};

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
  $scope.filtraLineeVuote = function(){
    return function(t){
      if (t.linea== 'null' ){return false;}
      var risposta = 0;
      angular.forEach(t.tweets, function(value, key){ 
        valore =  function(){
          var ora = new Date();
          var dataevento = new Date(value.stamp);
          if($scope.filters.nonevento && value.tipo==0){
             return 0;
          }
          if($scope.filters.eventiOggi && (ora.getTime()- dataevento.getTime()) > (25*60*60*1000)  
            )
          {
            return 0;
          }
          return 1
        };
        risposta = risposta + valore();
      });
      if (risposta == 0) {return false;}
      return true;
    }
  };
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

.controller('AccountCtrl', function($scope, $timeout, Restangular, $rootScope) {
  console.log($scope.filters.nonevento);
  console.log($scope.linee);
  //$scope.pippo 

//  $rootScope.filters.nonevento = $scope.pippo 

});

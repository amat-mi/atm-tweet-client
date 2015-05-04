angular.module('starter.controllers', [])


.controller('TabCtrl', function($scope, $ionicModal, $timeout, $rootScope,  Restangular) {

  $rootScope.appUser = null;

  // inizializzo il dizionario dei filtri
  $rootScope.filters = {
    nonevento :false,
    aperturaevento : false,
    chiusuraevento : false
  };

  $rootScope.linee = {};

})

.controller('LineeCtrl', function($scope, $ionicModal, $timeout, $rootScope, Restangular) {


})


.controller('ChatsCtrl', function($scope, $timeout, $stateParams, Restangular, $rootScope) {
  //inizializzo il vettore dei tweet
  $scope.tweet = [];

  // variabile booleana per lo stato di aggiornamento o meno del sistema
  var updating= false;
  // Inserisco il numero pagna in locale perchè con next mi ritorna url e non id pagina
  $scope.metadata = {};
  $scope.metadata.number = 0;
  $scope.pagina = 0;

  $scope.filtraTweet = function(){
    return function(t){
      if($rootScope.filters.nonevento){
        if(_.contains(t.tipo_evento, "Non evento")){return false;}return true;
      }
      if($rootScope.filters.chiusuraevento){
        return _.contains(t.tipo_evento, "Chiusura");
      }
      return true;
    }
  }

  var updateFromServer = function(page){
      updating = true;
      var params = angular.copy($rootScope.filters);
      params.page = page;

      if(page == 1){
          $scope.tweet = [];
      }

      Restangular.all('tweet').getList(params)
      .then(function(data){
          $scope.tweet = $scope.tweet.concat(data);
          $scope.metadata = data.metadata;
          updating = false;
          console.log($scope.tweet);
          // Estraggo la lista delle chiavi per poter creare un filtro
          $rootScope.linee = _.keys(_.groupBy($scope.tweet, 'linea'));
          console.log($rootScope.linee);
      });
  };

  $scope.updateTweet = function(){
//    console.log('richiesta update');
      if(updating){ $scope.$broadcast('scroll.infiniteScrollComplete'); return;}
      if($scope.metadata && $scope.metadata.next){
        $scope.pagina = $scope.pagina + 1;
          updateFromServer($scope.pagina);

      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
  };
  // avvia la richiesta della prima pagina al server 
  updateFromServer(1);
})



.controller('ChatDetailCtrl', function($scope, $timeout, $stateParams, Restangular) {
 Restangular.all('tweet').get($stateParams.chatId)
  .then(function(tweet){
    $scope.tt = tweet;
  }); 
})

.controller('AccountCtrl', function($scope, $timeout, Restangular, $rootScope) {
  console.log($rootScope.filters.nonevento);
  $scope.pippo 

//  $rootScope.filters.nonevento = $scope.pippo 

});

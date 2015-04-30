angular.module('starter.controllers', [])

.controller('LineeCtrl', function($scope, $ionicModal, $timeout, $rootScope, Restangular) {

})


.controller('ChatsCtrl', function($scope, $timeout, $stateParams, Restangular) {
  //inizializzo il vettore dei tweet
  $scope.tweet = [];
  // inizializzo il dizionario dei filtri
  $scope.filters = {};
  // variabile booleana per lo stato di aggiornamento o meno del sistema
  var updating= false;
  // Inserisco il numero pagna in locale perchè con next mi ritorna url e non id pagina
  $scope.metadata = {};
  $scope.metadata.number = 0;
  $scope.pagina = 0;

  var updateFromServer = function(page){
      updating = true;
      var params = angular.copy($scope.filters);
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
      });
  };

  $scope.updateTweet = function(){
    console.log('richiesta update');
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

.controller('AccountCtrl', function($scope, $timeout, Restangular) {
  console.log('ciao');


});

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','btford.socket-io','ngSanitize',/*'ngCordovaOauth'*/])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider,$urlRouterProvider){
$stateProvider
  .state('login', {
    url: '/login',
    templateUrl:'templates/login.html'
  })
  .state('chat', {
    url: '/chat/:nickname',
    templateUrl:'templates/chat.html'
  });

  $urlRouterProvider.otherwise('/login');  

})


.directive('ngEnter',function(){
  return function(scope,element,attrs){
    element.bind("keydown keypress", function(event){
       if(event.which === 13){
         scope.$apply(function(){
          scope.$eval(attrs.ngEnter);
         });
         event.preventDefault();
       }
    })
  }
})

.controller('LoginController', function($scope,$state/*,$cordovaOauth*/){

    $scope.join = function (nickname){
      if(nickname)
      {
        $state.go('chat',{nickname: nickname});
      }
    }
    $scope.loginWithFacebook = function(){
      $cordovaOauth.facebook("490195891312954", ["email"]).then(function(result){
          alert(result.access_token);
      }, function(error){
       alert(error);
      });
    }
})
.controller('ChatController', function($scope,$stateParams, Socket
,$ionicScrollDelegate,$sce,$timeout)

{
  $scope.status_message = "Welcome to ChatApp";
  $scope.messages = [];
  $scope.nickname = $stateParams.nickname;
  $scope.displayPicture = "http://www.smartcallcentersolutions.com/images/profile_icon.png";

  var COLORS =['#f44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#009688'];
  
  Socket.on("connect",function(){
      $scope.socketId=this.id;

      var data = {
        message: $scope.nickname +" has joined the chat!", 
        sender: $scope.nickname, 
        socketId: $scope.socketId,
        isLog: true,
        displayPicture: "",
        color: $scope.getUsernameColor($scope.nickname)
    };

      Socket.emit("Message", data);

  });
  Socket.on("Message", function(data){
    data.message = fillWithEmoticons(data.message);
    data.message = $sce.trustAsHtml(data.message);
    $scope.messages.push(data);
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
  })

var typing = false;
var TYPING_TIMER_LENGTH=5000;

$scope.updateTyping = function(){
  if (!typing){
    typing = true;
    Socket.emit("typing",{socketId: $scope.socketId, sender: $scope.nickname});
  }
  lastTypingTime = (new Date()).getTime();

  $timeout(function(){
    var timeDiff = (new Date()).getTime() - lastTypingTime;
    if(timeDiff >= TYPING_TIMER_LENGTH && typing){
      Socket.emit('stop typing', {socketId: $scope.socketId, sender: $scope.nickname});
      typing =  false;
    }
}, TYPING_TIMER_LENGTH)
}

Socket.on('stop typing', function(data){
  $scope.status_message = "Welcome to ChatApp";
})

Socket.on('typing', function(data){
  $scope.status_message = data.sender + " is typing...";
})

 $scope.sendMessage = function(){
   if($scope.message.length==0)
    return;
   var newMessage= { sender:'', message:'', socketId:'', isLog:false, color:''};
   newMessage.sender = $scope.nickname;
   newMessage.message = $scope.message;
   newMessage.socketId = $scope.socketId;
   newMessage.isLog = false;
   newMessage.displayPicture = $scope.displayPicture;
   newMessage.color = $scope.getUsernameColor($scope.nickname);

   Socket.emit("Message",newMessage);
   $scope.message='';

 }

var fillWithEmoticons = function(message)
    { //(y)
      message = message.replace(/;\)/g, "<img src='img/emoticons/1_27.png' width='20px' height='20px' />");
      message = message.replace(/\(y\)/g, "<img src='img/emoticons/1_01.png' width='20px' height='20px' />");
      message = message.replace(/O:\)/g, "<img src='img/emoticons/1_02.png' width='20px' height='20px' />");
      message = message.replace(/:3/g, "<img src='img/emoticons/1_03.png' width='20px' height='20px' />");
      message = message.replace(/o.O/g, "<img src='img/emoticons/1_04.png' width='20px' height='20px' />");
      message = message.replace(/O.o/g, "<img src='img/emoticons/1_05.png' width='20px' height='20px' />");
      message = message.replace(/:\'\(/g, "<img src='img/emoticons/1_06.png' width='20px' height='20px' />");
      message = message.replace(/3:\)/g, "<img src='img/emoticons/1_07.png' width='20px' height='20px' />");
      message = message.replace(/:\(/g, "<img src='img/emoticons/1_08.png' width='20px' height='20px' />");
      message = message.replace(/:O/g, "<img src='img/emoticons/1_09.png' width='20px' height='20px' />");
      message = message.replace(/8-\)/g, "<img src='img/emoticons/1_10.png' width='20px' height='20px' />");
      message = message.replace(/:D/g, "<img src='img/emoticons/1_11.png' width='20px' height='20px' />");
      message = message.replace(/>:\(/g, "<img src='img/emoticons/1_22.png' width='20px' height='20px' />");
      message = message.replace(/\<3/g, "<img src='img/emoticons/1_13.png' width='20px' height='20px' />");
      message = message.replace(/\^_\^/g, "<img src='img/emoticons/1_14.png' width='20px' height='20px' />");
      message = message.replace(/\:\*/g, "<img src='img/emoticons/1_15.png' width='20px' height='20px' />");
      message = message.replace(/\:v/g, "<img src='img/emoticons/1_16.png' width='20px' height='20px' />");
      message = message.replace(/\<\(\"\)/g, "<img src='img/emoticons/1_17.png' width='20px' height='20px' />");
      message = message.replace(/\:poop\:/g, "<img src='img/emoticons/1_18.png' width='20px' height='20px' />");
      message = message.replace(/\:putnam\:/g, "<img src='img/emoticons/1_19.png' width='20px' height='20px' />");
      message = message.replace(/\(\^\^\^\)/g, "<img src='img/emoticons/1_20.png' width='20px' height='20px' />");
      message = message.replace(/\:\)/g, "<img src='img/emoticons/1_21.png' width='20px' height='20px' />");
      message = message.replace(/\-\_\-/g, "<img src='img/emoticons/1_22.png' width='20px' height='20px' />");
      message = message.replace(/8\|/g, "<img src='img/emoticons/1_23.png' width='20px' height='20px' />");
      message = message.replace(/\:P/g, "<img src='img/emoticons/1_24.png' width='20px' height='20px' />");
      message = message.replace(/\:\//g, "<img src='img/emoticons/1_25.png' width='20px' height='20px' />");
      message = message.replace(/\>\:O/g, "<img src='img/emoticons/1_26.png' width='20px' height='20px' />");
      message = message.replace(/\:\|\]/g, "<img src='img/emoticons/1_28.png' width='20px' height='20px' />");
      return message;
    }

$scope.getUsernameColor = function(username){
  var hash = 7;
  for(var i=0; i<username.length;i++)
  {
    hash= username.charCodeAt(i)+(hash<<5)- hash;
  }
  var index = Math.abs(hash%COLORS.length);
  return COLORS[index];
}
})

.factory('Socket', function (socketFactory) {
  var myIoSocket = io.connect('https://chatapp23.azurewebsites.net/');

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
})
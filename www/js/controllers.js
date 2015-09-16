angular.module('starter.controllers', [])

  .service('ItemInfo', function(){
    $ionicModal.fromTemplateUrl('templates/getphoto.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.getPhotoModal = modal;
    });

    return {
      lastPhoto:"",
      closeGetPhotoModal:function() {
        getPhotoModal.hide();
      },

    }
  })

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})

.controller('GetPhotoCtrl', function($scope, Camera, ItemInfo){

  $scope.getPhoto = function() {
    Camera.getPicture({
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: true
    }).then(function(imageURI) {
      console.log(imageURI);
      ItemInfo.lastPhoto = imageURI;
      // close modal
    }, function(err) {
      console.err(err);
    });
  };


  $scope.openPhotoLibrary = function() {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    Camera.getPicture(options).then(function(imageData) {

      //console.log(imageData);
      //console.log(options);
      var image = document.getElementById('tempImage');
      image.src = imageData;
      ItemInfo.lastPhoto = imageData;

      var server = "http://yourdomain.com/upload.php",
        filePath = imageData;

      var date = new Date();

      var options = {
        fileKey: "file",
        fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
        chunkedMode: false,
        mimeType: "image/jpg"
      };

      //$cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
      //  console.log("SUCCESS: " + JSON.stringify(result.response));
      //  console.log('Result_' + result.response[0] + '_ending');
      //  alert("success");
      //  alert(JSON.stringify(result.response));
      //
      //}, function(err) {
      //  console.log("ERROR: " + JSON.stringify(err));
      //  //alert(JSON.stringify(err));
      //}, function (progress) {
      //  // constant progress updates
      //});


    }, function(err) {
      // error
      console.log(err);
    });
  }

})

.controller('ProfileCtrl', function($scope){

})

.controller('ListItemCtrl', function($scope, Camera){
  $scope.lastPhoto = "img/placeholder.jpg";

  $scope.showChangePhoto = function(){
    console.log("test");
    $scope.getPhotoModal.show();
  };


});
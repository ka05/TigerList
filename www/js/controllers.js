angular.module('starter.controllers', [])

  .factory('ItemService', function(){
    var items = [];


    function getSearchItems(){
      var items = JSON.parse(window.localStorage.getItem("items")),
          searchItems = [];
      if(items){
        for(var i = 0; i<items.length; i++){
          searchItems.push(items[i]);
        }
      }
      return searchItems;
    }

    function getPremiumItems(){
      // get from db later
      // for now hard code them
      var items = [
        {
          itemId:'1',
          itemImg:'img/placeholder.jpg',
          itemName:'Premium Item 1',
          itemPrice:'$20',
          itemDesc:'Premium item description'
        },
        {
          itemId:'2',
          itemImg:'img/placeholder.jpg',
          itemName:'Premium Item 2',
          itemPrice:'$20',
          itemDesc:'Premium item description'
        },
        {
          itemId:'3',
          itemImg:'img/placeholder.jpg',
          itemName:'Premium Item 3',
          itemPrice:'$20',
          itemDesc:'Premium item description'
        },
        {
          itemId:'4',
          itemImg:'img/placeholder.jpg',
          itemName:'Premium Item 4',
          itemPrice:'$20',
          itemDesc:'Premium item description'
        },
        {
          itemId:'5',
          itemImg:'img/placeholder.jpg',
          itemName:'Premium Item 5',
          itemPrice:'$20',
          itemDesc:'Premium item description'
        }
        ],
        premiumItems = [];

      for(var i=0; i<items.length; i++){
        premiumItems.push(items[i]);
      }
      return premiumItems;
    }

    return {
      GetItems: function(){
        return getSearchItems();
      },
      GetPremiumItems: function(){
        return getPremiumItems();
      },
      GetItem: function(itemId){
        var items = getPremiumItems();
        items = items.concat(getSearchItems());
        for(i=0;i<items.length;i++){
          if(items[i].itemId == itemId){
            return items[i];
          }
        }
      }
    }
  })

  .service('ModalService', function($ionicModal, $rootScope) {
    // -- http://stackoverflow.com/questions/25214451/ionic-modal-windows-from-service
    var init = function(tpl, $scope) {

      var promise;
      $scope = $scope || $rootScope.$new();

      promise = $ionicModal.fromTemplateUrl(tpl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        return modal;
      });

      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });

      return promise;
    };

    return {
      init: init
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


.controller('ProfileCtrl', function($scope){

})

.controller('GesturesCtrl', function($scope, $timeout){
  $scope.gestureData = {
    swiperight: 0,
    swipeleft: 0,
    doubletap : 0
  };

  $scope.reportEvent = function(event)  {
    console.log('Reporting : ' + event.type);

    $timeout(function() {
      $scope.gestureData[event.type]++;
    })
  }

})

.directive('detectGestures', function($ionicGesture) {
  return {
    restrict :  'A',

    link : function(scope, elem, attrs) {
      var gestureType = attrs.gestureType;

      switch(gestureType) {
        case 'swipe':
          $ionicGesture.on('swipe', scope.reportEvent, elem);
          break;
        case 'swiperight':
          $ionicGesture.on('swiperight', scope.reportEvent, elem);
          break;
        case 'swipeleft':
          $ionicGesture.on('swipeleft', scope.reportEvent, elem);
          break;
        case 'doubletap':
          $ionicGesture.on('doubletap', scope.reportEvent, elem);
          break;
        case 'tap':
          $ionicGesture.on('tap', scope.reportEvent, elem);
          break;
        case 'scroll':
          $ionicGesture.on('scroll', scope.reportEvent, elem);
          break;
      }

    }
  }
})

.controller('ItemDetailCtrl', function($scope, $stateParams, ItemService){
  var itemId = $stateParams.itemId;
  $scope.item = ItemService.GetItem(itemId);
    console.log(ItemService.GetItem(itemId));
})

.controller('SearchCtrl', function($scope, ItemService){
  $scope.premiumItems = ItemService.GetPremiumItems();
  $scope.searchItems = ItemService.GetItems();

  $scope.showFilters = function(){
    // display filters modal
    console.log("show filters");
  };

})

.controller('ListItemCtrl', function($scope, $ionicPopup, $cordovaCamera){

  $scope.productImage = "img/placeholder.jpg";
  $scope.productId = "";

  $scope.listItem = function(){
    if(validateInputs("#item-form")){
      // get the inputs values and store
      var data = {
        "itemId":$scope.productId,
        "itemImg":$scope.productImage,
        "itemName":$('#item-name').val(),
        "itemDesc":$('#item-desc').val(),
        "itemPrice":"$" +$('#item-price').val()
        },
        items = [];

      if(window.localStorage.getItem("items")){
        items = JSON.parse(window.localStorage.getItem("items"));
      }
      items.push(data);
      window.localStorage["items"] = JSON.stringify(items);

      resetListItemForm();
    }

  };

  function resetListItemForm(){
    $scope.productImage = "img/placeholder.jpg";
    $('#item-name').val("");
    $('#item-desc').val("");
    $('#item-price').val("");
  }

  function validateInputs(_formID){
    console.log("validating");
    if(!checkEmptyFields(_formID)){
      console.log("valid");
      $scope.productId = makeid();
      return true;
    }else{
      return false;
    }
  }

  function checkEmptyFields(_formID){
    var oneEmpty = false;

    $(_formID + ' input').each(function(){
      if($(this).val() == ""){
        oneEmpty = true;
      }
    });
    return oneEmpty;
  }

  /* CAMERA RELATED FUNCTIONS */

  function fail(error) {
    console.log("fail: " + error.code);
  }

  function copyFile(fileEntry) {
    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
    var newName = makeid() + name;
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
        fileEntry.copyTo(
          fileSystem2,
          newName,
          onCopySuccess,
          fail
        );
      },
      fail);
  }

  function onCopySuccess(entry) {
    $scope.$apply(function () {
      //$scope.images.push(entry.nativeURL);
      $scope.productImage = entry.nativeURL;
    });
  }

  function createFileEntry(fileURI) {
    window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
  }

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i=0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

    // http://devdactic.com/how-to-capture-and-store-images-with-ionic/
    // https://github.com/driftyco/ionic-example-cordova-camera/blob/master/www/js/app.js
  //console.log($cordovaCamera);
  var takePhoto = function(){
    $cordovaCamera.getPicture({
      //quality: 50,
      //targetWidth: 320,
      //targetHeight: 320,
      destinationType : navigator.camera.DestinationType.FILE_URI,
      sourceType : navigator.camera.PictureSourceType.CAMERA,
      //mediaType: navigator.camera.MediaType.CAMERA,
      allowEdit : false,
      encodingType: navigator.camera.EncodingType.PNG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
      //correctOrientation:true
    }).then(function(imageURI) {
      createFileEntry(imageURI);
        console.log(imageURI);
      // close modal
    }, function(err) {
      console.log(err);
    });
  },
  choosePhoto = function(){
    $cordovaCamera.getPicture({
      quality: 50,
      destinationType: navigator.camera.DestinationType.FILE_URI,
      sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      encodingType: navigator.camera.EncodingType.PNG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    }).then(function(imageData) {
      createFileEntry(imageData);

      //var server = "http://yourdomain.com/upload.php",
      //  filePath = imageData;
      //
      //var date = new Date();
      //
      //var options = {
      //  fileKey: "file",
      //  fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
      //  chunkedMode: false,
      //  mimeType: "image/jpg"
      //};

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
  };

  $scope.showPhotoModal = function(){
    var myPopup = $ionicPopup.show({
      title: 'Add a Photo',
      subTitle: 'Please be reasonable with what you upload',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Take Photo',
          type: 'button-positive',
          onTap: function(e) {
            takePhoto();
          }
        },
        {
          text: 'Upload Photo',
          type: 'button-positive',
          onTap: function(e) {
            choosePhoto();
          }
        }
      ]
    });
  };

})

.controller('MapCtrl', function($scope, $ionicLoading){
    $scope.positions = [{
      lat: 43.080017,
      lng: -77.682456
    }];

    $scope.$on('mapInitialized', function(event, map) {
      $scope.map = map;
    });

    $scope.centerOnMe= function(){
      $scope.positions = [];


      $ionicLoading.show({
        template: 'Loading...'
      });


      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.positions.push({lat: pos.k,lng: pos.B});
        console.log(pos);
        $scope.map.setCenter(pos);
        $ionicLoading.hide();
      });

    };

})

.controller('FileStorageCtrl', function($scope, $cordovaFile){

    $scope.saveToFile = function(){
      var demoTxt = '{ "value" : "' + $('#demo-txt').val() + '"}',
          fileName = "test.json";

      // save demo text to file
      writeToFile(fileName, demoTxt);
    };

    $scope.readFromFile = function(){
      // get file
      console.log("readFromFile");
      // parse out text
      var txtFromFile = "";// $cordovaFile.readAsText(cordova.file.dataDirectory, 'test.json');

      $cordovaFile.readAsText(cordova.file.dataDirectory, 'test.json').then(function(result) {
        console.log("readAsText: " + result);

        // set text of input to text retrieved from file
        $('#demo-txt').val(JSON.parse(result).value);

      }, function(err) {
        console.log("readAsText: " + JSON.stringify(err));
      });
    };


    function createFile(_fileName, _callback){
      $cordovaFile.createFile(cordova.file.dataDirectory, _fileName, true).then(function(result) {
        console.log("createFile: " + JSON.stringify(result));
        _callback();
      }, function(err) {
        console.log("createFile: " + JSON.stringify(err));
      });
    }

    function writeFile(_fileName, _data){
      // '{"test":"test"}'
      $cordovaFile.writeFile(cordova.file.dataDirectory, _fileName, _data, true).then( function(result) {
        // Success!
        console.log("writeFile: " + JSON.stringify(result));
      }, function(err) {
        // An error occured. Show a message to the user
        console.log("writeFile: " + JSON.stringify(err));
      });
    }

    function writeToFile(_fileName, _data){
      $cordovaFile.checkFile(cordova.file.dataDirectory, _fileName)
        .then(function (result) {
          console.log("checkFile: " + JSON.stringify(result));
          if( result.isFile ){
            console.log("file exists");
            writeFile(_fileName, _data);
          }else{
            console.log("file does not exist");
            // file doesnt exist
            createFile(_fileName, function(){
              writeFile(_fileName, _data);
            });
          }
          // success
        }, function (err) {
          console.log("file does not exist");
          console.log("checkFile: " + JSON.stringify(err));
          if(err.code == 1){
            // file doesnt exist
            createFile(_fileName, function(){
              writeFile(_fileName, _data);
            });
          }
          return false;
        });
    }
});

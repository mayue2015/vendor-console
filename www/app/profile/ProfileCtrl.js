'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
    .controller('ProfileCtrl', function ($scope, $rootScope, $http, $stateParams, $location, $state, $filter, apiConfig, ConfirmModalDialogService, CameraService, FeedbackService) {
        
      $scope.form = {};
      $scope.isCommitState = true;
      $scope.showDrop = false;

      $scope.$watch('lastPhoto', function(newValue) {
          if (newValue) {
              $scope.isCommitState = false;
          } else if (newValue === "" || newValue === null) {
              $scope.isCommitState = true;
          }
      });

      $scope.$watch('form.content', function(newValue) {
          if (newValue) {
              $scope.isCommitState = false;
          } else if (newValue === "" || newValue === null) {
              $scope.isCommitState = true;
          }
      });

      $scope.uploadFile = function () {
          $upload.upload({
              url: '/api/v2/media',
              method: 'POST',
              file: files[i]
          }).progress(function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.uploadProgress = ('progress: ' + progressPercentage + '% ' + evt.config.file.name);
          }).success(function (data) {
              $scope.mediaUrl = data.url;
              $scope.form.mediaFileId = data.id;
          })
      };

      $scope.upload = function (filePath) {
          if (filePath) {
              $scope.isCommitState = true;

              CameraService.upload(filePath).then(function (file) {
                  $scope.isCommitState = false;

                  FeedbackService.feedback($scope.form.content, file.id).then(function () {
                      ConfirmModalDialogService.AsyncAlert("反馈成功，我们会尽快处理");
                      $scope.form.content = null;
                      $scope.lastPhoto = null;
                      
                      return;
                  });
              }, function (err) {
                  $scope.isCommitState = false;

                  ConfirmModalDialogService.AsyncAlert("反馈失败");
                  return;
              });
          } else {
              FeedbackService.feedback($scope.form.content).then(function () {
                  ConfirmModalDialogService.AsyncAlert("反馈成功，我们会尽快处理");
                  $scope.form.content = null;
                  return;
              });
          }
      };

      $scope.addPicture = function () {
          $('div.action-sheet-backdrop')[0].style.display = "block";
          $scope.showDrop = true;
      };

      $scope.hideBackdrop = function () {
          $('div.action-sheet-backdrop')[0].style.display = "none";
      };

      $scope.buttonClicked = function (index) {
          if (index === 0) {
              CameraService.getPicture({
                  quality: 75,
                  targetWidth: 320,
                  targetHeight: 320,
                  saveToPhotoAlbum: false,
                  sourceType: Camera.PictureSourceType.PHOTOLIBRARY
              }).then(function (imageURI) {
                  $scope.lastPhoto = imageURI;

                  $('div.action-sheet-backdrop')[0].style.display = "none";
              })

              return true;
          } else if (index === 1) {
              CameraService.getPicture({
                  quality: 75,
                  targetWidth: 320,
                  targetHeight: 320,
                  saveToPhotoAlbum: false
              }).then(function (imageURI) {
                  $scope.lastPhoto = imageURI;

                  $('div.action-sheet-backdrop')[0].style.display = "none";
              })

              return true;
          }
      };

    	$scope.reset = function() {
    			$scope.oldPassword = null;
  	    	$scope.newPassword = null;
  	    	$scope.repeatNewPassword = null;
  		};
  		
    	$scope.reset();

  		$scope.updatePassword = function() {
    			if ($scope.newPassword !== $scope.repeatNewPassword) {
    				  ConfirmModalDialogService.AsyncAlert("请再次确认新密码");
              return;
    			} else {
    				  $http({
                  url: apiConfig.host + '/admin/vendor-api/vendor/updateVendorPassword',
                  method: 'PUT',
                  params: {
                  	oldPassword: $scope.oldPassword,
                  	newPassword: $scope.newPassword
                  },
                  headers: {'Content-Type': 'application/json;charset=UTF-8'}
              })
              .success(function (data, status) {
                  ConfirmModalDialogService.AsyncAlert("密码修改成功");
                  $scope.reset();

                  return;
              })
              .error(function (data) {
                  ConfirmModalDialogService.AsyncAlert("密码修改失败");
                  return;
              });
    			}
  		};

      // 退出登录
      $scope.logout = function () {
          ConfirmModalDialogService.AsyncConfirmYesNo(
              "确定退出登录？", 
              function() {
                  $http({
                      url: apiConfig.host + "/admin/vendor-api/logout",
                      method: 'GET'
                  })
                  .success(function (data, status) {
                      window.localStorage.removeItem('cachedUsername');
                      window.localStorage.removeItem('password');
                      window.localStorage.removeItem('realName');

                      $state.go("login");
                  })
                  .error(function (data, status) {
                      ConfirmModalDialogService.AsyncAlert("退出异常");
                  })
              }
          );
      };

    });
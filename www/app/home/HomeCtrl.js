'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
    .controller('HomeCtrl', function($scope, $http, $state, apiConfig, ConfirmModalDialogService) {

        // 获取当前登录用户
        $scope.userName = "";

        if (window.localStorage['realName'])
            $scope.userName = window.localStorage['realName'];
        else
            ConfirmModalDialogService.AsyncAlert("获取登录用户异常");
        
    });

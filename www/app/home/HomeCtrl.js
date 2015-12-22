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

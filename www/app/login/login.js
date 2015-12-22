'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
    .controller('LoginCtrl', function($scope, $http, $state, apiConfig, ConfirmModalDialogService) {

        $scope.isLoginState = false;

    	$scope.user = {
            username: '',
            password: ''
        };

        // 供应商登录
        $scope.login = function (user) {
            if (user.username === "") {
                ConfirmModalDialogService.AsyncAlert("登录用户名不能为空");
                return;
            } 
            if (user.password === "") {
                ConfirmModalDialogService.AsyncAlert("登录密码不能为空");
                return;
            }

            $scope.isLoginState = true;

            $http({
                url: apiConfig.host + "/admin/vendor-api/login",
                method: 'POST',
                data: user
            })
            .success(function (data, status) {
                window.localStorage['cachedUsername'] = user.username;
                window.localStorage['password'] = user.password;
                window.localStorage['realName'] = data.name;

                $state.go("home");

                $scope.isLoginState = false;
            })
            .error(function (data, status) {
                $scope.isLoginState = false;

                if (data)
                    ConfirmModalDialogService.AsyncAlert(data.errmsg);
                else
                    ConfirmModalDialogService.AsyncAlert("登录失败");
            });
        };

        if (window.localStorage['cachedUsername']) {
            $scope.user.username = window.localStorage['cachedUsername'];
            $scope.user.password = window.localStorage['password'];

            $scope.login($scope.user);
        }

        // 重置
        $scope.reset = function () {
            $scope.user.username = "";
            $scope.user.password = "";
        };

    });

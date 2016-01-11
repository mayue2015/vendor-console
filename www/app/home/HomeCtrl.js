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

        if (window.localStorage['realName']) {
            $scope.userName = window.localStorage['realName'];
        } else {
			var strcookie = document.cookie;
			var arrcookie = strcookie.split("; ");
			for (var i=0; i < arrcookie.length; i++) {
				var arr = arrcookie[i].split("=");
				if ("realName" === arr[0]) {
					$scope.userName = unescape(arr[1]);
					break;
				}
			}
        }
        
    });

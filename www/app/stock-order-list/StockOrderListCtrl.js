'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:StockOrderListCtrl
 * @description
 * # StockOrderListCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
    .controller('StockOrderListCtrl', function($scope, $http, apiConfig, ConfirmModalDialogService) {

    	$scope.showLoading = true;

    	$http.get(apiConfig.host + "/admin/vendor-api/vendor/order/ready")
			.success(function (data, status) {
				// console.log(data.content);
				$scope.purchaseOrders = data.content;
				$scope.showLoading = false;
			})
			.error(function (data, status) {
				ConfirmModalDialogService.AsyncAlert("列表加载失败");
				$scope.showLoading = false;
			});

    });

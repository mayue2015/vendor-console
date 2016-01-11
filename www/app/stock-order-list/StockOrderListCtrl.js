'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:StockOrderListCtrl
 * @description
 * # StockOrderListCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
    .controller('StockOrderListCtrl', function($scope, $http, apiConfig, ConfirmModalDialogService, CommonService) {

    	$scope.showLoading = true;
    	$scope.searchForm = {
    		depotId: ""
    	};

    	CommonService.getVendorDepots().then(function(data) {
            $scope.vendorDepots = data;
        });

    	$scope.loadStockOrders = function () {
	    	$http({
	    		url: apiConfig.host + "/admin/vendor-api/vendor/order/ready",
	    		method: "GET",
	    		params: {depotId: $scope.searchForm.depotId}
	    	})
			.success(function (data, status) {
				// console.log(data.content);
				$scope.purchaseOrders = data.content;
				$scope.showLoading = false;
			})
			.error(function (data, status) {
				ConfirmModalDialogService.AsyncAlert("列表加载失败");
				$scope.showLoading = false;
			});
		};

		$scope.loadStockOrders();

    });

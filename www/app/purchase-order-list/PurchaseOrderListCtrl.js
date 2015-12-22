'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:PurchaseOrderListCtrl
 * @description
 * # PurchaseOrderListCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
    .controller('PurchaseOrderListCtrl', function($scope, $http, apiConfig, ConfirmModalDialogService) {

    	$scope.isCheckedAll = false;
        $scope.isCommiting = false;
        $scope.searchForm = {};
    	$scope.searchForm.checkedItemIds = [];

    	$scope.loadPurchaseOrders = function () {
    		$http.get(apiConfig.host + "/admin/vendor-api/vendor/order/notReady")
    			.success(function (data, status) {
    				// console.log(data.content);
    				$scope.purchaseOrders = data.content;
    			})
    			.error(function (data, status) {
    				ConfirmModalDialogService.AsyncAlert("获取采购单数据失败");
    			});
    	};

    	$scope.loadPurchaseOrders();

		$scope.checkAll = function() {
			if (!($scope.isCheckedAll)) {
				angular.forEach($scope.purchaseOrders, function(value, key){
					$scope.searchForm.checkedItemIds.push(value.id);
				});

				$scope.isCheckedAll = true;
			} else {
				$scope.searchForm.checkedItemIds = [];
				$scope.isCheckedAll = false;
			}
		};

        $scope.confirmPurchase = function () {
            if ($scope.searchForm.checkedItemIds.length === 0) {
                ConfirmModalDialogService.AsyncAlert("请选择已备货商品");
                return;
            }

            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认提交所选备货？", 
                function() {
                    $scope.isCommiting = true;

                    $http({
                        url: apiConfig.host + "/admin/vendor-api/vendor/order/submit",
                        method: 'POST',
                        data: $scope.searchForm.checkedItemIds
                    })
                    .success(function (data, status) {
                       ConfirmModalDialogService.AsyncAlert("提交备货成功");
                       
                       $scope.loadPurchaseOrders();
                       $scope.isCommiting = false;
                    })
                    .error(function (data, status) {
                        ConfirmModalDialogService.AsyncAlert("提交异常");
                        $scope.isCommiting = false;
                    })

                }
            );
        };

    });

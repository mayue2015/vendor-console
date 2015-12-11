'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:PurchaseOrderListCtrl
 * @description
 * # PurchaseOrderListCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
    .controller('PurchaseOrderListCtrl', function($scope, $http, $stateParams, apiConfig, ConfirmModalDialogService) {

    	$scope.isCheckedAll = false;

		$scope.checkAll = function() {
			if(!($scope.isCheckedAll)){
				angular.forEach($scope.purchaseOrders, function(value, key){
					$scope.searchForm.checkedItemIds.push(value.id);
				});
				$scope.isCheckedAll = true;
			}else{
				$scope.searchForm.checkedItemIds = [];
				$scope.isCheckedAll = false;
			}
		};

		
    });

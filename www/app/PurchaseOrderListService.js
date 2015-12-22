angular.module('vendorConsoleApp')
	.factory('PurchaseOrderListService', function ($http, apiConfig) {

		var service = {};

		service.getOrderGroups = function () {
			return $http({
				url: apiConfig.host + "/admin/api/v2/orderGroups",
				method: "GET"
			}).then(function (payload) {
				return payload.data;
			})
		};

		return service;
	});
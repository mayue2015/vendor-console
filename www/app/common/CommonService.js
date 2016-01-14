angular.module("vendorConsoleApp")
	.factory('CommonService', function ($http, apiConfig) {

		var service = {};

		service.setCityId = function (cityId) {
			service.cityId = cityId;
		};

		service.getVendorDepots = function () {
			return $http({
				url: apiConfig.host + "/admin/vendor-api/vendor/depot/list/" + service.cityId,
				method: "GET"
			}).then(function (payload) {
				return payload.data;
			});
		};

		return service;
	});
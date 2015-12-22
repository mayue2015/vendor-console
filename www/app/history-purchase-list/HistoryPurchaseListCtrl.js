'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:HistoryPurchaseListCtrl
 * @description
 * # HistoryPurchaseListCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
	.controller('HistoryPurchaseListCtrl', function($scope, $http, $filter, $stateParams, $location, apiConfig, ConfirmModalDialogService) {

		$scope.searchForm = {
			page : $stateParams.page,
            pageSize : $stateParams.pageSize,
            start : $stateParams.start,
            end : $stateParams.end
		};

		$scope.format = 'yyyy-MM-dd';

        $scope.showLoading = true;

		$scope.page = {
            itemsPerPage : 50
        };

		$scope.openStart = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedEnd = false;
            $scope.openedStart = true;
        };

        $scope.openEnd = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedStart = false;
            $scope.openedEnd = true;
        };

        $scope.dateOptions = {
            dateFormat: 'yyyy-MM-dd',
            formatYear: 'yyyy',
            startingDay: 1,
            startWeek: 1
        };

        $scope.$watch('startDate', function(newVal) {
            $scope.searchForm.start = $filter('date')(newVal, 'yyyy-MM-dd');
        });

        $scope.$watch('endDate', function(newVal) {
            $scope.searchForm.end = $filter('date')(newVal, 'yyyy-MM-dd');
        });

        if ($scope.searchForm.start) {
            $scope.startDate = Date.parse($scope.searchForm.start);
        }

        if ($scope.searchForm.end) {
            $scope.endDate = Date.parse($scope.searchForm.end);
        }

        $http({
            url: apiConfig.host + "/admin/vendor-api/vendor/order/history",
            method: "GET",
            params: $scope.searchForm
        })
        .success(function (data, status) {
            // console.log(data);
            $scope.historyPurchaseLists = data.content;

            $scope.showLoading = false;

            /*分页数据*/
            $scope.page.itemsPerPage = data.pageSize;
            $scope.page.totalItems = data.total;
            $scope.page.currentPage = data.page + 1;
        })
        .error(function (data, status) {
            ConfirmModalDialogService.AsyncAlert("获取历史数据失败");
            $scope.showLoading = false;
        });

        $scope.resetPageAndSearch = function () {
            $scope.searchForm.page = 0;
            $scope.searchForm.pageSize = 50;

            $location.search($scope.searchForm);
        };

        $scope.pageChanged = function() {
            $scope.searchForm.page = $scope.page.currentPage - 1;
            $scope.searchForm.pageSize = $scope.page.itemsPerPage;

            $location.search($scope.searchForm);
        }

 	});

//将时间控件的时间格式化为字符串
angular.module('vendorConsoleApp')
	.directive('dateForSearch', ['$filter', '$parse', function ($filter, $parse) {
	    return {
	        restrict: 'A',
	        require: '^ngModel',
	        link: function (scope, element, attrs, ctrl) {
	            scope.$watch(attrs.ngModel, function (d) {
	                if (d) {
	                    if (angular.isDate(d)) {
	                    } else {
	                        d = Date.parse(d);
	                    }

	                    var modelGetter = $parse(attrs.ngModel);
	                    var modelSetter = modelGetter.assign;
	                    if (scope.submitDateFormat) {
	                        modelSetter(scope, $filter('date')(d, scope.submitDateFormat));
	                    } else {
	                        modelSetter(scope, $filter('date')(d, 'yyyy-MM-dd'));
	                    }
	                }
	            });
	        }
	    };
}]);
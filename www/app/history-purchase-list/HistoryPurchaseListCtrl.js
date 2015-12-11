'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:HistoryPurchaseListCtrl
 * @description
 * # HistoryPurchaseListCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
	.controller('HistoryPurchaseListCtrl', function($scope, $stateParams, ConfirmModalDialogService) {

		$scope.searchForm = {};
		$scope.submitDateFormat = "yyyy-MM-dd HH:mm";
        $scope.openedStart = false;
        $scope.openedEnd = false;

		$scope.dateOptions = {
            dateFormat: 'yyyy-MM-dd HH:mm',
            startingDay: 1
        };

        $scope.openCalendar = function(e) {
            e.preventDefault();
            e.stopPropagation();

            $scope.openedStart = true;
        };

        $scope.openCalendar1 = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            $scope.isOopenedEndpen1 = true;
        };
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
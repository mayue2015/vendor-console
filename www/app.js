'use strict';
/**
 * @ngdoc overview
 * @name vendorConsoleApp
 * @description
 * # vendorConsoleApp
 *
 * Main module of the application.
 */
angular
	.module('vendorConsoleApp', [
        'oc.lazyLoad',
        'angular-loading-bar',
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.datetimepicker',
        'checklist-model',
        'ngTouch'
    ])
    .constant('apiConfig', {
        // "host": "http://115.28.66.10"  //线上
        // "host": "http://115.28.64.174"  //测试
        "host": "",  //本地   http://192.168.1.114
        "environment": "develop"
    })
    .run(function (UpdateService) {
        UpdateService.check().then(function (result) {
            if (result === true) {
                console.log('update available');

                var download = UpdateService.download();
                download.then(function (manifest) {
                        console.log('manifest.....:');
                        console.log(JSON.stringify(manifest));

                        UpdateService.update();
                    }, function (error) {
                        console.log('error....: ');
                        console.log(JSON.stringify(error));
                    }
                );
            } else {
                console.log('not update available');
            }
        }, function (error) {
            console.log('no update available');
            console.log(JSON.stringify(error));
        });
    })
	.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$locationProvider', '$httpProvider', '$provide',
        function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider, $httpProvider, $provide) {

            $ocLazyLoadProvider.config({
                debug: false,
                events: true
            });

            $urlRouterProvider.otherwise('/login');

            $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
                return {
                    'responseError': function (rejection) {
                        var status = rejection.status;
                        var config = rejection.config;
                        var method = config.method;
                        var url = config.url;

                        if (status == 401) {
                            $location.path("/login");
                        } else {
                            $rootScope.error = method + " on " + url + " failed with status " + status;
                        }

                        return $q.reject(rejection);
                    }
                };
            });

            $stateProvider
	            .state('login', {
                    templateUrl: 'app/login/login.html',
                    controller: 'LoginCtrl',
                    url: '/login',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'vendorConsoleApp',
                                files: [
                                    'app/common/CommonService.js',
                                    'app/login/login.js'
                                ]
                            })
                        }
                    }
	            })
                .state('home', {
                    templateUrl: 'app/home/home.html',
                    controller: 'HomeCtrl',
                    url: '/home',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'vendorConsoleApp',
                                files: [
                                    'app/home/HomeCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('purchase-order-list', {
                    templateUrl: 'app/purchase-order-list/purchase-order-list.html',
                    controller: 'PurchaseOrderListCtrl',
                    url: '/purchase-order-list',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'vendorConsoleApp',
                                files: [
                                    'app/common/CommonService.js',
                                    'app/purchase-order-list/PurchaseOrderListCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('stock-order-list', {
                    templateUrl: 'app/stock-order-list/stock-order-list.html',
                    controller: 'StockOrderListCtrl',
                    url: '/stock-order-list',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'vendorConsoleApp',
                                files: [
                                    'app/common/CommonService.js',
                                    'app/stock-order-list/StockOrderListCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('history-purchase-list', {
                    templateUrl: 'app/history-purchase-list/history-purchase-list.html',
                    controller: 'HistoryPurchaseListCtrl',
                    url: '/history-purchase-list/?page&pageSize&start&end',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'vendorConsoleApp',
                                files: [
                                    'app/history-purchase-list/HistoryPurchaseListCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('profile', {
                    templateUrl: 'app/profile/profile.html',
                    controller: 'ProfileCtrl',
                    url: '/profile',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'vendorConsoleApp',
                                files: [
                                    'app/profile/CameraService.js',
                                    'app/profile/FeedbackService.js',
                                    'app/profile/ProfileCtrl.js'
                                ]
                            })
                        }
                    }
                })
        }
    ]);

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
angular.module('vendorConsoleApp')
	.factory('ConfirmModalDialogService', function () {

		var service = {};

		service.AsyncConfirmYesNo = function (msg, yesFn) {
			var $confirm = $("#modalConfirmYesNo");
		    
		    $confirm.modal({backdrop: 'static', keyboard: false});
		    $confirm.modal('show');
		    
		    $("#lblMsgConfirmYesNo").html(msg);

		    $("#btnNoConfirmYesNo").off('click').click(function () {
		        $confirm.modal("hide");
		    });

		    $("#btnYesConfirmYesNo").off('click').click(function () {
		        $confirm.modal("hide");
		        yesFn();
		    });
		}

		service.AsyncAlert = function (msg) {
			var $alert = $("#alertModal");
		    
		    $alert.modal({backdrop: 'static', keyboard: false});
		    $alert.modal('show');
		    
		    $("#alertMsg").html(msg);

		    $("#alertBtn").off('click').click(function () {
		        $alert.modal("hide");
		        $("body .modal-backdrop").remove();
		    });
		}

		return service;
	});
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
'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
    .controller('HomeCtrl', function($scope, $http, $state, apiConfig) {

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

'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
    .controller('LoginCtrl', function($scope, $http, $state, apiConfig, ConfirmModalDialogService, CommonService) {

        $scope.isLoginState = false;

    	$scope.user = {
            username: '',
            password: ''
        };

        $scope.isLocalStorageSupported = function () {
            var testKey = 'testKey',
                storage = window.localStorage;

            try {
                storage.setItem(testKey, 'testValue');
                storage.removeItem(testKey);
                return true;
            } catch (error) {
                return false;
            }
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
                if ($scope.isLocalStorageSupported()) {
                    window.localStorage['cachedUsername'] = user.username;
                    window.localStorage['password'] = user.password;
                    window.localStorage['realName'] = data.name;
                } else {
                    document.cookie = "realName="+escape(data.name);
                }

                CommonService.setCityId(data.city.id);

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

angular.module('vendorConsoleApp')
    .factory('CameraService', ['$q', 'apiConfig', function ($q, $cordovaFileTransfer, apiConfig) {
        // '$cordovaFileTransfer',
        return {
            getPicture: function (options) {
                var q = $q.defer();

                navigator.camera.getPicture(function (result) {
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            },

            upload: function(filePath) {
                document.addEventListener('deviceready', function () {
                    return $cordovaFileTransfer.upload(apiConfig.host + "/admin/vendor-api/media", filePath, {
                        fileKey: "file",
                        chunkedMode: false
                    }).then(function(result) {
                        if(result.responseCode === 200) {
                            return angular.fromJson(result.response);
                        }
                    });
                }, false);
            }
        }
    }]);
angular.module('vendorConsoleApp')
    .factory('FeedbackService', function ($http, $q, apiConfig) {
        var service = {};

        service.feedback = function (content, fileId) {
            return $http({
                url: apiConfig.host + "/admin/vendor-api/feedback",
                method: 'POST',
                data: {feedbackDescription: content, mediaFileId: fileId}
            }).then(function(payload) {
                return payload.data;
            });
        };

        return service;
    })
'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
    .controller('ProfileCtrl', function ($scope, $rootScope, $http, $stateParams, $location, $state, $filter, apiConfig, ConfirmModalDialogService, CameraService, FeedbackService) {
        
      $scope.form = {};
      $scope.isCommitState = true;
      $scope.showDrop = false;

      $scope.$watch('lastPhoto', function(newValue) {
          if (newValue) {
              $scope.isCommitState = false;
          } else if (newValue === "" || newValue === null) {
              $scope.isCommitState = true;
          }
      });

      $scope.$watch('form.content', function(newValue) {
          if (newValue) {
              $scope.isCommitState = false;
          } else if (newValue === "" || newValue === null) {
              $scope.isCommitState = true;
          }
      });

      $scope.uploadFile = function () {
          $upload.upload({
              url: '/api/v2/media',
              method: 'POST',
              file: files[i]
          }).progress(function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.uploadProgress = ('progress: ' + progressPercentage + '% ' + evt.config.file.name);
          }).success(function (data) {
              $scope.mediaUrl = data.url;
              $scope.form.mediaFileId = data.id;
          })
      };

      $scope.upload = function (filePath) {
          if (filePath) {
              $scope.isCommitState = true;

              CameraService.upload(filePath).then(function (file) {
                  $scope.isCommitState = false;

                  FeedbackService.feedback($scope.form.content, file.id).then(function () {
                      ConfirmModalDialogService.AsyncAlert("反馈成功，我们会尽快处理");
                      $scope.form.content = null;
                      $scope.lastPhoto = null;
                      
                      return;
                  });
              }, function (err) {
                  $scope.isCommitState = false;

                  ConfirmModalDialogService.AsyncAlert("反馈失败");
                  return;
              });
          } else {
              FeedbackService.feedback($scope.form.content).then(function () {
                  ConfirmModalDialogService.AsyncAlert("反馈成功，我们会尽快处理");
                  $scope.form.content = null;
                  return;
              });
          }
      };

      $scope.addPicture = function () {
          $('div.action-sheet-backdrop')[0].style.display = "block";
          $scope.showDrop = true;
      };

      $scope.hideBackdrop = function () {
          $('div.action-sheet-backdrop')[0].style.display = "none";
      };

      $scope.buttonClicked = function (index) {
          if (index === 0) {
              CameraService.getPicture({
                  quality: 75,
                  targetWidth: 320,
                  targetHeight: 320,
                  saveToPhotoAlbum: false,
                  sourceType: Camera.PictureSourceType.PHOTOLIBRARY
              }).then(function (imageURI) {
                  $scope.lastPhoto = imageURI;

                  $('div.action-sheet-backdrop')[0].style.display = "none";
              })

              return true;
          } else if (index === 1) {
              CameraService.getPicture({
                  quality: 75,
                  targetWidth: 320,
                  targetHeight: 320,
                  saveToPhotoAlbum: false
              }).then(function (imageURI) {
                  $scope.lastPhoto = imageURI;

                  $('div.action-sheet-backdrop')[0].style.display = "none";
              })

              return true;
          }
      };

    	$scope.reset = function() {
    			$scope.oldPassword = null;
  	    	$scope.newPassword = null;
  	    	$scope.repeatNewPassword = null;
  		};
  		
    	$scope.reset();

  		$scope.updatePassword = function() {
    			if ($scope.newPassword !== $scope.repeatNewPassword) {
    				  ConfirmModalDialogService.AsyncAlert("请再次确认新密码");
              return;
    			} else {
    				  $http({
                  url: apiConfig.host + '/admin/vendor-api/vendor/updateVendorPassword',
                  method: 'PUT',
                  params: {
                  	oldPassword: $scope.oldPassword,
                  	newPassword: $scope.newPassword
                  },
                  headers: {'Content-Type': 'application/json;charset=UTF-8'}
              })
              .success(function (data, status) {
                  ConfirmModalDialogService.AsyncAlert("密码修改成功");
                  
                  $state.go("home");
              })
              .error(function (data) {
                  ConfirmModalDialogService.AsyncAlert("密码修改失败");
              });
    			}
  		};

      // 退出登录
      $scope.logout = function () {
          ConfirmModalDialogService.AsyncConfirmYesNo(
              "确定退出登录？", 
              function() {
                  $http({
                      url: apiConfig.host + "/admin/vendor-api/logout",
                      method: 'GET'
                  })
                  .success(function (data, status) {
                      window.localStorage.removeItem('cachedUsername');
                      window.localStorage.removeItem('password');
                      window.localStorage.removeItem('realName');

                      $state.go("login");
                  })
                  .error(function (data, status) {
                      ConfirmModalDialogService.AsyncAlert("退出异常");
                  })
              }
          );
      };

    });
'use strict';
/**
 * @ngdoc function
 * @name vendorConsoleApp.controller:PurchaseOrderListCtrl
 * @description
 * # PurchaseOrderListCtrl
 * Controller of the vendorConsoleApp
 */
angular.module('vendorConsoleApp')
    .controller('PurchaseOrderListCtrl', function($scope, $http, apiConfig, ConfirmModalDialogService, CommonService) {

    	$scope.isCheckedAll = false;
        $scope.isCommiting = false;
        $scope.showLoading = true;
        $scope.searchForm = {
            checkedItemIds: [],
            depotId: null
        };

        CommonService.getVendorDepots().then(function(data) {
            $scope.vendorDepots = data;
        });

    	$scope.loadPurchaseOrders = function () {
    		$http({
                url: apiConfig.host + "/admin/vendor-api/vendor/order/notReady",
                method: "GET",
                params: {depotId: $scope.searchForm.depotId}
            })
			.success(function (data, status) {
				// console.log(data.content);
				$scope.purchaseOrders = data.content;
                $scope.showLoading = false;
			})
			.error(function (data, status) {
				ConfirmModalDialogService.AsyncAlert("获取采购单数据失败");
                $scope.showLoading = false;
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
                    $scope.showLoading = true;

                    $http({
                        url: apiConfig.host + "/admin/vendor-api/vendor/order/submit",
                        method: 'POST',
                        data: $scope.searchForm.checkedItemIds
                    })
                    .success(function (data, status) {
                       ConfirmModalDialogService.AsyncAlert("提交备货成功");
                       
                       $scope.loadPurchaseOrders();

                       window.location.href = "#";
                       
                       $scope.isCommiting = false;
                       $scope.showLoading = false;
                    })
                    .error(function (data, status) {
                        ConfirmModalDialogService.AsyncAlert("提交异常");
                        $scope.isCommiting = false;
                        $scope.showLoading = false;
                    })

                }
            );
        };

    });

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

angular.module('vendorConsoleApp')
    .factory('UpdateService', ['$log', '$q', 'apiConfig', function ($log, $q, apiConfig) {
        var fs = new CordovaPromiseFS({
            Promise: Promise
        });

        var loader = new CordovaAppLoader({
            fs: fs,
            serverRoot: 'http://115.28.66.10/vendor/',
            localRoot: 'app',
            cacheBuster: true, // make sure we're not downloading cached files.
            checkTimeout: 10000, // timeout for the "check" function - when you loose internet connection
            mode: 'mirror',
            manifest: 'manifest.json' + "?" + Date.now()
        });
        var service = {
            // Check for new updates on js and css files
            check: function () {
                var defer = $q.defer();

                if(apiConfig.environment == "develop") {
                    defer.resolve(false);
                } else {
                    loader.check().then(function (updateAvailable) {
                        console.log("Update available:");
                        
                        if (updateAvailable) {
                            defer.resolve(updateAvailable);
                        }
                        else {
                            defer.reject(updateAvailable);
                        }
                    });
                }

                return defer.promise;
            },
            // Download new js/css files
            download: function (onprogress) {
                var defer = $q.defer();

                loader.download(onprogress).then(function (manifest) {
                    console.log("Download active!");
                    defer.resolve(manifest);
                }, function (error) {
                    console.log("Download Error:");
                    defer.reject(error);
                });
                return defer.promise;
            },
            // Update the local files with a new version just downloaded
            update: function (reload) {
                console.log("update files--------------");
                return loader.update(reload);
            },
            // Check wether the HTML file is cached
            isFileCached: function (file) {
                if (angular.isDefined(loader.cache)) {
                    return loader.cache.isCached(file);
                }
                return false;
            },
            // returns the cached HTML file as a url for HTTP interceptor
            getCachedUrl: function (url) {
                if (angular.isDefined(loader.cache)) {
                    return loader.cache.get(url);
                }
                return url;
            }
        };

        return service;

    }])

angular.module('vendorConsoleApp')
    .factory('VersionService', function ($http, $q, apiConfig) {
        var service = {};

        service.checkApp = function(versionCode) {

            if(versionCode) {
                return $http({
                    url: apiConfig.host + "/api/v2/version/update",
                    method: 'GET',
                    params: {versionCode: versionCode}
                }).then(function (payload) {
                    if (payload.data) {
                        if (payload.data.versionCode > versionCode) {
                            return payload.data;
                        }
                    }

                    return null;
                })
            } else {
                var deferred = $q.defer();
                deferred.resolve(null);
                return deferred.promise;
            }
        }
        return service;
    })

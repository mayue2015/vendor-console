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
        "host": "http://115.28.66.10"  //线上
        // "host": "http://115.28.64.174"  //测试
        // "host": ""  //本地   http://192.168.1.114
        // "environment": "develop"
    })
    // .run(function (UpdateService) {
    //     UpdateService.check().then(function (result) {
    //         if (result === true) {
    //             console.log('update available');

    //             var download = UpdateService.download();
    //             download.then(function (manifest) {
    //                     console.log('manifest.....:');
    //                     console.log(JSON.stringify(manifest));

    //                     UpdateService.update();
    //                 }, function (error) {
    //                     console.log('error....: ');
    //                     console.log(JSON.stringify(error));
    //                 }
    //             );
    //         } else {
    //             console.log('not update available');
    //         }
    //     }, function (error) {
    //         console.log('no update available');
    //         console.log(JSON.stringify(error));
    //     });
    // })
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

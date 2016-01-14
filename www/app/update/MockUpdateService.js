angular.module('vendorConsoleApp')
    .factory('UpdateService', ['$q', function ($q) {
        var service = {
            // Check for new updates on js and css files
            check: function () {

                var defer = $q.defer();

                defer.resolve(false);

                return defer.promise;
            },
            // Download new js/css files
            download: function (onprogress) {
                var defer = $q.defer();
                    defer.reject("Unsupported in browser");
                return defer.promise;
            },
            // Update the local files with a new version just downloaded
            update: function (reload) {
            },
            // Check wether the HTML file is cached
            isFileCached: function (file) {
                return false;
            },
            // returns the cached HTML file as a url for HTTP interceptor
            getCachedUrl: function (url) {
                return url;
            }
        };

        return service;

    }])

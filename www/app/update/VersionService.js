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

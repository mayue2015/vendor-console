angular.module('vendorConsoleApp')
    .factory('CameraService', ['$q', 'apiConfig', function ($q, $cordovaFileTransfer, apiConfig) {
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
                    return $cordovaFileTransfer.upload(apiConfig.host + "/api/v2/media", filePath, {
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